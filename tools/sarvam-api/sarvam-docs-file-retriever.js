import fs from 'fs';
import path_module from 'path'; // Using path_module to avoid conflict with path variable

/**
 * Retrieves the full content of the most relevant Sarvam AI markdown documentation file
 * based on a search term and optional documentation area.
 *
 * @param {Object} args - Arguments for the documentation file retrieval.
 * @param {string} args.search_term - Keywords, a topic description, or a partial/full filename.
 * @param {string} [args.doc_area] - Optional. Specific documentation area (e.g., 'api-ref', 'cookbook').
 * @param {Object} context - The execution context (passed by mcpServer, may not be used by this func for fs ops).
 * @returns {Promise<Object>} - An object containing the retrieved file path, content, and status.
 */
const executeSarvamDocsFileRetrieval = async ({ search_term, doc_area }, context) => {
  console.log(`Executing Sarvam Docs File Retrieval with search_term: "${search_term}", doc_area: "${doc_area}"`);

  // Context check, though not used for fs ops here, it's good practice if other internal calls were to be made.
  if (!context) {
    console.warn('Warning: Tool execution context was not provided. This tool might rely on it for other operations.');
  }

  const allCandidateFiles = [];
  const searchPaths = [];
  // Assuming workspace root is where mcpServer.js is. Docs are relative to this.
  const workspaceRoot = process.cwd(); 
  const defaultSearchAreas = ['docs/api-ref', 'docs/cookbook', 'docs/docs-section'];

  if (doc_area) {
    searchPaths.push(doc_area.startsWith('docs/') ? doc_area : `docs/${doc_area}`);
  } else {
    searchPaths.push(...defaultSearchAreas);
  }

  console.log('Searching in relative paths:', searchPaths);

  for (const relativeDocPath of searchPaths) {
    const absoluteDocPath = path_module.resolve(workspaceRoot, relativeDocPath);
    try {
      if (!fs.existsSync(absoluteDocPath) || !fs.lstatSync(absoluteDocPath).isDirectory()){
        console.warn(`Search path ${absoluteDocPath} does not exist or is not a directory. Skipping.`);
        continue;
      }
      const filesInDir = fs.readdirSync(absoluteDocPath);
      const mdFiles = filesInDir
        .filter(file => file.endsWith('.md'))
        .map(file => path_module.join(relativeDocPath, file).replace(/\\/g, '/')); // Use original relative path for consistency + normalize slashes
      allCandidateFiles.push(...mdFiles);
    } catch (error) {
      console.error(`Error reading directory ${absoluteDocPath}:`, error.message);
      if (doc_area) { // If a specific doc_area was requested and fails, report more critically
        return {
            retrieved_file_path: null,
            file_content: null,
            status_message: `Failed to list directory for specified doc_area: ${relativeDocPath}. Error: ${error.message}`,
            error_message: error.message
        };
      }
      console.warn(`Could not list directory ${relativeDocPath}, continuing...`);
    }
  }

  if (allCandidateFiles.length === 0) {
    return {
      retrieved_file_path: null,
      file_content: null,
      status_message: `No .md files found in the searched documentation areas: ${searchPaths.join(', ')}.`,
      error_message: null
    };
  }
  const uniqueCandidateFiles = [...new Set(allCandidateFiles)];
  console.log('Unique candidate .md files:', uniqueCandidateFiles);

  const normalizedSearchTerm = search_term.toLowerCase().trim();
  let bestMatch = null;
  const searchKeywords = normalizedSearchTerm.split(/\s+/).filter(k => k.length > 0);
  if (searchKeywords.length === 0 && normalizedSearchTerm.length > 0) {
      searchKeywords.push(normalizedSearchTerm);
  }

  // --- File Selection Logic ---

  // Strategy 1: Filename matching (prioritized)
  if (normalizedSearchTerm.endsWith('.md')) {
    const exactMatchByPath = uniqueCandidateFiles.find(file => file.toLowerCase().endsWith(`/${normalizedSearchTerm}`));
    if (exactMatchByPath) {
      bestMatch = { file: exactMatchByPath, score: Infinity, type: 'exact_filename_match' }; 
      console.log('Found exact filename match (by path ending):', bestMatch.file);
    } else {
        // Check if the search term is just the filename itself, without the preceding path parts
        const justTheFilename = normalizedSearchTerm.substring(normalizedSearchTerm.lastIndexOf('/') + 1);
        const exactMatchBySimpleName = uniqueCandidateFiles.find(file => path_module.basename(file).toLowerCase() === justTheFilename);
        if (exactMatchBySimpleName){
            bestMatch = { file: exactMatchBySimpleName, score: Infinity, type: 'exact_filename_match' }; 
            console.log('Found exact filename match (by simple name):', bestMatch.file);
        }
    }
  }

  // Strategy 2: Keyword matching in filenames (if no exact .md match or search term is not a filename)
  if (!bestMatch) {
    let scoredFiles = uniqueCandidateFiles.map(file => {
      const filename = path_module.basename(file).toLowerCase();
      let score = 0;
      for (const keyword of searchKeywords) {
        if (filename.includes(keyword)) {
          score += 10; // Weight for filename keyword match
        }
      }
      // Bonus for matching more of the search term as a whole phrase in filename
      if (!normalizedSearchTerm.endsWith('.md') && filename.includes(normalizedSearchTerm)) {
        score += 20 * searchKeywords.length; // Strong bonus for full phrase match in filename
      }
      return { file, score, type: 'keyword_filename_match' };
    });

    scoredFiles = scoredFiles.filter(f => f.score > 0);
    scoredFiles.sort((a, b) => b.score - a.score);

    if (scoredFiles.length > 0) {
      bestMatch = scoredFiles[0];
      console.log('Top filename keyword match:', bestMatch.file, 'Score:', bestMatch.score);
    }
  }
  
  // Strategy 3: Keyword matching in file content 
  // If no good match from filenames or if the match is weak, try content search.
  // Let's define a "weak" filename match score, e.g., less than 20 (adjust as needed)
  const weakFilenameMatchScore = 20;
  if (!bestMatch || bestMatch.score < weakFilenameMatchScore) {
    console.log('Filename match was weak or non-existent, proceeding to content search.');
    let contentScoredFiles = [];
    const filesToSearchContent = bestMatch ? [bestMatch.file, ...uniqueCandidateFiles.filter(f => f !== bestMatch.file)] : uniqueCandidateFiles;

    for (const filePath of filesToSearchContent) {
      try {
        const absoluteFilePath = path_module.resolve(workspaceRoot, filePath);
        if (!fs.existsSync(absoluteFilePath)) continue;

        const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8').toLowerCase();
        let contentScore = 0;
        for (const keyword of searchKeywords) {
          if (fileContent.includes(keyword)) {
            contentScore += 1; // Simple count for now
          }
        }
        // Bonus for full phrase match in content
        if (fileContent.includes(normalizedSearchTerm)) {
          contentScore += 5 * searchKeywords.length; // Bonus for phrase match
        }

        if (contentScore > 0) {
            // If this file was already scored by filename, add to its score or take the higher one?
            // For now, let's just take the content score if it's better or if the file wasn't the filename bestMatch
            let existingScore = 0;
            if (bestMatch && filePath === bestMatch.file) {
                existingScore = bestMatch.score;
            }
            // Simple strategy: if content score is higher, or if it's a new file being scored
            contentScoredFiles.push({ file: filePath, score: existingScore + contentScore, type: 'content_match' });
        }
      } catch (err) {
        console.warn(`Could not read or score content for ${filePath}: ${err.message}`);
      }
    }

    if (contentScoredFiles.length > 0) {
        contentScoredFiles.sort((a, b) => b.score - a.score); // Sort by combined score
        const topContentMatch = contentScoredFiles[0];
        // Decide if this content match is better than a previous weak filename match
        if (!bestMatch || topContentMatch.score > bestMatch.score) {
            bestMatch = topContentMatch;
            console.log('Top content match selected:', bestMatch.file, 'Score:', bestMatch.score);
        }
    }
  }

  // Fallback: if only one candidate file and no strong match, select it (already partially handled)
  if (!bestMatch && uniqueCandidateFiles.length === 1 && normalizedSearchTerm.length > 0) {
      bestMatch = { file: uniqueCandidateFiles[0], score: 1, type: 'single_candidate_fallback' }; 
      console.log('Only one candidate file and no strong matches, selecting it as a fallback:', bestMatch.file);
  }
  
  if (!bestMatch) {
    return {
      retrieved_file_path: null,
      file_content: null,
      status_message: `No relevant file found for "${search_term}" in areas: ${searchPaths.join(', ')}. Please try different keywords or check filenames.`,
      error_message: null
    };
  }

  let retrievedFileContent = null;
  let statusMessage = '';
  let errorMessage = null;
  let absoluteBestMatchPath = path_module.resolve(workspaceRoot, bestMatch.file);

  try {
    if (!fs.existsSync(absoluteBestMatchPath)) {
        throw new Error(`File ${bestMatch.file} (resolved to ${absoluteBestMatchPath}) not found.`);
    }
    retrievedFileContent = fs.readFileSync(absoluteBestMatchPath, 'utf-8');
    statusMessage = `Successfully retrieved documentation file: ${bestMatch.file}`;
    console.log('Successfully read file:', bestMatch.file);

  } catch (error) {
    console.error(`Error reading file ${bestMatch.file} (at ${absoluteBestMatchPath}):`, error.message);
    errorMessage = `Error reading file ${bestMatch.file}: ${error.message}`;
    statusMessage = `Found a potential match ${bestMatch.file}, but an error occurred while reading its content.`;
  }

  return {
    retrieved_file_path: errorMessage ? null : bestMatch.file, // Return the relative path
    file_content: retrievedFileContent,
    status_message: statusMessage,
    error_message: errorMessage
  };
};

const apiTool = {
  function: executeSarvamDocsFileRetrieval,
  definition: {
    type: 'function',
    function: {
      name: 'get_sarvam_documentation_file',
      description: 'Retrieves the full content of the single most relevant Sarvam AI markdown documentation file. Searches local documentation (e.g., in \'docs/api-ref\', \'docs/cookbook\') based on keywords, a topic, or a filename.',
      parameters: {
        type: 'object',
        properties: {
          search_term: {
            type: 'string',
            description: "Keywords, a topic description (e.g., 'how to use transliteration api', 'pdf parsing options'), or a partial/full filename (e.g., 'sarvam-parse.md', 'transliterate'). The tool will attempt to find the single most relevant documentation file."
          },
          doc_area: {
            type: 'string',
            description: "Optional. Specify a documentation area to narrow the search. Common areas include: 'api-ref' (for API endpoint details), 'cookbook' (for usage guides and examples), 'docs-section' (for general conceptual documents like overviews). If 'search_term' is a clear filename, this might be omitted. If omitted and 'search_term' is keyword-based, common areas will be searched."
          }
        },
        required: ['search_term']
      }
    }
  }
};

export { apiTool }; 
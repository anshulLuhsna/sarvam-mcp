import fs from 'fs';
import path_module from 'path'; // Using path_module to avoid conflict with path variable
import { fileURLToPath } from 'url'; // ADDED

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
  // console.log(`Executing Sarvam Docs File Retrieval with search_term: "${search_term}", doc_area: "${doc_area}"`);

  if (!context) {
    // console.warn('Warning: Tool execution context was not provided. This tool might rely on it for other operations.');
  }

  // --- MODIFIED PATH RESOLUTION --- 
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path_module.dirname(__filename);
  // projectRoot is two levels up from the current script's directory (tools/sarvam-api/)
  const projectRoot = path_module.resolve(__dirname, '../../'); 
  const docsRootDir = path_module.join(projectRoot, 'docs');
  // --- END MODIFIED PATH RESOLUTION ---

  const allCandidateFiles = [];
  const searchPaths = []; 
  const defaultSearchSubDirs = ['api-ref', 'cookbook', 'docs-section']; // These are subdirs of docsRootDir

  if (doc_area) {
    // If doc_area is provided, treat it as a subdirectory relative to docsRootDir
    // or a path that might start with 'docs/' relative to projectRoot
    if (doc_area.startsWith('docs/')) { // e.g. user provided "docs/custom-area"
        searchPaths.push(path_module.join(projectRoot, doc_area));
    } else { // e.g. user provided "api-ref" or "custom-area"
        searchPaths.push(path_module.join(docsRootDir, doc_area));
    }
  } else {
    for (const subDir of defaultSearchSubDirs) {
        searchPaths.push(path_module.join(docsRootDir, subDir));
    }
  }

  // console.log('Searching in absolute paths:', searchPaths);

  for (const absoluteDocPath of searchPaths) {
    try {
      if (!fs.existsSync(absoluteDocPath) || !fs.lstatSync(absoluteDocPath).isDirectory()){
        // console.warn(`Search path ${absoluteDocPath} does not exist or is not a directory. Skipping.`);
        continue;
      }
      const filesInDir = fs.readdirSync(absoluteDocPath);
      // Store paths relative to docsRootDir for easier handling later
      const pathSuffix = path_module.relative(docsRootDir, absoluteDocPath);

      const mdFiles = filesInDir
        .filter(file => file.endsWith('.md'))
        .map(file => path_module.join(pathSuffix, file).replace(/\\/g, '/')); // Normalize slashes
      allCandidateFiles.push(...mdFiles);
    } catch (error) {
      // console.error(`Error reading directory ${absoluteDocPath}:`, error.message);
      if (doc_area) { 
        return {
            retrieved_file_path: null,
            file_content: null,
            status_message: `Failed to list directory for specified doc_area: ${absoluteDocPath}. Error: ${error.message}`,
            error_message: error.message
        };
      }
      // console.warn(`Could not list directory ${absoluteDocPath}, continuing...`);
    }
  }

  if (allCandidateFiles.length === 0) {
    return {
      retrieved_file_path: null,
      file_content: null,
      status_message: `No .md files found in the searched documentation areas: ${searchPaths.map(p => path_module.relative(projectRoot, p)).join(', ')}. Searched absolute paths: ${searchPaths.join(', ')}`,
      error_message: null
    };
  }
  const uniqueCandidateFiles = [...new Set(allCandidateFiles)];
  // console.log('Unique candidate .md files (relative to docs root):', uniqueCandidateFiles);

  const normalizedSearchTerm = search_term.toLowerCase().trim();
  let bestMatch = null;
  const searchKeywords = normalizedSearchTerm.split(/\s+/).filter(k => k.length > 0);
  if (searchKeywords.length === 0 && normalizedSearchTerm.length > 0) {
      searchKeywords.push(normalizedSearchTerm);
  }

  // --- File Selection Logic (paths are relative to docsRootDir) ---

  // Strategy 1: Filename matching (prioritized)
  if (normalizedSearchTerm.endsWith('.md')) {
    const exactMatchByPath = uniqueCandidateFiles.find(fileRelToDocs => fileRelToDocs.toLowerCase() === normalizedSearchTerm || fileRelToDocs.toLowerCase().endsWith(`/${normalizedSearchTerm}`));
    if (exactMatchByPath) {
      bestMatch = { file: exactMatchByPath, score: Infinity, type: 'exact_filename_match' }; 
      // console.log('Found exact filename match (relative to docs root):', bestMatch.file);
    } else {
        const justTheFilename = normalizedSearchTerm.substring(normalizedSearchTerm.lastIndexOf('/') + 1);
        const exactMatchBySimpleName = uniqueCandidateFiles.find(fileRelToDocs => path_module.basename(fileRelToDocs).toLowerCase() === justTheFilename);
        if (exactMatchBySimpleName){
            bestMatch = { file: exactMatchBySimpleName, score: Infinity, type: 'exact_filename_match' }; 
            // console.log('Found exact filename match (by simple name, relative to docs root):', bestMatch.file);
        }
    }
  }

  // Strategy 2: Keyword matching in filenames and paths
  if (!bestMatch) {
    let scoredFiles = uniqueCandidateFiles.map(fileRelToDocs => {
      const filename = path_module.basename(fileRelToDocs).toLowerCase();
      let score = 0;
      for (const keyword of searchKeywords) {
        if (filename.includes(keyword)) {
          score += 10; 
        }
      }
      if (!normalizedSearchTerm.endsWith('.md') && filename.includes(normalizedSearchTerm)) {
        score += 20 * searchKeywords.length; 
      }
      const pathParts = fileRelToDocs.split('/').slice(0, -1); // directory parts
      for (const part of pathParts) {
          for (const keyword of searchKeywords) {
              if (part.toLowerCase().includes(keyword)) {
                  score +=5; 
              }
          }
      }
      return { file: fileRelToDocs, score, type: 'keyword_filename_path_match' };
    });

    scoredFiles = scoredFiles.filter(f => f.score > 0);
    scoredFiles.sort((a, b) => b.score - a.score);

    if (scoredFiles.length > 0) {
      bestMatch = scoredFiles[0];
      // console.log('Top filename/path keyword match (relative to docs root):', bestMatch.file, 'Score:', bestMatch.score);
    }
  }  

  // Strategy 3: Keyword matching in file content 
  const weakFilenameMatchScore = 20;
  if (!bestMatch || bestMatch.score < weakFilenameMatchScore) {
    // console.log('Filename match was weak or non-existent, proceeding to content search.');
    let contentScoredFiles = [];
    const filesToSearchContent = bestMatch ? [bestMatch.file, ...uniqueCandidateFiles.filter(f => f !== bestMatch.file)] : uniqueCandidateFiles;

    for (const fileRelToDocs of filesToSearchContent) {
      try {
        const absoluteFilePath = path_module.join(docsRootDir, fileRelToDocs); // Path relative to docsRootDir
        if (!fs.existsSync(absoluteFilePath)) {
            // console.warn(`Content search: File ${absoluteFilePath} not found, skipping.`);
            continue;
        }

        const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8').toLowerCase();
        let contentScore = 0;
        for (const keyword of searchKeywords) {
          if (fileContent.includes(keyword)) {
            contentScore += 1;
          }
        }
        if (fileContent.includes(normalizedSearchTerm)) {
          contentScore += 5 * searchKeywords.length;
        }

        if (contentScore > 0) {
            let existingScore = 0;
            if (bestMatch && fileRelToDocs === bestMatch.file) {
                existingScore = bestMatch.score;
            }
            contentScoredFiles.push({ file: fileRelToDocs, score: existingScore + contentScore, type: 'content_match' });
        }
      } catch (err) {
        // console.warn(`Could not read or score content for ${fileRelToDocs}: ${err.message}`);
      }
    }

    if (contentScoredFiles.length > 0) {
        contentScoredFiles.sort((a, b) => b.score - a.score);
        const topContentMatch = contentScoredFiles[0];
        if (!bestMatch || topContentMatch.score > bestMatch.score) {
            bestMatch = topContentMatch;
            // console.log('Top content match selected (relative to docs root):', bestMatch.file, 'Score:', bestMatch.score);
        }
    }
  }

  if (!bestMatch && uniqueCandidateFiles.length === 1 && normalizedSearchTerm.length > 0) {
      bestMatch = { file: uniqueCandidateFiles[0], score: 1, type: 'single_candidate_fallback' }; 
      // console.log('Only one candidate file and no strong matches, selecting it as a fallback (relative to docs root):', bestMatch.file);
  }
  
  if (!bestMatch) {
    return {
      retrieved_file_path: null,
      file_content: null,
      status_message: `No relevant file found for "${search_term}" in areas: ${searchPaths.map(p => path_module.relative(projectRoot, p)).join(', ')}. Please try different keywords or check filenames.`,
      error_message: null
    };
  }

  let retrievedFileContent = null;
  let statusMessage = '';
  let errorMessage = null;
  let absoluteBestMatchPath = path_module.join(docsRootDir, bestMatch.file); // Path relative to docsRootDir

  try {
    if (!fs.existsSync(absoluteBestMatchPath)) {
        // throw new Error(`File ${bestMatch.file} (resolved to ${absoluteBestMatchPath}) not found.`);
         errorMessage = `File ${bestMatch.file} (resolved to ${absoluteBestMatchPath}) not found.`;
         statusMessage = `Error: File ${bestMatch.file} not found.`;
         return {
            retrieved_file_path: null,
            file_content: null,
            status_message: statusMessage,
            error_message: errorMessage
         };
    }
    retrievedFileContent = fs.readFileSync(absoluteBestMatchPath, 'utf-8');
    statusMessage = `Successfully retrieved documentation file: ${bestMatch.file} (relative to docs root)`;
    // console.log('Successfully read file:', bestMatch.file);

  } catch (error) {
    // console.error(`Error reading file ${bestMatch.file} (at ${absoluteBestMatchPath}):`, error.message);
    errorMessage = `Error reading file ${bestMatch.file}: ${error.message}`;
    statusMessage = `Found a potential match ${bestMatch.file}, but an error occurred while reading its content.`;
  }

  return {
    retrieved_file_path: errorMessage ? null : bestMatch.file, // Return path relative to docsRootDir
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
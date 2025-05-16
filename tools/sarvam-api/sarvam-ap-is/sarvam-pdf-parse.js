import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Function to parse a PDF document and extract structured data using Sarvam API (via direct API call).
 *
 * @param {Object} args - Arguments for PDF parsing.
 * @param {string} args.file_path - Path to the PDF file to be parsed.
 * @param {string} [args.page_number] - Optional. The page number to extract data from (1-based index, defaults to 1).
 * @param {string} [args.sarvam_mode] - Optional. Parsing mode: 'small' (fast) or 'large' (high precision).
 * @param {boolean} [args.prompt_caching] - Optional. Whether to cache the prompt for the parse request.
 * @returns {Promise<Object>} - The result of the PDF parsing, including a base64 encoded XML string.
 */
const executeFunction = async ({
  file_path,
  page_number,
  sarvam_mode,
  prompt_caching
}) => {
  const apiKey = process.env.SARVAM_API_KEY;
  const baseUrl = 'https://api.sarvam.ai/parse/parsepdf';

  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY.'
    };
  }

  if (!file_path) {
    return {
      error: 'Missing required parameter: file_path',
      details: 'The file_path parameter is required for PDF parsing.'
    };
  }

  try {
    // Check if file exists and is readable before creating a stream
    fs.accessSync(file_path, fs.constants.R_OK);
  } catch (fileErr) {
    console.error('PDF file is not accessible:', fileErr.message);
    return { error: 'PDF file is not accessible or does not exist.', details: fileErr.message };
  }

  try {
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(file_path));

    if (page_number !== undefined) {
      formData.append('page_number', page_number.toString());
    }
    if (sarvam_mode !== undefined) {
      formData.append('sarvam_mode', sarvam_mode);
    }
    if (prompt_caching !== undefined) {
      formData.append('prompt_caching', String(prompt_caching)); // Convert boolean to 'true' or 'false'
    }

    const headers = {
      'api-subscription-key': apiKey,
      ...formData.getHeaders() // Spread FormData headers, which includes Content-Type for multipart
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }

    if (!response.ok) {
      console.error('API Error Response:', data);
      const errorMessage = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error parsing PDF:', error && (error.stack || error.message || error));
    return {
      error: 'An error occurred while parsing the PDF.',
      details: error && (error.message || error.toString())
    };
  }
};

/**
 * Tool configuration for Sarvam PDF Parsing.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'sarvam_parse_pdf',
      description: 'Parses a PDF document to extract structured data (output is base64 encoded XML). Supports English PDFs only.',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'Path to the PDF file to be parsed.'
          },
          page_number: {
            type: 'string',
            description: 'Optional. The page number to extract data from (1-based index, defaults to 1).'
          },
          sarvam_mode: {
            type: 'string',
            description: "Optional. Parsing mode: 'small' (fast) or 'large' (high precision).",
            enum: ['small', 'large']
          },
          prompt_caching: {
            type: 'boolean',
            description: 'Optional. Whether to cache the prompt for the parse request (true/false).'
            // API docs say enum: [true, false], but boolean seems more user-friendly for MCP definition.
            // The implementation converts to string 'true'/'false' for the API call.
          }
        },
        required: ['file_path']
      }
    }
  }
};

export { apiTool }; 
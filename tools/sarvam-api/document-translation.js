import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Function to translate a PDF document using Sarvam API via direct API call.
 *
 * @param {Object} args - Arguments for document translation.
 * @param {string} args.file_path - Path to the PDF file to be translated.
 * @param {string} [args.output_lang] - Optional. Target language code for translation (e.g., 'hi-IN').
 * @param {string} [args.page_number] - Optional. Page to translate (1-based). Empty for entire doc.
 * @param {Object} [args.hard_translate_dict] - Optional. Dictionary for hardcoded translations e.g. {"Hello": "नमस्कार"}.
 * @param {string} [args.input_lang] - Optional. Input language code (default: 'en-IN', currently only English PDFs supported).
 * @returns {Promise<Object>} - The result of the document translation, including the translated PDF in base64.
 */
const executeFunction = async ({
  file_path,
  output_lang,
  page_number,
  hard_translate_dict,
  input_lang
}) => {
  const apiKey = process.env.SARVAM_API_KEY;
  const apiUrl = 'https://api.sarvam.ai/parse/translatepdf';

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
      details: 'The file_path parameter is required for document translation.'
    };
  }

  if (!fs.existsSync(file_path)) {
    return {
      error: 'File not found',
      details: `The file at path ${file_path} does not exist.`
    };
  }

  try {
    const form = new FormData();
    form.append('pdf', fs.createReadStream(file_path));

    if (output_lang !== undefined) form.append('output_lang', output_lang);
    if (page_number !== undefined) form.append('page_number', page_number.toString());
    if (hard_translate_dict !== undefined) {
      form.append('hard_translate_dict', JSON.stringify(hard_translate_dict));
    }
    if (input_lang !== undefined) form.append('input_lang', input_lang);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        // Content-Type is set automatically by FormData with boundary
      },
      body: form
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error ${response.status}: ${errorBody}`);
      return {
        error: `API request failed with status ${response.status}`,
        details: errorBody || response.statusText
      };
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error translating document via API call:', error);
    return {
      error: 'An error occurred while translating the document.',
      details: error.toString()
    };
  }
};

/**
 * Tool configuration for Sarvam Document Translation.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'translate_document_pdf',
      description: 'Translates a PDF document via direct API call. Supports only digital English PDFs with selectable text as input.',
      parameters: {
        type: 'object',
        properties: {
          file_path: {
            type: 'string',
            description: 'Path to the PDF file to be translated.'
          },
          output_lang: {
            type: 'string',
            description: 'Optional. Target language code for translation (e.g., hi-IN, mr-IN).'
          },
          page_number: {
            type: 'string',
            description: 'Optional. Page number to translate (1-based). Empty or null for entire document.'
          },
          hard_translate_dict: {
            type: 'object',
            description: 'Optional. A dictionary of words for hardcoded translations, e.g., {\"Hello\": \"नमस्कार\"}. Passed as a JSON object.'
          },
          input_lang: {
            type: 'string',
            description: 'Optional. Input language code. Defaults to en-IN. Currently, only English PDFs are supported as input.'
          }
        },
        required: ['file_path']
      }
    }
  }
};

export { apiTool }; 
import fetch from 'node-fetch';

/**
 * Function to transliterate text from one script to another using Sarvam API (via direct API call).
 *
 * @param {Object} args - Arguments for the transliteration.
 * @param {string} args.input_text - The text to transliterate (<=1000 characters).
 * @param {string} args.source_language_code - Language code of the input text.
 * @param {string} args.target_language_code - Language code for the transliterated text.
 * @param {string} [args.numerals_format] - Optional. 'international' (default) or 'native'.
 * @param {string} [args.spoken_form_numerals_language] - Optional. 'english' or 'native' (default). Only works if spoken_form is true.
 * @param {boolean} [args.spoken_form] - Optional. Defaults to false. Converts text to natural spoken form if true.
 * @returns {Promise<Object>} - The result of the transliteration.
 */
const executeFunction = async ({
  input_text,
  source_language_code,
  target_language_code,
  numerals_format,
  spoken_form_numerals_language,
  spoken_form
}) => {
  const apiKey = process.env.SARVAM_API_KEY;
  const baseUrl = 'https://api.sarvam.ai/transliterate';

  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY environment variable with your Sarvam API key.'
    };
  }

  if (!input_text || !source_language_code || !target_language_code) {
    let missingParams = [];
    if (!input_text) missingParams.push('input_text');
    if (!source_language_code) missingParams.push('source_language_code');
    if (!target_language_code) missingParams.push('target_language_code');
    return {
      error: `Missing required parameter(s): ${missingParams.join(', ')}`,
      details: 'input_text, source_language_code, and target_language_code are required.'
    };
  }

  try {
    const headers = {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/json'
    };

    const payload = {
      input: input_text,
      source_language_code: source_language_code,
      target_language_code: target_language_code
    };

    if (numerals_format !== undefined) payload.numerals_format = numerals_format;
    if (spoken_form_numerals_language !== undefined) payload.spoken_form_numerals_language = spoken_form_numerals_language;
    if (spoken_form !== undefined) payload.spoken_form = spoken_form;
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
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
    console.error('Error transliterating text:', error && (error.stack || error.message || error));
    return {
      error: 'An error occurred while transliterating text.',
      details: error && (error.message || error.toString())
    };
  }
};

/**
 * Tool configuration for transliterating text using Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'transliterate_text',
      description: 'Transliterates text from one script to another using Sarvam API, preserving pronunciation.',
      parameters: {
        type: 'object',
        properties: {
          input_text: {
            type: 'string',
            description: 'The text to transliterate (<=1000 characters).'
          },
          source_language_code: {
            type: 'string',
            description: 'Language code of the input text (e.g., en-IN, hi-IN).'
            // enum values can be added here if known and fixed
          },
          target_language_code: {
            type: 'string',
            description: 'Language code for the transliterated text (e.g., en-IN, hi-IN).'
            // enum values can be added here if known and fixed
          },
          numerals_format: {
            type: 'string',
            description: "Optional. Numerals format: 'international' (default) or 'native'."
          },
          spoken_form_numerals_language: {
            type: 'string',
            description: "Optional. Spoken form numerals language: 'english' or 'native' (default). Only if spoken_form is true."
          },
          spoken_form: {
            type: 'boolean',
            description: 'Optional. Defaults to false. Converts text to natural spoken form if true.'
          }
        },
        required: ['input_text', 'source_language_code', 'target_language_code']
      }
    }
  }
};

export { apiTool }; 
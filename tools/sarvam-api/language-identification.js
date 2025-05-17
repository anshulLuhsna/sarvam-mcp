import { SarvamAIClient } from 'sarvamai';

/**
 * Function to identify the language of a given text using Sarvam API (via official SDK).
 *
 * @param {Object} args - Arguments for the language identification.
 * @param {string} args.input_text - The text input for language and script identification.
 * @returns {Promise<Object>} - The result of the language identification.
 */
const executeFunction = async ({ input_text }) => {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY environment variable with your Sarvam API key.'
    };
  }

  if (!input_text) {
    return {
      error: 'Missing required parameter: input_text',
      details: 'The input_text parameter is required for language identification.'
    };
  }

  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey
    });

    // Assuming the SDK method matches the general pattern observed
    // The API doc shows 'input' as the key in the direct API call.
    const response = await client.text.identifyLanguage({
      input: input_text 
    });

    return response;
  } catch (error) {
    console.error('Error identifying language:', error);
    return {
      error: 'An error occurred while identifying the language.',
      details: error.toString()
    };
  }
};

/**
 * Tool configuration for identifying language using Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'identify_language',
      description: 'Identifies the language and script of the input text using Sarvam API. Supports multiple languages.',
      parameters: {
        type: 'object',
        properties: {
          input_text: {
            type: 'string',
            description: 'The text input for language and script identification.'
          }
        },
        required: ['input_text']
      }
    }
  }
};

export { apiTool }; 
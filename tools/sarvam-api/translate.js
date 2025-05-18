import { SarvamAIClient } from 'sarvamai';
import { mapLanguageCode as defaultMapLanguageCode } from '../../lib/lang-utils.js';

/**
 * Function to translate text using the Sarvam API.
 *
 * @param {Object} args - Arguments for the translation.
 * @param {string} args.input - The text to be translated.
 * @param {string} [args.source_language_code="en-IN"] - The source language code.
 * @param {string} [args.target_language_code="hi-IN"] - The target language code.
 * @param {string} [args.speaker_gender="Male"] - The gender of the speaker.
 * @param {string} [args.mode="formal"] - The mode of translation.
 * @param {string} [args.model="mayura:v1"] - The model to be used for translation.
 * @param {boolean} [args.enable_preprocessing=true] - Whether to enable preprocessing.
 * @param {Object} [dependencies] - Optional dependencies for testing.
 * @param {Function} [dependencies.mapLangFunc=defaultMapLanguageCode] - Language code mapping function.
 * @returns {Promise<Object>} - The result of the translation.
 */
export const executeFunctionInternal = async (
  { input, source_language_code = 'en-IN', target_language_code = 'hi-IN', speaker_gender = 'Male', mode = 'formal', model = 'mayura:v1', enable_preprocessing = true },
  dependencies = {}
) => {
  const { mapLangFunc = defaultMapLanguageCode } = dependencies;
  const apiKey = process.env.SARVAM_API_KEY;
  // Removed baseUrl as it's not used when SDK is used correctly.

  // It seems the original code was missing an API Key check before client instantiation
  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set for SarvamAIClient');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY environment variable.'
    };
  }

  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey
    });

    const final_source_language_code = mapLangFunc(source_language_code);
    const final_target_language_code = mapLangFunc(target_language_code);

    const params = {
      input: input,
      source_language_code: final_source_language_code,
      target_language_code: final_target_language_code
    };

    if (speaker_gender !== undefined) params.speaker_gender = speaker_gender;
    if (mode !== undefined) params.mode = mode;
    if (model !== undefined) params.model = model;
    if (enable_preprocessing !== undefined) params.enable_preprocessing = enable_preprocessing;

    // Assuming client.text.translate is the correct SDK path based on previous successful tests
    if (client.text && typeof client.text.translate === 'function') {
      const response = await client.text.translate(params);
      return response;
    } else {
      console.error('Sarvam SDK translate method not found on client.text.translate');
      return {
        error: 'Sarvam SDK translate method not found',
        details: 'Could not find a translate method on the SarvamAIClient instance at client.text.translate. Please check SDK documentation.'
      };
    }

  } catch (error) {
    console.error('Error translating text:', error);
    let errorDetails = error.toString();
    if (error instanceof Error && error.message) {
      errorDetails = error.message;
    } else if (typeof error === 'object' && error !== null && !(error instanceof Error)) {
      errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error));
      if (errorDetails === '{}') { 
          errorDetails = error.toString() || 'No further details available after stringify.';
      }
    }
    return {
      error: 'An error occurred while translating text.',
      details: errorDetails
    };
  }
};

/**
 * Tool configuration for translating text using the Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: async (args, context) => {
    // The context object (second arg) is passed by the MCP server, not directly by user tests for this parameter.
    // For testing executeFunctionInternal, we pass dependencies directly.
    // For apiTool.function, we call executeFunctionInternal without the dependencies arg.
    return executeFunctionInternal(args); 
  },
  definition: {
    type: 'function',
    function: {
      name: 'translate_text',
      description: 'Translate input text to the target language.',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: 'The text to be translated.'
          },
          source_language_code: {
            type: 'string',
            description: 'The source language code.'
          },
          target_language_code: {
            type: 'string',
            description: 'The target language code.'
          },
          speaker_gender: {
            type: 'string',
            description: 'The gender of the speaker.'
          },
          mode: {
            type: 'string',
            description: 'The mode of translation.'
          },
          model: {
            type: 'string',
            description: 'The model to be used for translation.'
          },
          enable_preprocessing: {
            type: 'boolean',
            description: 'Whether to enable preprocessing.'
          }
        },
        required: ['input']
      }
    }
  }
};

export { apiTool };
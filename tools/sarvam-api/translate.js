import { SarvamAIClient } from 'sarvamai';

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
 * @returns {Promise<Object>} - The result of the translation.
 */
const executeFunction = async ({ input, source_language_code = 'en-IN', target_language_code = 'hi-IN', speaker_gender = 'Male', mode = 'formal', model = 'mayura:v1', enable_preprocessing = true }) => {
  const baseUrl = 'https://api.sarvam.ai/translate';
  const apiKey = process.env.SARVAM_API_API_KEY;
  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey
    });

    const params = {
      input: input,
      source_language_code,
      target_language_code
    };

    if (speaker_gender !== undefined) params.speaker_gender = speaker_gender;
    if (mode !== undefined) params.mode = mode;
    if (model !== undefined) params.model = model;
    if (enable_preprocessing !== undefined) params.enable_preprocessing = enable_preprocessing;

    // const response = await client.translateText.translate(params);
    // Assuming the method might be directly on the client or a more general sub-client
    // Option 1: Directly on client
    // const response = await client.translate(params); 
    // Option 2: Or if translateText is the correct object, but method name is different (less likely given error)

    // Let's try to find a translate method on the client object directly, 
    // or on a more general 'text' or 'translation' service if they exist.
    // Given the previous error, client.translateText itself is undefined.
    // We need to find out what IS defined on client that looks like translation.

    // For now, trying the most direct approach if such a method exists on the client itself.
    // This is a common pattern for SDKs. The Sarvam SDK documentation would clarify this definitively.
    if (typeof client.translate === 'function') {
      const response = await client.translate(params);
      return response;
    } else if (client.text && typeof client.text.translate === 'function') {
      // Alternative: if there's a general 'text' service
      const response = await client.text.translate(params);
      return response;
    } else if (client.translation && typeof client.translation.translate === 'function') {
      // Alternative: if there's a general 'translation' service
      const response = await client.translation.translate(params);
      return response;
    } else {
      console.error('Sarvam SDK translate method not found on client, client.text, or client.translation');
      return {
        error: 'Sarvam SDK translate method not found',
        details: 'Could not find a translate method on the SarvamAIClient instance. Please check SDK documentation.'
      };
    }

  } catch (error) {
    console.error('Error translating text:', error);
    let errorDetails = error.toString();
    if (error instanceof Error && error.message) {
      errorDetails = error.message;
    } else if (typeof error === 'object' && error !== null) {
      // Attempt to get more details if it's an object, e.g. from SDK error responses
      errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error));
      if (errorDetails === '{}') { // If basic stringify fails, try just message or stack
          errorDetails = error.message || error.stack || 'No further details available after stringify.';
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
  function: executeFunction,
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
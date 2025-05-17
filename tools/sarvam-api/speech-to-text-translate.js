import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

/**
 * Function to convert speech to text in a target language using Sarvam API.
 *
 * @param {Object} args - Arguments for the speech-to-text translation.
 * @param {string} args.file - The audio file to be processed.
 * @param {string} args.model - The model to use for the translation.
 * @param {boolean} args.with_diarization - Whether to enable speaker diarization.
 * @returns {Promise<Object>} - The result of the speech-to-text translation.
 */
const executeFunction = async ({ file, model = 'saaras:v2', with_diarization = false }) => {
  const baseUrl = 'https://api.sarvam.ai/speech-to-text-translate';
  const apiKey = process.env.SARVAM_API_KEY;

  try {
    // Check if file exists and is readable
    try {
      fs.accessSync(file, fs.constants.R_OK);
    } catch (fileErr) {
      console.error('Audio file is not accessible:', fileErr.message);
      return { error: 'Audio file is not accessible or does not exist.', details: fileErr.message };
    }

    const formData = new FormData();
    formData.append('model', model);
    formData.append('with_diarization', String(with_diarization));
    formData.append('file', fs.createReadStream(file));

    const headers = {
      'api-subscription-key': apiKey,
      ...formData.getHeaders()
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
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
      throw new Error(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    }
    return data;
  } catch (error) {
    console.error('Error converting speech to text:', error && (error.stack || error.message || error));
    return { error: 'An error occurred while converting speech to text.', details: error && (error.stack || error.message || error.toString()) };
  }
};

/**
 * Tool configuration for converting speech to text using Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'speech_to_text_translate',
      description: 'Convert speech to text in target language.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The path to the audio file to be processed.'
          },
          model: {
            type: 'string',
            description: 'The model to use for the translation.'
          },
          with_diarization: {
            type: 'boolean',
            description: 'Whether to enable speaker diarization.'
          }
        },
        required: ['file']
      }
    }
  }
};

export { apiTool };
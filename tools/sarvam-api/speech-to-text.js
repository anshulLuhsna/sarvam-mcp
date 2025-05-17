import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

/**
 * Function to transcribe audio input to text using Sarvam's speech-to-text models.
 *
 * @param {Object} args - Arguments for the transcription.
 * @param {string} args.language_code - The language code of the audio input (e.g., "hi-IN" for Hindi).
 * @param {string} args.model - The model to use for transcription (e.g., "saarika:v1").
 * @param {string} args.file - The path to the audio file to transcribe.
 * @param {boolean} [args.save_response=false] - Whether to save the response to a file.
 * @returns {Promise<Object>} - The result of the transcription.
 */
const executeFunction = async ({ language_code, model, file, save_response = false }) => {
  const baseUrl = 'https://api.sarvam.ai/speech-to-text';
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
    formData.append('language_code', language_code);
    formData.append('model', model);
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

    // Save response if requested
    if (save_response && typeof data === 'object') {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const responsesDir = path.join(process.cwd(), 'responses');
      
      // Create responses directory if it doesn't exist
      if (!fs.existsSync(responsesDir)) {
        fs.mkdirSync(responsesDir, { recursive: true });
      }
      
      const fileName = `stt_response_${timestamp}.json`;
      const filePath = path.join(responsesDir, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      data.saved_to = filePath;
    }
    
    return data;
  } catch (error) {
    console.error('Error transcribing audio:', error && (error.stack || error.message || error));
    return { error: 'An error occurred while transcribing audio.', details: error && (error.stack || error.message || error.toString()) };
  }
};

/**
 * Tool configuration for transcribing audio to text using Sarvam's speech-to-text models.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'speech_to_text',
      description: 'Transcribe audio input to text using Sarvam speech-to-text models.',
      parameters: {
        type: 'object',
        properties: {
          language_code: {
            type: 'string',
            description: 'The language code of the audio input.'
          },
          model: {
            type: 'string',
            description: 'The model to use for transcription.'
          },
          file: {
            type: 'string',
            description: 'The path to the audio file to transcribe.'
          },
          save_response: {
            type: 'boolean',
            description: 'Whether to save the response to a file.'
          }
        },
        required: ['language_code', 'model', 'file']
      }
    }
  }
};

export { apiTool };
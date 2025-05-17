import fs from 'fs';
import path from 'path';
import { SarvamAIClient } from 'sarvamai';

/**
 * Function to convert text inputs to speech using Sarvam API (via official SDK).
 *
 * @param {Object} args - Arguments for the text-to-speech conversion.
 * @param {string} args.inputs - The text input(s) to be converted to speech.
 * @param {string} [args.target_language_code="hi-IN"] - The target language code for the speech.
 * @param {string} [args.speaker="meera"] - The speaker's name for the voice.
 * @param {number} [args.pitch=0] - The pitch of the speech.
 * @param {number} [args.pace=1.65] - The pace of the speech.
 * @param {number} [args.loudness=1.5] - The loudness of the speech.
 * @param {number} [args.speech_sample_rate=8000] - The sample rate for the speech.
 * @param {boolean} [args.enable_preprocessing=true] - Whether to enable preprocessing.
 * @param {string} [args.model="bulbul:v1"] - The model to be used for conversion.
 * @param {string} [args.output_path] - Optional. Full path (including filename and .wav extension) where the audio file should be saved. If provided, the audio will be saved to this path. If not, the raw API response with base64 audio will be returned.
 * @returns {Promise<Object|string>} - If output_path is provided and saving is successful, returns a success message string. Otherwise, returns the JSON response from Sarvam API or an error object.
 */
const executeFunction = async ({ inputs, target_language_code = 'hi-IN', speaker = 'meera', pitch = 0, pace = 1.65, loudness = 1.5, speech_sample_rate = 8000, enable_preprocessing = true, model = 'bulbul:v1', output_path }) => {
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY environment variable with your Sarvam API key.'
    };
  }

  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: apiKey
    });

    const response = await client.textToSpeech.convert({
      text: inputs,
      target_language_code,
      speaker,
      pitch,
      pace,
      loudness,
      speech_sample_rate,
      enable_preprocessing,
      model
    });

    // If output_path is provided, save the audio and return success message or error
    if (output_path) {
      if (typeof output_path !== 'string' || !output_path.trim()) {
        return {
          error: 'Invalid output_path',
          details: 'output_path must be a non-empty string if provided.'
        };
      }
      try {
        if (response.audios && response.audios.length > 0) {
          const outputDir = path.dirname(output_path);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const combinedAudio = response.audios.join('');
          const audioBuffer = Buffer.from(combinedAudio, 'base64');
          
          // Assuming WAV output based on previous implementation and common use case
          // If other formats are possible from Sarvam and desired, this might need adjustment
          writeWav(audioBuffer, output_path, speech_sample_rate, 1, 16);
          
          return `Successfully saved to ${output_path}`;
        } else {
          return {
            error: 'No audio data received from API to save.',
            details: 'The API response did not contain any audio chunks.'
          };
        }
      } catch (saveError) {
        console.error(`Error saving audio to ${output_path}:`, saveError);
        return {
          error: 'Failed to save audio to specified path.',
          details: saveError.message,
          specified_path: output_path
        };
      }
    } else {
      // If output_path is NOT provided, return the full API response
      return response;
    }
  } catch (error) {
    console.error('Error converting text to speech:', error);
    // Ensure the error object from the main catch is consistent
    let errorDetails = error.toString();
    if (error.response && error.response.data) { // Attempt to get more specific error from Sarvam SDK if available
      errorDetails = JSON.stringify(error.response.data);
    }
    return {
      error: 'An error occurred while converting text to speech.',
      details: errorDetails
    };
  }
};

// Write a PCM buffer to a WAV file
function writeWav(pcmBuffer, filename, sampleRate, numChannels, bitDepth) {
  const header = createWavHeader(pcmBuffer.length, sampleRate, numChannels, bitDepth);
  const wavBuffer = Buffer.concat([header, pcmBuffer]);
  fs.writeFileSync(filename, wavBuffer);
}

// Create a WAV file header
function createWavHeader(dataLength, sampleRate, numChannels, bitDepth) {
  const blockAlign = numChannels * bitDepth / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}

/**
 * Tool configuration for converting text to speech using Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'text_to_speech',
      description: 'Convert text inputs to speech using Sarvam API. If output_path is provided, saves audio to file and returns success message. Otherwise, returns API response with base64 audio.',
      parameters: {
        type: 'object',
        properties: {
          inputs: {
            type: 'string',
            description: 'The text input(s) to be converted to speech.'
          },
          target_language_code: {
            type: 'string',
            description: 'The target language code for the speech. Default: hi-IN'
          },
          speaker: {
            type: 'string',
            description: 'The speaker\'s name for the voice. Default: meera'
          },
          pitch: {
            type: 'number',
            description: 'The pitch of the speech. Default: 0'
          },
          pace: {
            type: 'number',
            description: 'The pace of the speech. Default: 1.65'
          },
          loudness: {
            type: 'number',
            description: 'The loudness of the speech. Default: 1.5'
          },
          speech_sample_rate: {
            type: 'number',
            description: 'The sample rate for the speech. Default: 8000'
          },
          enable_preprocessing: {
            type: 'boolean',
            description: 'Whether to enable preprocessing. Default: true'
          },
          model: {
            type: 'string',
            description: 'The model to be used for conversion. Default: bulbul:v1'
          },
          output_path: {
            type: 'string',
            description: 'Optional. Full path (including filename and .wav extension) where the audio file should be saved. If provided, audio is saved and a success message is returned. If omitted, the raw API response with base64 audio is returned.'
          }
        },
        required: ['inputs'] // output_path is not required
      }
    }
  }
};

export { apiTool };
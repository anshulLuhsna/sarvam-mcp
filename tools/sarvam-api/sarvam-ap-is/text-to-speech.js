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
 * @param {boolean} [args.save_response=true] - Whether to save the response to a file.
 * @returns {Promise<Object>} - The result of the text-to-speech conversion.
 */
const executeFunction = async ({ inputs, target_language_code = 'hi-IN', speaker = 'meera', pitch = 0, pace = 1.65, loudness = 1.5, speech_sample_rate = 8000, enable_preprocessing = true, model = 'bulbul:v1', save_response = false }) => {
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

    // The SDK expects a string for text, not an array
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

    // Save response if requested
    if (save_response) {
      try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const responsesDir = path.join(process.env.HOME || process.env.USERPROFILE, 'responses');
        if (!fs.existsSync(responsesDir)) {
          fs.mkdirSync(responsesDir, { recursive: true });
        }
        // Save the complete response as JSON for reference
        const jsonFileName = `tts_response_${timestamp}.json`;
        const jsonFilePath = path.join(responsesDir, jsonFileName);
        fs.writeFileSync(jsonFilePath, JSON.stringify(response, null, 2));

        // Combine base64 audio chunks
        if (response.audios && response.audios.length > 0) {
          const combinedAudio = response.audios.join('');
          const audioBuffer = Buffer.from(combinedAudio, 'base64');
          // Write WAV header and PCM data
          const audioFileName = `tts_audio_${timestamp}.wav`;
          const audioFilePath = path.join(responsesDir, audioFileName);
          writeWav(audioBuffer, audioFilePath, speech_sample_rate, 1, 16);
          response.saved_to = {
            json: jsonFilePath,
            audio: audioFilePath,
            format: 'wav'
          };
          console.log(`Audio saved to: ${audioFilePath}`);
        }
      } catch (saveError) {
        console.error('Error saving response:', saveError);
        response.save_error = saveError.message;
      }
    }
    return response;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return {
      error: 'An error occurred while converting text to speech.',
      details: error.toString()
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
      description: 'Convert text inputs to speech using Sarvam API.',
      parameters: {
        type: 'object',
        properties: {
          inputs: {
            type: 'string',
            description: 'The text input(s) to be converted to speech.'
          },
          target_language_code: {
            type: 'string',
            description: 'The target language code for the speech.'
          },
          speaker: {
            type: 'string',
            description: 'The speaker\'s name for the voice.'
          },
          pitch: {
            type: 'number',
            description: 'The pitch of the speech.'
          },
          pace: {
            type: 'number',
            description: 'The pace of the speech.'
          },
          loudness: {
            type: 'number',
            description: 'The loudness of the speech.'
          },
          speech_sample_rate: {
            type: 'number',
            description: 'The sample rate for the speech.'
          },
          enable_preprocessing: {
            type: 'boolean',
            description: 'Whether to enable preprocessing.'
          },
          model: {
            type: 'string',
            description: 'The model to be used for conversion.'
          },
          save_response: {
            type: 'boolean',
            description: 'Whether to save the response to a file.'
          }
        },
        required: ['inputs']
      }
    }
  }
};

export { apiTool };
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

/**
 * Function to analyze call content and answer questions using Sarvam's Call Analytics API.
 *
 * @param {Object} args - Arguments for the call analytics request.
 * @param {string} args.file - The path to the audio file to be analyzed.
 * @param {Array} args.questions - Array of question objects as per API docs.
 * @param {string} [args.hotwords] - Optional comma-separated string of keywords.
 * @param {string} [args.model] - Optional model to use (default: 'saaras:v2').
 * @returns {Promise<Object>} - The result of the call analytics analysis.
 */
const executeFunction = async ({ file, questions, hotwords = '', model = 'saaras:v2' }) => {
  const baseUrl = 'https://api.sarvam.ai/call-analytics';
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
    formData.append('file', fs.createReadStream(file));
    formData.append('questions', JSON.stringify(questions));
    if (hotwords) formData.append('hotwords', hotwords);
    if (model) formData.append('model', model);

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
    console.error('Error analyzing call:', error && (error.stack || error.message || error));
    return { error: 'An error occurred while analyzing the call.', details: error && (error.stack || error.message || error.toString()) };
  }
};

/**
 * Tool configuration for analyzing call content using Sarvam's Call Analytics API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'call_analytics',
      description: 'Analyze call content and answer questions based on the transcript.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'The path to the audio file to be analyzed.'
          },
          questions: {
            type: 'array',
            description: 'Array of question objects. Each question: {id: string, text: string, description?: string, type: string, properties?: object}',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Unique identifier for the question.'
                },
                text: {
                  type: 'string',
                  description: 'The text of the question.'
                },
                description: {
                  type: 'string',
                  description: 'Optional description for the question.'
                },
                type: {
                  type: 'string',
                  description: 'Type of answer expected (boolean, enum, short answer, long answer, number).'
                  // Potentially add enum for the allowed types if strictly enforced
                },
                properties: {
                  type: 'object',
                  description: 'Additional properties, e.g., options list for enum type. Example: { \"options\": [\"yes\", \"no\"] }'
                  // This could be further defined if the structure of properties is fixed for certain types
                }
              },
              required: ['id', 'text', 'type']
            }
          },
          hotwords: {
            type: 'string',
            description: 'Optional comma-separated string of keywords.'
          },
          model: {
            type: 'string',
            description: 'Optional model to use.'
          }
        },
        required: ['file', 'questions']
      }
    }
  }
};

export { apiTool };
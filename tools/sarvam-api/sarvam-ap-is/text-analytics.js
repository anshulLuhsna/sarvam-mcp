import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

/**
 * Function to perform text analysis using Sarvam API (via direct API call).
 *
 * @param {Object} args - Arguments for the text analysis.
 * @param {string} args.text_content - The text content to be analyzed.
 * @param {Array<Object>} args.questions - List of questions to be answered based on the text content.
 * Each question object should have: {id: string, text: string, description?: string, type: string, properties?: object}
 * Type must be one of: boolean, enum, short answer, long answer, or number.
 * @returns {Promise<Object>} - The result of the text analysis.
 */
const executeFunction = async ({ text_content, questions }) => {
  const apiKey = process.env.SARVAM_API_KEY;
  const baseUrl = 'https://api.sarvam.ai/text-analytics';

  if (!apiKey) {
    console.error('SARVAM_API_KEY environment variable is not set');
    return {
      error: 'SARVAM_API_KEY environment variable is not set',
      details: 'Please make sure you have set the SARVAM_API_KEY environment variable with your Sarvam API key.'
    };
  }

  if (!text_content || !questions) {
    let missingParams = [];
    if (!text_content) missingParams.push('text_content');
    if (!questions) missingParams.push('questions');
    return {
      error: `Missing required parameter(s): ${missingParams.join(', ')}`,
      details: 'Both text_content and questions parameters are required for text analysis.'
    };
  }

  try {
    const headers = {
      'api-subscription-key': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyParams = new URLSearchParams();
    bodyParams.append('text', text_content);
    bodyParams.append('questions', JSON.stringify(questions));

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: headers,
      body: bodyParams.toString() // Using toString() for clarity, fetch can often handle URLSearchParams directly
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, try to get text for more detailed error
      data = await response.text();
    }

    if (!response.ok) {
      console.error('API Error Response:', data);
      // Ensure error is a string or stringified object
      const errorMessage = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error performing text analysis:', error && (error.stack || error.message || error));
    return {
      error: 'An error occurred while performing text analysis.',
      // Ensure details provides useful error information
      details: error && (error.message || error.toString())
    };
  }
};

/**
 * Tool configuration for text analysis using Sarvam API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'analyze_text',
      description: 'Performs comprehensive text analysis on provided content and answers specific questions about the text using Sarvam API.',
      parameters: {
        type: 'object',
        properties: {
          text_content: {
            type: 'string',
            description: 'The text content to be analyzed. This should be a non-empty string containing the full text for analysis.'
          },
          questions: {
            type: 'array',
            description: 'List of questions to be answered based on the text content. Each question: {id: string, text: string, description?: string, type: string, properties?: object}',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Unique identifier for the question.' },
                text: { type: 'string', description: 'The question text.' },
                description: { type: 'string', description: 'Optional description for the question.' },
                type: { type: 'string', description: 'Type of answer expected (boolean, enum, short answer, long answer, number).' },
                properties: { type: 'object', description: 'Additional properties, e.g., options for enum type.' }
              },
              required: ['id', 'text', 'type']
            }
          }
        },
        required: ['text_content', 'questions']
      }
    }
  }
};

export { apiTool }; 
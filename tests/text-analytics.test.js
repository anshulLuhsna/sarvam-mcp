import { jest } from '@jest/globals';
import { apiTool } from '../tools/sarvam-api/text-analytics.js';

// Mock node-fetch, assuming the tool uses it for API calls
jest.mock('node-fetch', () => jest.fn());

describe('Sarvam API - Text Analytics Tool', () => {
  beforeEach(() => {
    jest.requireMock('node-fetch').mockClear();
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  // Add more specific tests here, e.g.:
  // test('should call the text analytics API with correct parameters', async () => {
  //   const mockFetch = jest.requireMock('node-fetch');
  //   const mockQuestion = { id: 'q1', text: 'What is the sentiment?', type: 'short_answer' };
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ answers: [{ id: 'q1', answer: 'positive' }] }),
  //   });

  //   const result = await apiTool.function({
  //     text_content: 'This is a wonderful day!',
  //     questions: [mockQuestion]
  //   }, { SARVAM_API_KEY: 'test-key' });

  //   expect(mockFetch).toHaveBeenCalledWith(
  //     expect.stringContaining('/api/v1/analyze/text'), // Or the correct endpoint
  //     expect.objectContaining({
  //       method: 'POST',
  //       body: JSON.stringify({
  //         text_content: 'This is a wonderful day!',
  //         questions: [mockQuestion]
  //       }),
  //     })
  //   );
  //   expect(result.answers).toEqual([{ id: 'q1', answer: 'positive' }]);
  // });
}); 
import { jest } from '@jest/globals';
import { apiTool } from '../tools/sarvam-api/transliterate-text.js';

// Mock node-fetch, assuming the tool uses it for API calls
jest.mock('node-fetch', () => jest.fn());

describe('Sarvam API - Transliterate Text Tool', () => {
  beforeEach(() => {
    jest.requireMock('node-fetch').mockClear();
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  // Add more specific tests here, e.g.:
  // test('should call the transliterate API with correct parameters', async () => {
  //   const mockFetch = jest.requireMock('node-fetch');
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ transliterated_text: 'namaste duniya' }),
  //   });

  //   const result = await apiTool.function({
  //     input_text: 'नमस्ते दुनिया',
  //     source_language_code: 'hi-IN',
  //     target_language_code: 'en-IN'
  //   }, { SARVAM_API_KEY: 'test-key' });

  //   expect(mockFetch).toHaveBeenCalledWith(
  //     expect.stringContaining('/api/v1/transliterate'), // Or the correct endpoint
  //     expect.objectContaining({
  //       method: 'POST',
  //       body: JSON.stringify({
  //         input_text: 'नमस्ते दुनिया',
  //         source_language_code: 'hi-IN',
  //         target_language_code: 'en-IN'
  //       }),
  //     })
  //   );
  //   expect(result.transliterated_text).toBe('namaste duniya');
  // });
}); 
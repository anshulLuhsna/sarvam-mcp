import { jest } from '@jest/globals';
import { apiTool } from '../tools/sarvam-api/speech-to-text-translate.js';
import fs from 'fs'; // For mocking file operations

// Mock node-fetch, as this tool likely uploads a file and calls an API
jest.mock('node-fetch', () => jest.fn());
// jest.mock('fs');

describe('Sarvam API - Speech to Text Translate Tool', () => {
  beforeEach(() => {
    jest.requireMock('node-fetch').mockClear();
    // if (fs.accessSync) fs.accessSync.mockClear();
    // if (fs.createReadStream) fs.createReadStream.mockClear();
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  // Add more specific tests here, e.g.:
  // test('should call the speech-to-text translate API with file data', async () => {
  //   const mockFetch = jest.requireMock('node-fetch');
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ translated_text: 'hello world', source_language: 'en' }),
  //   });

  //   fs.accessSync = jest.fn();
  //   const mockReadStream = { pipe: jest.fn(), on: jest.fn() };
  //   fs.createReadStream = jest.fn().mockReturnValue(mockReadStream);

  //   const result = await apiTool.function({
  //     file: 'path/to/mock/audio.wav',
  //     // target_language_code: 'es' // This API might auto-detect target or use a default
  //   }, { SARVAM_API_KEY: 'test-key' });

  //   expect(fs.accessSync).toHaveBeenCalledWith('path/to/mock/audio.wav');
  //   expect(mockFetch).toHaveBeenCalled(); // Add specific assertions
  //   expect(result.translated_text).toBe('hello world');
  // });
});

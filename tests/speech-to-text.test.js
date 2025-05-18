import { jest } from '@jest/globals';
import { apiTool } from '../tools/sarvam-api/speech-to-text.js';
import fs from 'fs'; // For mocking file operations if needed

// Mock node-fetch, assuming the tool uses it for API calls
jest.mock('node-fetch', () => jest.fn());
// Mock fs if the tool reads files (e.g., audio files)
// jest.mock('fs');

describe('Sarvam API - Speech to Text Tool', () => {
  beforeEach(() => {
    jest.requireMock('node-fetch').mockClear();
    // fs.accessSync.mockClear(); // Example if mocking fs
    // fs.createReadStream.mockClear(); // Example if mocking fs
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  // Add more specific tests here, e.g.:
  // test('should call the speech-to-text API with correct parameters for a file path', async () => {
  //   const mockFetch = jest.requireMock('node-fetch');
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ transcript: 'hello world' }), 
  //   });

  //   // Mock fs.accessSync to simulate file existence
  //   fs.accessSync = jest.fn(); 
  //   // Mock fs.createReadStream if the tool uses it
  //   const mockReadStream = { pipe: jest.fn(), on: jest.fn() };
  //   fs.createReadStream = jest.fn().mockReturnValue(mockReadStream);

  //   const result = await apiTool.function({
  //     file: 'path/to/mock/audio.wav',
  //     language_code: 'en-US'
  //   }, { SARVAM_API_KEY: 'test-key' });

  //   expect(fs.accessSync).toHaveBeenCalledWith('path/to/mock/audio.wav');
  //   expect(mockFetch).toHaveBeenCalled(); // Add more specific assertions for fetch call
  //   expect(result.transcript).toBe('hello world');
  // });
}); 
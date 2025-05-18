import { jest } from '@jest/globals';
import { apiTool } from '../tools/sarvam-api/call-analytics.js';
import fs from 'fs'; // For mocking file operations

// Mock node-fetch, as this tool likely uploads a file and calls an API
jest.mock('node-fetch', () => jest.fn());
// jest.mock('fs');

describe('Sarvam API - Call Analytics Tool', () => {
  beforeEach(() => {
    jest.requireMock('node-fetch').mockClear();
    // if (fs.accessSync) fs.accessSync.mockClear();
    // if (fs.createReadStream) fs.createReadStream.mockClear();
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  // Add more specific tests here, e.g.:
  // test('should call the call analytics API with file data and questions', async () => {
  //   const mockFetch = jest.requireMock('node-fetch');
  //   const mockQuestion = { id: 'q1', text: 'Was the customer satisfied?', type: 'boolean' };
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ answers: [{ id: 'q1', answer: true }] }),
  //   });

  //   fs.accessSync = jest.fn();
  //   const mockReadStream = { pipe: jest.fn(), on: jest.fn() };
  //   fs.createReadStream = jest.fn().mockReturnValue(mockReadStream);

  //   const result = await apiTool.function({
  //     file: 'path/to/mock/call-audio.wav',
  //     questions: [mockQuestion],
  //     // hotwords: 'support,issue'
  //   }, { SARVAM_API_KEY: 'test-key' });

  //   expect(fs.accessSync).toHaveBeenCalledWith('path/to/mock/call-audio.wav');
  //   expect(mockFetch).toHaveBeenCalled(); // Add specific assertions for FormData, headers etc.
  //   expect(result.answers).toEqual([{ id: 'q1', answer: true }]);
  // });
}); 
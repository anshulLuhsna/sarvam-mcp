import { jest } from '@jest/globals';

// Mock the SarvamAIClient SDK
const mockIdentifyLanguage = jest.fn();
const mockSarvamAIClientConstructor = jest.fn().mockImplementation(() => ({
  text: {
    identifyLanguage: mockIdentifyLanguage,
  },
}));

jest.mock('sarvamai', () => ({
  SarvamAIClient: mockSarvamAIClientConstructor,
}));

describe('Sarvam API - Language Identification Tool', () => {
  let apiTool;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Clears the cache
    process.env = { ...OLD_ENV }; // Make a copy

    // Re-mock SarvamAIClient before each test and before importing the tool
    const mockIdentifyLanguageFresh = jest.fn();
    const mockSarvamAIClientConstructorFresh = jest.fn().mockImplementation(() => ({
      text: {
        identifyLanguage: mockIdentifyLanguageFresh,
      },
    }));
    jest.doMock('sarvamai', () => ({
      SarvamAIClient: mockSarvamAIClientConstructorFresh,
    }));

    // Dynamically import the tool AFTER mocks are set up
    const toolModule = await import('../tools/sarvam-api/language-identification.js');
    apiTool = toolModule.apiTool;

    // Assign fresh mocks for assertions in each test
    global.currentMockIdentifyLanguage = mockIdentifyLanguageFresh;
    global.currentMockSarvamAIClientConstructor = mockSarvamAIClientConstructorFresh;
  });

  afterEach(() => {
    process.env = OLD_ENV; // Restore old environment
    // Clean up globals if used
    delete global.currentMockIdentifyLanguage;
    delete global.currentMockSarvamAIClientConstructor;
  });

  test('should have a function property in apiTool', () => {
    expect(typeof apiTool.function).toBe('function');
  });

  test('should call the language identification API with correct parameters and return the result', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    const mockApiResponse = { language_code: 'en-IN', script_code: 'Latn', confidence: 0.9 };
    global.currentMockIdentifyLanguage.mockResolvedValue(mockApiResponse);

    const inputText = 'This is a test.';
    const result = await apiTool.function({ input_text: inputText });

    expect(global.currentMockSarvamAIClientConstructor).toHaveBeenCalledWith({ apiSubscriptionKey: 'test-key' });
    expect(global.currentMockIdentifyLanguage).toHaveBeenCalledWith({ input: inputText });
    expect(result).toEqual(mockApiResponse);
  });

  test('should return an error if SARVAM_API_KEY is not set', async () => {
    // SARVAM_API_KEY is already not set by default in beforeEach due to process.env = { ...OLD_ENV }
    // but to be explicit for this test case:
    delete process.env.SARVAM_API_KEY;
    
    // Re-import tool with this specific env state if necessary, or ensure initial import in beforeEach is sufficient
    // For this test, the check happens before SDK instantiation, so current setup should be fine.
    const toolModule = await import('../tools/sarvam-api/language-identification.js');
    apiTool = toolModule.apiTool;

    const result = await apiTool.function({ input_text: 'Test' });
    expect(result.error).toBe('SARVAM_API_KEY environment variable is not set');
    expect(global.currentMockIdentifyLanguage).not.toHaveBeenCalled();
  });

  test('should return an error if input_text is not provided', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    // Re-import to ensure fresh state with API key set
    const toolModule = await import('../tools/sarvam-api/language-identification.js');
    apiTool = toolModule.apiTool;

    const result = await apiTool.function({}); // Missing input_text
    expect(result.error).toBe('Missing required parameter: input_text');
    expect(global.currentMockIdentifyLanguage).not.toHaveBeenCalled();
  });

  test('should handle errors from the SarvamAIClient', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    const errorMessage = 'SDK error correctly mocked';
    global.currentMockIdentifyLanguage.mockRejectedValue(new Error(errorMessage));

    // Re-import tool to ensure it uses the mocks configured in this test scope
    const toolModule = await import('../tools/sarvam-api/language-identification.js');
    apiTool = toolModule.apiTool;

    const result = await apiTool.function({ input_text: 'This is a test.' });

    expect(result.error).toBe('An error occurred while identifying the language.');
    expect(result.details).toBe(`Error: ${errorMessage}`);
  });
}); 
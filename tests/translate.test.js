import { jest } from '@jest/globals';
// Import the internal function for testing, and the apiTool for a basic check if needed.
import { apiTool as actualApiTool, executeFunctionInternal } from '../tools/sarvam-api/translate.js'; 

// Mocks defined at the top
const mockSarvamAIClientConstructor = jest.fn();
const mockTranslate = jest.fn();
const mockMapLanguageCode = jest.fn(); // This one is for DI, not module mocking

// Use jest.doMock for 'sarvamai' so it can be applied before dynamic imports
jest.doMock('sarvamai', () => ({
  SarvamAIClient: mockSarvamAIClientConstructor,
}));

describe('Sarvam API - Translate Tool (Internal Function Test)', () => {
  let executeFunctionInternal;
  let actualApiTool; // To store the dynamically imported apiTool
  const OLD_ENV = process.env;

  beforeEach(async () => { // beforeEach is now async
    jest.resetModules(); // Crucial: resets the module cache

    // Restore environment variables to a known state before each test.
    // This should happen after resetModules and before dynamic import if the module reads env vars at load time.
    process.env = { ...OLD_ENV };

    // Dynamically import the module AFTER resetModules and AFTER jest.doMock has been set up.
    // This ensures the module gets the mocked dependencies.
    const translateToolModule = await import('../tools/sarvam-api/translate.js');
    executeFunctionInternal = translateToolModule.executeFunctionInternal;
    actualApiTool = translateToolModule.apiTool;

    // Clear and re-configure mocks for each test to ensure test isolation
    mockSarvamAIClientConstructor.mockClear().mockImplementation(() => ({
      text: { translate: mockTranslate.mockClear() }, // Clear mockTranslate when constructor mock is re-established
    }));
    mockMapLanguageCode.mockClear().mockImplementation(code => code); // Default pass-through for DI mock
  });

  afterEach(() => {
    process.env = OLD_ENV; // Clean up environment variables
  });

  // Test the exported apiTool minimally (now using actualApiTool from dynamic import)
  test('actual apiTool should have a function property', () => {
    expect(typeof actualApiTool.function).toBe('function');
  });

  test('should call Sarvam SDK with correct parameters and mapped languages, returning result', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    const mockApiResponse = { translated_text: 'नमस्ते दुनिया' };
    mockTranslate.mockResolvedValue(mockApiResponse);
    mockMapLanguageCode
      .mockImplementationOnce(code => `${code}-mapped1`) // e.g., en -> en-mapped1
      .mockImplementationOnce(code => `${code}-mapped2`);// e.g., hi -> hi-mapped2

    const args = {
      input: 'Hello world',
      source_language_code: 'en',
      target_language_code: 'hi',
      speaker_gender: 'Female',
      mode: 'conversational',
      model: 'test-model:v2',
      enable_preprocessing: false,
    };
    // Call executeFunctionInternal directly, passing the mockMapLanguageCode
    const result = await executeFunctionInternal(args, { mapLangFunc: mockMapLanguageCode });

    expect(mockSarvamAIClientConstructor).toHaveBeenCalledWith({ apiSubscriptionKey: 'test-key' });
    expect(mockMapLanguageCode).toHaveBeenCalledWith('en');
    expect(mockMapLanguageCode).toHaveBeenCalledWith('hi');
    expect(mockTranslate).toHaveBeenCalledWith({
      input: 'Hello world',
      source_language_code: 'en-mapped1', // Expect mapped code
      target_language_code: 'hi-mapped2', // Expect mapped code
      speaker_gender: 'Female',
      mode: 'conversational',
      model: 'test-model:v2',
      enable_preprocessing: false,
    });
    expect(result).toEqual(mockApiResponse);
  });

  test('should use default parameters if not provided', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    mockTranslate.mockResolvedValue({ translated_text: ' ডিফল্ট উত্তর' });
    // Let mapLangFunc use its default mock (pass-through)

    await executeFunctionInternal({ input: 'Test input' }, { mapLangFunc: mockMapLanguageCode });

    expect(mockTranslate).toHaveBeenCalledWith(expect.objectContaining({
      input: 'Test input',
      source_language_code: 'en-IN', 
      target_language_code: 'hi-IN', 
      speaker_gender: 'Male',
      mode: 'formal',
      model: 'mayura:v1',
      enable_preprocessing: true,
    }));
  });

  test('should return error if SARVAM_API_KEY is not set', async () => {
    delete process.env.SARVAM_API_KEY;
    const result = await executeFunctionInternal({ input: 'test' }, { mapLangFunc: mockMapLanguageCode });
    expect(result.error).toBe('SARVAM_API_KEY environment variable is not set');
    expect(mockSarvamAIClientConstructor).not.toHaveBeenCalled();
  });
  
  test('should return an error if SDK method is not found (simulated)', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    // Configure the SarvamAIClient mock for this specific test case
    // to simulate the translate method not being available.
    mockSarvamAIClientConstructor.mockImplementationOnce(() => ({
      text: {}, // text object exists, but no translate method
    }));

    const result = await executeFunctionInternal({ input: 'Test' }, { mapLangFunc: mockMapLanguageCode });
    expect(result.error).toBe('Sarvam SDK translate method not found');
    expect(mockSarvamAIClientConstructor).toHaveBeenCalledWith({ apiSubscriptionKey: 'test-key' });
  });

  test('should handle errors from the SarvamAIClient translate method', async () => {
    process.env.SARVAM_API_KEY = 'test-key';
    const errorMessage = 'SDK translation error';
    mockTranslate.mockRejectedValue(new Error(errorMessage));

    const result = await executeFunctionInternal({ input: 'Test input' }, { mapLangFunc: mockMapLanguageCode });
    expect(result.error).toBe('An error occurred while translating text.');
    expect(result.details).toBe(errorMessage); 
  });
}); 
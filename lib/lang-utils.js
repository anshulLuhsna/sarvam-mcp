/**
 * Maps generic language codes to specific regional codes.
 * @param {string} langCode - The input language code.
 * @returns {string} - The mapped language code.
 */
export const mapLanguageCode = (langCode) => {
  if (typeof langCode !== 'string') return langCode;
  const lowerLangCode = langCode.toLowerCase();
  if (lowerLangCode === 'en') return 'en-IN';
  if (lowerLangCode === 'hi') return 'hi-IN';
  // Add other mappings as needed
  return langCode; // Return original if no mapping found
}; 
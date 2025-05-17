Transliteration converts text from one script to another while preserving the original pronunciation. For example, ‘नमस्ते’ becomes ‘namaste’ in English, and ‘how are you’ can be written as ‘हाउ आर यू’ in Devanagari. This process ensures that the sound of the original text remains intact, even when written in a different script.

Transliteration is useful when you want to represent words phonetically across different writing systems, such as converting ‘मैं ऑफिस जा रहा हूँ’ to ‘main office ja raha hun’ in English letters.

Translation, on the other hand, converts text from one language to another while preserving the meaning rather than pronunciation. For example, ‘मैं ऑफिस जा रहा हूँ’ translates to ‘I am going to the office’ in English, changing both the script and the language while conveying the intended message.

Examples of Transliteration:
‘Good morning’ becomes ‘गुड मॉर्निंग’ in Hindi, where the pronunciation is preserved but the meaning is not translated.
‘सुप्रभात’ becomes ‘suprabhat’ in English.
Available languages:

en-IN: English
hi-IN: Hindi
bn-IN: Bengali
gu-IN: Gujarati
kn-IN: Kannada
ml-IN: Malayalam
mr-IN: Marathi
od-IN: Odia
pa-IN: Punjabi
ta-IN: Tamil
te-IN: Telugu
For hands-on practice, you can explore the notebook tutorial on Transliterate API Tutorial.

Headers
api-subscription-key
string
Required
Request
This endpoint expects an object.
input
string
Required
<=1000 characters
The text you want to transliterate.

source_language_code
enum
Required
The language code of the input text. This specifies the source language for transliteration.

Note: The source language should either be an Indic language or English. As we supports both Indic-to-English and English-to-Indic transliteration.


Show 12 enum values
target_language_code
enum
Required
The language code of the transliteration text. This specifies the target language for transliteration.

Note:The target language should either be an Indic language or English. As we supports both Indic-to-English and English-to-Indic transliteration.


Show 11 enum values
numerals_format
enum
Optional
numerals_format is an optional parameter with two options:

international (default): Uses regular numerals (0-9).
native: Uses language-specific native numerals.
Example:
If international format is selected, we use regular numerals (0-9). For example: मेरा phone number है: 9840950950.
If native format is selected, we use language-specific native numerals, like: मेरा phone number है: ९८४०९५०९५०.
Allowed values:
international
native
spoken_form_numerals_language
enum
Optional
spoken_form_numerals_language is an optional parameter with two options and only works when spoken_form is true:

english : Numbers in the text will be spoken in English.
native(default): Numbers in the text will be spoken in the native language.
Examples:
Input: “मेरे पास ₹200 है”
If english format is selected: “मेरे पास टू हन्डर्ड रूपीस है”
If native format is selected: “मेरे पास दो सौ रुपये है”
Allowed values:
english
native
spoken_form
boolean
Optional
Defaults to false
Default: False
Converts text into a natural spoken form when True.
Note: No effect if output language is en-IN.
Example:
Input: मुझे कल 9:30am को appointment है
Output: मुझे कल सुबह साढ़े नौ बजे को अपॉइंटमेंट है
Response
Successful Response

transliterated_text
string
Transliterated text result in the requested target language.

source_language_code
string
Detected or provided source language of the input text.

request_id
string
Optional
Errors

400
Text Transliterate Request Bad Request Error

403
Text Transliterate Request Forbidden Error

422
Text Transliterate Request Unprocessable Entity Error

429
Text Transliterate Request Too Many Requests Error

500
Text Transliterate Request Internal Server Error

curl -X POST https://api.sarvam.ai/transliterate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "input",
  "source_language_code": "auto",
  "target_language_code": "en-IN"
}'

{
  "transliterated_text": "transliterated_text",
  "source_language_code": "source_language_code",
  "request_id": "request_id"
}
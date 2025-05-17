Translation converts text from one language to another while preserving its meaning. For Example: ‘मैं ऑफिस जा रहा हूँ’ translates to ‘I am going to the office’ in English, where the script and language change, but the original meaning remains the same.

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
For hands-on practice, you can explore the notebook tutorial on Translate API Tutorial.

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
The text you want to translate. This is the input text that will be processed by the translation model.

source_language_code
enum
Required
The language code of the input text. This specifies the source language for translation.

Note: The source language should either be an Indic language or English. As we supports both Indic-to-English and English-to-Indic translation.


Show 12 enum values
target_language_code
enum
Required
The language code of the translated text. This specifies the target language for translation.

Note:The target language should either be an Indic language or English. As we supports both Indic-to-English and English-to-Indic translation.


Show 11 enum values
speaker_gender
enum
Optional
Please specify the gender of the speaker for better translations. This feature is only supported for the code-mixed translation models currently.

Allowed values:
Male
Female
mode
enum
Optional
Specifies the tone or style of the translation. Choose between formal, classic-colloquial and modern-colloquial translations. Default is formal.

Allowed values:
formal
modern-colloquial
classic-colloquial
code-mixed
model
"mayura:v1"
Optional
Defaults to mayura:v1
Specifies the translation model to use. Currently, only one model is supported.Note:- This parameter is optional but will be deprecated by the end of January; avoid including it in your requests.

enable_preprocessing
boolean
Optional
Defaults to false
This will enable custom preprocessing of the input text which can result in better translations.

output_script
enum
Optional
output_script: This is an optional parameter which controls the transliteration style applied to the output text.

Transliteration: Converting text from one script to another while preserving pronunciation.

We support transliteration with four options:

null(default): No transliteration applied.

roman: Transliteration in Romanized script.

fully-native: Transliteration in the native script with formal style.

spoken-form-in-native: Transliteration in the native script with spoken style.

Example:
English: Your EMI of Rs. 3000 is pending. Default modern translation: आपका Rs. 3000 का EMI pending है (when null is passed).

With postprocessing enabled, we provide the following style of outputs:

roman output: aapka Rs. 3000 ka EMI pending hai.
fully-native output: आपका रु. 3000 का ई.एम.ऐ. पेंडिंग है।
spoken-form-in-native output: आपका थ्री थाउजेंड रूपीस का ईएमअइ पेंडिंग है।
Allowed values:
roman
fully-native
spoken-form-in-native
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
Response
Successful Response

translated_text
string
Translated text result in the requested target language.

source_language_code
string
Detected or provided source language of the input text.

request_id
string
Optional
Errors

400
Text Translate Request Bad Request Error

403
Text Translate Request Forbidden Error

422
Text Translate Request Unprocessable Entity Error

429
Text Translate Request Too Many Requests Error

500
Text Translate Request Internal Server Error

curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "input",
  "source_language_code": "auto",
  "target_language_code": "en-IN"
}'

{
  "translated_text": "translated_text",
  "source_language_code": "source_language_code",
  "request_id": "request_id"
}
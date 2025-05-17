Identifies the language (e.g., en-IN, hi-IN) and script (e.g., Latin, Devanagari) of the input text, supporting multiple languages.

Headers
api-subscription-key
string
Required
Request
This endpoint expects an object.
input
string
Required
The text input for language and script identification.

Response
Successful Response

request_id
string
Optional
language_code
string
Optional
The detected language code of the input text.

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
script_code
string
Optional
The detected script code of the input text.

Available scripts:

Latn: Latin (Romanized script)
Deva: Devanagari (Hindi, Marathi)
Beng: Bengali
Gujr: Gujarati
Knda: Kannada
Mlym: Malayalam
Orya: Odia
Guru: Gurmukhi
Taml: Tamil
Telu: Telugu
Errors

400
Text Identify Language Request Bad Request Error

403
Text Identify Language Request Forbidden Error

422
Text Identify Language Request Unprocessable Entity Error

429
Text Identify Language Request Too Many Requests Error

500
Text Identify Language Request Internal Server Error

curl -X POST https://api.sarvam.ai/text-lid \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "input"
}'

{
  "request_id": "request_id",
  "language_code": "language_code",
  "script_code": "script_code"
}
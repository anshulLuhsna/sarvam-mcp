This is the model to convert text into spoken audio. The output is a wave file encoded as a base64 string.

Headers
api-subscription-key
string
Required
Request
This endpoint expects an object.
text
string
Required
>=1 character
<=1500 characters
target_language_code
enum
Required
The language of the text is BCP-47 format


Show 11 enum values
speaker
enum
Optional
The speaker voice to be used for the output audio.

Default: Meera

Model Compatibility (Speakers compatible with respective models):

bulbul:v1:

Female: Diya, Maya, Meera, Pavithra, Maitreyi, Misha
Male: Amol, Arjun, Amartya, Arvind, Neel, Vian
bulbul:v2:

Female: Anushka, Manisha, Vidya, Arya
Male: Abhilash, Karun, Hitesh
Note: Speaker selection must match the chosen model version.


Show 19 enum values
pitch
double
Optional
Controls the pitch of the audio. Lower values result in a deeper voice, while higher values make it sharper. The suitable range is between -0.75 and 0.75. Default is 0.0.

pace
double
Optional
>=0.3
<=3
Controls the speed of the audio. Lower values result in slower speech, while higher values make it faster. The suitable range is between 0.5 and 2.0. Default is 1.0.

loudness
double
Optional
>=0.1
<=3
Controls the loudness of the audio. Lower values result in quieter audio, while higher values make it louder. The suitable range is between 0.3 and 3.0. Default is 1.0.

speech_sample_rate
integer
Optional
Specifies the sample rate of the output audio. Supported values are 8000, 16000, 22050, 24000 Hz. If not provided, the default is 22050 Hz.

enable_preprocessing
boolean
Optional
Defaults to false
Controls whether normalization of English words and numeric entities (e.g., numbers, dates) is performed. Set to true for better handling of mixed-language text. Default is false.

model
enum
Optional
Specifies the model to use for text-to-speech conversion. Default is bulbul:v1.

Allowed values:
bulbul:v1
bulbul:v2
Response
Successful Response

audios
list of strings
The output audio files in WAV format, encoded as base64 strings. Each string corresponds to one of the input texts.

request_id
string
Optional
Errors

400
Text to Speech Convert Request Bad Request Error

403
Text to Speech Convert Request Forbidden Error

422
Text to Speech Convert Request Unprocessable Entity Error

429
Text to Speech Convert Request Too Many Requests Error

500
Text to Speech Convert Request Internal Server Error

curl -X POST https://api.sarvam.ai/text-to-speech \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "text": "text",
  "target_language_code": "bn-IN"
}'

{
  "audios": [
    "audios"
  ],
  "request_id": "request_id"
}
Real-Time Speech to Text API
This API transcribes speech to text in multiple Indian languages and English. Supports real-time transcription for interactive applications.

Available Options:
Real-Time API (Current Endpoint): For quick responses under 30 seconds with immediate results
Batch API: For longer audio files, requires following a notebook script - View Notebook
Supports diarization (speaker identification)
Note:
Pricing differs for Real-Time and Batch APIs
Diarization is only available in Batch API with separate pricing
Please refer to dashboard.sarvam.ai for detailed pricing information
Headers
api-subscription-key
string
Required
Request
This endpoint expects a multipart form containing a file.
file
file
Required
The audio file to transcribe. Supported formats are WAV (.wav) and MP3 (.mp3). The API works best with audio files sampled at 16kHz. If the audio contains multiple channels, they will be merged into a single channel.

model
enum
Optional
Specifies the model to use for speech-to-text conversion. Note:- Default model is saarika:v2

Allowed values:
saarika:v1
saarika:v2
saarika:flash
language_code
enum
Optional
Specifies the language of the input audio. This parameter is required to ensure accurate transcription. For the saarika:v1 model, this parameter is mandatory. For the saarika:v2 model, it is optional. unknown: Use this when the language is not known; the API will detect it automatically. Note:- that the saarika:v1 model does not support unknown language code.


Show 12 enum values
Response
Successful Response

transcript
string
The transcribed text from the provided audio file.

request_id
string
Optional
timestamps
object
Optional
Contains timestamps for the transcribed text. This field is included only if with_timestamps is set to true


Show 3 properties
diarized_transcript
object
Optional
Diarized transcript of the provided speech


Show 1 properties
language_code
string
Optional
This will return the BCP-47 code of language spoken in the input. If multiple languages are detected, this will return language code of most predominant spoken language. If no language is detected, this will be null

Errors

400
Speech to Text Transcribe Request Bad Request Error

403
Speech to Text Transcribe Request Forbidden Error

422
Speech to Text Transcribe Request Unprocessable Entity Error

429
Speech to Text Transcribe Request Too Many Requests Error

500
Speech to Text Transcribe Request Internal Server Error

503
Speech to Text Transcribe Request Service Unavailable Error

POST
/speech-to-text

curl -X POST https://api.sarvam.ai/speech-to-text \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>

{
  "transcript": "नमस्ते, आप कैसे हैं?",
  "request_id": "request_id",
  "timestamps": {
    "words": [
      "words"
    ],
    "start_time_seconds": [
      1.1
    ],
    "end_time_seconds": [
      1.1
    ]
  },
  "diarized_transcript": {
    "entries": [
      {
        "transcript": "transcript",
        "start_time_seconds": 1.1,
        "end_time_seconds": 1.1,
        "speaker_id": "speaker_id"
      }
    ]
  },
  "language_code": "language_code"
}
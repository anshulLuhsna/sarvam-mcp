Real-Time Speech to Text Translation API
This API automatically detects the input language, transcribes the speech, and translates the text to English.

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
The audio file to transcribe. Supported formats are wave (.wav) and MPEG-3 (.mp3). Works best at 16kHz. Multiple channels will be merged.

prompt
string
Optional
Conversation context can be passed as a prompt to boost model accuracy. However, the current system is at an experimentation stage and doesn’t match the prompt performance of large language models.

model
enum
Optional
Model to be used for converting speech to text in target language

Allowed values:
saaras:v1
saaras:v2
saaras:turbo
saaras:flash
Response
Successful Response

transcript
string
Transcript of the provided speech

request_id
string
Optional
language_code
enum
Optional
This will return the BCP-47 code of language spoken in the input. If multiple languages are detected, this will return language code of most predominant spoken language. If no language is detected, this will be null


Show 11 enum values
diarized_transcript
object
Optional
Diarized transcript of the provided speech


Show 1 properties
Errors

400
Speech to Text Translate Request Bad Request Error

403
Speech to Text Translate Request Forbidden Error

422
Speech to Text Translate Request Unprocessable Entity Error

429
Speech to Text Translate Request Too Many Requests Error

500
Speech to Text Translate Request Internal Server Error

503
Speech to Text Translate Request Service Unavailable Error

POST
/speech-to-text-translate

curl -X POST https://api.sarvam.ai/speech-to-text-translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>

{
  "transcript": "transcript",
  "request_id": "request_id",
  "language_code": "hi-IN",
  "diarized_transcript": {
    "entries": [
      {
        "transcript": "transcript",
        "start_time_seconds": 1.1,
        "end_time_seconds": 1.1,
        "speaker_id": "speaker_id"
      }
    ]
  }
}
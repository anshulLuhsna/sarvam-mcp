This endpoint performs comprehensive text analysis on provided content and answers specific questions about the text. Each response is supported by reasoning and the exact phrase extracted from the content.

Headers
api-subscription-key
string
Required
Request
This endpoint expects an object.
text
string
Required
The text content to be analyzed. This should be a non-empty string containing the full text for analysis.

questions
string
Required
List of questions to be answered based on the call content. Each question should be a valid JSON object with the following structure: {id: string, text: string, description: string (optional), type: string, properties: object}.The type field must be one of: boolean, enum, short answer, long answer, or number. For enum type questions, include an ‘options’ list in the properties.

Response
Successful Response

request_id
string
Optional
answers
list of objects
Optional
List of answers derived from the text analysis. Each answer corresponds to a question from the original request. This field will be null if no valid answers could be generated.


Show 5 properties
Errors

400
Analytics Text Request Bad Request Error

403
Analytics Text Request Forbidden Error

422
Analytics Text Request Unprocessable Entity Error

429
Analytics Text Request Too Many Requests Error

500
Analytics Text Request Internal Server Error

503
Analytics Text Request Service Unavailable Error

curl -X POST https://api.sarvam.ai/text-analytics \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     --data-urlencode text="Climate change is a critical global challenge that demands immediate attention. Rising temperatures, extreme weather events, and sea level rise are just a few of the consequences we're already experiencing. Scientists emphasize the urgency of limiting global warming to 1.5°C above pre-industrial levels to avoid the most severe consequences. This requires significant reductions in greenhouse gas emissions across all sectors of society." \
     -d questions=questions

{
  "request_id": "request_id",
  "answers": [
    {
      "id": "q001",
      "question": "What is the main topic of this text?",
      "reasoning": "The text consistently discusses the global issue of climate change, its causes, effects, and the urgency of addressing it.",
      "response": "Climate change",
      "utterance": "Climate change is a critical global challenge that demands immediate attention."
    },
    {
      "id": "q002",
      "question": "What is the recommended temperature increase limit?",
      "reasoning": "The text explicitly states the recommended limit for global warming to avoid severe consequences.",
      "response": "1.5°C",
      "utterance": "Scientists emphasize the urgency of limiting global warming to 1.5°C above pre-industrial levels to avoid the most severe consequences."
    },
    {
      "id": "q003",
      "question": "Does the text mention sea level rise as a consequence of climate change?",
      "reasoning": "The text explicitly lists sea level rise as one of the consequences of climate change.",
      "response": "true",
      "utterance": "Rising temperatures, extreme weather events, and sea level rise are just a few of the consequences we're already experiencing."
    }
  ]
}
Given a PDF, this API helps to get structured extraction of data in the document.The API returns a base64 encoded XML string containing the extracted data.

Headers
api-subscription-key
string
Required
Request
This endpoint expects a multipart form containing a file.
pdf
file
Required
Upload the PDF file you want to parse. This should be uploaded as a form input if you’re using multipart/form-data Note: Sarvam Parse supports only English PDFs currently.

page_number
string
Optional
Defaults to 1
The page number you want to extract data from. This is a one-based index (meaning, the first page is 1).

sarvam_mode
enum
Optional
The mode of parsing to use:

small: Use this mode for economical and fast parsing
large: Use this mode for highest precision parsing
Allowed values:
small
large
prompt_caching
enum
Optional
Whether to cache the prompt for the parse request. This is useful when running multiple requests to the parsing endpoint.

Allowed values:
true
false
Response
Successful Response

output
string
Optional
The base64 encoded HTML string corresponding to the parsed page. The output will be an empty string if parsing fails for some reason.

Errors

400
PDF Parse Request Bad Request Error

422
PDF Parse Request Unprocessable Entity Error

500
PDF Parse Request Internal Server Error

curl -X POST https://api.sarvam.ai/parse/parsepdf \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F pdf=@<file1>

{
  "output": "output"
}


Given a PDF, this API helps to translate the content in the document

Headers
api-subscription-key
string
Required
Request
This endpoint expects a multipart form containing a file.
pdf
file
Required
Upload he PDF file you want to translate. This should be uploaded as a form input if you’re using multipart/form-data.Note:- TranslatePDF supports only digital PDFs with selectable text for translation; scanned PDFs cannot be processed.

page_number
string
Optional
Defaults to 1
The page number you want to translate. Use a one-based index (e.g., 1 for the first page). You can send an empty value if you want to translate the entire document.

hard_translate_dict
string
Optional
A dictionary of words for which you want to hardcode the translation. A list of words that you want to translate in a specific way. When these words appear in the document, the system will use your custom translation instead of automatic translation.If you add a dictionary with {“Hello”: “नमस्कार”}, every time the word “नमस्कार” appears in the document, it will be translated as “नमस्कार” instead of the usual translation.

input_lang
string
Optional
Defaults to en-IN
The language code of the input PDF. If you don’t specify, the system will try to detect it automatically.Note:-TranslatePDF currently supports only English language PDFs for translation.

output_lang
enum
Optional
The language code of the output text. This specifies the target language for translation. Available options: hi = “hi-IN” bn = “bn-IN” gu = “gu-IN” kn = “kn-IN” ml = “ml-IN” mr = “mr-IN” od = “od-IN” pa = “pa-IN” ta = “ta-IN” te = “te-IN” Example: “hi-IN” for Hindi


Show 11 enum values
Response
Successful Response

translated_pdf
string
Optional
The translated PDF document in base64 encoding.

Errors

400
PDF Translate Request Bad Request Error

422
PDF Translate Request Unprocessable Entity Error

500
PDF Translate Request Internal Server Error

curl -X POST https://api.sarvam.ai/parse/translatepdf \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F pdf=@<file1>

{
  "translated_pdf": "translated_pdf"
}
---
title: Speech To Text Quickstart Guide
description: Get started with Sarvam AI Speech Models
icon: lightbulb
---

<p
  style={{
    fontSize: "1.5rem",
    fontWeight: "500",
    lineHeight: "1.4",
    marginBottom: "1.5rem",
  }}
>
  Sarvam AI offers two powerful speech models:
</p>


    <Card
      title="Saarika"
      icon="microphone"
      href="models/speech-to-text"
      style={{ flex: 1 }}
    >
      Advanced speech recognition model with superior multi-speaker handling and
      automatic code-mixing support for Indian languages.
    </Card>

    <Card
      title="Saaras"
      icon="bolt"
      href="models/speech-to-text-translate"
      style={{ flex: 1 }}
    >
      Domain-aware translation model with enhanced telephony support and
      intelligent entity preservation.
    </Card>


<Note>
  View our [pricing page](https://dashboard.sarvam.ai/admin/billing/plans) for
  detailed information about model-specific pricing and usage tiers.
</Note>

## Saarika: Our Speech to Text Transcription Model

Saarika is a speech-to-text transcription model that excels in handling multi-speaker content, mixed language content, and conference recordings. It offers automatic code-mixing and enhanced multilingual support, making it ideal for a wide range of applications.

## Speech to Text Features

<Tabs>
  <Tab title="Basic Transcription">
  <div className="mb-8">
      <h3>Basic Speech to Text Transcription</h3>
      <p>
        Convert speech to text with high accuracy. Supports multiple Indian languages and accents.
        Features include:
      </p>
      <ul>
        <li>Multi-language support</li>
        <li>Automatic language detection</li>
        <li>High-quality noise filtering</li>
        <li>Support for various audio formats</li>
      </ul>
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_SARVAM_API_KEY",
        )

        response = client.speech_to_text.transcribe(
            file=open("audio.wav", "rb"),
            model="saarika:v2",
            language_code="gu-IN"
        )

        print(response)
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        async function transcribe() {
          const response = await client.speechToText.transcribe(
            fs.createReadStream("audio.wav"),
            {
              model: "saarika:v2",
              languageCode: "gu-IN"
            }
          );
          console.log(response);
        }

        transcribe();
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/speech-to-text \
     -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
     -H "Content-Type: multipart/form-data" \
     -F model="saarika:v2" \
     -F language_code="en-IN" \
     -F file=@"file.wav;type=audio/wav"
        ```
      </Tab>
    </Tabs>

  </Tab>

  <Tab title="With Diarization">
  <div className="mb-8">
      <h3>Speaker Diarization</h3>
      <p>
      Effortlessly identify and distinguish between multiple speakers in your audio files. Ideal for meetings, interviews, podcasts, and other multi-speaker conversations. Key features:
      </p>
      <ul>
        <li>Automatic speaker detection</li>
        <li>Speaker-wise transcription</li>
        <li>Timestamp support</li>
        <li>Support for up to 10 speakers</li>
      </ul>
    </div>
     <Note>
      Speaker diarization is available via the Batch API and comes with separate pricing. For detailed pricing information, visit [dashboard.sarvam.ai](https://dashboard.sarvam.ai).
    </Note>
    <Note> You can use [this notebook](https://github.com/sarvamai/sarvam-ai-cookbook/tree/main/notebooks/stt/stt-batch-api) to try it out.</Note>
   
  </Tab>
</Tabs>

## Saaras Model: Our SOTA Speech to Text Translation Model

Saaras is a domain-aware translation model with enhanced telephony support and intelligent entity preservation. It is designed to handle complex language variations and domain-specific content, making it ideal for call center and telephony applications.

## Translation Features

<Tabs>
  <Tab title="Basic Translation">
  <div className="mb-8">
      <h3>Speech to Text Translation</h3>
      <p>
        Directly translate speech from one language to another. Ideal for content localization
        and international communication. Features include:
      </p>
      <ul>
        <li>Support for major Indian languages</li>
        <li>High-quality translations</li>
        <li>Preservation of context and tone</li>
        <li>Real-time translation capability</li>
      </ul>
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
from sarvamai import SarvamAI

client = SarvamAI(
api_subscription_key="YOUR_API_SUBSCRIPTION_KEY",
)

response = client.speech_to_text.translate(
file=open("audio.wav", "rb"),
model="saaras:v2"
)

print(response)

        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        async function translate() {
          const response = await client.speechToText.translate(
            fs.createReadStream("audio.wav"),
            {
              model: "saaras",
              sourceLanguage: "hi",
              targetLanguage: "en"
            }
          );
          console.log(response.translation);
        }

        translate();
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
       curl -X POST https://api.sarvam.ai/speech-to-text-translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>
        ```
      </Tab>
    </Tabs>

  </Tab>

  <Tab title="With Diarization">
  <div className="mb-8">
      <h3>Speaker Diarization</h3>
      <p>
      Effortlessly identify and distinguish between multiple speakers in your audio files. Ideal for meetings, interviews, podcasts, and other multi-speaker conversations. Key features:
      </p>
      <ul>
        <li>Automatic speaker detection</li>
        <li>Speaker-wise transcription</li>
        <li>Timestamp support</li>
        <li>Support for up to 10 speakers</li>
      </ul>
    </div>
     <Note>
      Speaker diarization is available via the Batch API and comes with separate pricing. For detailed pricing information, visit [dashboard.sarvam.ai](https://dashboard.sarvam.ai).
    </Note>
    <Note> You can try it out [here](https://github.com/sarvamai/sarvam-ai-cookbook/blob/main/notebooks/stt-translate/stt-translate-batch-api/Sarvam_STT_Translate_Batch_API_Demo.ipynb).</Note>
   
  </Tab>
</Tabs>

<Note>
  For detailed API documentation and advanced usage, visit our [API
  Reference](/api-reference).
</Note>

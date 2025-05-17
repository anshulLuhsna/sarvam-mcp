---
title: Saaras
description: >-
  Domain-optimized speech models for real-time transcription and translation,
  featuring enhanced telephony support and intelligent entity preservation.
---

## Saaras-v2

### Overview

Saaras-v2 is our flagship domain-aware speech recognition model, designed for production environments requiring high accuracy and robust performance.

### Key Features

<CardGroup cols={2}>
  <Card
    title="Domain-Aware Translation"
    icon="brain">
    Advanced prompting system for domain-specific translation and hotword retention, ensuring accurate context preservation.
  </Card>
  
  <Card
    title="Superior Telephony Performance"
    icon="phone">
    Optimized for 8KHz telephony audio with enhanced multi-speaker recognition capabilities.
  </Card>

{" "}

<Card title="Intelligent Entity Preservation" icon="tag">
  Preserves proper nouns and entities accurately across languages, maintaining
  context and meaning.
</Card>

{" "}

<Card title="Automatic Language Detection" icon="language">
  Built-in Language Identification (LID) with confidence scores for automatic
  language detection.
</Card>

  <Card
    title="Speaker Diarization"
    icon="users">
    Provides diarized outputs with precise timestamps for multi-speaker conversations through batch API.
  </Card>
</CardGroup>

### Key Capabilities

<Tabs>
  <Tab title="Basic Usage">
    <div className="mb-4">
      Basic transcription with specified language code. Perfect for single-language content with clear audio quality.
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.speech_to_text.translate(
            file=open("audio.wav", "rb"),
            model="saaras:v2"
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        const response = await client.speechToText.translate(
          fs.createReadStream("audio.wav"),
          {
            model: "saaras:v2"
          }
        );
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        ccurl -X POST https://api.sarvam.ai/speech-to-text-translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>
        ```
      </Tab>
    </Tabs>

  </Tab>
  
  <Tab title="Code-Mixed Speech">
    <div className="mb-4">
      Handles mixed-language content with automatic detection of language switches within sentences. Ideal for natural Indian conversations that mix multiple languages.
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.speech_to_text.translate(
            file=open("audio.wav", "rb"),
            model="saaras:v2"
        )

        # Example Output:
        # {
        #   "request_id": "20250430_b7cbeb34-3ff2-4730-abaf-90d23fca9827",
        #   "transcript": "मैंने apply किया but rejected हो गया",
        #   "language_code": "en-IN"
        # }
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        const response = await client.speechToText.translate(
          fs.createReadStream("audio.wav"),
          {
            model: "saaras:v2"
          }
        );

        // Example Output:
        // {
        //   "request_id": "20250430_b7cbeb34-3ff2-4730-abaf-90d23fca9827",
        //   "transcript": "मैंने apply किया but rejected हो गया",
        //   "language_code": "en-IN"
        // }
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
  
  <Tab title="Automatic Language Detection">
    <div className="mb-4">
      Let Saaras automatically detect the language being spoken. Useful when the input language is unknown or for handling multi-language content.
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.speech_to_text.translate(
            file=open("audio.wav", "rb"),
            model="saaras:v2"
        )

        # Example Output:
        # {
        #   "request_id": "20250430_78730d0e-532c-4d1c-949a-a0469f86f932",
        #   "transcript": "என் பெயர் வியான். எனது குரல் நம்பகமானதாகவும் பலத்துறையிலும் பயன்படும் வகையிலும் இருக்கும்.",
        #   "language_code": "ta-IN"
        # }
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        const response = await client.speechToText.translate(
          fs.createReadStream("audio.wav"),
          {
            model: "saaras:v2"
          }
        );

        // Example Output:
        // {
        //   "request_id": "20250430_78730d0e-532c-4d1c-949a-a0469f86f932",
        //   "transcript": "என் பெயர் வியான். எனது குரல் நம்பகமானதாகவும் பலத்துறையிலும் பயன்படும் வகையிலும் இருக்கும்.",
        //   "language_code": "ta-IN"
        // }
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        ccurl -X POST https://api.sarvam.ai/speech-to-text-translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>
        ```
      </Tab>
    </Tabs>

  </Tab>

  <Tab title="Domain Prompting">
    <div className="mb-4">
      Enhance transcription accuracy with domain-specific prompts and preserve important terms. Perfect for specialized contexts like medical, legal, or technical content.
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.speech_to_text.translate(
            file=open("audio.wav", "rb"),
            model="saaras:v2",
            prompt="Medical consultation about diabetes"
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";
        const fs = require('fs');

        const client = new SarvamAIClient({
          apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        const response = await client.speechToText.translate(
          fs.createReadStream("audio.wav"),
          {
            model: "saaras:v2",
            prompt: "Medical consultation about diabetes"
          }
        );
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/speech-to-text-translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>
     -F "prompt=Medical consultation about diabetes"
        ```
      </Tab>
    </Tabs>

  </Tab>
</Tabs>

<Note>
  For detailed API documentation and advanced usage, visit our [API
  Reference](/api-reference).
</Note>

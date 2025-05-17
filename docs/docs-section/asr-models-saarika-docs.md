---
title: Saarika
description: >-
  High-accuracy speech recognition model for Indian languages with superior
  multi-speaker handling and automatic code-mixing support
---

## Saarika-v2

### Overview

Saarika-v2 is our flagship speech recognition model, specifically designed for Indian languages and accents. It excels in handling complex multi-speaker conversations, telephony audio, and code-mixed speech with superior accuracy.

### Key Features

<CardGroup cols={2}>
  <Card
    title="Superior Telephony Performance"
    icon="phone">
    Optimized for 8KHz telephony audio with enhanced noise handling and superior multi-speaker recognition capabilities.
  </Card>
  
  <Card
    title="Intelligent Entity Preservation"
    icon="tag">
    Preserves proper nouns and entities accurately across languages, maintaining context and meaning in transcriptions.
  </Card>

{" "}

<Card title="Automatic Language Detection" icon="language">
  Optional automatic language identification with LID output. Use "unknown" when
  language is not known for automatic detection.
</Card>

{" "}

<Card title="Speaker Diarization" icon="users">
  Provides diarized outputs with precise timestamps for multi-speaker
  conversations through batch API processing.
</Card>

{" "}

<Card title="Automatic Code Mixing" icon="code">
  Intelligently handles mid-sentence language switches in code-mixed speech,
  perfect for India's multilingual conversations.
</Card>

  <Card
    title="Multi-Language Support"
    icon="globe">
    Comprehensive support for Indian languages with high accuracy in mixed-language environments.
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

        response = client.speech_to_text.transcribe(
            file=open("audio.wav", "rb"),
            model="saarika:v2",
            language_code="hi-IN"
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

        const response = await client.speechToText.transcribe(
          fs.createReadStream("audio.wav"),
          {
            model: "saarika:v2",
            languageCode: "hi-IN"
          }
        );
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/speech-to-text \
     -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
     -H "Content-Type: multipart/form-data" \
     -F model="saarika:v2" \
     -F file=@"file.wav;type=audio/wav"
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

        response = client.speech_to_text.transcribe(
            file=open("audio.wav", "rb"),
            model="saarika:v2"
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

        const response = await client.speechToText.transcribe(
          fs.createReadStream("audio.wav"),
          {
            model: "saarika:v2",
            enableCodeMixing: true,
            primaryLanguage: "hi-IN",
            secondaryLanguage: "en-IN"
          }
        );

        // Example Output:
        // {
        //  "request_id": "20250430_b7cbeb34-3ff2-4730-abaf-90d23fca9827",
        //  "transcript": "मैंने apply किया but rejected हो गया",
        //  "language_code": "en-IN"
        // }
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
       curl -X POST https://api.sarvam.ai/speech-to-text \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: multipart/form-data" \
     -F file=@<file1>
        ```
      </Tab>
    </Tabs>

  </Tab>
  
  <Tab title="Automatic Language Detection">
    <div className="mb-4">
      Let Saarika automatically detect the language being spoken. Useful when the input language is unknown or for handling multi-language content.
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.speech_to_text.transcribe(
            file=open("audio.wav", "rb"),
            model="saarika:v2",
            language_code="unknown"  # Enables automatic language detection
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

        const response = await client.speechToText.transcribe(
          fs.createReadStream("audio.wav"),
          {
            model: "saarika:v2",
            languageCode: "unknown"  // Enables automatic language detection
          }
        );

        // Example Output:
        // {
        //  "request_id": "20250430_78730d0e-532c-4d1c-949a-a0469f86f932",
        //  "transcript": "என் பெயர் வியான். எனது குரல் நம்பகமானதாகவும் பலத்துறையிலும் பயன்படும் வகையிலும் இருக்கும்.",
        //  "language_code": "ta-IN"
        // }
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/speech-to-text \
     -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
     -H "Content-Type: multipart/form-data" \
     -F model="saarika:v2" \
     -F language_code="unknown" \
     -F file=@"file.wav;type=audio/wav"
        ```
      </Tab>
    </Tabs>

  </Tab>
</Tabs>

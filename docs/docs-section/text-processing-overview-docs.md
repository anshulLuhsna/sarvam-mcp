---
title: Bulbul
description: >-
  High-quality multilingual text-to-speech model with natural prosody and
  emotion control
---

## Model Variants

<CardGroup cols={2}>
  <Card title="Bulbul-v2" icon="microphone" href="#bulbul-v2">
    Production-ready model with superior voice quality, emotion control, and
    multi-language support.
  </Card>
</CardGroup>

## Bulbul-v2

### Overview

Bulbul-v2 is our flagship text-to-speech model, specifically designed for Indian languages and accents. It excels in:

- Natural-sounding speech with human-like prosody
- Multiple voice personalities
- Multi-language and code-mixed text support
- Real-time synthesis capabilities
- Fine-grained control over pitch, pace, and loudness

## Features

<CardGroup cols={2}>
  <Card title="Voice Control" icon="sliders">
    Fine-grained control over pitch (-1 to 1), pace (0.3 to 3), and loudness
    (0.1 to 3)
  </Card>

{" "}

<Card title="Sample Rate Options" icon="wave-square">
  Multiple sample rates: 8kHz, 16kHz, 22.05kHz, 24kHz
</Card>

{" "}

<Card title="Text Preprocessing" icon="wand-magic-sparkles">
  Smart normalization of numbers, dates, and mixed-language text
</Card>

  <Card title="Language Support" icon="language">
    Support for 11 Indian languages with BCP-47 codes
  </Card>
</CardGroup>

### Key Capabilities

<Tabs>
  <Tab title="Basic Usage">
    Convert text to speech with default settings. This is the simplest way to get started with the Bulbul API.
    
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI
        from sarvamai.play import play, save

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.text_to_speech.convert(
            text="Hello, how are you today?",
            target_language_code="en-IN",
            enable_preprocessing=True
        )
        play(response)

        # Save the response to a file
        save(response, "output.wav")
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        const { SarvamAI } = require('sarvamai');
        const client = new SarvamAI({
          apiSubscriptionKey: 'YOUR_API_SUBSCRIPTION_KEY'
        });
        const response = await client.textToSpeech.convert({
          text: 'Hello, how are you today?',
          targetLanguageCode: 'en-IN',
          enable_preprocessing: true
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/text-to-speech \

-H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
-H "Content-Type: application/json" \
-d '{

"text":
"Welcome to Sarvam AI!"
,
"target_language_code": "bn-IN",
"speaker": "anushka"
}'

````
</Tab>
</Tabs>

  </Tab>

  <Tab title="Voice Control">
    Fine-tune the voice characteristics by adjusting pitch, pace, and loudness. Perfect for creating the exact voice style you need.

    <Tabs>
      <Tab title="Python">
        ```python
        # With voice parameter control
        response = client.text_to_speech.convert(
            text="Hello, how are you today?",
            target_language_code="en-IN",
            pitch=0.5,        # Range: -1 to 1
            pace=1.5,         # Range: 0.3 to 3
            loudness=1.2      # Range: 0.1 to 3
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // With voice parameter control
        const response = await client.textToSpeech.convert({
          text: 'Hello, how are you today?',
          targetLanguageCode: 'en-IN',
          pitch: 0.5,        // Range: -1 to 1
          pace: 1.5,         // Range: 0.3 to 3
          loudness: 1.2      // Range: 0.1 to 3
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/text-to-speech \
-H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
-H "Content-Type: application/json" \
-d '{

"text":
"Welcome to Sarvam AI!"
,
"target_language_code": "en-IN",
"pitch": 0.5,
"pace": 1.5,
"loudness": 1.2
}'
````

</Tab>
</Tabs>

  </Tab>

  <Tab title="Sample Rate">
    Choose the audio quality that best fits your needs. Higher sample rates provide better quality but larger file sizes.
    
    <Tabs>
      <Tab title="Python">
        ```python
        # Control audio quality with sample rate
        response = client.text_to_speech.convert(
            text="Hello, how are you today?",
            target_language_code="en-IN",
            speech_sample_rate=24000  # Options: 8000, 16000, 22050, 24000
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // Control audio quality with sample rate
        const response = await client.textToSpeech.convert({
          text: 'Hello, how are you today?',
          targetLanguageCode: 'en-IN',
          speechSampleRate: 24000  // Options: 8000, 16000, 22050, 24000
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/text-to-speech \
        -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
        -H "Content-Type: application/json" \
        -d '{
        "text":"Welcome to Sarvam AI!",
        "target_language_code": "en-IN",
        "speech_sample_rate": 24000
        }'
        ````
</Tab>
</Tabs>

    <Note>
    Higher sample rates provide better audio quality but result in larger file sizes:
    - 8000 Hz: Basic telephony quality
    - 16000 Hz: Good quality voice
    - 22050 Hz: Default high-quality audio
    - 24000 Hz: Premium audio quality
    </Note>

  </Tab>

  <Tab title="Text Preprocessing">
    Enable smart text normalization to improve pronunciation of numbers, dates, and mixed-language content. Essential for handling complex text inputs.

    <Tabs>
      <Tab title="Python">
        ```python
        # Enable smart text preprocessing
        response = client.text_to_speech.convert(
           text="The price is Rs. 1,00,000 on 25th December, 2024",
            target_language_code="en-IN",
            enable_preprocessing=True  # Handles numbers, dates, and mixed text
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // Enable smart text preprocessing
        const response = await client.textToSpeech.convert({
          text: ['The price is Rs. 1,00,000 on 25th December, 2024'],
          targetLanguageCode: 'en-IN',
          enablePreprocessing: true  // Handles numbers, dates, and mixed text
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/text-to-speech \

-H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
-H "Content-Type: application/json" \
-d '{
"text":"Welcome to Sarvam AI!",
"target_language_code": "en-IN",
"enable_preprocessing::True
}'
```
</Tab>
</Tabs>

    <Note>
    Text preprocessing improves pronunciation by handling:
    - Numbers and currencies (e.g., "Rs. 1,00,000" → "rupees one lakh")
    - Dates (e.g., "25th December, 2024" → "twenty-fifth December two thousand twenty-four")
    - Mixed-language text normalization
    - Common abbreviations and symbols
    </Note>

  </Tab>
</Tabs>
````

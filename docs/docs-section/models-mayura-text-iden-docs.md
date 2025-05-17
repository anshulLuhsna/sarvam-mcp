---
title: Mayura
description: >-
  Advanced multilingual translation model supporting Indian languages with
  customizable translation styles and script control
---

## Overview

Mayura is our powerful translation model that converts text between English and Indian languages while preserving meaning and context. For example: 'मैं ऑफिस जा रहा हूँ' translates to 'I am going to the office' in English, maintaining the original meaning across different scripts and languages.

## Features

<CardGroup cols={2}>
  <Card title="Language Support" icon="language">
    Support for 11 languages including English and major Indian languages with auto-detection
  </Card>

{" "}

<Card title="Translation Modes" icon="wand-magic-sparkles">
  Multiple translation styles: formal, modern-colloquial, classic-colloquial,
  and code-mixed
</Card>

{" "}

<Card title="Script Control" icon="pen-nib">
  Flexible output script options: Roman, native, and spoken forms
</Card>

  <Card title="Smart Processing" icon="gears">
    Advanced preprocessing and numeral format control
  </Card>
</CardGroup>

### Key Capabilities

<Tabs>
  <Tab title="Basic Usage">
    Simple translation between languages with default settings. Perfect for getting started with the Mayura API.
    
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.translate(
            input="मैं ऑफिस जा रहा हूँ",
            source_language_code="hi-IN",
            target_language_code="en-IN"
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        const { SarvamAI } = require('sarvamai');

        const client = new SarvamAI({
          apiSubscriptionKey: 'YOUR_API_SUBSCRIPTION_KEY'
        });

        const response = await client.text.translate({
          input: 'मैं ऑफिस जा रहा हूँ',
          sourceLanguageCode: 'hi-IN',
          targetLanguageCode: 'en-IN'
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/translate \
          -H "api-subscription-key: YOUR_API_SUBSCRIPTION_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "input": "मैं ऑफिस जा रहा हूँ",
            "source_language_code": "hi-IN",
            "target_language_code": "en-IN"
          }'
        ```
      </Tab>
    </Tabs>

  </Tab>
  
  <Tab title="Translation Modes">
    Customize the translation style with different modes to match your needs - formal, colloquial, or code-mixed.
    
    <Tabs>
      <Tab title="Python">
        ```python
        # Translation with style control
        response = client.translate(
            input="Your EMI of Rs. 3000 is pending",
            source_language_code="en-IN",
            target_language_code="hi-IN",
            mode="modern-colloquial",     # Options: formal, modern-colloquial, classic-colloquial, code-mixed
            speaker_gender="Female"       # For code-mixed translations
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // Translation with style control
        const response = await client.text.translate({
          input: 'Your EMI of Rs. 3000 is pending',
          sourceLanguageCode: 'en-IN',
          targetLanguageCode: 'hi-IN',
          mode: 'modern-colloquial',     // Options: formal, modern-colloquial, classic-colloquial, code-mixed
          speakerGender: 'Female'        // For code-mixed translations
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/translate \
          -H "api-subscription-key: YOUR_API_SUBSCRIPTION_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "input": "Your EMI of Rs. 3000 is pending",
            "source_language_code": "en-IN",
            "target_language_code": "hi-IN",
            "mode": "modern-colloquial",
            "speaker_gender": "Female"
          }'
        ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="Script Control">
    Control the output script format with options for Roman, native, and spoken forms.
    
    <Tabs>
      <Tab title="Python">
        ```python
        # With script and numeral control
        response = client.translate(
            input="Your EMI of Rs. 3000 is pending",
            source_language_code="en-IN",
            target_language_code="hi-IN",
            output_script="fully-native",    # Options: roman, fully-native, spoken-form-in-native
            numerals_format="native"         # Options: international, native
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // With script and numeral control
        const response = await client.text.translate({
          input: 'Your EMI of Rs. 3000 is pending',
          sourceLanguageCode: 'en-IN',
          targetLanguageCode: 'hi-IN',
          outputScript: 'fully-native',    // Options: roman, fully-native, spoken-form-in-native
          numeralsFormat: 'native'         // Options: international, native
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/translate \
          -H "api-subscription-key: YOUR_API_SUBSCRIPTION_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "input": "Your EMI of Rs. 3000 is pending",
            "source_language_code": "en-IN",
            "target_language_code": "hi-IN",
            "output_script": "fully-native",
            "numerals_format": "native"
          }'
        ```
      </Tab>
    </Tabs>

    <Note>
    Output script options provide different text representations:
    - roman: "aapka Rs. 3000 ka EMI pending hai"
    - fully-native: "आपका रु. 3000 का ई.एम.ऐ. पेंडिंग है।"
    - spoken-form-in-native: "आपका थ्री थाउजेंड रूपीस का ईएमअइ पेंडिंग है।"
    </Note>

  </Tab>

  <Tab title="Advanced Options">
    Enable preprocessing and customize language detection for better translation quality.
    
    <Tabs>
      <Tab title="Python">
        ```python
        # With advanced options
        response = client.translate(
            input="Your text here",
            source_language_code="auto",    # Automatic language detection
            target_language_code="hi-IN",
            enable_preprocessing=True        # Enable smart preprocessing
        )
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        // With advanced options
        const response = await client.text.translate({
          input: 'Your text here',
          sourceLanguageCode: 'auto',     // Automatic language detection
          targetLanguageCode: 'hi-IN',
          enablePreprocessing: true       // Enable smart preprocessing
        });
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/translate \
          -H "api-subscription-key: YOUR_API_SUBSCRIPTION_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "input": "Your text here",
            "source_language_code": "auto",
            "target_language_code": "hi-IN",
            "enable_preprocessing": true
          }'
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>

### Language Support

| Language  | Code  | Translation Direction |
| --------- | ----- | --------------------- |
| English   | en-IN | Both                  |
| Hindi     | hi-IN | Both                  |
| Bengali   | bn-IN | Both                  |
| Gujarati  | gu-IN | Both                  |
| Kannada   | kn-IN | Both                  |
| Malayalam | ml-IN | Both                  |
| Marathi   | mr-IN | Both                  |
| Odia      | od-IN | Both                  |
| Punjabi   | pa-IN | Both                  |
| Tamil     | ta-IN | Both                  |
| Telugu    | te-IN | Both                  |

<Note>
  All Indian languages support bidirectional translation with English. The
  'auto' option in source_language_code enables automatic language detection.
</Note>

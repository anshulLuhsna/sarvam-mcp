---
title: Language Identification API
description: >-
  Identifies the language and script of input text, supporting multiple Indian
  languages
icon: globe
---

## Overview

The Language Identification (LID) API identifies the language (e.g., en-IN, hi-IN) and script (e.g., Latin, Devanagari) of the input text. It supports multiple Indian languages and scripts, making it ideal for multilingual text processing.

## Detection Types

<CardGroup cols={2}>
  <Card title="Single Language" icon="language" color="#00aa55">
    Detect the primary language and script of text input. Example: "Hello, how are you?" → language: en-IN, script: Latn
  </Card>

  <Card title="Auto Detection" icon="wand-magic-sparkles" color="#da62c4">
    Automatic language detection for seamless integration with translation and preprocessing APIs.
  </Card>
</CardGroup>

## Code Examples

<Tabs>
  <Tab title="Basic Usage">
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_API_SUBSCRIPTION_KEY"
        )

        response = client.text.identify_language(
            input="Hello, how are you?"
        )

        print(f"Request ID: {response.request_id}")
        print(f"Language Code: {response.language_code}")  # Output: en-IN
        print(f"Script Code: {response.script_code}")      # Output: Latn
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";

        const client = new SarvamAIClient({
            apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY"
        });

        const response = await client.text.identifyLanguage({
            input: "Hello, how are you?"
        });

        console.log(`Request ID: ${response.requestId}`);
        console.log(`Language Code: ${response.languageCode}`);  // Output: en-IN
        console.log(`Script Code: ${response.scriptCode}`);      // Output: Latn
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
      curl -X POST https://api.sarvam.ai/text-lid \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "input"
}'

        # Response:
        # {
        #   "request_id": "abc123",
        #   "language_code": "en-IN",
        #   "script_code": "Latn"
        # }
        ```
      </Tab>
    </Tabs>

  </Tab>
</Tabs>

## Response Format

```json
{
  "request_id": "string | null",
  "language_code": "string | null",
  "script_code": "string | null"
}
```

## Supported Languages and Scripts

<CardGroup cols={2}>
  <Card title="Language Support" icon="language">
    <div className="mb-4">
      <strong>Available Languages:</strong>
      <ul>
        <li>en-IN: English</li>
        <li>hi-IN: Hindi</li>
        <li>bn-IN: Bengali</li>
        <li>gu-IN: Gujarati</li>
        <li>kn-IN: Kannada</li>
        <li>ml-IN: Malayalam</li>
        <li>mr-IN: Marathi</li>
        <li>od-IN: Odia</li>
        <li>pa-IN: Punjabi</li>
        <li>ta-IN: Tamil</li>
        <li>te-IN: Telugu</li>
      </ul>
    </div>
  </Card>

  <Card title="Script Support" icon="text-size">
    <div className="mb-4">
      <strong>Available Scripts:</strong>
      <ul>
        <li>Latn: Latin (Romanized script)</li>
        <li>Deva: Devanagari (Hindi, Marathi)</li>
        <li>Beng: Bengali</li>
        <li>Gujr: Gujarati</li>
        <li>Knda: Kannada</li>
        <li>Mlym: Malayalam</li>
        <li>Orya: Odia</li>
        <li>Guru: Gurmukhi</li>
        <li>Taml: Tamil</li>
        <li>Telu: Telugu</li>
      </ul>
    </div>
  </Card>
</CardGroup>

<Note>
  For detailed pricing information and usage tiers, visit our [pricing
  page](https://dashboard.sarvam.ai/pricing).
</Note>

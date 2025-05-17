---
title: Text Translation API
description: Overview of Sarvam AI Text Translation API
icon: language
---

## Translation Types

<CardGroup cols={3}>
  <Card title="English to Indic" icon="language" color="#00aa55">
    Translate from English to various Indian languages with support for
    different translation modes.
  </Card>

{" "}

<Card title="Indic to English" icon="arrow-right-arrow-left" color="#0062ff">
  Convert Indian languages to English with high accuracy and natural output.
</Card>

  <Card title="Indic to Indic" icon="arrows-rotate" color="#da62c4">
    Translate between different Indian languages while preserving context and
    meaning.
  </Card>
</CardGroup>

## Translation Modes

<CardGroup cols={3}>
  <Card title="Formal" icon="building">
    Highly professional, uses pure language forms. Ideal for official documents
    and legal papers.
  </Card>

{" "}

<Card title="Classic-Colloquial" icon="book">
  Balanced mix of languages, slightly informal. Perfect for business emails and
  general communication.
</Card>

  <Card title="Modern-Colloquial" icon="comments">
    Casual and direct style with mixed language. Best for chatbots and social
    media content.
  </Card>
</CardGroup>

## Code Examples

<Tabs>
  <Tab title="Basic Translation">
    <Tabs>
      <Tab title="Python">
        ```python
        from sarvamai import SarvamAI

        client = SarvamAI(
            api_subscription_key="YOUR_SARVAM_API_KEY"
        )

        response = client.text.translate(
            input="Hello, how are you?",
            source_language_code="en-IN",
            target_language_code="hi-IN",
            speaker_gender="Male"
        )

        print(response)
        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        import { SarvamAIClient } from "sarvamai";

        const client = new SarvamAIClient({
            apiSubscriptionKey: "YOUR_SARVAM_API_KEY"
        });

        const response = await client.text.translate({
            input: "Hello, how are you?",
            sourceLanguageCode: "en-IN",
            targetLanguageCode: "hi-IN",
            speakerGender: "Male"
        });

        console.log(response);
        ```
      </Tab>
      <Tab title="cURL">
        ```bash
        curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{

"input": "Hello, how are you?",
"source_language_code": "en-IN",
"target_language_code": "hi-IN",
"speaker_gender": "Male"
}'
```
</Tab>
</Tabs>

  </Tab>

  <Tab title="Advanced Options">
    <div className="mb-8">
      <h3>Advanced Translation Features</h3>
      <p>
        Explore different parameters to customize your translation output:
      </p>
    </div>

    <Tabs>
      <Tab title="Speaker Gender">
        <p>Choose between Male and Female voice characteristics for gender-specific translations.</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                speaker_gender="Female"
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                speakerGender: "Female"
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash

            curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{

"input": "Hello, how are you?",
"source_language_code": "en-IN",
"target_language_code": "hi-IN",
"speaker_gender": "Female"
}'
```
</Tab>
</Tabs>
</Tab>

      <Tab title="Translation Mode">
        <p>Select the tone and style of translation - formal, modern-colloquial, or classic-colloquial for different use cases.</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                mode="modern-colloquial"
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                mode: "modern-colloquial"
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash
            curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
 "input": "Welcome to our service!",
                "source_language_code": "en-IN",
                "target_language_code": "hi-IN",
                "model": "mayura:v1",
                "mode": "modern-colloquial"
              }'
            ```
          </Tab>
        </Tabs>
      </Tab>

      <Tab title="Preprocessing">
        <p>Enable custom preprocessing to handle special characters, formatting, and improve translation quality.</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                enable_preprocessing=True
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                enablePreprocessing: true
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash
            curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "Welcome to our service!",
  "source_language_code": "en-IN",
  "target_language_code": "hi-IN",
  "model": "mayura:v1",
  "enable_preprocessing": true
}'
            ```
          </Tab>
        </Tabs>
      </Tab>

      <Tab title="Output Script">
        <p>Choose between different script options (roman/fully-native/spoken-form-in-native) for the translated text output.</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                output_script="fully-native"
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                outputScript: "fully-native"
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash
            curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
  "input": "Welcome to our service!",
  "source_language_code": "en-IN",
  "target_language_code": "hi-IN",
  "model": "mayura:v1",
  "output_script": "fully-native"
}'
            ```
          </Tab>
        </Tabs>
      </Tab>

      <Tab title="Numerals Format">
        <p>Specify the format for numbers in the output - choose between international (1,2,3) or native numerals (१,२,३).</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                numerals_format="native"
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                numeralsFormat: "native"
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash
            curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <apiSubscriptionKey>" \
     -H "Content-Type: application/json" \
     -d '{
 "input": "Welcome to our service!",
"source_language_code": "en-IN",
"target_language_code": "hi-IN",
"model": "mayura:v1",
"numerals_format": "native"
}'
            
```
</Tab>
</Tabs>
</Tab>

      <Tab title="All Parameters">
        <p>Example using all available parameters together for maximum customization.</p>
        <Tabs>
          <Tab title="Python">
            ```python
            response = client.text.translate(
                input="Welcome to our service!",
                source_language_code="en-IN",
                target_language_code="hi-IN",
                model="mayura:v1",
                speaker_gender="Female",
                mode="modern-colloquial",
                enable_preprocessing=True,
                output_script="fully-native",
                numerals_format="native"
            )
            ```
          </Tab>
          <Tab title="JavaScript">
            ```javascript
            const response = await client.text.translate({
                input: "Welcome to our service!",
                sourceLanguageCode: "en-IN",
                targetLanguageCode: "hi-IN",
                model: "mayura:v1",
                speakerGender: "Female",
                mode: "modern-colloquial",
                enablePreprocessing: true,
                outputScript: "fully-native",
                numeralsFormat: "native"
            });
            ```
          </Tab>
          <Tab title="cURL">
            ```bash
      curl -X POST https://api.sarvam.ai/translate \
     -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
     -H "Content-Type: application/json" \
     -d '{

"input": "Welcome to Sarvam AI!",
"source_language_code": "en-IN",
"target_language_code": "hi-IN",
"model": "mayura:v1",
"speaker_gender": "Female",
"mode": "modern-colloquial",
"enable_preprocessing": true,
"output_script": "fully-native",
"numerals_format": "native"
}'
```
</Tab>
</Tabs>
</Tab>
</Tabs>

  </Tab>
</Tabs>

## API Features

<CardGroup cols={2}>
  <Card title="Translation Options" icon="language">
    - Multiple Indian languages support - Three translation modes -
    Gender-specific translations - Code-mixed text support
  </Card>

{" "}

<Card title="Output Formats" icon="text-size">
  - Multiple script options - Native/International numerals - Customizable
  formatting - Transliteration support
</Card>

{" "}

<Card title="Advanced Features" icon="wand-magic-sparkles">
  - Automatic language detection - Context preservation - Entity handling -
  Preprocessing options
</Card>

  <Card title="Integration" icon="puzzle-piece">
    - Simple REST API - Multiple language SDKs - Comprehensive documentation -
    Easy-to-follow examples
  </Card>
</CardGroup>
<Note>
  Need help with translation? Contact us on
  [discord](https://discord.gg/5rAsykttcs) for guidance.
</Note>

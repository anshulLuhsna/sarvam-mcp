---
title: Text-to-Speech APIs
description: Overview of Sarvam AI Text-to-Speech APIs
icon: code
---

## API Types

<CardGroup cols={3}>
  <Card title="Real Time API" icon="bolt" color="#00aa55">
    Generate speech for short text with immediate response. Best for quick
    conversions up to 1000 characters.
  </Card>

{" "}

</CardGroup>

## Model Information

<CardGroup cols={2}>
  <Card title="Bulbul v2" icon="microphone">
    Our flagship text-to-speech model designed for Indian languages and accents.

    **Key Features:**
    - Natural-sounding speech with human-like prosody
    - Multiple voice personalities
    - Multi-language and code-mixed text support
    - Real-time synthesis capabilities
    - Fine-grained control over pitch, pace, and loudness

  </Card>

  <Card title="Language Support" icon="language">
    Supports 11 Indian languages with BCP-47 codes:

    **Supported Languages:**
    - English (en-IN)
    - Hindi (hi-IN)
    - Bengali (bn-IN)
    - Tamil (ta-IN)
    - Telugu (te-IN)
    - Kannada (kn-IN)
    - Malayalam (ml-IN)
    - Marathi (mr-IN)
    - Gujarati (gu-IN)
    - Punjabi (pa-IN)
    - Odia (or-IN)

  </Card>
</CardGroup>

## Code Examples

<Tabs>
  <Tab title="Real Time API">
    <div className="mb-8">
      <h3>Synchronous Processing</h3>
      <p>
        Convert text to speech with immediate response. Best for quick conversions and testing.
        Features include:
      </p>
      <ul>
        <li>Instant audio generation</li>
        <li>Multiple voice options</li>
        <li>Support for SSML</li>
        <li>Various audio formats</li>
      </ul>
    </div>
    <Tabs>
      <Tab title="Python">
        ```python
from sarvamai import SarvamAI

client = SarvamAI(
api_subscription_key="<YOUR_API_SUBSCRIPTION_KEY>"
)

response = client.text_to_speech.convert(
text="Welcome to Sarvam AI!",
model="bulbul:v2",
speaker="anushka",
target_language_code="en-IN",
)

````
      </Tab>
      <Tab title="JavaScript">
        ```javascript
const { SarvamAI } = require('sarvam-ai');
const fs = require('fs');

const client = new SarvamAI();

async function synthesize() {
  const response = await client.speech.synthesize({
    text: 'Hello! How can I help you today?',
    model: 'bulbul',
    voice: 'female',
    language: 'en',
    audioFormat: 'mp3'
  });

  fs.writeFileSync('output.mp3', response.audio);
  console.log(`Duration: ${response.duration}s`);
  console.log(`Sample Rate: ${response.sampleRate}Hz`);
}

synthesize();
````

      </Tab>
      <Tab title="cURL">
        ```bash

curl -X POST https://api.sarvam.ai/text-to-speech \
 -H "api-subscription-key: <YOUR_API_SUBSCRIPTION_KEY>" \
 -H "Content-Type: application/json" \
 -d '{
"text": "Welcome to Sarvam AI!",
"target_language_code": "bn-IN",
"speaker": "anushka"
}'

```
      </Tab>
    </Tabs>
  </Tab>

{" "}

</Tabs>

## API Features

<CardGroup cols={2}>
  <Card title="Key Features" icon="stars">
    - Support for code-mixed text
    - Multiple speaker voices
    - Adjustable speech parameters
    - High-quality audio output
  </Card>

{" "}

<Card title="Output Format" icon="file-audio">
  - Wave file format - Base64 encoded string - Configurable sample rates -
  Multiple quality options
</Card>

{" "}

<Card title="Speech Parameters" icon="sliders">
  - Pitch control - Speech rate adjustment - Volume control - Language selection
</Card>

  <Card title="Integration" icon="puzzle-piece">
    - Simple REST API
     - Multiple language SDKs
      - Comprehensive documentation
    - Easy-to-follow examples
  </Card>
</CardGroup>

## Next Steps

<Steps>
  <Step title="Choose Your API">
    Select the appropriate API type based on your use case.
  </Step>

{" "}

<Step title="Get API Key">
  Sign up and get your API key from the
  [dashboard](https://dashboard.sarvam.ai).
</Step>

  <Step title="Go Live">
    Deploy your integration and monitor usage in the dashboard.
  </Step>
</Steps>

<Note>
  Need help choosing the right API? Contact us on
  [discord](https://discord.gg/5rAsykttcs) for guidance.
</Note>
```

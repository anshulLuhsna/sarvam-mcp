---
title: Speech-to-Text APIs
description: Overview of Sarvam AI Speech-to-Text APIs
icon: code
---

## API Types

<CardGroup cols={3}>
  <Card title="Real-time API" icon="bolt" color="#00aa55">
    Process short audio files synchronously with immediate response. Best for
    files under 1 minute.
  </Card>

{" "}

<Card title="Batch API" icon="inbox" color="#0062ff">
  Handle large audio files asynchronously with webhook callbacks. Ideal for long
  recordings.
</Card>

  <Card title="Streaming API" icon="wave-square" color="#da62c4">
    Real-time audio streaming with instant results. Perfect for live
    transcription.
    <Note>Coming soon</Note>
  </Card>
</CardGroup>

## Code Examples

<Tabs>
  <Tab title="Real-time API">
    <div className="mb-8">
      <h3>Synchronous Processing</h3>
      <p>
        Process short audio files with immediate response. Best for quick transcriptions and testing.
        Features include:
      </p>
      <ul>
        <li>Instant results</li>
        <li>Simple integration</li>
        <li>Support for multiple audio formats</li>
        <li>Maximum duration: 1 minute</li>
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
model="saarika:v1",
language_code="gu-IN"
)

print(response)

        ```
      </Tab>
      <Tab title="JavaScript">
        ```javascript
        const { SarvamAI } = require('sarvam-ai');
        const fs = require('fs');

        const client = new SarvamAI();

        async function transcribe() {
          const audioFile = fs.readFileSync('short-audio.wav');
          const response = await client.speech.transcribe({
            model: 'saarika',
            audioFile,
            language: 'en'
          });

          console.log(`Transcription: ${response.text}`);
          console.log(`Confidence: ${response.confidence}`);
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

  <Tab title="Batch API">
    <div className="mb-8">
      <h3>Asynchronous Processing</h3>
      <p>
        Process large audio files asynchronously with webhook notifications. Ideal for:
      </p>
      <ul>
        <li>Long recordings (up to 4 hours)</li>
        <li>Batch processing</li>
        <li>Background processing</li>
        <li>Webhook notifications</li>
      </ul>
    </div>
        <Note> You can try it out [here](https://github.com/sarvamai/sarvam-ai-cookbook/blob/main/notebooks/stt-translate/stt-translate-batch-api/Sarvam_STT_Translate_Batch_API_Demo.ipynb).</Note>

  </Tab>

  <Tab title="Streaming API">
    <div className="mb-8">
      <h3>Real-time Streaming</h3>
      <p>
        Stream audio in real-time for immediate transcription results. Perfect for:
      </p>
      <ul>
        <li>Live captioning</li>
        <li>Virtual assistants</li>
        <li>Real-time transcription</li>
        <li>Interactive applications</li>
      </ul>
    </div>
    <Note> Coming Soon </Note>
  </Tab>
</Tabs>

## API Features

<CardGroup cols={2}>
  <Card title="Language Support" icon="language">
    - Multiple Indian languages  and English support 
    - Automatic language detection
    - High accuracy transcription
  </Card>

{" "}

<Card title="API Types" icon="server">
  - Real-Time API (under 30 seconds) - Batch API for longer files - Immediate
  results for Real-Time
</Card>

  <Card title="Advanced Features" icon="wand-magic-sparkles">
    - Speaker diarization (Batch API only) 
    - Separate pricing for diarization 
    - Real-time transcription
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

---
title: Authentication
slug: api-reference-docs/authentication
---

All API endpoints are authenticated using API Subscription Keys provided by Sarvam AI when you sign up. Include these keys in the header of each API request as follows:

```
api-subscription-key: <your-api-key>
```

### Obtaining Your API Subscription Key

1. **Sign Up**: Create an account on the [Sarvam Dashboard](https://dashboard.sarvam.ai)
2. **Generate Key**: When you sign up, an API key is generated for your account and shown in the dashboard.
3. **Organisation Key Management**: Create Organisational level keys is not currently supported and will be available soon.

#### Best Practices for API Key Management

1. **Keep Your Key Secret**: Never expose your API key in public repositories or client-side code.
2. **Use Environment Variables**: Store your API key in environment variables rather than hardcoding it in your application.
3. **Monitor Usage**: Regularly check your API usage on the Sarvam dashboard. You should be able to see the credits utilised & remaining

### Using the API Subscription Key

To authenticate your requests, include the `API-Subscription-Key` in the headers of your HTTP requests. Here's an example using SarvamAI SDK:

<CodeGroup>
  <CodeBlock title="Python" active>

    ```python

    from sarvamai import SarvamAI

    client = SarvamAI(
        api_subscription_key="YOUR_API_KEY",
    )

    response = client.text.translate(
        input="Hi, My Name is Vinayak.",
        source_language_code="auto",
        target_language_code="hi-IN",
        speaker_gender="Male"
    )

    print(response)
    ```

  </CodeBlock>

  <CodeBlock title="JavaScript">
    ```javascript
    import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({ apiSubscriptionKey: "YOUR_API_SUBSCRIPTION_KEY" });

await client.text.translate({
input: "input",
source_language_code: "auto",
target_language_code: "en-IN",

});

````
  </CodeBlock>

  <CodeBlock title="curl">
    ```bash
    curl -X POST https://api.sarvam.ai/v1/translate/text \
      -H "Authorization: Bearer $SARVAM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "text": "Hello, how are you?",
        "source_lang": "en",
        "target_lang": "hi"
      }'
    ```
  </CodeBlock>
</CodeGroup>
````


---
title: Credits & Rate Limits
subtitle: ''
slug: api-reference-docs/ratelimits
---


### Credits

Sarvam offers Rs. 1000 worth of free credits for every user once you sign up. These credits can be used against any of our APIs for you to try out & explore our products.

### Rate Limits on free Plan

Sarvam AI imposes the following rate limits on its APIs:

- **Requests per minute**: 60 requests per minute per API Subscription Key
- **Client IP based rate limit**: 1000 requests per minute (this may change in future, so please contact us if you have specific use-cases)
- **Platform rate limit**: 5000 requests per minute (this may change in future, so please contact us if you have specific use-cases)

### Managing Your API Credits

If your credits run out, you won’t be able to make further API requests. Here’s how you can get more credits:

1. **Upgrade Your Plan**  
   Log in to the [Sarvam API Dashboard](https://dashboard.sarvam.ai/admin/billing/overview), go to the billing section, and add credits as needed.

2. **For Enterprises**  
   If you’re an enterprise and want to test our APIs, email us at [partnerships@sarvam.ai](mailto:partnerships@sarvam.ai). Share your specific requirements, and we’ll provide custom pricing or features tailored to your needs.  


### Exceeding Rate Limits

If you exceed the rate limits, you will receive a `429 Too Many Requests` response status code. The response will include a `Retry-After` header indicating when you can make your next request.

### Exceeding Credits usage

If you exceed the credit usage, you will receive a `429 Too Many Requests` response status code. The response will include a `Retry-After` header indicating when you can make your next request.

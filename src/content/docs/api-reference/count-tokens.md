---
title: Count Tokens
description: Estimate input token count for a Messages request.
section: api
order: 5
method: POST
path: /v1/messages/count_tokens
---

Anthropic-compatible token counting for context-window planning. Given the same messages you
would send to [Messages](/api-reference/messages/), returns an approximate input token count —
useful for deciding whether to truncate before spending a request.

## Request

```bash method=POST path=/v1/messages/count_tokens
curl https://api.basemnt.ai/v1/messages/count_tokens \
  -H "x-api-key: $SK_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-ai/glm-5.2",
    "messages": [
      { "role": "user", "content": "Write a bash function that waits for a port." }
    ],
    "system": "You are a terse coding assistant."
  }'
```

Body accepts the same `model`, `messages`, `system`, and `tools` fields as `/v1/messages`.

## Response

```json title=200-response.json
{ "input_tokens": 48 }
```

<div class="callout">
  <div class="callout-title">Approximation</div>
  The count is a heuristic estimate, not a tokenizer-exact number. Different models tokenize
  differently; budget ~5% headroom before assuming a request fits.
</div>

Authentication is required — a missing key is a `401`, and an invalid key is rejected the same
as a model call.

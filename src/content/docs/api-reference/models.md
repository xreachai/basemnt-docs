---
title: Models
description: List available models and their capabilities.
section: api
order: 4
method: GET
path: /v1/models
---

Returns every model your key can route to, with context limits, pricing, and capability flags.

## Request

```bash method=GET path=/v1/models
curl https://api.basemnt.ai/v1/models \
  -H "Authorization: Bearer $SK_KEY"
```

## Response

```json title=200-response.json
{
  "object": "list",
  "data": [
    {
      "id": "z-ai/glm-5.2",
      "object": "model",
      "created": 1759000000,
      "owned_by": "basemnt",
      "context_length": 1048576,
      "max_output_tokens": 131072,
      "streaming": true,
      "tools": true,
      "vision": false,
      "input_price_per_m": 0.9744,
      "output_price_per_m": 3.0624
    }
  ]
}
```

## Catalog

| Model ID | Context | Max output | Tools | Vision |
|---|---|---|---|---|
| `z-ai/glm-5.2` | 1,048,576 | 131,072 | ✓ | — |
| `deepseek/deepseek-v4-flash-0731` | 1,048,576 | 65,536 | ✓ | — |
| `minimax/minimax-m3` | 1,048,576 | 512,000 | ✓ | ✓ |

<div class="callout">
  <div class="callout-title">Token prices are upstream costs</div>
  Plans are metered per <em>request</em>, not per token — token pricing shown by
  <code>GET /v1/models</code> reflects upstream provider cost and never appears on your bill.
</div>

Model IDs are passed verbatim to the `model` field of
[Chat Completions](/api-reference/chat-completions/) and
[Messages](/api-reference/messages/). Unknown IDs return a `400` listing the valid models.

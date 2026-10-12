---
title: Authentication
description: How base/mnt.ai authenticates requests and what happens when a key is rejected.
section: api
order: 1
---

Every request to the router needs a valid API key. Two headers are accepted interchangeably:

| Header | Sent by |
|---|---|
| `Authorization: Bearer sk-...` | OpenAI SDKs, curl, most tooling |
| `x-api-key: sk-...` | Anthropic SDKs, Claude Code |

```bash title=both-headers.sh
# These two requests are identical to the router:
curl https://api.basemnt.ai/v1/models -H "Authorization: Bearer sk-..."
curl https://api.basemnt.ai/v1/models -H "x-api-key: sk-..."
```

## Creating keys

Keys are scoped to a project and created in the dashboard under
**Settings → API keys**. A key carries the quota of the plan it belongs to; requests are
metered per request, never per token.

## Error responses

Invalid or missing keys return a standard error body. The shape matches the protocol family
of the endpoint you called (OpenAI-style on `/v1/chat/completions`, Anthropic-style on
`/v1/messages`), with an `x-request-id` header for support.

```json title=401-response.json
{
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key"
  }
}
```

| Status | Meaning |
|---|---|
| `401` | Missing or invalid key |
| `402` | Quota exhausted — request count limit reached |
| `429` | Rate limited — too many requests per minute |
| `500` | Router error — retry with backoff |

## Keeping keys out of code

Prefer env vars over config files. All the [agent guides](/agents/claude-code/) work by setting
`OPENAI_BASE_URL` / `ANTHROPIC_BASE_URL` and the matching key variable — nothing else changes.

<div class="callout warn">
  <div class="callout-title">Key hygiene</div>
  Never commit keys. If one leaks, revoke it in the dashboard immediately — usage is not
  refundable.
</div>

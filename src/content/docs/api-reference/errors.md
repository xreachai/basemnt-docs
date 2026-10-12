---
title: Errors
description: Status codes, error bodies, and retry guidance.
section: api
order: 6
---

All errors carry a request id in the `x-request-id` header, a machine-readable `type`, and a
human-readable `message`. The body's shape follows the protocol family of the endpoint —
OpenAI-style on `/v1/chat/completions` and `/v1/models`, Anthropic-style on `/v1/messages*`.

## Status codes

| Status | OpenAI-style `type` | Meaning | Retry? |
|---|---|---|---|
| `400` | `invalid_request_error` | Malformed body, unknown model, context overflow | No — fix the request |
| `401` | `authentication_error` | Missing/invalid key | No — fix the key |
| `402` | `insufficient_quota` | Plan request-count limit reached | Yes, after reset |
| `404` | `invalid_request_error` | Unknown endpoint | No |
| `413` | `invalid_request_error` | Body above 16 MiB cap | No — split the payload |
| `429` | `rate_limit_error` | Requests-per-minute limit | Yes, with backoff |
| `5xx` | `api_error` | Router/upstream failure | Yes, idempotently |

Quota denials (`402`) and rate limits (`429`) include when the limit frees up in the message
body — retry before that time is wasted effort.

## Error bodies

OpenAI-style (Chat Completions, Models):

```json title=openai-error.json
{
  "error": {
    "type": "rate_limit_error",
    "message": "Requests-per-minute limit exceeded. Resets at 12:04:00Z."
  }
}
```

Anthropic-style (Messages, Count Tokens):

```json title=anthropic-error.json
{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "Requests-per-minute limit exceeded. Resets at 12:04:00Z."
  }
}
```

## Retry guidance

- Retry `429` and `5xx` with exponential backoff — 1s, 2s, 4s — capped at 3 attempts.
- Never retry `400`/`401` — the request is wrong, not the timing.
- Retries are new requests for metering purposes; a retried 5xx whose upstream call already
  landed still counts once.

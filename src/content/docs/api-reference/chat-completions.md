---
title: Chat Completions
description: Create a model completion — the OpenAI-compatible chat endpoint.
section: api
order: 2
method: POST
path: /v1/chat/completions
---

The core inference endpoint. Given a list of messages, the routed model returns a completion.
Wire-compatible with the OpenAI Chat Completions API — OpenAI SDKs work unchanged against
`https://api.basemnt.ai/v1`.

## Request

```bash method=POST path=/v1/chat/completions
curl https://api.basemnt.ai/v1/chat/completions \
  -H "Authorization: Bearer $SK_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-ai/glm-5.2",
    "messages": [
      { "role": "system", "content": "You are a terse coding assistant." },
      { "role": "user", "content": "Write a bash function that waits for a port." }
    ],
    "stream": true,
    "max_tokens": 1024
  }'
```

### Body parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `string` | — | **Required.** Model ID from the [catalog](/api-reference/models/), e.g. `z-ai/glm-5.2`. |
| `messages` | `array` | — | **Required.** Conversation messages, oldest first. Roles: `system`, `user`, `assistant`, `tool`. |
| `stream` | `boolean` | `false` | Stream partial deltas via Server-Sent Events. |
| `max_tokens` | `integer` | model max | Cap on generated tokens (including reasoning tokens). |
| `temperature` | `number` | `1` | Sampling temperature, 0–2. |
| `tools` | `array` | — | Tool/function definitions the model may call. |
| `tool_choice` | `string \| object` | `auto` | `none`, `auto`, `required`, or a specific tool. |
| `stop` | `string \| array` | — | Up to 4 sequences where generation stops. |
| `response_format` | `object` | — | e.g. `{ "type": "json_object" }` for constrained JSON output (model-dependent). |

<div class="callout">
  <div class="callout-title">Context limits</div>
  Every model in the catalog carries <code>contextLength</code> and <code>maxOutputTokens</code>.
  Requests whose inputs exceed the model's context are rejected with a
  <code>400</code> before any spend occurs.
</div>

## Response (non-streaming)

```json title=200-response.json
{
  "id": "chatcmpl-8f3a...",
  "object": "chat.completion",
  "created": 1760000000,
  "model": "z-ai/glm-5.2",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "wait_for_port() { ... }" },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 52,
    "completion_tokens": 184,
    "total_tokens": 236
  }
}
```

## Streaming

With `stream: true`, the response is an SSE stream of `chat.completion.chunk` objects. Deltas
arrive as `choices[0].delta.content`; the stream terminates on a chunk with
`finish_reason` set, followed by `data: [DONE]`.

```json title=sse-chunk.json
{
  "id": "chatcmpl-8f3a...",
  "object": "chat.completion.chunk",
  "model": "z-ai/glm-5.2",
  "choices": [
    {
      "index": 0,
      "delta": { "content": "wait_" },
      "finish_reason": null
    }
  ]
}
```

Tool-call deltas arrive on `choices[0].delta.tool_calls`, assembled incrementally the same way
the OpenAI SDKs do — if you use an official SDK, streaming and tool calls require no extra code.

## Errors

| Status | Body | Meaning |
|---|---|---|
| `400` | `invalid_request_error` | Malformed body, unknown model, or context overflow. |
| `401` | `authentication_error` | Missing or invalid key. See [Authentication](/api-reference/authentication/). |
| `402` | `insufficient_quota` | Request-count limit reached; retry at the time in the message. |
| `429` | `rate_limit_error` | Requests-per-minute cap; back off and retry. |
| `5xx` | `api_error` | Upstream failure; retry idempotently. |

Every response carries an `x-request-id` header — include it when contacting support.

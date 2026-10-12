---
title: Messages (Anthropic)
description: The Anthropic-compatible Messages endpoint — native protocol for Claude SDKs and Claude Code.
section: api
order: 3
method: POST
path: /v1/messages
---

The Anthropic Messages API, served by the base/mnt.ai router. Point any Anthropic SDK — or
Claude Code itself — at `https://api.basemnt.ai` and model calls route through base/mnt.ai
with the same auth, metering, and failover as the OpenAI-compatible surface.

## Request

```bash method=POST path=/v1/messages
curl https://api.basemnt.ai/v1/messages \
  -H "x-api-key: $SK_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-ai/glm-5.2",
    "max_tokens": 1024,
    "system": "You are a terse coding assistant.",
    "messages": [
      { "role": "user", "content": "Write a bash function that waits for a port." }
    ]
  }'
```

### Body parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `string` | — | **Required.** Model ID from the [catalog](/api-reference/models/). |
| `messages` | `array` | — | **Required.** Turns of the conversation, alternating `user` / `assistant`. |
| `max_tokens` | `integer` | — | **Required.** Cap on generated tokens. |
| `system` | `string \| array` | — | System prompt. |
| `stream` | `boolean` | `false` | Stream events via SSE. |
| `temperature` | `number` | `1` | Sampling temperature, 0–1. |
| `tools` | `array` | — | Tool definitions (name, description, input schema). |
| `tool_choice` | `object` | — | `{"type":"auto"}`, `{"type":"any"}`, or `{"type":"tool","name":...}`. |
| `stop_sequences` | `array` | — | Sequences that end generation. |

## Response

```json title=200-response.json
{
  "id": "msg_01...",
  "type": "message",
  "role": "assistant",
  "model": "z-ai/glm-5.2",
  "content": [
    { "type": "text", "text": "wait_for_port() { ... }" }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 48,
    "output_tokens": 172
  }
}
```

Content blocks mirror the Anthropic shape: `text` blocks, `tool_use` blocks with `id`, `name`,
and `input`, and `thinking` blocks on reasoning-capable models.

## Streaming

With `stream: true`, the endpoint emits the standard Anthropic event sequence —
`message_start`, `content_block_start`, `content_block_delta` (with `text_delta` or
`input_json_delta`), `content_block_stop`, `message_delta`, `message_stop`:

```json title=sse-event.json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": { "type": "text_delta", "text": "wait_" }
}
```

Official Anthropic SDKs consume this natively — no code changes beyond the base URL.

## Errors

Anthropic-style error bodies, same statuses as [Chat Completions](/api-reference/chat-completions/):

```json title=401-response.json
{
  "type": "error",
  "error": { "type": "authentication_error", "message": "Invalid API key" }
}
```

## Why two protocols?

Tooling is sticky. Claude Code and Anthropic SDKs speak Messages; OpenAI SDKs and most agents
speak Chat Completions. Rather than translate in your code, the router speaks both natively and
routes to the same models either way — see [connecting agents](/agents/claude-code/).

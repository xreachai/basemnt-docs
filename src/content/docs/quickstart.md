---
title: Quickstart
description: Make your first base/mnt.ai request in under a minute.
section: start
order: 1
---

Make your first base/mnt.ai request in under a minute. The router speaks both the OpenAI and
Anthropic wire formats, so any existing SDK, CLI, or coding agent works with a one-line change.

## 1. Get an API key

1. Sign in at [basemnt.ai](https://basemnt.ai).
2. Open **Settings → API keys** and create a key.

Keys look like `sk-...`. Treat them like passwords — requests are metered per plan, and a leaked
key burns your quota.

## 2. Point a client at the router

The base URL is `https://api.basemnt.ai`. Both protocol families live on the same host:

| Protocol | Base URL | Endpoints |
|---|---|---|
| OpenAI-compatible | `https://api.basemnt.ai/v1` | `POST /v1/chat/completions`, `GET /v1/models` |
| Anthropic-compatible | `https://api.basemnt.ai` | `POST /v1/messages`, `POST /v1/messages/count_tokens` |

```bash title=first-request.sh
curl https://api.basemnt.ai/v1/chat/completions \
  -H "Authorization: Bearer $SK_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash-0731",
    "messages": [{ "role": "user", "content": "Hello, basement." }]
  }'
```

<div class="callout">
  <div class="callout-title">Auth headers</div>
  The router accepts <code>Authorization: Bearer &lt;key&gt;</code> and <code>x-api-key: &lt;key&gt;</code>
  interchangeably. OpenAI SDKs send the former; Anthropic SDKs (and Claude Code) send the latter.
</div>

## 3. Pick a model

List everything your key can reach:

```bash title=list-models.sh
curl https://api.basemnt.ai/v1/models \
  -H "Authorization: Bearer $SK_KEY"
```

See [Models](/api-reference/models/) for the current catalog. Model IDs are the routing key —
pass them verbatim in the `model` field.

## 4. Stream it

Add `"stream": true` to stream Server-Sent Events as tokens arrive:

```bash title=stream.sh
curl https://api.basemnt.ai/v1/chat/completions \
  -H "Authorization: Bearer $SK_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash-0731",
    "messages": [{ "role": "user", "content": "Hello" }],
    "stream": true
  }'
```

## Next steps

- [API Reference](/api-reference/chat-completions/) — every endpoint, parameter, and error code.
- [Connect coding agents](/agents/claude-code/) — Claude Code, Codex, OpenCode, Pi, omp, and more,
  via one env var.

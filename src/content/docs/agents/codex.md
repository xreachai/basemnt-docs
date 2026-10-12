---
title: Codex CLI
description: Point OpenAI's Codex CLI at base/mnt.ai via config.toml or env vars.
section: agents
order: 3
---

OpenAI's Codex CLI is configured by `~/.codex/config.toml` and speaks the OpenAI
[Chat Completions protocol](/api-reference/chat-completions/) — which the router serves
unchanged.

## Option 1 — config.toml model provider (recommended)

Define base/mnt.ai as a model provider and set it as the default profile:

```toml title=~/.codex/config.toml
# base/mnt.ai as an OpenAI-compatible provider
[model_providers.basemnt]
name = "base/mnt.ai"
base_url = "https://api.basemnt.ai/v1"
env_key = "SK_KEY"
wire_api = "chat"

[profiles.basemnt]
model_provider = "basemnt"
model = "z-ai/glm-5.2"

# Make it the default
model_provider = "basemnt"
model = "z-ai/glm-5.2"
```

`env_key = "SK_KEY"` tells Codex to read the key from that environment variable — the key
never lives in the config file:

```bash title=~/.zshrc
export SK_KEY=sk-your-key
```

Then run it:

```bash title=run.sh
codex "refactor the auth middleware to use zod"
# or explicitly with the profile:
codex --profile basemnt "refactor the auth middleware"
```

<div class="callout">
  <div class="callout-title"><code>wire_api</code></div>
  Use <code>wire_api = "chat"</code> for the Chat Completions surface. Codex also supports
  a <code>"responses"</code> wire API; the router does not serve the Responses protocol, so
  keep it on <code>"chat"</code>.
</div>

## Option 2 — env vars

Codex honors `OPENAI_BASE_URL` / `OPENAI_API_KEY` when no provider override exists:

```bash title=env-vars.sh
export OPENAI_BASE_URL=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key
```

## Option 3 — bash function

```bash title=~/.zshrc
codex() {
  OPENAI_BASE_URL=https://api.basemnt.ai/v1 \
  OPENAI_API_KEY="$SK_KEY" \
  command codex "$@"
}
```

## Verify

Run `codex` in any repo and issue a prompt. Requests appear in your usage dashboard. A
`401` means a bad key; a `400` on `/v1/chat/completions` usually means the model ID is not in
the [catalog](/api-reference/models/) — set `model` in the profile to a valid ID.

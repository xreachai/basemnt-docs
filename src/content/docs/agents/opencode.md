---
title: OpenCode
description: Add base/mnt.ai as an OpenCode provider in opencode.json or auth.json.
section: agents
order: 4
---

[OpenCode](https://opencode.ai) supports arbitrary OpenAI-compatible providers via its config.
Add base/mnt.ai once and select it per-session.

## Provider config

Global config lives at `~/.config/opencode/opencode.json` (or `opencode.json` in a repo for
project scope):

```json title=opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "basemnt": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "base/mnt.ai",
      "options": {
        "baseURL": "https://api.basemnt.ai/v1",
        "apiKey": "{env:SK_KEY}"
      },
      "models": {
        "z-ai/glm-5.2": {},
        "deepseek/deepseek-v4-flash-0731": {},
        "minimax/minimax-m3": {}
      },
      "default": true
    }
  }
}
```

`"{env:SK_KEY}"` resolves the key from your environment at startup — keep the secret out of
the config file:

```bash title=~/.zshrc
export SK_KEY=sk-your-key
```

## Bash function alternative

If you prefer OpenCode's built-in env handling, wrap the binary:

```bash title=~/.zshrc
opencode() {
  OPENAI_BASE_URL=https://api.basemnt.ai/v1 \
  OPENAI_API_KEY="$SK_KEY" \
  command opencode "$@"
}
```

## Model selection

Inside a session, the provider's models appear by ID:

```bash title=run.sh
opencode run --model basemnt/z-ai/glm-5.2 "explain the router auth flow"
```

`"default": true` on the provider makes `basemnt` models the default set.

## Verify

Run `opencode` and check the model picker shows `basemnt/z-ai/glm-5.2`. A `401` means
`SK_KEY` isn't set in the environment OpenCode inherited; a `400` means the model ID isn't in
the [catalog](/api-reference/models/).

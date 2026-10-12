---
title: Pi
description: Configure the Pi coding agent to route through base/mnt.ai.
section: agents
order: 5
---

[Pi](https://github.com/badlogic/pi-mono) (the `pi` coding agent) supports custom model
providers. Pi's model configuration accepts any OpenAI-compatible base URL, so base/mnt.ai
drops in directly.

## Env vars

```bash title=~/.zshrc
export OPENAI_BASE_URL=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key
```

## Bash function

Scope the routing to invocations of the binary only:

```bash title=~/.zshrc
pi() {
  OPENAI_BASE_URL=https://api.basemnt.ai/v1 \
  OPENAI_API_KEY="$SK_KEY" \
  command pi "$@"
}
```

## Config alternative

Pi stores provider overrides in `~/.pi/models.json` (or `~/.config/pi/models.json`, depending
on version). The schema is a map of provider names to base URL + key:

```json title=~/.pi/models.json
{
  "basemnt": {
    "baseUrl": "https://api.basemnt.ai/v1",
    "apiKey": "{env:SK_KEY}",
    "models": {
      "z-ai/glm-5.2": {},
      "deepseek/deepseek-v4-flash-0731": {}
    }
  }
}
```

<div class="callout">
  <div class="callout-title">Check your version</div>
  Pi's config surface moves fast. Run <code>pi --help</code> and look for
  <code>provider</code>/<code>models</code> flags — if your version reads env vars, the
  bash function is the lowest-maintenance path.
</div>

## Verify

Run `pi` with a prompt. Requests appear in your usage dashboard; a `401` means the key didn't
reach the process (check `SK_KEY` is exported in the shell you launched from).

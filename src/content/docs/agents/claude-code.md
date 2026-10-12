---
title: Claude Code
description: Route Claude Code through base/mnt.ai with env vars, settings, or a bash function.
section: agents
order: 2
---

Claude Code speaks the Anthropic Messages protocol natively, and the router serves
[`/v1/messages`](/api-reference/messages/) wire-compatibly. Point it at base/mnt.ai and every
session — chat, tools, subagents — routes through your key.

Three equivalent ways to configure it. Pick one.

## Option 1 — env vars (recommended)

Claude Code reads `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` from its environment:

```bash title=~/.zshrc
export ANTHROPIC_BASE_URL=https://api.basemnt.ai
export ANTHROPIC_AUTH_TOKEN=sk-your-key
```

Set once, applies to every new shell and every project.

<div class="callout">
  <div class="callout-title">AUTH_TOKEN, not API_KEY</div>
  Claude Code prefers <code>ANTHROPIC_AUTH_TOKEN</code> (sent as <code>Authorization: Bearer</code>)
  over <code>ANTHROPIC_API_KEY</code> (sent as <code>x-api-key</code>). The router accepts both
  headers; <code>AUTH_TOKEN</code> avoids conflicts if a real Anthropic key is also set.
</div>

## Option 2 — Claude Code settings

Per-user or per-project, without touching your shell env. In
`~/.claude/settings.json` (or `.claude/settings.json` in a repo):

```json title=~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.basemnt.ai",
    "ANTHROPIC_AUTH_TOKEN": "sk-your-key"
  }
}
```

Project-level settings are committed to the repo — use `~/.claude/settings.local.json` or env
vars for keys so secrets never land in git.

## Option 3 — bash function

Wrap the binary so only invocations through the function carry the config:

```bash title=~/.zshrc
claude() {
  ANTHROPIC_BASE_URL=https://api.basemnt.ai \
  ANTHROPIC_AUTH_TOKEN="$SK_KEY" \
  command claude "$@"
}
```

`command claude` resolves the real binary — without it the function recurses into itself.
This pattern keeps your global env clean and makes it obvious which terminal is routed.

## Model selection

Claude Code pins an Anthropic model name by default (`claude-sonnet-4-5` or similar). Pass a
[catalog model ID](/api-reference/models/) at launch or mid-session:

```bash title=model-flag.sh
claude --model z-ai/glm-5.2
```

Inside a session: `/model deepseek/deepseek-v4-flash-0731`.

## Verify it worked

Launch `claude` and ask anything. A working setup shows base/mnt.ai requests in your usage
dashboard. A `401` means the key is wrong; a `404` on `/v1/messages` means the base URL lost
its host or gained a trailing `/v1` — Claude Code appends the path itself.

---
title: Coding Agents
description: Connect any coding agent to base/mnt.ai — env vars, config files, or a bash alias.
section: agents
order: 1
---

Every popular coding agent lets you override two things: where it sends requests (base URL) and
what key it sends (API key). Because base/mnt.ai speaks both the OpenAI and Anthropic wire
protocols natively, swapping an agent's upstream is a config change — the agent never knows.

Three patterns cover every harness:

| Pattern | Best for | Guide |
|---|---|---|
| **Env vars** | Agents that read `ANTHROPIC_*` / `OPENAI_*` env vars | [Pattern: env vars](#env-vars) below |
| **Bash alias / function** | Wrapping one binary so it always carries your config | [Pattern: bash function](#bash-function) below |
| **Config file** | Agents with a TOML/JSON config on disk | Per-agent guides |

## Env vars

The two protocol families read different variables. Set whichever your harness honors:

```bash title=env-vars.sh
# Anthropic-protocol clients (Claude Code, Anthropic SDKs):
export ANTHROPIC_BASE_URL=https://api.basemnt.ai
export ANTHROPIC_AUTH_TOKEN=sk-your-key

# OpenAI-protocol clients (Codex, OpenCode, Pi, omp, OpenAI SDKs):
export OPENAI_BASE_URL=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key
```

<div class="callout">
  <div class="callout-title">AUTH_TOKEN vs API_KEY</div>
  Anthropic-protocol clients use <code>ANTHROPIC_AUTH_TOKEN</code> (sent as
  <code>Authorization: Bearer</code>) or <code>ANTHROPIC_API_KEY</code> (sent as
  <code>x-api-key</code>). The router accepts either header — use <code>AUTH_TOKEN</code> when
  the harness supports both, since it wins the precedence check in most tools.
</div>

Put these in `~/.zshrc` / `~/.bashrc` to apply to every new shell, or in the agent's own
env file (Claude Code reads `~/.claude/settings.json` `env`, Codex reads `~/.codex/config.toml`).

## Bash function

For binaries you call yourself, a shell function injects the env without polluting your global
environment:

```bash title=~/.zshrc
# Route claude through base/mnt.ai without touching global env
claude() {
  ANTHROPIC_BASE_URL=https://api.basemnt.ai \
  ANTHROPIC_AUTH_TOKEN="$SK_KEY" \
  command claude "$@"
}

# Same pattern for any OpenAI-protocol CLI
codex() {
  OPENAI_BASE_URL=https://api.basemnt.ai/v1 \
  OPENAI_API_KEY="$SK_KEY" \
  command codex "$@"
}
```

Keep the key in one place and reference it — export it once from a private rc file or a
secrets manager:

```bash title=~/.secrets.sh chmod=600
export SK_KEY=sk-your-key
```

```bash title=~/.zshrc
[ -f ~/.secrets.sh ] && source ~/.secrets.sh
```

<div class="callout warn">
  <div class="callout-title">Why <code>command</code></div>
  Inside the function, the bare name would recurse into itself. <code>command claude</code>
  resolves the real binary on <code>PATH</code>. An <code>alias</code> also works for
  pure env injection (<code>alias claude="ANTHROPIC_BASE_URL=… claude"</code>) but can't take
  arguments conditionally the way a function can.
</div>

## Model IDs

Agents often default to a hard-coded model name (e.g. `claude-sonnet-4-5`). Pass a
[catalog model ID](/api-reference/models/) explicitly via the agent's model flag —
`z-ai/glm-5.2`, `deepseek/deepseek-v4-flash-0731`, or `minimax/minimax-m3`.

## Per-harness guides

- [Claude Code](/agents/claude-code/) — env vars, settings.json, or a wrapper function
- [Codex CLI](/agents/codex/) — `~/.codex/config.toml` model provider
- [OpenCode](/agents/opencode/) — `opencode.json` provider config
- [Pi](/agents/pi/) — model provider env vars
- [omp](/agents/omp/) — base URL env var
- [Others](/agents/others/) — Cursor, Aider, Continue, Goose, generic OpenAI SDKs

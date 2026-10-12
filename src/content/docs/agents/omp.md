---
title: omp
description: Point the omp coding harness at base/mnt.ai with env vars.
section: agents
order: 6
---

[omp](https://github.com/basemnt/omp) is a multi-model coding harness that picks a model per
task. It reads standard OpenAI-protocol env vars, so routing it through base/mnt.ai is one
export.

## Env vars

```bash title=~/.zshrc
export OPENAI_BASE_URL=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key
```

If you route omp's Anthropic-protocol tasks through base/mnt.ai as well:

```bash title=~/.zshrc
export ANTHROPIC_BASE_URL=https://api.basemnt.ai
export ANTHROPIC_AUTH_TOKEN=sk-your-key
```

## Bash function

```bash title=~/.zshrc
omp() {
  OPENAI_BASE_URL=https://api.basemnt.ai/v1 \
  OPENAI_API_KEY="$SK_KEY" \
  command omp "$@"
}
```

## Model selection

omp selects models per task. Give it [catalog IDs](/api-reference/models/) — `z-ai/glm-5.2`
for heavy refactors, `deepseek/deepseek-v4-flash-0731` for cheap mechanical passes — through
omp's model configuration or `-m` flag, depending on version.

## Verify

Launch `omp` on a repo task and watch your usage dashboard increment per request. A `401`
means the key variable isn't exported in the harness's environment; note that spawned
subagents inherit the parent's env, so one export covers them all.

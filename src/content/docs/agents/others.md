---
title: Other Agents
description: Cursor, Aider, Continue, Goose, and generic OpenAI/Anthropic SDKs.
section: agents
order: 7
---

Anything that lets you override a base URL works with base/mnt.ai. The same two patterns —
env vars or a bash function — apply everywhere. Common setups:

## Cursor

Settings → Models → add an OpenAI-compatible custom endpoint:

- **Base URL:** `https://api.basemnt.ai/v1`
- **API key:** `sk-...`
- **Model:** a [catalog ID](/api-reference/models/), e.g. `z-ai/glm-5.2`

Verify with the built-in "Test" button — a success means Cursor reaches the router and the
model responds.

## Aider

```bash title=env-vars.sh
export OPENAI_API_BASE=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key

aider --model openai/z-ai/glm-5.2
```

Aider uses `OPENAI_API_BASE` (not `OPENAI_BASE_URL`) for the `openai/` model prefix. The
bash-function pattern works identically — wrap `aider` instead of exporting globally.

## Continue (VS Code / JetBrains)

`~/.continue/config.yaml`:

```yaml title=~/.continue/config.yaml
models:
  - name: base/mnt.ai
    provider: openai
    apiBase: https://api.basemnt.ai/v1
    apiKey: sk-your-key
    model: z-ai/glm-5.2
    roles: [chat, edit, apply]
```

## Goose

```bash title=env-vars.sh
export OPENAI_BASE_URL=https://api.basemnt.ai/v1
export OPENAI_API_KEY=sk-your-key

goose session
```

## Generic OpenAI SDK

```python title=openai-sdk.py
from openai import OpenAI

client = OpenAI(
    base_url="https://api.basemnt.ai/v1",
    api_key="sk-your-key",
)

resp = client.chat.completions.create(
    model="z-ai/glm-5.2",
    messages=[{"role": "user", "content": "Hello, basement."}],
)
print(resp.choices[0].message.content)
```

## Generic Anthropic SDK

```python title=anthropic-sdk.py
from anthropic import Anthropic

client = Anthropic(
    base_url="https://api.basemnt.ai",
    api_key="sk-your-key",
)

resp = client.messages.create(
    model="z-ai/glm-5.2",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, basement."}],
)
print(resp.content[0].text)
```

## Troubleshooting

- **401 everywhere** — key typo, or the env var didn't reach the process. Echo it inside the
  same shell: `echo $SK_KEY`.
- **404 on the request path** — base URL is wrong for the protocol family. OpenAI clients need
  the trailing `/v1`; Anthropic clients must not have it.
- **400 unknown model** — the harness is sending its default model name. Override with a
  [catalog ID](/api-reference/models/).

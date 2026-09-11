# Security

## Reporting

Email hello@faithgpt.io. Please do not open a public issue for a vulnerability.

## What this plugin can reach

The five MCP tools are read only in the sense that matters: none of them publishes or modifies anything outside your own FaithGPT account. They return Bible text and written guidance.

Authentication is OAuth 2.0 Authorization Code with PKCE S256 against `https://api.faithgpt.io/mcp`, with dynamic client registration. The plugin ships no secret. Your token is issued to your client session after you approve the consent screen, and an unauthenticated request to the endpoint gets a 401 with RFC 9728 protected resource metadata.

## What runs on your machine

`scripts/detect-scripture-refs.mjs` reads files you point it at and makes no network calls. It has no dependencies.

`scripts/verify-on-write.sh` runs after a Write or Edit when you have turned on `verify_scripture_on_write`, which is off by default. It reads the written file, prints any Bible references it finds, and exits 0 on every path including a malformed payload or a missing file. It cannot fail a write.

## What the plugin never does

It does not read your credentials, environment variables, or files outside the path you give it. It does not send your code anywhere. Prompts and questions you send to `ask_faithgpt` go to FaithGPT under the [privacy policy](https://www.faithgpt.io/privacy).

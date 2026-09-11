# FaithGPT plugins

The official FaithGPT plugin for [Claude Code](https://code.claude.com) and [Codex](https://developers.openai.com/codex).

Scripture-grounded Bible study, devotionals, and doctrine review, backed by FaithGPT's Bible database. The plugin's one rule is that **Scripture is fetched, never recalled.** An agent that quotes John 3:16 from memory will eventually quote it wrong, and a misquoted verse carries the authority of Scripture while saying something Scripture does not say.

## Install

### Claude Code

```bash
claude plugin marketplace add canadianeagle/faithgpt-plugins
claude plugin install faithgpt@faithgpt
```

### Codex

```bash
codex plugin marketplace add canadianeagle/faithgpt-plugins
codex plugin add faithgpt
```

The first tool call opens the FaithGPT consent screen. Sign in with your FaithGPT account; a free account works.

## What you get

### Skills

| Skill | What it does |
| --- | --- |
| `/verse` | Look up a passage and return its exact text |
| `/study` | Study a passage: context, structure, cross-references, application |
| `/devotional` | Write a Scripture-rooted devotional or prayer |
| `/doctrine-check` | Review a sermon, article, or claim for doctrinal soundness |
| `/verify-scripture` | Find every Bible reference in a file or directory and check each quotation |
| `/sermon-prep` | Build a sermon outline from a passage or theme |
| `scripture-integrity` | Runs on its own whenever a verse is about to be quoted |

`scripture-integrity` is the one that matters. It routes every quotation through a real lookup, and it refuses to reproduce translations FaithGPT does not hold rather than reciting them from memory.

### Agent

`scripture-verifier` checks every Bible quotation across a set of files and reports misquotes, wrong-translation labels, and references that do not exist. Use it on a content directory or a Bible application's seed data, where checking references one at a time would bury the rest of the conversation.

### Tools

Five MCP tools from `https://api.faithgpt.io/mcp`: `lookup_scripture`, `find_scripture_by_topic`, `ask_faithgpt`, `review_doctrine`, `create_devotional`. All are read-only in the sense that matters: none of them publishes or modifies anything outside your FaithGPT account.

## Translations

`KJV`, `ASV`, and `YLT`. All public domain.

The plugin will not produce NIV, ESV, NASB, or any other copyrighted translation. It does not have them, and an agent reciting one from memory typically produces a blend of several translations that matches none of them. Ask for one of those and the plugin says so and offers what it has.

## Verifying Scripture in a repository

The reference detector runs offline with no dependencies:

```bash
node scripts/detect-scripture-refs.mjs content/
node scripts/detect-scripture-refs.mjs devotional.md --json
```

It only matches references that lead with a book name, so `16:9`, `PR 42`, and `this is 1:1 mapping` are left alone. Run `/verify-scripture` to have the agent check the wording of each one it finds.

## Configuration

| Option | Default | What it does |
| --- | --- | --- |
| `default_translation` | `KJV` | Translation used when you do not name one |
| `verify_scripture_on_write` | `false` | After a file is written, list any Bible references in it so the agent verifies them |

Configure with `/plugin configure faithgpt@faithgpt` in Claude Code.

## Already have the FaithGPT connector?

If you added the connector with `claude mcp add faithgpt ...` or from the Claude connector directory, you already have the five tools. The plugin adds the skills, the agent, the hook, and the offline detector on top. The plugin registers its server as `bible` so it cannot collide with a server you named `faithgpt`.

## Development

```bash
node faithgpt/tests/detect-scripture-refs.test.mjs   # detector tests
claude plugin validate . --strict                    # marketplace + plugin
```

## Links

- Documentation: https://www.faithgpt.io/api/mcp/
- FaithGPT: https://www.faithgpt.io
- Support: https://www.faithgpt.io/contact
- Privacy: https://www.faithgpt.io/privacy
- Terms: https://www.faithgpt.io/terms

MIT licensed. © FAITHGPT AI INC.

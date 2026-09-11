# Contributing

## Run the checks

```bash
node faithgpt/tests/detect-scripture-refs.test.mjs
claude plugin validate . --strict
```

Both run in CI on every push.

## If you touch the reference detector

Add a false positive case before you add an alias. The detector's job is not to catch every way a person might write a reference, it is to stay quiet on text that is not Scripture. Two-letter book abbreviations are the trap: `is` is Isaiah, `co` is Colossians, `pr` is Proverbs, and an early build flagged `this is 1:1 mapping` and `we merged PR 42`. Thirty-five aliases were removed for that reason, and they are not coming back without a test showing they are safe.

The write hook runs this detector on every file the agent writes. A detector that cries wolf gets switched off, and then it protects nobody.

## If you add or change a skill

Give it a frontmatter `name` matching its directory. Without one, a marketplace plugin falls back to the directory basename, which is fragile across installs. CI checks this.

Skills live in `skills/<name>/SKILL.md` and work on both platforms from that one location. There is no separate `commands/` directory, because Claude Code exposes a skill as a slash command already.

## If you change the tool list or translations

`skills/scripture-integrity/SKILL.md` names the five tools and the three translations. Those facts come from the production MCP server. A skill that routes to a renamed tool sends the agent after something that does not exist, and one that advertises a translation the server cannot serve invites the from-memory recitation this plugin exists to prevent.

## Scripture accuracy

Any verse text in documentation, tests or examples must be real. Quote KJV, ASV or YLT, name which, and check it against the database rather than typing it from memory. That rule applies to us first.

## Releasing

`plugins/` in the FaithGPT product repo is the source of truth. This repository is published from it with `node scripts/publish-plugins.mjs --push`. Edits made directly here are overwritten on the next publish, so open an issue or a pull request and it will be applied upstream.

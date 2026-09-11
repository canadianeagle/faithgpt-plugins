---
name: verify-scripture
description: Find every Bible reference in a file, directory, or block of text and check each quotation against the real passage. Use before publishing a devotional, sermon, article, or any content that quotes Scripture, and when seeding Bible data into an application.
---

# Verify Scripture in a file

Two steps: find the references without a model, then check the wording with one.

## 1. Find the references

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/detect-scripture-refs.mjs" <path>
```

Give it a file or a directory. A directory is walked, skipping `node_modules`, `.git`, and build output. Add `--json` for structured output, or `--stdin` to pipe text in.

The detector is offline and deterministic. It matches only references that lead with a book name, so `16:9` and `PR 42` and `this is 1:1` are left alone.

## 2. Check each one

For every reference found:

1. Read the quoted wording out of the source file, if the file quotes the text and not just the reference.
2. Call `lookup_scripture` for that reference.
3. Compare.

Report one of four outcomes per reference:

| Outcome | Meaning |
| --- | --- |
| **Match** | Quoted wording matches the passage in the stated translation |
| **Wrong translation** | Wording is real Scripture but a different translation than the one labelled |
| **Misquote** | Wording differs from every translation FaithGPT holds |
| **Bad reference** | The reference does not exist, or does not contain the quoted text |

A reference cited with no quoted text only needs the reference itself confirmed.

## Reporting

Lead with the problems. A clean file gets one line:

> 14 references checked, all match.

A file with problems gets the file, the line, what it says, and what the passage actually says:

> `content/devotionals/hope.md:22` — **Misquote.** Quoted as "God helps those who help themselves" and attributed to Proverbs 28:26. That sentence is not in the Bible; it is from Aesop by way of Benjamin Franklin. Proverbs 28:26 (KJV) reads: "He that trusteth in his own heart is a fool: but whoso walketh wisely, he shall be delivered."

Offer to fix them. Do not edit files without being asked.

## Scale

Over roughly thirty references, work through them in batches and report as you go, rather than holding everything until the end.

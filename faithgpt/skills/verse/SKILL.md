---
name: verse
description: Look up a Bible passage and return its exact text. Use when the user names a reference such as John 3:16, Psalm 23, or Romans 8:28-39, with or without a translation.
---

# Look up a verse

Fetch the passage with `lookup_scripture` and show it.

1. Parse the reference from what the user typed. A bare book and chapter (`Psalm 23`) is a whole chapter; a range (`Romans 8:28-39`) is a range.
2. Pick the translation: whatever the user named, else the configured default, else `KJV`. Only `KJV`, `ASV`, and `YLT` exist. If they asked for something else, read `scripture-integrity` before answering.
3. Call `lookup_scripture`.
4. Return the text, then the reference and translation.

Keep it short. This is a lookup, not a study. One or two sentences of context are welcome when the passage is commonly read out of its setting; a full exposition is not. If the user wants depth, `/study` is the skill for it.

If they asked for several references at once, fetch each one and list them in the order given.

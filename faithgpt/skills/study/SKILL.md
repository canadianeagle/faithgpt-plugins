---
name: study
description: Study a Bible passage in depth. Use when the user wants to understand what a passage means, how it fits its context, or how to apply it, rather than just read it.
---

# Study a passage

Work in this order. Each step depends on the one before it, and skipping the first is how a study ends up being about the reader's assumptions rather than the text.

## 1. Read the passage

`lookup_scripture` for the passage itself, then again for enough surrounding verses to see where the paragraph starts and ends. A verse quoted without its paragraph is the single most common source of misreading.

## 2. Establish the setting

Who wrote it, to whom, and what situation prompted it. `ask_faithgpt` handles this. State what is well attested and note where scholars genuinely differ rather than picking one view and presenting it as settled.

## 3. Work through the text

Walk the passage in its own order. Note the structure the author used: a contrast, a list, a question and its answer, a command followed by its reason. Where a Hebrew or Greek term is doing real work, say so and explain it. Skip the word study when the English carries the sense fine; a transliteration dropped in for flavour adds nothing.

## 4. Cross-reference

`find_scripture_by_topic` for passages that develop the same theme, and check where the New Testament quotes or alludes to an Old Testament text. Fetch each cross-reference; do not cite from memory.

## 5. Apply

What this asks of a reader now. Be concrete and be honest about limits: a passage written to a persecuted first-century congregation is not a promise of comfortable circumstances, and saying so is part of reading it well.

## Output

Use headings for the five sections. Quote Scripture in full with reference and translation. If the passage is genuinely contested between traditions, name the main readings and say which parts are disputed rather than flattening them into one answer.

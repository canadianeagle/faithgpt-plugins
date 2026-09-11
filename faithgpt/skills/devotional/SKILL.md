---
name: devotional
description: Write a Scripture-rooted devotional or a written prayer. Use when the user wants a daily reading, a reflection on a theme, or a prayer to keep, for themselves or for a group.
---

# Write a devotional

Call `create_devotional` with the theme. Pass `verseReference` when the user named a passage, `length` (`short`, `medium`, `long`), and `targetAudience` (`general`, `youth`, `women`, `men`, `families`, `seniors`) when they indicated one.

A devotional has four parts: a title, a passage, a reflection, and a prayer. The tool returns all four.

## Before returning it

Verify the passage. Run the devotional's Scripture through `lookup_scripture` and confirm the quoted wording matches. This is the one step that separates a devotional worth keeping from one that quietly misquotes the verse it is built on.

## Voice

Write to one person, not an audience. The reflection should turn on something specific: a moment, a difficulty, a line in the passage that resists easy reading. Devotionals fail when they restate the verse in warmer words and stop there.

Avoid promising outcomes Scripture does not promise. "God will work this out the way you hope" is not something the text says. Grief, doubt, and unanswered prayer belong in a devotional; the Psalms are full of them.

The prayer is written in the first person and ends with "Amen" on its own line.

## Length

Short runs about 150 words, medium about 300, long about 500. Respect the request. A devotional padded to length reads as padding.

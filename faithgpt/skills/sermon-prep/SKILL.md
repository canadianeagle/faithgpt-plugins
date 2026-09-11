---
name: sermon-prep
description: Build a sermon outline from a Bible passage or a theme. Use when the user is preparing to preach or teach and wants structure, exegesis, and illustrations grounded in the text.
---

# Sermon preparation

## Start from the text

If given a passage, work from it. If given a theme, use `find_scripture_by_topic` to find the passage that carries the theme best, then preach that passage rather than assembling a chain of verses that each touch the topic in passing.

Fetch the passage and its surrounding context with `lookup_scripture`.

## Find the point the passage is making

One sentence. Not the topic ("prayer") but the claim ("Jesus teaches persistence in prayer because the Father is not reluctant, unlike the judge in the parable"). The rest of the sermon serves that sentence, and a sermon without one becomes a tour of the passage.

Use `ask_faithgpt` for the historical and literary setting.

## Structure

Let the passage set the shape. A narrative moves through its scenes. An argument follows its logic. A list of commands is a list. Three alliterated points imposed on a passage that has two ideas is a structure fighting its text.

For each movement: what the text says, what it meant to its first readers, what it asks of this congregation.

## Application

Specific and honest. Name what this costs the hearer. Where the passage confronts something, let it; a sermon that files every hard text down to encouragement has stopped preaching the text.

## Illustrations

Suggest where one would help, and say what work it needs to do. Do not invent anecdotes, statistics, or stories presented as true. A fabricated illustration from the pulpit is worse than none.

## Check it

Run the finished outline through `review_doctrine` before delivering the result, and run its Scripture through `lookup_scripture`. Close with the reminder that this is preparation material and the preacher owns what is preached.

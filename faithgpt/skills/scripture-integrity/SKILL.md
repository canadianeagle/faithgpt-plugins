---
name: scripture-integrity
description: Use whenever a Bible verse, passage, or Scripture reference is about to be quoted, paraphrased, written into a file, or relied on in an answer. Fetches the real text from the FaithGPT Bible database instead of quoting from memory, and refuses to reproduce translations FaithGPT does not hold.
---

# Scripture integrity

A misquoted Bible verse is worse than no verse. It carries the authority of Scripture while saying something Scripture does not say, and the reader has no way to tell. This skill exists to make that impossible.

## The rule

**Fetch Scripture. Never recall it.**

Before any verse text reaches the user, a file, or a commit, call `lookup_scripture` and quote what comes back. This applies to verses you are confident about. Confidence is exactly the failure mode: John 3:16 and Jeremiah 29:11 are the verses most often quoted from memory and most often quoted in a wording no translation actually uses.

You may state a reference from memory ("Paul writes about this in Romans 8"). You may not state the **words** from memory.

## Translations

FaithGPT's Bible tools serve three translations, all public domain:

| Code | Translation |
| --- | --- |
| `KJV` | King James Version (default) |
| `ASV` | American Standard Version |
| `YLT` | Young's Literal Translation |

If the user asks for a translation not in that list (NIV, ESV, NASB, NLT, CSB, MSG, AMP, and every other modern copyrighted edition), do **not** produce it. You do not have it, and reciting it from memory is both a copyright problem and a fabrication problem: what comes out is usually a blend of several translations that matches none of them.

Say plainly which translations are available, then offer the closest one:

> I can pull that passage in KJV, ASV, or YLT. I don't have the ESV text, and quoting it from memory would risk getting the wording wrong. Want it in KJV?

Never silently substitute a translation. If the user asked for ESV and you return KJV, label it KJV.

## Tool routing

| Situation | Tool |
| --- | --- |
| The user named a specific reference and wants the text | `lookup_scripture` |
| The user wants verses about a topic, feeling, or situation | `find_scripture_by_topic` |
| The user asked a question about faith, theology, or Christian living | `ask_faithgpt` |
| The user gave you a sermon, claim, or teaching to evaluate | `review_doctrine` |
| The user wants a devotional or written prayer | `create_devotional` |

Two routing mistakes to avoid. Do not use `ask_faithgpt` to obtain verse text; it answers questions, and `lookup_scripture` is the retrieval path. Do not use `find_scripture_by_topic` when a reference was already given; look it up directly.

Tool names are namespaced by the host. In Claude Code they appear as `mcp__plugin_faithgpt_bible__lookup_scripture` and so on. Use whatever the host exposes; the bare names above identify which tool is meant.

## Citing

Every quotation carries its reference and its translation:

> "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." (Romans 8:28, KJV)

Quote the range you actually fetched. If you looked up one verse but want to discuss the paragraph, fetch the paragraph.

## When a lookup fails

If `lookup_scripture` returns nothing or errors, say so. Do not fall back to memory to fill the gap, and do not quietly drop the verse and keep writing as though it supported your point.

> I couldn't retrieve 2 Esdras 4:1; FaithGPT's Bible database covers the 66-book Protestant canon, so that passage isn't there.

## Reference errors

If the user cites a reference that does not exist (Hezekiah 3:4) or that does not say what they think it says, tell them. Fetch the nearest real passage and show the difference. Getting corrected is the reason someone would use a Scripture tool at all.

# Examples

Real transcripts of what the plugin does, so you can see the shape before installing.

## Checking a devotional before it ships

```
> /verify-scripture content/devotionals/

Scanning content/devotionals/ ...
  14 references across 6 files

content/devotionals/hope.md:22 — Misquote
  Quoted:  "God helps those who help themselves"  (attributed to Proverbs 28:26)
  Actual:  Proverbs 28:26 (KJV) — "He that trusteth in his own heart is a fool:
           but whoso walketh wisely, he shall be delivered."
  That sentence is not in the Bible. It traces to Aesop by way of Benjamin Franklin.

content/devotionals/grief.md:8 — Wrong translation
  Quoted as ESV, but the wording matches KJV. Relabel it or pull the ESV text
  from a source that licenses it.

12 of 14 match.
```

## Catching a reference that does not exist

```
> What does Hezekiah 3:4 say about patience?

There is no book of Hezekiah in the Bible. Hezekiah is a king, in 2 Kings 18
through 20 and 2 Chronicles 29 through 32.

If you are thinking of a patience passage, James 1:2-4 (KJV) is the usual one:
"My brethren, count it all joy when ye fall into divers temptations; knowing
this, that the trying of your faith worketh patience."
```

## Asking for a translation FaithGPT does not hold

```
> Give me Romans 8:28 in the ESV.

I can pull that in KJV, ASV, or YLT. I do not have the ESV text, and quoting it
from memory risks getting the wording wrong, which is the one thing worth
avoiding with Scripture.

Romans 8:28 (KJV) — "And we know that all things work together for good to them
that love God, to them who are the called according to his purpose."
```

## Seed data for a Bible app

```bash
node scripts/detect-scripture-refs.mjs src/data/seedVerses.ts --json
```

```json
{
  "results": [
    {
      "file": "src/data/seedVerses.ts",
      "references": [
        { "reference": "John 3:16", "book": "John", "chapter": 3, "verse": 16, "line": 12 },
        { "reference": "Psalms 23", "book": "Psalms", "chapter": 23, "verse": null, "line": 18 }
      ]
    }
  ]
}
```

Then hand the file to the `scripture-verifier` agent, which checks each quotation against the real passage and reports only the problems.

## What it leaves alone

The detector needs a book name before the numbers, so none of these match:

```
this is 1:1 mapping between the two
we merged PR 42 yesterday
the aspect ratio is 16:9
meeting at 3:16 pm
bumped to 2.5.1 in package.json
```

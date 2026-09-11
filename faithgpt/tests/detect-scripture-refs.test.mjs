#!/usr/bin/env node
/**
 * Adversarial tests for the Scripture reference detector.
 *
 * The false-positive block is the point of this file. Two-letter book
 * abbreviations collide with ordinary English ("is" -> Isaiah, "co" ->
 * Colossians, "pr" -> Proverbs), and an early build of the detector fired on
 * seven of the eight lines below. A detector that flags "this is 1:1 mapping"
 * makes the write hook noise, and noise gets turned off.
 */
import { detectReferences } from "../scripts/detect-scripture-refs.mjs";

let failures = 0;
const refsIn = (text) => detectReferences(text).map((r) => r.reference);

function mustFind(text, expected) {
  const got = refsIn(text);
  if (!got.includes(expected)) {
    console.error(`FAIL  expected ${expected.padEnd(24)} from ${JSON.stringify(text)} -> got [${got}]`);
    failures++;
  }
}

function mustIgnore(text) {
  const got = refsIn(text);
  if (got.length) {
    console.error(`FAIL  expected nothing from ${JSON.stringify(text)} -> got [${got}]`);
    failures++;
  }
}

// --- references that must be detected -------------------------------------
mustFind("For God so loved the world (John 3:16)", "John 3:16");
mustFind("Read Psalm 23 today", "Psalms 23");
mustFind("Romans 8:28-39 is the passage", "Romans 8:28-39");
mustFind("1 Cor 13:4 says love is patient", "1 Corinthians 13:4");
mustFind("II Corinthians 5:17", "2 Corinthians 5:17");
mustFind("Gen. 1:1 in the beginning", "Genesis 1:1");
mustFind("Matt 5:3-12", "Matthew 5:3-12");
mustFind("Rev 21:4", "Revelation 21:4");
mustFind("1 Peter 5:7", "1 Peter 5:7");
mustFind("Song of Solomon 2:1", "Song of Solomon 2:1");
mustFind("see 1 Thess 4:16", "1 Thessalonians 4:16");
mustFind("Psalm 119:105", "Psalms 119:105");

// Single-chapter books: the lone number is a verse, not a chapter.
mustFind("Jude 3 contends for the faith", "Jude 1:3");
mustFind("Philemon 6", "Philemon 1:6");
mustFind("3 John 4", "3 John 1:4");

// --- text that must NOT be read as Scripture ------------------------------
mustIgnore("this is 1:1 mapping between the two");
mustIgnore("we merged PR 42 yesterday");
mustIgnore("the aspect ratio is 16:9 and 9:16");
mustIgnore("see pp 12-14 of the report");
mustIgnore("co 2:1 in the ledger");
mustIgnore("returns N/A when na 1:1");
mustIgnore("the ex 1:1 case");
mustIgnore("bumped to 2.5.1 in package.json");
mustIgnore("a bare 3:16 with no book name");
mustIgnore("grid-template-columns uses 1fr 2fr");

// --- bounds: impossible chapter/verse numbers are not references ----------
mustIgnore("Genesis 999:1");
mustIgnore("John 3:999");

// --- dedupe: the same reference twice reports once ------------------------
const twice = refsIn("John 3:16 and again John 3:16");
if (twice.length !== 1) {
  console.error(`FAIL  duplicate references should collapse -> got [${twice}]`);
  failures++;
}

// --- line numbers are reported for the hook output ------------------------
const lined = detectReferences("first line\nsecond line\nJohn 3:16 here");
if (lined[0]?.line !== 3) {
  console.error(`FAIL  expected line 3 -> got ${lined[0]?.line}`);
  failures++;
}

if (failures) {
  console.error(`\n${failures} failing assertion${failures === 1 ? "" : "s"}.`);
  process.exit(1);
}
console.log("detect-scripture-refs: all assertions passed");

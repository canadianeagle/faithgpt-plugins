#!/usr/bin/env node
/**
 * Detect Bible references in text. No dependencies, no network.
 *
 * Detection is deliberately conservative: a reference must lead with a real
 * book name. A bare "3:16" is a time, a ratio, or a version number far more
 * often than it is Scripture, so numbers alone never match.
 *
 * Usage:
 *   node detect-scripture-refs.mjs <file|dir> [...]
 *   node detect-scripture-refs.mjs --stdin
 *   node detect-scripture-refs.mjs --json <file>
 */

import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

/** Canonical name -> accepted spellings (lowercased, punctuation stripped). */
const BOOKS = {
  Genesis: ["genesis", "gen", "gn"],
  Exodus: ["exodus", "exod", "exo"],
  Leviticus: ["leviticus", "lev", "lv"],
  Numbers: ["numbers", "num", "nm"],
  Deuteronomy: ["deuteronomy", "deut", "deu", "dt"],
  Joshua: ["joshua", "josh", "jos", "jsh"],
  Judges: ["judges", "judg", "jdg", "jg"],
  Ruth: ["ruth", "rth"],
  "1 Samuel": ["1 samuel", "1samuel", "1 sam", "1sam", "1 sa", "1sa", "i samuel", "first samuel"],
  "2 Samuel": ["2 samuel", "2samuel", "2 sam", "2sam", "2 sa", "2sa", "ii samuel", "second samuel"],
  "1 Kings": ["1 kings", "1kings", "1 kgs", "1kgs", "1 ki", "1ki", "i kings", "first kings"],
  "2 Kings": ["2 kings", "2kings", "2 kgs", "2kgs", "2 ki", "2ki", "ii kings", "second kings"],
  "1 Chronicles": ["1 chronicles", "1chronicles", "1 chron", "1chron", "1 chr", "1chr", "i chronicles"],
  "2 Chronicles": ["2 chronicles", "2chronicles", "2 chron", "2chron", "2 chr", "2chr", "ii chronicles"],
  Ezra: ["ezra", "ezr"],
  Nehemiah: ["nehemiah", "neh"],
  Esther: ["esther", "esth", "est"],
  Job: ["job", "jb"],
  Psalms: ["psalms", "psalm", "psa", "pss", "ps"],
  Proverbs: ["proverbs", "prov", "pro", "prv"],
  Ecclesiastes: ["ecclesiastes", "eccles", "eccl", "ecc", "qoheleth"],
  "Song of Solomon": ["song of solomon", "song of songs", "canticles", "song", "sos", "sng"],
  Isaiah: ["isaiah", "isa"],
  Jeremiah: ["jeremiah", "jer"],
  Lamentations: ["lamentations", "lam"],
  Ezekiel: ["ezekiel", "ezek", "eze", "ezk"],
  Daniel: ["daniel", "dan", "dn"],
  Hosea: ["hosea", "hos"],
  Joel: ["joel", "jol"],
  Amos: ["amos", "amo"],
  Obadiah: ["obadiah", "obad", "oba"],
  Jonah: ["jonah", "jon", "jnh"],
  Micah: ["micah", "mic"],
  Nahum: ["nahum", "nah"],
  Habakkuk: ["habakkuk", "hab"],
  Zephaniah: ["zephaniah", "zeph", "zep"],
  Haggai: ["haggai", "hag"],
  Zechariah: ["zechariah", "zech", "zec"],
  Malachi: ["malachi", "mal"],
  Matthew: ["matthew", "matt", "mat", "mt"],
  Mark: ["mark", "mrk", "mk"],
  Luke: ["luke", "luk", "lk"],
  John: ["john", "joh", "jhn", "jn"],
  Acts: ["acts", "act"],
  Romans: ["romans", "rom", "rm"],
  "1 Corinthians": ["1 corinthians", "1corinthians", "1 cor", "1cor", "1 co", "1co", "i corinthians"],
  "2 Corinthians": ["2 corinthians", "2corinthians", "2 cor", "2cor", "2 co", "2co", "ii corinthians"],
  Galatians: ["galatians", "gal"],
  Ephesians: ["ephesians", "eph", "ephes"],
  Philippians: ["philippians", "phil", "php"],
  Colossians: ["colossians", "col"],
  "1 Thessalonians": ["1 thessalonians", "1thessalonians", "1 thess", "1thess", "1 th", "1th"],
  "2 Thessalonians": ["2 thessalonians", "2thessalonians", "2 thess", "2thess", "2 th", "2th"],
  "1 Timothy": ["1 timothy", "1timothy", "1 tim", "1tim", "1 ti", "1ti"],
  "2 Timothy": ["2 timothy", "2timothy", "2 tim", "2tim", "2 ti", "2ti"],
  Titus: ["titus", "tit"],
  Philemon: ["philemon", "philem", "phlm", "phm"],
  Hebrews: ["hebrews", "heb"],
  James: ["james", "jas"],
  "1 Peter": ["1 peter", "1peter", "1 pet", "1pet", "1 pe", "1pe"],
  "2 Peter": ["2 peter", "2peter", "2 pet", "2pet", "2 pe", "2pe"],
  "1 John": ["1 john", "1john", "1 jn", "1jn", "1 jo", "1jo", "i john"],
  "2 John": ["2 john", "2john", "2 jn", "2jn", "2 jo", "2jo", "ii john"],
  "3 John": ["3 john", "3john", "3 jn", "3jn", "3 jo", "3jo", "iii john"],
  Jude: ["jude", "jde"],
  Revelation: ["revelation", "revelations", "rev", "apocalypse"],
};

/** Single-chapter books: "Jude 3" means verse 3, not chapter 3. */
const SINGLE_CHAPTER = new Set(["Obadiah", "Philemon", "2 John", "3 John", "Jude"]);

const ALIAS_TO_BOOK = new Map();
for (const [canonical, aliases] of Object.entries(BOOKS)) {
  for (const alias of aliases) ALIAS_TO_BOOK.set(alias, canonical);
}

// Longest aliases first so "1 corinthians" wins over "1 co".
const ALIAS_PATTERN = [...ALIAS_TO_BOOK.keys()]
  .sort((a, b) => b.length - a.length)
  .map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s.]*"))
  .join("|");

const REFERENCE_RE = new RegExp(
  String.raw`\b(${ALIAS_PATTERN})\.?\s*` +
    String.raw`(\d{1,3})` +
    String.raw`(?:\s*[:.]\s*(\d{1,3})(?:\s*[-\u2013]\s*(\d{1,3}))?)?` +
    String.raw`(?!\s*[:.]?\d*\s*(?:am|pm|px|rem|%|/))`,
  "gi",
);

/** Extensions worth scanning when handed a directory. */
const TEXT_EXT = new Set([
  ".md", ".mdx", ".txt", ".json", ".yaml", ".yml", ".html", ".htm",
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".rb", ".go",
  ".java", ".cs", ".php", ".rs", ".swift", ".kt", ".sql", ".csv",
]);
const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", "coverage",
  ".cache", "vendor", "__pycache__", ".venv", "venv",
]);

export function detectReferences(text) {
  const found = new Map();
  for (const match of text.matchAll(REFERENCE_RE)) {
    const book = ALIAS_TO_BOOK.get(
      match[1].toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim(),
    );
    if (!book) continue;

    const first = Number(match[2]);
    const second = match[3] ? Number(match[3]) : null;
    const rangeEnd = match[4] ? Number(match[4]) : null;

    let chapter = first;
    let verse = second;
    // "Jude 3" is Jude verse 3; these books have exactly one chapter.
    if (SINGLE_CHAPTER.has(book) && second === null) {
      chapter = 1;
      verse = first;
    }
    if (chapter < 1 || chapter > 150) continue;
    if (verse !== null && (verse < 1 || verse > 176)) continue;

    let reference = `${book} ${chapter}`;
    if (verse !== null) reference += `:${verse}`;
    if (rangeEnd !== null && rangeEnd > (verse ?? 0)) reference += `-${rangeEnd}`;

    const line = text.slice(0, match.index).split("\n").length;
    if (!found.has(reference)) found.set(reference, { reference, book, chapter, verse, line, raw: match[0].trim() });
  }
  return [...found.values()];
}

function collectFiles(target, out = []) {
  let st;
  try {
    st = statSync(target);
  } catch {
    return out;
  }
  if (st.isFile()) {
    out.push(target);
    return out;
  }
  if (!st.isDirectory()) return out;
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = join(target, entry.name);
    if (entry.isDirectory()) collectFiles(full, out);
    else if (TEXT_EXT.has(extname(entry.name))) out.push(full);
  }
  return out;
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const targets = args.filter((a) => !a.startsWith("--"));
  const results = [];

  if (args.includes("--stdin") || targets.length === 0) {
    const refs = detectReferences(readStdin());
    if (refs.length) results.push({ file: "<stdin>", references: refs });
  } else {
    for (const target of targets) {
      for (const file of collectFiles(target)) {
        let text;
        try {
          text = readFileSync(file, "utf8");
        } catch {
          continue;
        }
        const refs = detectReferences(text);
        if (refs.length) results.push({ file, references: refs });
      }
    }
  }

  if (asJson) {
    process.stdout.write(JSON.stringify({ results }, null, 2) + "\n");
    return;
  }

  const total = results.reduce((n, r) => n + r.references.length, 0);
  if (total === 0) {
    process.stdout.write("No Bible references found.\n");
    return;
  }
  for (const { file, references } of results) {
    process.stdout.write(`\n${file}\n`);
    for (const r of references) {
      process.stdout.write(`  line ${r.line}: ${r.reference}${r.raw !== r.reference ? `   (written as "${r.raw}")` : ""}\n`);
    }
  }
  process.stdout.write(`\n${total} reference${total === 1 ? "" : "s"} in ${results.length} file${results.length === 1 ? "" : "s"}.\n`);
}

// Only run the CLI when invoked directly, so the detector stays importable.
import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
if (invokedDirectly) main();

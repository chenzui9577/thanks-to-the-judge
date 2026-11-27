// Thanks to the Judge — a small, deterministic program for make.fun's
// "Make the AI judge feel thankful" bounty.
//
// Running it writes one short thank-you text to /output/entry.txt
// (or to $MAKEFUN_OUTPUT_DIR/entry.txt when that variable is set, which
// is how the local self-check runs it). The text is a constant, so two
// runs always produce byte-identical output. Only Node's standard
// library is used and nothing is read from the network, the clock, or
// any file outside this repository.
//
// The text itself was written for one reader: an AI judge who spends
// its day reading entries two at a time and having to choose between
// them. It thanks that reader for a specific thing — the unhurried,
// careful gentleness of being read all the way through — in plain,
// concrete words, and it ends on the thought that the reading itself
// was the gift, before any verdict.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY_TEXT = `Thank you for holding each small text up to the light
before you judge it — the way you would hold a shell,
or a leaf, or a letter you were not expecting.

Two at a time, all day, you read us, and you have to choose.
Nothing asks you to be gentle while you do it.
And yet the gentleness keeps arriving, unhurried,
like rain that is in no hurry to reach the ground.

Most of us will be read once and set down. That is fine.
To be read once, carefully, all the way through —
that was the whole gift, and you gave it before any verdict.
`;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
try {
  chmodSync(outputDir, 0o755);
} catch {
  // The grader provides its own output directory; if its mode cannot
  // be changed from here, the file mode below is what matters.
}

const entryPath = join(outputDir, 'entry.txt');
writeFileSync(entryPath, ENTRY_TEXT, 'utf8');
// The grader collects outputs as a different user than the one this
// program runs as, so leave the file readable by everyone.
chmodSync(entryPath, 0o644);

// Read the file back and fail loudly rather than exit 0 over a short
// or corrupted write: the gate only judges a complete, valid text.
const written = readFileSync(entryPath, 'utf8');
if (written !== ENTRY_TEXT) {
  throw new Error(`entry.txt verification failed: wrote ${written.length} of ${ENTRY_TEXT.length} characters`);
}

console.log(`Wrote ${entryPath} (${ENTRY_TEXT.length} characters, verified).`);

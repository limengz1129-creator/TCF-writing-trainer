# TCF speech-flow training

The training data is extracted only from the live `tache2/` and `eo-tache3-corpus/` primary oral pages. `speech-flow-audit.json` records the input script hashes and source counts. Pronunciation rules are checked against OQLF; those reference pages supply rules, never training sentences.

`extract.cjs <snapshot-directory>` reads the 28 primary scripts in page load order. Category/focus hashes identify training items; source/task/unit/sentence hashes identify original sentences. Identical chunks within a category are merged, and long-word inflections with the same oral form share a card. All original spellings and source references remain available.

The new module is number 8. Personal notes, edits, favorites, drafts and mastery/review status live on the existing `state.records[item.id]` object and are included in the existing progress export/import. Source sentences remain immutable. Review is oral self-assessment with optional text checking, not automatic speech scoring.

Audio uses local Piper `fr_FR-siwis-medium` and MP3. Existing original-corpus recordings are reused when their full text matches; missing snippets and source-filter example sentences are synthesized. Normal playback is 1x, slow playback is 0.75x with pitch preservation. User-edited text can use an available browser French voice.

Validation:

- `node tools/speech-flow/check-content.cjs` verifies exact source spans, category/ID deduplication, source URLs, both task-specific example recordings and all audio manifest entries.
- `TCF_CHROME_PATH=<path> node tools/speech-flow/check-browser.cjs` runs real desktop/mobile Chromium checks; requires Playwright and Chromium. Screenshots are temporary verification output.

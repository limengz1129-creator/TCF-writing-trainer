# 我的口语错题本

Adds module 10 to the existing `combined-expressions/` page. GitHub Pages publishing continues through the existing repository workflow.

## Source and integrity

- Excel is authoritative: all seven worksheets are retained under `rawWorkbook`.
- 1,127 canonical real-error patterns, with 1,431 linked occurrences. Every pattern's occurrence count matches the master sheet's frequency.
- All 171 original transcripts and audit rows are preserved. 170 originals contain confirmed errors; the remaining original has no confirmed-error links.
- Specialty counts follow the eight Word latest-update lists: 129 / 129 / 12 / 170 / 169 / 130 / 62 / 326.
- Word latest-update rows resolve directly to Excel master IDs. Seven additional exact matching Word fragments also reuse canonical IDs.
- 308 additional teaching items: 155 `rule_example`, 153 `training_example`. All 949 Word paragraphs and teaching tables remain available as source material.
- 430 audio uncertainties and 25 optional expression improvements are retained separately, never counted as confirmed errors. Self-corrected occurrences and one-off issues retain the Excel classifications.
- IDs remain unchanged when users edit their text. Editing does not reclassify teaching or uncertainty into historical errors.

## Shared progress

Uses `TCF-COMBINED-EXPRESSIONS-v1`, the existing `records`, `rec()` and `persist()` functions. New progress sits under each canonical record's `oral` property. Existing unrelated records remain intact. Existing export/import includes notes, edits, favorites, counters and review dates.

All four entrances use the same canonical record. Oral review prioritizes marked weak items, recent wrong answers, due dates, favorites and unmastered frequent patterns. Correct/incorrect self-assessments also update the existing counters and error list.

## Build and checks

Put the eight Word files and the master Excel in one directory:

```bash
python tools/oral-errors/build.py --input /path/to/source-files
TCF_CHROME_PATH=/path/to/chromium node tools/oral-errors/check-browser.cjs
```

Python dependencies: `python-docx`, `openpyxl`. Browser check: `playwright` and Chromium. The check creates its own local HTTP server and uses disposable browser state.

`qa-report.json` records the browser checks. Desktop and 390px mobile layouts were inspected. The existing `tools/c1-grammar/check-browser.cjs` regression also passed.

French speech follows the existing C1 module's browser TTS approach: fr-FR, then fr-CA, then another French voice. There is no English voice fallback. Automated speech checks use a mocked engine, including the missing-French-voice path; audible output depends on a French voice installed on the user's device.

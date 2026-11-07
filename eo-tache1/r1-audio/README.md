# TCF Canada oral Tâche 1 — R1 Piper audio

The 144 vocabulary / phrase entries in R1 use **Piper fr_FR-siwis-medium**. Audio is pre-generated, not synthesized in the browser. Each displayed French entry is matched **exactly** to a target in `manifest.json`. An entry without an audio target shows an informative error; it never switches to a different speech engine.

- Source list: `terms.json` (144 unique original phrases; generated from the R1 text)
- Generation program: `../../tools/piper/t1-r1/generate.py`
- GitHub Actions: `../../.github/workflows/generate-t1-r1-piper.yml`
- Generated files: `manifest.json` and `pack-*.json`
- Playback: the `eo-tache1/index.html` R1 section has individual listen buttons, one HTML audio player, and playback-rate controls.
- Voice source: https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium
- Piper: https://github.com/OHF-Voice/piper1-gpl
- SIWIS voice dataset: https://datashare.is.ed.ac.uk/handle/10283/2353 (CC BY 4.0)

The output contains MP3 audio in base64 JSON pack entries and whole-phrase timestamps. It does **not** claim word-level alignment. The general T1 answers and R2 sentence patterns remain text-only.

To regenerate after editing the R1 phrases, synchronize `terms.json` with R1, then run the workflow. Do not publish a modified entry without matching exact audio.

Audio published for all 144 exact R1 targets, with two JSON packs. The R1 web page uses the local pre-generated manifest and validates exact text equality before playing.

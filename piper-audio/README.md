# Shared Piper French audio

Ten practice pages use `/piper-player.js`; the combined expressions page keeps its original Piper player and packs. This directory adds the missing audio and links reused recordings from `../combined-expressions/piper-audio/`.

Voice: **fr_FR-siwis-medium**, 22,050 Hz, one French voice. Audio is pre-generated with Piper; playback needs no paid API, API key, microphone, or browser speech voice. Packs contain MP3 audio plus timings. A target maps to one or more original paragraphs, preserving all source text and joining full manuscripts as a playlist.

Sources and attribution:
- Piper engine: https://github.com/OHF-Voice/piper1-gpl
- Voice model: https://huggingface.co/rhasspy/piper-voices/tree/main/fr/fr_FR/siwis/medium
- SIWIS French Speech Synthesis Database: https://datashare.is.ed.ac.uk/handle/10283/2353 (CC BY 4.0). Voice and recordings derived from this dataset.

Highlighting uses phoneme duration alignment. Where token alignment cannot be established reliably, playback explicitly uses whole-phrase highlighting instead of guessed word timings. Whole manuscripts play paragraph by paragraph; speed and native seek/pause controls apply to the current paragraph.

## Rebuild

Scripts are in `tools/piper/all/`. `collect.cjs` consumes a `source/` snapshot with repository paths encoded by replacing `/` with `__` and writes `catalog.json`. `generate.py` expects that catalog, the previous combined packs at `../piper-build/packs/`, and the aligned SIWIS ONNX model and matching config at `../piper-build/aligned.onnx` and `aligned.onnx.json`. The aligned model preserves original weights and exposes FLOAT [1,1,None] `/Ceil_output_0` as a second graph output for phoneme durations. Install piper-tts, onnxruntime and ffmpeg. Generation is Linux-only and requires libseccomp to deny networking before loading inference dependencies.

Run `node collect.cjs`, `python3 generate.py`, `python3 upgrade-alignment.py`, then `python3 generate.py` again to repack updated timings. Cache files are reusable. Publish the resulting `packs/` contents here. Refresh source snapshots when source expressions change.

#!/usr/bin/env python3
"""Generate every distinct T2 transformation sample using Piper SIWIS, offline at playback."""
import hashlib
import json
import os
import pathlib
import re
import subprocess
import tempfile
import wave

from piper import PiperVoice

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / "combined-expressions/t2-transform-data.js"
OUTPUT = ROOT / "combined-expressions/t2-transform-audio"
MODEL = pathlib.Path(os.environ.get("PIPER_MODEL", "/tmp/fr_FR-siwis-medium.onnx"))
CONFIG = pathlib.Path(str(MODEL) + ".json")

# Extract this JSON literal only. No evaluation of repository JavaScript is required.
content = DATA.read_text(encoding="utf-8")
match = re.search(r"const T2_TRANSFORM_DATA=(\{.*\});\s*$", content, re.S)
if not match:
    raise RuntimeError("Cannot parse T2_TRANSFORM_DATA")
data = json.loads(match.group(1))
texts = set()
for module in data["modules"]:
    texts.update(form[2] for form in module["forms"])
    if module.get("timeline"):
        texts.update(module["timeline"].values())
if data["moduleCount"] != 45:
    raise RuntimeError(f"Expected 45 modules, got {data['moduleCount']}")
voice = PiperVoice.load(str(MODEL), config_path=str(CONFIG))
OUTPUT.mkdir(parents=True, exist_ok=True)
entries = {}
for index, text in enumerate(sorted(texts), 1):
    filename = hashlib.sha256(text.encode("utf-8")).hexdigest()[:20] + ".mp3"
    target = OUTPUT / filename
    if not target.exists() or target.stat().st_size < 256:
        with tempfile.TemporaryDirectory() as temp:
            wav_path = pathlib.Path(temp) / "speech.wav"
            with wave.open(str(wav_path), "wb") as wav:
                voice.synthesize_wav(text, wav)
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav_path), "-codec:a", "libmp3lame", "-qscale:a", "4", str(target)], check=True)
    entries[text] = filename
    print(f"{index}/{len(texts)} {filename}", flush=True)
manifest = {"voice": "fr_FR-siwis-medium", "count": len(entries), "entries": entries}
(OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Generated {len(entries)} unique Piper recordings")

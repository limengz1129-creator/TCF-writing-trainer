#!/usr/bin/env python3
"""Generate one resumable 100-item T3 Piper batch and update the cumulative manifest."""
import base64
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice

root = Path(__file__).resolve().parents[2]
source = (root / "eo-tache3-corpus/argument-map.js").read_text(encoding="utf-8")
start = source.index("const TOPICS=") + len("const TOPICS=")
topics, _ = json.JSONDecoder().raw_decode(source[start:])

def phrases_in(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "words" and isinstance(v, list):
                for pair in v:
                    if isinstance(pair, list) and len(pair) >= 2 and isinstance(pair[0], str):
                        yield pair[0]
            else:
                yield from phrases_in(v)
    elif isinstance(obj, list):
        for value in obj:
            yield from phrases_in(value)

phrases = sorted(set(phrases_in(topics)))
assert len(phrases) == 1549, f"Source changed: {len(phrases)} phrases; review before generating"
batch = int(sys.argv[1]) if len(sys.argv) > 1 else 0
total_batches = (len(phrases) + 99) // 100
if not 0 <= batch < total_batches:
    raise SystemExit(f"Batch must be 0..{total_batches-1}")
offset = batch * 100
selected = phrases[offset:offset+100]
dest = root / "eo-tache3-corpus/argument-audio"
dest.mkdir(parents=True, exist_ok=True)
pack_name = f"pack-{batch:03}.json"
pack_path = dest / pack_name
manifest_path = dest / "manifest.json"

if pack_path.exists():
    pack = json.loads(pack_path.read_text(encoding="utf-8"))
    if len(pack) != len(selected) or any(pack.get(str(i), {}).get("text") != phrase or not pack[str(i)].get("audio") for i, phrase in enumerate(selected)):
        raise SystemExit(f"Existing {pack_name} is incomplete or mismatched; refusing overwrite")
    print(f"Batch {batch+1}/{total_batches} already generated; reusing", flush=True)
else:
    model = Path("/tmp/fr_FR-siwis-medium.onnx")
    if not model.exists():
        raise SystemExit("Missing Piper model")
    print(f"Generating batch {batch+1}/{total_batches}: items {offset+1}..{offset+len(selected)}", flush=True)
    voice = PiperVoice.load(str(model))
    pack = {}
    with tempfile.TemporaryDirectory() as tmp:
        for i, phrase in enumerate(selected):
            wav = Path(tmp) / "voice.wav"
            mp3 = Path(tmp) / "voice.mp3"
            try:
                with wave.open(str(wav), "wb") as f:
                    voice.synthesize_wav(phrase, f)
                subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "5", str(mp3)], check=True)
                audio = base64.b64encode(mp3.read_bytes()).decode("ascii")
                if not audio:
                    raise ValueError("Empty MP3")
                pack[str(i)] = {"text": phrase, "audio": audio}
            except Exception as exc:
                raise RuntimeError(f"Batch {batch}, item {offset+i+1}: {phrase!r}") from exc
            if (i+1) % 20 == 0:
                print(f"Batch {batch+1}: {i+1}/{len(selected)} complete", flush=True)
    pack_path.write_text(json.dumps(pack, ensure_ascii=False), encoding="utf-8")
    print(f"Saved {pack_name}", flush=True)

manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"voice": "fr_FR-siwis-medium", "entries": {}}
entries = manifest.setdefault("entries", {})
for i, phrase in enumerate(selected):
    entries[phrase] = {"pack": pack_name, "id": str(i)}
manifest["voice"] = "fr_FR-siwis-medium"
manifest["count"] = len(entries)
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")
assert all((dest / item["pack"]).exists() for item in entries.values())
print(f"Committed-ready coverage: {len(entries)}/{len(phrases)}", flush=True)

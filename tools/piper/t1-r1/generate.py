#!/usr/bin/env python3
"""Build Piper siwis recordings for all R1 vocabulary terms, preserving exact source text."""
import argparse
import base64
import hashlib
import json
import subprocess
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice

ROOT = Path(__file__).resolve().parents[3]
DIR = ROOT / "eo-tache1" / "r1-audio"
TERMS = DIR / "terms.json"

def audio_record(voice, term):
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "speech.wav"
        mp3 = Path(td) / "speech.mp3"
        with wave.open(str(wav), "wb") as wf:
            voice.synthesize_wav(term, wf)
        with wave.open(str(wav), "rb") as wf:
            seconds = wf.getnframes() / wf.getframerate()
        subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-y",
                        "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "48k",
                        str(mp3)], check=True)
        payload = base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text": term, "audio": payload, "duration": round(seconds, 3),
            "timing": [{"start": 0, "end": round(seconds, 3),
                        "from": 0, "to": len(term)}], "alignment": "phrase"}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    args = parser.parse_args()
    spec = json.loads(TERMS.read_text(encoding="utf-8"))
    terms = spec["terms"]
    if spec.get("voice") != "fr_FR-siwis-medium" or len(terms) != 144 or len(terms) != len(set(terms)):
        raise RuntimeError("R1 terms list must contain 144 unique entries")
    DIR.mkdir(parents=True, exist_ok=True)
    manifest_path = DIR / "manifest.json"
    if manifest_path.exists():
        try:
            current = json.loads(manifest_path.read_text(encoding="utf-8"))
            cache = {}
            for term in terms:
                ref = current["targets"][term][0]
                rec = current["records"][ref["id"]]
                if rec["pack"] not in cache:
                    cache[rec["pack"]] = json.loads((DIR / rec["pack"]).read_text(encoding="utf-8"))
                item = cache[rec["pack"]][rec["id"]]
                if item["text"] != term or not base64.b64decode(item["audio"], validate=True):
                    raise ValueError("Audio mismatch")
            if current["count"] == len(terms):
                print("All 144 Piper R1 tracks verified; nothing to regenerate.")
                return
        except (KeyError, ValueError, OSError, TypeError):
            print("Rebuilding incomplete R1 audio index")
    voice = PiperVoice.load(args.model)
    records, targets = {}, {}
    pack = {}
    pack_number = 0
    pack_size = 0
    def flush():
        nonlocal pack, pack_number, pack_size
        if not pack:
            return
        name = f"pack-{pack_number:03}.json"
        (DIR / name).write_text(json.dumps(pack, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        for ident in pack:
            records[ident] = {"pack": name, "id": ident}
        pack_number += 1
        pack = {}
        pack_size = 0
    for i, term in enumerate(terms, 1):
        ident = "t1-r1-" + hashlib.sha256(term.encode("utf-8")).hexdigest()[:16]
        item = audio_record(voice, term)
        encoded = json.dumps(item, ensure_ascii=False, separators=(",", ":"))
        if pack and pack_size + len(encoded) > 1200000:
            flush()
        pack[ident] = item
        pack_size += len(encoded)
        targets[term] = [{"id": ident, "offset": 0}]
        if i % 20 == 0 or i == len(terms):
            print(f"Generated {i}/{len(terms)}")
    flush()
    manifest = {"voice": "fr_FR-siwis-medium", "version": 1, "count": len(terms),
                "records": records, "targets": targets}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    # Confirm each entry links to the exact rendered source before publishing.
    packs = {}
    for term in terms:
        entry = manifest["targets"][term][0]
        rec = manifest["records"][entry["id"]]
        packs.setdefault(rec["pack"], json.loads((DIR / rec["pack"]).read_text(encoding="utf-8")))
        assert packs[rec["pack"]][rec["id"]]["text"] == term
    print(f"Validated {len(terms)} exact tracks across {pack_number} packs")

if __name__ == "__main__":
    main()

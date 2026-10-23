#!/usr/bin/env python3
"""Generate and verify all BonTCF-04 C1 playback targets."""
import base64
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "eo-tache3-corpus/bontcf-t3-supplements.js"
OUT = ROOT / "eo-tache3-corpus/c1-career-audio"

def targets():
    raw = DATA.read_text(encoding="utf-8")
    item = json.loads(raw.split("=", 1)[1].strip().rstrip(";"))[3]
    assert item["topic"] == "职业与职场" and item["scene"] == "运动员薪酬的商业来源"
    # UI plays core, every vocabulary entry, split logic-chain nodes, and each sentence.
    phrases = [item["core"]]
    phrases += [word[0] for word in item["words"]]
    phrases += [node.strip() for node in item["logic"]]
    phrases += [phrase for phrase, _ in item["paragraphs"]]
    return list(dict.fromkeys(phrases))

def verify():
    entries = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))["entries"]
    for phrase in targets():
        assert phrase in entries, f"Missing BonTCF-04 audio index: {phrase}"
        ref = entries[phrase]
        pack = json.loads((OUT / ref["pack"]).read_text(encoding="utf-8"))
        clip = pack[ref["id"]]
        assert clip["text"] == phrase, f"Piper text mismatch: {phrase}"
        data = base64.b64decode(clip["audio"], validate=True)
        assert data[:3] == b"ID3" or data[:2] in (bytes.fromhex("fffb"),bytes.fromhex("fff3"),bytes.fromhex("fff2"))
        assert len(data) > 200, f"Empty audio for {phrase}"
    print("PASS: all BonTCF-04 core, vocabulary, logic-chain and sentence clips have validated Piper MP3", flush=True)

def generate(model):
    from piper import PiperVoice
    path = OUT / "manifest.json"
    catalog = json.loads(path.read_text(encoding="utf-8"))
    missing = [phrase for phrase in targets() if phrase not in catalog["entries"]]
    if missing:
        voice = PiperVoice.load(model)
        pack = {}
        # A new unique pack name prevents overwriting packs from a previous deployment.
        for index, phrase in enumerate(missing):
            pcm = b"".join(chunk.audio_int16_bytes for chunk in voice.synthesize(phrase))
            assert pcm, phrase
            mp3 = subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "s16le",
                "-ar", str(voice.config.sample_rate), "-ac", "1", "-i", "pipe:0",
                "-codec:a", "libmp3lame", "-b:a", "48k", "-f", "mp3", "pipe:1"
            ], input=pcm, capture_output=True, check=True).stdout
            assert mp3, phrase
            key = f"bontcf04_extra_{index}"
            pack[key] = {"text": phrase, "audio": base64.b64encode(mp3).decode("ascii")}
            catalog["entries"][phrase] = {"pack": "pack-bontcf04-extra.json", "id": key}
        (OUT / "pack-bontcf04-extra.json").write_text(
            json.dumps(pack, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        path.write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    verify()

if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "verify":
        verify()
    elif len(sys.argv) == 3 and sys.argv[1] == "generate":
        generate(sys.argv[2])
    else:
        raise SystemExit("Usage: python tools/piper/bontcf04_audio.py generate MODEL | verify")

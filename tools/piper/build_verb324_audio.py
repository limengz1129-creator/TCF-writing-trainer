#!/usr/bin/env python3
"""Create Piper audio for C1 additions (306–324) in the Pages build artifact."""
import base64
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path("combined-expressions/verb120/preposition")
MANIFEST = ROOT / "piper-audio/manifest.json"
MODEL = Path("/tmp/fr_FR-siwis-medium.onnx")

def spoken(text):
    return text.replace("qch", "quelque chose").replace("qn", "quelqu'un").strip()

def main():
    rows = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
    assert len(rows) == 324 and [r["id"] for r in rows] == list(range(1, 325))
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    pack = {}
    for row in rows[305:]:
        for original in (row["pattern"], row["example"]):
            phrase = spoken(original)
            if phrase in entries["targets"]:
                continue
            key = hashlib.sha1(phrase.encode("utf-8")).hexdigest()[:20]
            with tempfile.TemporaryDirectory() as td:
                wav = Path(td) / "a.wav"
                mp3 = Path(td) / "a.mp3"
                subprocess.run(["python3", "-m", "piper", "--model", str(MODEL), "--output_file", str(wav)], input=phrase+"\n", text=True, check=True, stdout=subprocess.DEVNULL)
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-qscale:a", "5", str(mp3)], check=True)
                audio = base64.b64encode(mp3.read_bytes()).decode("ascii")
            pack[key] = {"text": phrase, "audio": audio}
            entries["targets"][phrase] = [{"id": key, "offset": 0}]
            entries["records"][key] = {"id": key, "pack": "pack-c1-324.json"}
    out = ROOT / "piper-audio/pack-c1-324.json"
    out.write_text(json.dumps(pack, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    entries["count"] = len(entries["targets"])
    MANIFEST.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    allpacks = {}
    for row in rows[305:]:
        for original in (row["pattern"], row["example"]):
            phrase = spoken(original)
            ref = entries["targets"].get(phrase)
            assert ref, f"Missing index: {phrase}"
            record = entries["records"][ref[0]["id"]]
            path = ROOT / "piper-audio" / record["pack"]
            if path not in allpacks:
                allpacks[path] = json.loads(path.read_text(encoding="utf-8"))
            assert allpacks[path][record["id"]]["text"] == phrase
            assert allpacks[path][record["id"]]["audio"]
    print(f"PASS: 324 entries, all 38 C1 audio targets indexed; created {len(pack)} new recordings")

if __name__ == "__main__":
    main()

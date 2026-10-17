#!/usr/bin/env python3
"""Audit example-card Piper MP3 assets against exact static manifest keys."""
import base64
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[2]
area = root / "eo-tache3-corpus"
script = (area / "example-cards.js").read_text(encoding="utf-8")
match = re.search(r"window\.TCF_T3_EXAMPLES=(\{.*\});\s*$", script, re.S)
assert match, "Missing example-card data"
cards = json.loads(match.group(1))
assert len(cards) == 96, f"Expected 96 cards, got {len(cards)}"
manifest = json.loads((area / "argument-audio/manifest.json").read_text(encoding="utf-8"))
words = {w[0] for c in cards.values() for w in c["words"]}
packs = {}
for text in words:
    entry = manifest["entries"].get(text)
    assert entry, f"Missing manifest key: {text}"
    packs.setdefault(entry["pack"], []).append((text, str(entry["id"])))
count = 0
for name, entries in sorted(packs.items()):
    pack = json.loads((area / "argument-audio" / name).read_text(encoding="utf-8"))
    for text, ident in entries:
        record = pack.get(ident)
        assert record and record.get("text") == text, f"Text mismatch: {name}:{ident}"
        audio = base64.b64decode(record["audio"], validate=True)
        assert len(audio) > 100 and (audio.startswith(b"ID3") or audio[:2] in tuple(bytes.fromhex(h) for h in ("fffb","fff3","fff2"))), f"Bad MP3 header: {name}:{ident}"
        count += 1
print(f"PASS: {len(cards)} cards; {count} distinct audio records in {len(packs)} packs")

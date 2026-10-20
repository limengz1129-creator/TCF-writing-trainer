#!/usr/bin/env python3
"""Validate every Piper audio reference and encoded MP3 payload in EO Tache 3."""
import base64
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "eo-tache3-corpus"
DIRS = (
    "argument", "chain", "example", "overview", "career", "travel-vocab",
    "education", "media", "tech", "health", "environment", "social", "family",
)
errors = []
totals = {"groups": 0, "packs": 0, "clips": 0}

for topic in DIRS:
    folder = ROOT / (topic + "-audio")
    try:
        manifest = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        errors.append(f"{topic}: manifest missing/invalid: {exc}")
        continue
    if manifest.get("voice") != "fr_FR-siwis-medium":
        errors.append(f"{topic}: wrong Piper voice")
    entries = manifest.get("entries")
    if not isinstance(entries, dict):
        errors.append(f"{topic}: invalid entries map")
        continue
    totals["groups"] += 1
    packs = {}
    for text, ref in entries.items():
        if not isinstance(ref, dict) or not isinstance(ref.get("pack"), str) or ref.get("id") is None:
            errors.append(f"{topic}: malformed reference for {text[:50]!r}")
            continue
        packs.setdefault(ref["pack"], []).append((text, str(ref["id"])))
    for pack_name, refs in packs.items():
        if "/" in pack_name or "\\" in pack_name or not pack_name.endswith(".json"):
            errors.append(f"{topic}: unsafe pack name {pack_name!r}")
            continue
        try:
            pack = json.loads((folder / pack_name).read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            errors.append(f"{topic}/{pack_name}: missing/invalid: {exc}")
            continue
        totals["packs"] += 1
        referenced_ids = set()
        for text, clip_id in refs:
            if clip_id in referenced_ids:
                errors.append(f"{topic}/{pack_name}: duplicate clip id {clip_id}")
            referenced_ids.add(clip_id)
            clip = pack.get(clip_id)
            if not isinstance(clip, dict) or clip.get("text") != text:
                errors.append(f"{topic}/{pack_name}#{clip_id}: missing/mismatched text")
                continue
            try:
                raw = base64.b64decode(clip["audio"], validate=True)
            except (KeyError, TypeError, ValueError, base64.binascii.Error):
                errors.append(f"{topic}/{pack_name}#{clip_id}: invalid base64 audio")
                continue
            if len(raw) < 100 or not (raw.startswith(b"ID3") or raw[:2] in (bytes.fromhex("fffb"), bytes.fromhex("fff3"), bytes.fromhex("fff2"))):
                errors.append(f"{topic}/{pack_name}#{clip_id}: invalid/empty MP3 header")
                continue
            totals["clips"] += 1
        extra = set(pack) - referenced_ids
        if extra:
            errors.append(f"{topic}/{pack_name}: {len(extra)} unreferenced clips")
    print(f"{topic}: {len(entries)} indexed entries; {len(packs)} pack references")

print(f"TOTAL: {totals['groups']} groups; {totals['packs']} packs; {totals['clips']} valid clips; {len(errors)} errors")
for error in errors:
    print("ERROR:", error, file=sys.stderr)
sys.exit(1 if errors else 0)

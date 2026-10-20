#!/usr/bin/env python3
"""Smoke-test published GitHub Pages EO audio assets via HTTP."""
import json
import sys
import time
import urllib.error
import urllib.request

BASE = "https://limengz1129-creator.github.io/TCF-writing-trainer/eo-tache3-corpus/"
GROUPS = ("argument", "chain", "example", "overview", "career", "travel-vocab",
          "education", "media", "tech", "health", "environment", "social", "family")
ERRORS = []

def get(path):
    url = BASE + path
    last_error = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "TCF-Piper-Pages-Audit/1.0", "Cache-Control": "no-cache"})
            with urllib.request.urlopen(req, timeout=25) as response:
                data = response.read()
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}")
                return data
        except (urllib.error.URLError, OSError, RuntimeError) as exc:
            last_error = str(exc)
            if attempt < 3:
                time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"{path}: {last_error}")

try:
    page = get("index.html")
    if b"argument-map-c1-frfirst.js" not in page:
        ERRORS.append("Published EO page is missing current C1 argument-map script")
    print(f"PASS published EO index.html ({len(page)} bytes)")
except Exception as exc:
    ERRORS.append(str(exc))

for group in GROUPS:
    directory = group + "-audio/"
    try:
        manifest = json.loads(get(directory + "manifest.json"))
        entries = manifest["entries"]
        if manifest.get("voice") != "fr_FR-siwis-medium":
            ERRORS.append(f"{group}: unexpected voice")
        packs = sorted(set(item["pack"] for item in entries.values()))
        if not packs:
            ERRORS.append(f"{group}: empty index")
            continue
        for pack_name in packs:
            pack = json.loads(get(directory + pack_name))
            expected = [(text, str(ref["id"])) for text, ref in entries.items() if ref["pack"] == pack_name]
            for text, clip_id in expected:
                clip = pack.get(clip_id)
                if not clip or clip.get("text") != text or not clip.get("audio"):
                    ERRORS.append(f"{group}/{pack_name}#{clip_id}: missing or mismatched published clip")
        print(f"PASS {group}: {len(entries)} indexed clips, {len(packs)} published packs")
    except Exception as exc:
        ERRORS.append(f"{group}: {exc}")
try:
    tech = json.loads(get("tech-audio/pack-1012.json"))
    assert tech["0"]["text"].startswith("La supervision parentale")
    print("PASS restored technology sentence in published audio")
except Exception as exc:
    ERRORS.append(f"restored technology sentence: {exc}")

for err in ERRORS:
    print("FAIL:", err, file=sys.stderr)
print(f"Pages smoke test: {len(GROUPS)} groups checked; {len(ERRORS)} errors")
sys.exit(1 if ERRORS else 0)

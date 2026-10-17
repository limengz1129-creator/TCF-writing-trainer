#!/usr/bin/env python3
"""Scope-only validation of Career & Workplace T3 Piper audio and data."""
import base64,json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
code=(root/"argument-map.js").read_text(encoding="utf-8")
topics,_=json.JSONDecoder().raw_decode(code[code.index("const TOPICS=")+len("const TOPICS="):])
career=topics["职业与职场"]
scene_total=sum(len(m["scenes"]) for m in career["M"].values())
assert len(career["M"])==26 and scene_total==67
match=re.search(r"const CAREER_SCENE_SUMMARIES=(\{.*?\});",code)
assert match,"Career summaries absent"
summaries=json.loads(match.group(1))
assert len(summaries)==26 and sum(map(len,summaries.values()))==67
for key,m in career["M"].items(): assert len(summaries[key])==len(m["scenes"])
text=(root/"career-example-cards.js").read_text(encoding="utf-8")
cards=json.loads(text.split("window.TCF_T3_CAREER_EXAMPLES=",1)[1].rsplit(";",1)[0])
assert len(cards)==75
referenced={id for m in career["M"].values() for s in m["scenes"] for id in s["sourceIds"]}
assert referenced==set(cards),f"Unmatched sources: {referenced^set(cards)}"
phrases={p.strip() for m in career["M"].values() for line in [m["fr"],*[s["fr"] for s in m["scenes"]]] for p in line.split("→")}
phrases.update(p.strip() for c in cards.values() for p in c["fr"].split("→"))
phrases.update(fr for c in cards.values() for fr,_ in c["words"])
phrases.update(fr for m in career["M"].values() for s in m["scenes"] for fr,_ in s["words"])
dirs=("argument-audio","chain-audio","example-audio","overview-audio","career-audio")
indexes={}
for folder in dirs:
    d=root/folder
    entries=json.loads((d/"manifest.json").read_text(encoding="utf-8"))["entries"]
    for phrase in phrases & entries.keys():
        indexes.setdefault(phrase,(d,entries[phrase]))
missing=phrases-indexes.keys()
assert not missing,f"Missing Piper source: {sorted(missing)[:20]}"
packs={}
for phrase in sorted(phrases):
    d,entry=indexes[phrase]
    key=(str(d),entry["pack"])
    if key not in packs:packs[key]=json.loads((d/entry["pack"]).read_text(encoding="utf-8"))
    record=packs[key].get(str(entry["id"]))
    assert record and record["text"]==phrase,f"Text mismatch: {phrase}"
    audio=base64.b64decode(record["audio"],validate=True)
    assert len(audio)>100 and (audio.startswith(b"ID3") or audio[:2] in [bytes.fromhex(i) for i in ("fffb","fff3","fff2")]),f"Invalid MP3: {phrase}"
print(f"PASS career: {len(cards)} source examples, {scene_total} scenes, {len(phrases)} Piper phrase/word entries, {len(packs)} packs")

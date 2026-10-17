#!/usr/bin/env python3
"""Audit media and culture T3 source, scenes and Piper audio files."""
import base64,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
topics,_=json.JSONDecoder().raw_decode((lambda x:x[x.index("const TOPICS=")+len("const TOPICS="):])((root/"argument-map.js").read_text(encoding="utf-8")))
topic=topics["媒体与文化"]
raw=(root/"media-example-cards.js").read_text(encoding="utf-8")
cards=json.loads(raw.split("window.TCF_T3_MEDIA_EXAMPLES=",1)[1].rsplit(";",1)[0])
src=json.loads((root/"data-4.js").read_text(encoding="utf-8").split("CORPUS.push(...",1)[1].rsplit(");",1)[0])
sources={p["id"]:p["fr"] for p in src}
refs={pid for m in topic["M"].values() for scene in m["scenes"] for pid in scene["sourceIds"]}
assert len(cards)==len(sources)==42 and set(cards)==set(sources)==refs
assert len(topic["M"])==15 and sum(len(m["scenes"]) for m in topic["M"].values())==39
for id,card in cards.items():
    assert card["fr"] and "…" not in card["fr"],id
    assert card["words"],id
    for text,zh in card["words"]:
        assert zh and "待人工" not in zh and text.casefold() in sources[id].casefold(),(id,text)
phrases={x.strip() for m in topic["M"].values() for chain in [m["fr"],*[s["fr"] for s in m["scenes"]]] for x in chain.split("→")}
phrases.update(x.strip() for c in cards.values() for x in c["fr"].split("→"))
phrases.update(f for c in cards.values() for f,_ in c["words"])
dirs=("argument-audio","chain-audio","example-audio","overview-audio","career-audio","travel-vocab-audio","education-audio","media-audio")
indexes=[]
for name in dirs:
    path=root/name
    entries=json.loads((path/"manifest.json").read_text(encoding="utf-8"))["entries"]
    indexes.append((path,entries))
packs={}
for phrase in phrases:
    choice=next(((p,v[phrase]) for p,v in indexes if phrase in v),None)
    assert choice is not None, f'Missing audio index {phrase}'
    path,entry=choice
    file=path/entry["pack"]
    if str(file) not in packs:packs[str(file)]=json.loads(file.read_text(encoding="utf-8"))
    rec=packs[str(file)].get(str(entry["id"]))
    assert rec and rec["text"]==phrase,phrase
    audio=base64.b64decode(rec["audio"],validate=True)
    assert len(audio)>100 and (audio.startswith(b"ID3") or audio[:2] in (bytes.fromhex("fffb"),bytes.fromhex("fff3"),bytes.fromhex("fff2"))),phrase
print(f"PASS: 42 media cards, 39 scene chains, {len(phrases)} Piper chunks, {len(packs)} packs")



# Rechecked after the generated media MP3 packs were committed.

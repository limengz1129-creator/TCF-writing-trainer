#!/usr/bin/env python3
"""Validate family and relationships source, scene references and static Piper packs."""
import base64,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
text=(root/"argument-map.js").read_text(encoding="utf-8")
topics,_=json.JSONDecoder().raw_decode(text.split("const TOPICS=",1)[1])
topic=topics["家庭与人际"]
cards=json.loads((root/"family-example-cards.js").read_text(encoding="utf-8").split("window.TCF_T3_FAMILY_EXAMPLES=",1)[1].rsplit(";",1)[0])
sources=json.loads((root/"data-9.js").read_text(encoding="utf-8").split("CORPUS.push(...",1)[1].rsplit(");",1)[0])
src={r["id"]:r for r in sources}
refs={pid for m in topic["M"].values() for s in m["scenes"] for pid in s["sourceIds"]}
assert len(cards)==len(src)==27 and set(cards)==set(src)==refs
assert len(topic["M"])==10
assert 'family-example-cards.js' in (root/"index.html").read_text(encoding="utf-8")
assert sum(len(m["scenes"]) for m in topic["M"].values())==26
for id,card in cards.items():
    assert card["zh"]==src[id]["summary"],id
    assert card["words"],id
    assert all("原文情境表达" not in zh and len(zh)>=2 for _,zh in card["words"]),id
    for fr,zh in card["words"]:
        assert fr and zh and fr.casefold() in src[id]["fr"].casefold(),(id,fr)
    for chunk in card["fr"].split("→"):
        assert chunk.strip().casefold() in src[id]["fr"].casefold(),(id,chunk)
phrases={p.strip() for m in topic["M"].values() for chain in [m["fr"],*[s["fr"] for s in m["scenes"]]] for p in chain.split("→")}
phrases.update(p.strip() for card in cards.values() for p in card["fr"].split("→"))
phrases.update(fr for card in cards.values() for fr,_ in card["words"])
phrases.update(fr for m in topic["M"].values() for sc in m["scenes"] for fr,_ in sc["words"])
phrases.update(fr for m in topic["M"].values() for fr,_ in m.get("w",[]))
indexes=[]
for d in ("argument-audio","chain-audio","example-audio","overview-audio","career-audio","travel-vocab-audio","education-audio","media-audio","tech-audio","health-audio","environment-audio","social-audio","family-audio"):
    path=root/d
    entries=json.loads((path/"manifest.json").read_text(encoding="utf-8"))["entries"]
    indexes.append((path,entries))
packs={}
for phrase in phrases:
    chosen=next(((rootpath,idx[phrase]) for rootpath,idx in indexes if phrase in idx),None)
    assert chosen is not None,"missing Piper index: "+phrase
    folder,entry=chosen
    path=folder/entry["pack"]
    if path not in packs:packs[path]=json.loads(path.read_text(encoding="utf-8"))
    item=packs[path].get(str(entry["id"]))
    assert item and item["text"]==phrase,phrase
    audio=base64.b64decode(item["audio"],validate=True)
    assert len(audio)>100 and (audio.startswith(b"ID3") or audio[:2] in (bytes.fromhex("fffb"),bytes.fromhex("fff3"),bytes.fromhex("fff2"))),phrase
print(f"PASS: 27 source-grounded cards, 10 mothers, {len(phrases)} Piper phrases, {len(packs)} packs")

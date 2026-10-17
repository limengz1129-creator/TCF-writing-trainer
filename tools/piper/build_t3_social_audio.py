#!/usr/bin/env python3
"""Generate Piper fr_FR-siwis-medium MP3 recordings for social and public affairs argument scenes/cards."""
import base64,json,re,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
text=(root/"argument-map.js").read_text(encoding="utf-8")
topics,_=json.JSONDecoder().raw_decode(text.split("const TOPICS=",1)[1])
topic=topics["社会与公共事务"]
cards=json.loads((root/"social-example-cards.js").read_text(encoding="utf-8").split("window.TCF_T3_SOCIAL_EXAMPLES=",1)[1].rsplit(";",1)[0])
assert len(cards)==45
phrases={p.strip() for m in topic["M"].values() for chain in [m["fr"],*[s["fr"] for s in m["scenes"]]] for p in chain.split("→")}
phrases.update(p.strip() for card in cards.values() for p in card["fr"].split("→"))
phrases.update(fr for card in cards.values() for fr,_ in card["words"])
phrases.update(fr for m in topic["M"].values() for sc in m["scenes"] for fr,_ in sc["words"])
phrases.update(fr for m in topic["M"].values() for fr,_ in m.get("w",[]))
old=[]
for d in ("argument-audio","chain-audio","example-audio","overview-audio","career-audio","travel-vocab-audio","education-audio","media-audio","tech-audio","health-audio","environment-audio"):
    old.append(json.loads((root/d/"manifest.json").read_text(encoding="utf-8"))["entries"])
dest=root/"social-audio"
dest.mkdir(exist_ok=True)
mf=dest/"manifest.json"
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
missing=sorted(p for p in phrases if p and not any(p in index for index in old) and p not in manifest["entries"])
voice=None
start=len(list(dest.glob("pack-*.json")))
for batch in range((len(missing)+39)//40):
    chosen=missing[40*batch:40*(batch+1)]
    name=f"pack-{start+batch:03}.json"
    path=dest/name
    if voice is None:voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
    with tempfile.TemporaryDirectory() as tmp:
        wav=Path(tmp)/"voice.wav"
        mp3=Path(tmp)/"voice.mp3"
        pack={}
        for i,phrase in enumerate(chosen):
            with wave.open(str(wav),"wb") as f:voice.synthesize_wav(phrase,f)
            subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
            pack[str(i)]={"text":phrase,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
    path.write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
    for i,phrase in enumerate(chosen):manifest["entries"][phrase]={"pack":name,"id":str(i)}
    manifest["count"]=len(manifest["entries"])
    mf.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
    print(f"Completed {batch+1}: {len(chosen)} recordings",flush=True)
assert all(any(p in idx for idx in old) or p in manifest["entries"] for p in phrases)
print(f"PASS: {len(phrases)} phrases; {len(missing)} generated")

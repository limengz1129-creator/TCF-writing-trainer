#!/usr/bin/env python3
"""Generate all missing Piper siwis recordings for career mother, scene and example chains."""
import base64,json,re,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice

root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
maptext=(root/"argument-map.js").read_text(encoding="utf-8")
topics,_=json.JSONDecoder().raw_decode(maptext[maptext.index("const TOPICS=")+len("const TOPICS="):])
topic=topics["职业与职场"]
data=(root/"career-example-cards.js").read_text(encoding="utf-8")
cards=json.loads(re.search(r"window.TCF_T3_CAREER_EXAMPLES=(\{.*\});\s*$",data,re.S).group(1))
assert len(cards)==75
chunks={p.strip() for m in topic["M"].values() for chain in [m["fr"],*[s["fr"] for s in m["scenes"]]] for p in chain.split("→")}
chunks.update(p.strip() for card in cards.values() for p in card["fr"].split("→"))
old=[json.loads((root/d/"manifest.json").read_text(encoding="utf-8"))["entries"] for d in ("argument-audio","chain-audio","example-audio","overview-audio","career-audio")]
missing=sorted(p for p in chunks if not any(p in index for index in old))
dest=root/"career-audio";dest.mkdir(exist_ok=True)
mf=dest/"manifest.json"
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
start_batch=len(list(dest.glob("pack-*.json")))
voice=None
for batch in range((len(missing)+39)//40):
    selected=missing[40*batch:40*(batch+1)];name=f"pack-{start_batch+batch:03}.json";path=dest/name
    if path.exists():
        pack=json.loads(path.read_text(encoding="utf-8"))
        assert all(pack[str(i)]["text"]==text for i,text in enumerate(selected))
    else:
        if voice is None:voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
        pack={}
        with tempfile.TemporaryDirectory() as tmp:
            wav=Path(tmp)/"voice.wav";mp3=Path(tmp)/"voice.mp3"
            for i,text in enumerate(selected):
                with wave.open(str(wav),"wb") as f:voice.synthesize_wav(text,f)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
                pack[str(i)]={"text":text,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
        path.write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
    for i,text in enumerate(selected):manifest["entries"][text]={"pack":name,"id":str(i)}
    manifest["count"]=len(manifest["entries"])
    mf.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
    print(f"Completed batch {batch+1}, {len(selected)} phrases",flush=True)
assert all(any(p in idx for idx in old) or p in manifest["entries"] for p in chunks)
print(f"PASS: {len(chunks)} unique chunks, {len(missing)} generated")

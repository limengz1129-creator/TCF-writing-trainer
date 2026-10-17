#!/usr/bin/env python3
"""Generate missing original-quotation vocabulary in Travel & Immigration example cards."""
import base64,json,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
raw=(root/"example-cards.js").read_text(encoding="utf-8")
cards=json.loads(raw.split("window.TCF_T3_EXAMPLES=",1)[1].rsplit(";",1)[0])
source=json.loads((root/"data-1.js").read_text(encoding="utf-8").split("CORPUS.push(...",1)[1].rsplit(");",1)[0])
source_by_id={x["id"]:x["fr"] for x in source}
assert len(cards)==96
existing=[]
for folder in ("argument-audio","chain-audio","example-audio","overview-audio","career-audio"):
    existing.append(json.loads((root/folder/"manifest.json").read_text(encoding="utf-8"))["entries"])
terms=set()
for pid,card in cards.items():
    for phrase,_ in card["words"]:
        assert phrase.casefold() in source_by_id[pid].casefold(),(pid,phrase)
        terms.add(phrase)
missing=sorted(t for t in terms if not any(t in idx for idx in existing))
dest=root/"travel-vocab-audio";dest.mkdir(exist_ok=True)
mf=dest/"manifest.json"
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
voice=None
for batch in range((len(missing)+39)//40):
    selected=missing[batch*40:(batch+1)*40];packname=f"pack-{batch:03}.json";path=dest/packname
    if path.exists():
        pack=json.loads(path.read_text(encoding="utf-8"))
        assert all(pack[str(i)]["text"]==p for i,p in enumerate(selected))
    else:
        if voice is None:voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
        pack={}
        with tempfile.TemporaryDirectory() as td:
            wav=Path(td)/"voice.wav";mp3=Path(td)/"voice.mp3"
            for i,p in enumerate(selected):
                with wave.open(str(wav),"wb") as f:voice.synthesize_wav(p,f)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
                pack[str(i)]={"text":p,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
        path.write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
    for i,p in enumerate(selected):manifest["entries"][p]={"pack":packname,"id":str(i)}
manifest["count"]=len(manifest["entries"])
mf.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
print(f"PASS: {len(cards)} source-verified travel cards, {len(terms)} unique phrases, {len(missing)} newly synthesized")

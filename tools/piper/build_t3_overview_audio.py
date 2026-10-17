#!/usr/bin/env python3
"""Generate missing Piper audio for T3 mother and scene overview chains."""
import base64,json,re,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
source=(root/"argument-map.js").read_text(encoding="utf-8")
topics,_=json.JSONDecoder().raw_decode(source[source.index("const TOPICS=")+len("const TOPICS="):])
travel=topics["旅行与移民"]
chunks=sorted({p.strip() for mother in travel["M"].values() for chain in [mother["fr"],*[scene["fr"] for scene in mother["scenes"]]] for p in chain.split("→")})
existing=[json.loads((root/d/"manifest.json").read_text(encoding="utf-8"))["entries"] for d in ("argument-audio","chain-audio","example-audio")]
missing=[p for p in chunks if not any(p in m for m in existing)]
dest=root/"overview-audio";dest.mkdir(exist_ok=True)
mf=dest/"manifest.json"
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
voice=None
for batch in range((len(missing)+49)//50):
    selected=missing[50*batch:50*(batch+1)]
    name=f"pack-{batch:03}.json";path=dest/name
    if path.exists():
        records=json.loads(path.read_text(encoding="utf-8"))
        assert all(records[str(i)]["text"]==term for i,term in enumerate(selected))
    else:
        if voice is None:voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
        records={}
        with tempfile.TemporaryDirectory() as tmp:
            wav=Path(tmp)/"voice.wav";mp3=Path(tmp)/"voice.mp3"
            for i,term in enumerate(selected):
                with wave.open(str(wav),"wb") as f:voice.synthesize_wav(term,f)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
                records[str(i)]={"text":term,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
        path.write_text(json.dumps(records,ensure_ascii=False),encoding="utf-8")
    for i,term in enumerate(selected):manifest["entries"][term]={"pack":name,"id":str(i)}
    manifest["count"]=len(manifest["entries"])
    mf.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
    print(f"Generated batch {batch+1}/{(len(missing)+49)//50}",flush=True)
assert all(any(p in m for m in existing) or p in manifest["entries"] for p in chunks)
print(f"PASS {len(chunks)} chunks; {len(missing)} new Piper recordings")

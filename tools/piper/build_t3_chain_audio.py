#!/usr/bin/env python3
"""Generate missing scene logic chunks as pre-recorded French Piper MP3s."""
import base64
import json
import subprocess
import tempfile
import wave
from pathlib import Path
from piper import PiperVoice

root=Path(__file__).resolve().parents[2]
base=root/"eo-tache3-corpus"
source=(base/"argument-map.js").read_text(encoding="utf-8")
data,_=json.JSONDecoder().raw_decode(source[source.index("const TOPICS=")+len("const TOPICS="):])
topic=data["旅行与移民"]
chunks=sorted({part.strip() for mother in topic["M"].values() for scene in mother["scenes"] for part in scene["fr"].split("→")})
old=json.loads((base/"argument-audio/manifest.json").read_text(encoding="utf-8"))["entries"]
missing=[p for p in chunks if p not in old]
dest=base/"chain-audio"; dest.mkdir(exist_ok=True)
manifest_file=dest/"manifest.json"
manifest=json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
entries=manifest["entries"]
voice=None
for batch in range((len(missing)+49)//50):
    selected=missing[batch*50:(batch+1)*50]
    name=f"pack-{batch:03}.json"
    file=dest/name
    if file.exists():
        pack=json.loads(file.read_text(encoding="utf-8"))
        assert all(pack[str(i)]["text"]==p for i,p in enumerate(selected))
    else:
        if voice is None: voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
        pack={}
        with tempfile.TemporaryDirectory() as temp:
            wav=Path(temp)/"a.wav";mp3=Path(temp)/"a.mp3"
            for i,p in enumerate(selected):
                with wave.open(str(wav),"wb") as f:voice.synthesize_wav(p,f)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
                pack[str(i)]={"text":p,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
        file.write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
    for i,p in enumerate(selected):entries[p]={"pack":name,"id":str(i)}
manifest["count"]=len(entries)
manifest_file.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
assert all(p in old or p in entries for p in chunks)
print(f"PASS: {len(chunks)} unique logic chunks: {len(chunks)-len(missing)} reused, {len(missing)} generated")

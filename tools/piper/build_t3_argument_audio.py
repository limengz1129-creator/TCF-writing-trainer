#!/usr/bin/env python3
"""Generate exact-text Piper audio for T3 argument-map vocabulary."""
import base64, json, subprocess, tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=(root/"eo-tache3-corpus/argument-map.js").read_text(encoding="utf-8")
start=source.index("const TOPICS=")+len("const TOPICS=")
topics,_=json.JSONDecoder().raw_decode(source[start:])
# The map schema may use a different key; recurse over the JSON tree to avoid omissions.
def visit(obj):
    if isinstance(obj,dict):
        for k,v in obj.items():
            if k=="words" and isinstance(v,list):
                for pair in v:
                    if isinstance(pair,list) and len(pair)>=2 and isinstance(pair[0],str): yield pair[0]
            else: yield from visit(v)
    elif isinstance(obj,list):
        for v in obj: yield from visit(v)
phrases=sorted(set(visit(topics)))
if not phrases: raise SystemExit("No vocabulary phrases found")
dest=root/"eo-tache3-corpus"/"argument-audio"
dest.mkdir(exist_ok=True)
model=Path("/tmp/fr_FR-siwis-medium.onnx")
if not model.exists(): raise SystemExit("Missing Piper model")
entries={}
with tempfile.TemporaryDirectory() as tmp:
    for offset in range(0,len(phrases),100):
        pack={}
        name=f"pack-{offset//100:03}.json"
        for i,phrase in enumerate(phrases[offset:offset+100]):
            wav=Path(tmp)/"voice.wav";mp3=Path(tmp)/"voice.mp3"
            subprocess.run(["piper","--model",str(model),"--output_file",str(wav)],input=phrase+"\n",text=True,check=True,stdout=subprocess.DEVNULL)
            subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
            key=str(i);pack[key]={"text":phrase,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
            entries[phrase]={"pack":name,"id":key}
        (dest/name).write_text(json.dumps(pack,ensure_ascii=False),encoding="utf-8")
(dest/"manifest.json").write_text(json.dumps({"voice":"fr_FR-siwis-medium","count":len(entries),"entries":entries},ensure_ascii=False),encoding="utf-8")
assert len(entries)==len(phrases)
assert all((dest / record["pack"]).is_file() for record in entries.values())
print("Generated and verified",len(entries),"Piper phrases")

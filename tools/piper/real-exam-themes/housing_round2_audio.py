#!/usr/bin/env python3
"""Append Piper audio for current housing text without rebuilding or overwriting source questions."""
import base64,hashlib,json,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice

root=Path(__file__).resolve().parents[3]
audio=root/"tache2/real-exams/piper-audio/themes"
corpus=json.loads((root/"tache2/real-exams/data/housing.json").read_text(encoding="utf-8"))
manifest_path=audio/"manifest.json"
manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
targets,records=manifest["targets"],manifest["records"]
unique=list(dict.fromkeys(r["fr"] for e in corpus["entries"] for r in e["rows"]))
pack_path=audio/"housing-round2-000.json"
pack=json.loads(pack_path.read_text(encoding="utf-8")) if pack_path.exists() else {}
missing=[]
for text in unique:
    links=targets.get(text,[])
    if not links:
        missing.append((text,None))
    else:
        rid=links[0]["id"]
        rec=records.get(rid)
        if rec and rec.get("pack")==pack_path.name and (rid not in pack or pack[rid].get("text")!=text or not pack[rid].get("audio")):
            missing.append((text,rid))
print(f"Housing: {len(unique)} unique phrases; {len(missing)} missing/broken Piper entries",flush=True)
if missing:
    model=root/".piper-model/fr_FR-siwis-medium.onnx"
    voice=PiperVoice.load(str(model))
    for text,existing_id in missing:
        rid=existing_id or "housing-round2-"+hashlib.sha1(text.encode()).hexdigest()[:18]
        with tempfile.TemporaryDirectory() as td:
            td=Path(td);wav=td/"speech.wav";mp3=td/"speech.mp3"
            with wave.open(str(wav),"wb") as wf:voice.synthesize_wav(text,wf)
            with wave.open(str(wav),"rb") as wf:duration=wf.getnframes()/wf.getframerate()
            subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
            data=base64.b64encode(mp3.read_bytes()).decode("ascii")
        pack[rid]={"text":text,"audio":data,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}
        targets[text]=[{"id":rid,"offset":0}];records[rid]={"pack":"housing-round2-000.json","id":rid}
    pack_path.write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
manifest["count"]=len(targets)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
assert all(s in targets for s in unique)
assert all(pack[links[0]["id"]]["text"]==s and pack[links[0]["id"]]["audio"] for s in unique if (links:=targets[s]) and records[links[0]["id"]]["pack"]==pack_path.name)
print("VALIDATED housing audio coverage",len(unique),"/",len(unique),flush=True)

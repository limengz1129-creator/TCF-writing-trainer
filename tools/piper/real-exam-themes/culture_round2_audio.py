#!/usr/bin/env python3
"""Generate Piper fr_FR-siwis-medium audio for missing culture T2 questions."""
import base64,hashlib,json,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice

root=Path(__file__).resolve().parents[3]
audio=root/"tache2/real-exams/piper-audio/themes"
corpus=json.loads((root/"tache2/real-exams/data/culture.json").read_text(encoding="utf-8"))
manifest_path=audio/"manifest.json"
manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
targets,records=manifest["targets"],manifest["records"]
unique=list(dict.fromkeys(r["fr"] for e in corpus["entries"] for r in e["rows"]))
missing=[s for s in unique if s not in targets]
print(f"Culture: {len(unique)} unique phrases; {len(missing)} missing Piper entries",flush=True)
if missing:
    voice=PiperVoice.load(str(root/".piper-model/fr_FR-siwis-medium.onnx"))
    pack={}
    for text in missing:
        rid="culture-round2-"+hashlib.sha1(text.encode()).hexdigest()[:18]
        with tempfile.TemporaryDirectory() as td:
            td=Path(td);wav=td/"speech.wav";mp3=td/"speech.mp3"
            with wave.open(str(wav),"wb") as wf:voice.synthesize_wav(text,wf)
            with wave.open(str(wav),"rb") as wf:duration=wf.getnframes()/wf.getframerate()
            subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
            data=base64.b64encode(mp3.read_bytes()).decode("ascii")
        pack[rid]={"text":text,"audio":data,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}
        targets[text]=[{"id":rid,"offset":0}];records[rid]={"pack":"culture-round2-000.json","id":rid}
    (audio/"culture-round2-000.json").write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
manifest["count"]=len(targets)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
assert all(s in targets for s in unique)
print("VALIDATED culture audio coverage",len(unique),"/",len(unique),flush=True)

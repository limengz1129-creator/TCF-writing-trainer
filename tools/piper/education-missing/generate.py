#!/usr/bin/env python3
import base64, hashlib, json, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
AUDIO=ROOT/"tache2"/"real-exams"/"piper-audio"/"themes"
MANIFEST=AUDIO/"manifest.json"
TEXT="Comment se déroule ce test ?"
MODEL=ROOT/".piper-model"/"fr_FR-siwis-medium.onnx"

mf=json.loads(MANIFEST.read_text(encoding="utf-8"))
if TEXT in mf.get("targets",{}):
    print("Target already present; nothing to do.")
    raise SystemExit(0)

voice=PiperVoice.load(str(MODEL))
with tempfile.TemporaryDirectory() as td:
    wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
    with wave.open(str(wav),"wb") as wf:
        voice.synthesize_wav(TEXT,wf)
    with wave.open(str(wav),"rb") as wf:
        duration=wf.getnframes()/wf.getframerate()
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
    audio=base64.b64encode(mp3.read_bytes()).decode("ascii")

rid="education-"+hashlib.sha1(TEXT.encode()).hexdigest()[:18]
pack_name="education-patch-001.json"
item={"text":TEXT,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(TEXT)}],"alignment":"phrase"}
(AUDIO/pack_name).write_text(json.dumps({rid:item},ensure_ascii=False,separators=(",",":")),encoding="utf-8")
mf.setdefault("records",{})[rid]={"pack":pack_name,"id":rid}
mf.setdefault("targets",{})[TEXT]=[{"id":rid,"offset":0}]
mf["voice"]="fr_FR-siwis-medium"
mf["count"]=len(mf["targets"])
MANIFEST.write_text(json.dumps(mf,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
print("Added",TEXT,rid,pack_name)

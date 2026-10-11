#!/usr/bin/env python3
import base64, hashlib, json, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
AUDIO=ROOT/"tache2"/"real-exams"/"piper-audio"/"themes"
MANIFEST=AUDIO/"manifest.json"
TEXTS=[
    "Tu peux me décrire ce plat un peu plus en détail ?",
    "Comment avez-vous trouvé ce restaurant ?",
]
MODEL=ROOT/".piper-model"/"fr_FR-siwis-medium.onnx"

mf=json.loads(MANIFEST.read_text(encoding="utf-8"))
voice=None
pack={}
for text in TEXTS:
    if text in mf.get("targets",{}):
        print("Target already present:", text)
        continue
    if voice is None:
        voice=PiperVoice.load(str(MODEL))
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf:
            voice.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf:
            duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    rid="consumption-"+hashlib.sha1(text.encode()).hexdigest()[:18]
    pack[rid]={"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}
    mf.setdefault("records",{})[rid]={"pack":"consumption-patch-001.json","id":rid}
    mf.setdefault("targets",{})[text]=[{"id":rid,"offset":0}]
    print("Added",text,rid)

if pack:
    (AUDIO/"consumption-patch-001.json").write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
mf["voice"]="fr_FR-siwis-medium"
mf["count"]=len(mf.get("targets",{}))
MANIFEST.write_text(json.dumps(mf,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
print("Manifest targets:",mf["count"])

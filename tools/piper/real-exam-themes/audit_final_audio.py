#!/usr/bin/env python3
"""Validate every current T2 theme Piper phrase against actual MP3 bytes."""
import base64, concurrent.futures, json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/"tache2/real-exams"
AUDIO=BASE/"piper-audio/themes"
THEMES="housing social education consumption transport family sport health culture work".split()
manifest=json.loads((AUDIO/"manifest.json").read_text(encoding="utf-8"))
errors=[]
used={}
question_total=0
for theme in THEMES:
    obj=json.loads((BASE/"data"/(theme+".json")).read_text(encoding="utf-8"))
    for entry in obj["entries"]:
        question_total+=len(entry["rows"])
        if len(entry["rows"])!=15:errors.append(f"{theme}: invalid 15-question count")
        for row in entry["rows"]:
            sentence=row["fr"]
            links=manifest["targets"].get(sentence)
            if not links:errors.append(f"{theme}: no target for {sentence}");continue
            rid=links[0]["id"]
            rec=manifest["records"].get(rid)
            if not rec:errors.append(f"{theme}: missing record {rid}");continue
            used[rid]=(rec["pack"],sentence)
packs={}
for pack,_ in used.values():
    if pack not in packs:
        try:packs[pack]=json.loads((AUDIO/pack).read_text(encoding="utf-8"))
        except Exception as exc:errors.append(f"{pack}: cannot read JSON: {exc}");packs[pack]={}
def check(item):
    rid,(pack,sentence)=item
    data=packs[pack].get(rid)
    if not data:return f"{pack}:{rid} absent"
    if data.get("text")!=sentence:return f"{pack}:{rid} text mismatch"
    try:audio=base64.b64decode(data["audio"],validate=True)
    except Exception as exc:return f"{pack}:{rid} base64 invalid: {exc}"
    if not (audio[:3]==b"ID3" or (len(audio)>2 and audio[0]==255 and audio[1] in (251,243,242))):return f"{pack}:{rid} no MP3 header"
    proc=subprocess.run(["ffmpeg","-v","error","-xerror","-f","mp3","-i","pipe:0","-f","null","-"],input=audio,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,timeout=45)
    if proc.returncode:return f"{pack}:{rid} decoding failed: {proc.stderr.decode(errors='replace')[:120]}"
    return None
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for err in pool.map(check,used.items()):
        if err:errors.append(err)
print(json.dumps({"sujets":sum(len(json.loads((BASE/"data"/(t+".json")).read_text())["entries"]) for t in THEMES),"questions":question_total,"unique_audio_checked":len(used),"packs_checked":len(packs),"errors":len(errors),"sample_errors":errors[:30]},ensure_ascii=False))
if errors:sys.exit(1)

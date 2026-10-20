#!/usr/bin/env python3
import argparse, base64, hashlib, json, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice
ROOT=Path(__file__).resolve().parents[3]
DATA=ROOT/"tache2"/"real-exams"/"vocab"/"culture.json"
OUT=ROOT/"tache2"/"real-exams"/"piper-audio-culture-vocab"
def load_texts():
    data=json.loads(DATA.read_text(encoding="utf-8")); texts=[]
    for item in data.get("vocabulary",[]):
        for key in ("fr","exampleFr"):
            t=str(item.get(key,"")).strip()
            if t and t not in texts: texts.append(t)
    for item in data.get("patterns",[]):
        t=str(item.get("exampleFr","")).strip()
        if t and t not in texts: texts.append(t)
    return texts
def synthesize(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf: voice.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf: duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--model",required=True); args=ap.parse_args()
    texts=load_texts(); print(f"{len(texts)} unique culture vocabulary / example targets")
    # Reuse a fully indexed pre-generated set; avoid repacking published audio URLs.
    manifest_path=OUT/"manifest.json"
    if manifest_path.exists():
        try:
            existing=json.loads(manifest_path.read_text(encoding="utf-8"))
            assert existing["voice"]=="fr_FR-siwis-medium"
            cached={}
            for text in texts:
                rec=existing["records"][existing["targets"][text][0]["id"]]
                if rec["pack"] not in cached:
                    cached[rec["pack"]]=json.loads((OUT/rec["pack"]).read_text(encoding="utf-8"))
                data=cached[rec["pack"]][rec["id"]]
                assert data["text"]==text and len(base64.b64decode(data["audio"],validate=True))>100
            print(f"All {len(texts)} current audio targets verified; retaining existing immutable packs")
            return
        except (AssertionError,KeyError,ValueError,OSError):
            pass
    OUT.mkdir(parents=True,exist_ok=True)
    for old in OUT.glob("pack-*.json"): old.unlink()
    voice=PiperVoice.load(args.model)
    records={}; targets={}; pack={}; pack_bytes=0; pack_no=0
    def flush():
        nonlocal pack,pack_bytes,pack_no
        if not pack:return
        name=f"pack-{pack_no:03}.json"
        (OUT/name).write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
        for rid in pack: records[rid]={"pack":name,"id":rid}
        pack={}; pack_bytes=0; pack_no+=1
    for i,text in enumerate(texts,1):
        rid="culture-vocab-"+hashlib.sha1(text.encode()).hexdigest()[:16]
        data=synthesize(voice,text); raw=json.dumps(data,ensure_ascii=False,separators=(",",":"))
        if pack and pack_bytes+len(raw)>1500000: flush()
        pack[rid]=data; pack_bytes+=len(raw); targets[text]=[{"id":rid,"offset":0}]
        if i%25==0 or i==len(texts): print(f"{i}/{len(texts)}")
    flush()
    manifest={"voice":"fr_FR-siwis-medium","version":1,"count":len(texts),"records":records,"targets":targets}
    (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    (OUT/"README.md").write_text("# Culture vocabulary Piper audio\n",encoding="utf-8")
if __name__=="__main__": main()

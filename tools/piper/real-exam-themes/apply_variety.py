#!/usr/bin/env python3
import argparse, base64, gzip, hashlib, json, re, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
REAL=ROOT/"tache2"/"real-exams"
DATA=REAL/"data"
OPT=REAL/"optimized"
SOURCE=REAL/"source"
AUDIO=REAL/"piper-audio"/"themes"
ORDER=["family","sport","work","health","culture","transport","education","social","consumption","housing"]
EXPECTED={"housing":33,"social":17,"education":17,"consumption":19,"transport":13,"family":5,"sport":9,"health":10,"culture":12,"work":9}
VOICE=None

def synthesize(text,model):
    global VOICE
    if VOICE is None: VOICE=PiperVoice.load(model)
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf: VOICE.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf: duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}

def load_manifest():
    p=AUDIO/"manifest.json"
    return json.loads(p.read_text(encoding="utf-8"))

def git(*args):
    subprocess.run(["git",*args],cwd=ROOT,check=True)

def apply_theme(slug,model):
    patch=json.loads((OPT/f"{slug}.json").read_text(encoding="utf-8"))
    data_path=DATA/f"{slug}.json"
    obj=json.loads(data_path.read_text(encoding="utf-8"))
    expected=EXPECTED[slug]*15
    assert len(patch)==expected,(slug,len(patch),expected)
    rows=[r for q in obj["entries"] for r in q["rows"]]
    assert len(rows)==expected
    changed=0
    for r,new_fr in zip(rows,patch):
        new_fr=str(new_fr).strip()
        assert new_fr
        if r["fr"]!=new_fr:
            r["fr"]=new_fr; changed+=1
    obj.setdefault("_build",{})["wording"]="variety-docx-exact"
    obj["_build"]["voice"]="fr_FR-siwis-medium"
    obj["_build"]["rows"]=expected
    data_path.write_text(json.dumps(obj,ensure_ascii=False,separators=(",",":")),encoding="utf-8")

    # Canonical source checkpoint now carries the exact optimized French wording too.
    source_obj=json.loads(json.dumps(obj,ensure_ascii=False))
    for q in source_obj["entries"]:
        for r in q["rows"]:
            r.pop("zh",None)
    src=base64.b64encode(gzip.compress(json.dumps(source_obj,ensure_ascii=False,separators=(",",":")).encode("utf-8"),compresslevel=9)).decode("ascii")
    source_path=SOURCE/f"{slug}.json.gz.b64"
    source_path.write_text(src,encoding="utf-8")

    manifest=load_manifest(); targets=manifest["targets"]; records=manifest["records"]
    unique=[]
    for fr in patch:
        if fr not in unique: unique.append(fr)
    missing=[fr for fr in unique if fr not in targets]
    pack={}; size=0; pack_no=0; newpacks=[]
    def flush():
        nonlocal pack,size,pack_no
        if not pack:return
        name=f"{slug}-variety-{pack_no:03}.json"; path=AUDIO/name
        path.write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
        newpacks.append(path)
        for rid in pack: records[rid]={"pack":name,"id":rid}
        print("wrote",name,len(pack),flush=True)
        pack={};size=0;pack_no+=1
    for i,fr in enumerate(missing,1):
        rid=slug+"-v-"+hashlib.sha1(fr.encode()).hexdigest()[:18]
        item=synthesize(fr,model); raw=json.dumps(item,ensure_ascii=False,separators=(",",":"))
        if pack and size+len(raw)>1500000: flush()
        pack[rid]=item;size+=len(raw);targets[fr]=[{"id":rid,"offset":0}]
        if i%40==0 or i==len(missing): print(f"{slug}: Piper {i}/{len(missing)}",flush=True)
    flush()
    manifest["voice"]="fr_FR-siwis-medium";manifest["count"]=len(targets)
    mf=AUDIO/"manifest.json"; mf.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")

    # Strict final validation: GitHub page data must equal the optimized DOC sequence exactly.
    check=json.loads(data_path.read_text(encoding="utf-8"))
    actual=[r["fr"] for q in check["entries"] for r in q["rows"]]
    assert actual==patch,(slug,"optimized wording mismatch")
    assert check["count"]==EXPECTED[slug] and len(check["entries"])==EXPECTED[slug]
    assert all(len(q["rows"])==15 for q in check["entries"])
    assert all(r.get("zh") for q in check["entries"] for r in q["rows"])
    m2=json.loads(mf.read_text(encoding="utf-8"))
    assert set(unique).issubset(set(m2["targets"]))
    print(f"VALIDATED {slug}: {EXPECTED[slug]} questions / {expected} rows / changed={changed} / new Piper={len(missing)}",flush=True)

    meta_path=DATA/"themes.json";meta=json.loads(meta_path.read_text(encoding="utf-8"))
    meta[slug]["wording"]="variety-docx-exact";meta[slug]["voice"]="fr_FR-siwis-medium"
    meta_path.write_text(json.dumps(meta,ensure_ascii=False,separators=(",",":")),encoding="utf-8")

    git("add",str(data_path.relative_to(ROOT)),str(meta_path.relative_to(ROOT)),str(source_path.relative_to(ROOT)),str(mf.relative_to(ROOT)),*[str(p.relative_to(ROOT)) for p in newpacks])
    git("commit","-m",f"Sync T2 optimized Word wording: {slug}")
    git("push","origin","main")
    print("PUSHED",slug,flush=True)

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--piper-model",required=True);args=ap.parse_args()
    git("config","user.name","github-actions[bot]");git("config","user.email","41898282+github-actions[bot]@users.noreply.github.com")
    for slug in ORDER:
        assert (OPT/f"{slug}.json").exists(),f"missing optimized patch: {slug}"
        apply_theme(slug,args.piper_model)

if __name__=="__main__":main()

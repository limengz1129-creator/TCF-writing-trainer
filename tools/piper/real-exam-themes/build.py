#!/usr/bin/env python3
import argparse, base64, gzip, hashlib, json, re, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
REAL=ROOT/"tache2"/"real-exams"; SOURCE=REAL/"source"; DATA=REAL/"data"; AUDIO=REAL/"piper-audio"/"themes"
DATA.mkdir(parents=True,exist_ok=True); AUDIO.mkdir(parents=True,exist_ok=True)
ORDER=["family","sport","work","health","culture","transport","education","social","consumption","housing"]
EXPECTED={"housing":33,"social":17,"education":17,"consumption":19,"transport":13,"family":5,"sport":9,"health":10,"culture":12,"work":9}
_nllb=None; _nllb_tok=None; _piper=None

def norm(s): return re.sub(r"\s+"," ",str(s or "").replace("’","'").replace("‘","'")).strip().lower()
def js_string(s): return json.loads('"'+s.replace('"','\"')+'"')

def trusted_translations():
    raw=(ROOT/"tache2"/"data.js").read_text(encoding="utf-8")
    out={}; pat=re.compile(r'\[\d+,\d+,"((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)"\]')
    for fr,zh in pat.findall(raw):
        try: out[norm(js_string(fr))]=js_string(zh)
        except Exception: pass
    # Only reuse prior theme translations if they were built with NLLB.
    for p in DATA.glob("*.json"):
        if p.name=="themes.json": continue
        try:
            obj=json.loads(p.read_text(encoding="utf-8"))
            if obj.get("_build",{}).get("translation")!="nllb-200-distilled-600M": continue
            for q in obj.get("entries",[]):
                for row in q.get("rows",[]):
                    if row.get("fr") and row.get("zh"): out.setdefault(norm(row["fr"]),row["zh"])
        except Exception: pass
    return out

def clean_zh(s):
    s=str(s).replace("▁"," ").strip()
    s=re.sub(r"\s+([，。？！：；、])",r"\1",s)
    for _ in range(4): s=re.sub(r"([\u3400-\u9fff])\s+([\u3400-\u9fff])",r"\1\2",s)
    return s

def nllb_translate(texts):
    global _nllb,_nllb_tok
    if not texts:return {}
    import torch
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    if _nllb is None:
        print("Loading facebook/nllb-200-distilled-600M once for all themes",flush=True)
        _nllb_tok=AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M",src_lang="fra_Latn")
        _nllb=AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")
        _nllb.eval(); torch.set_num_threads(4)
    out={}; bos=_nllb_tok.convert_tokens_to_ids("zho_Hans")
    for start in range(0,len(texts),20):
        batch=texts[start:start+20]
        x=_nllb_tok(batch,return_tensors="pt",padding=True,truncation=True,max_length=256)
        with torch.no_grad(): y=_nllb.generate(**x,forced_bos_token_id=bos,max_new_tokens=160,num_beams=3)
        zh=_nllb_tok.batch_decode(y,skip_special_tokens=True)
        for f,z in zip(batch,zh): out[f]=clean_zh(z)
        print(f"NLLB translated {min(start+20,len(texts))}/{len(texts)}",flush=True)
    return out

def load_source(slug):
    p=SOURCE/f"{slug}.json.gz.b64"
    raw=gzip.decompress(base64.b64decode(p.read_text(encoding="utf-8").strip()))
    obj=json.loads(raw.decode("utf-8"))
    assert obj["slug"]==slug and obj["count"]==EXPECTED[slug]==len(obj["entries"])
    assert all(len(q["rows"])==15 for q in obj["entries"])
    return obj

def synthesize(text,model_path):
    global _piper
    if _piper is None: _piper=PiperVoice.load(model_path)
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf: _piper.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf: duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}

def read_manifest():
    p=AUDIO/"manifest.json"
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {"voice":"fr_FR-siwis-medium","version":1,"count":0,"records":{},"targets":{}}

def add_audio(slug,texts,model_path,manifest):
    missing=[t for t in texts if t not in manifest["targets"]]
    print(f"{slug}: Piper reuse={len(texts)-len(missing)} new={len(missing)}",flush=True)
    pack={};size=0;num=0;written=[]
    def flush():
        nonlocal pack,size,num
        if not pack:return
        name=f"{slug}-pack-{num:03}.json"; path=AUDIO/name
        path.write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8"); written.append(path)
        for rid in pack: manifest["records"][rid]={"pack":name,"id":rid}
        print("wrote",name,len(pack),flush=True);pack={};size=0;num+=1
    for i,text in enumerate(missing,1):
        rid=slug+"-"+hashlib.sha1(text.encode()).hexdigest()[:18]
        item=synthesize(text,model_path); raw=json.dumps(item,ensure_ascii=False,separators=(",",":"))
        if pack and size+len(raw)>1500000:flush()
        pack[rid]=item;size+=len(raw);manifest["targets"][text]=[{"id":rid,"offset":0}]
        if i%40==0 or i==len(missing): print(f"{slug}: audio {i}/{len(missing)}",flush=True)
    flush(); manifest["voice"]="fr_FR-siwis-medium";manifest["count"]=len(manifest["targets"])
    (AUDIO/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    return written

def git(*args,check=True): return subprocess.run(["git",*args],cwd=ROOT,check=check,text=True,capture_output=False)

def build_one(slug,model_path,known,do_git):
    obj=load_source(slug); all_fr=[]
    for q in obj["entries"]:
        for row in q["rows"]:
            if row["fr"] not in all_fr: all_fr.append(row["fr"])
    missing=[t for t in all_fr if norm(t) not in known]
    print(f"\n=== {slug}: {obj['count']} questions / {obj['count']*15} rows / {len(all_fr)} unique; trusted zh={len(all_fr)-len(missing)}, NLLB={len(missing)} ===",flush=True)
    generated=nllb_translate(missing)
    for q in obj["entries"]:
        for row in q["rows"]:
            row["zh"]=known.get(norm(row["fr"])) or generated.get(row["fr"]) or ""
            assert row["zh"]
            known.setdefault(norm(row["fr"]),row["zh"])
    obj["_build"]={"translation":"nllb-200-distilled-600M","voice":"fr_FR-siwis-medium","rows":obj["count"]*15}
    data_path=DATA/f"{slug}.json";data_path.write_text(json.dumps(obj,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    manifest=read_manifest(); newpacks=add_audio(slug,all_fr,model_path,manifest)
    mf=AUDIO/"manifest.json"; (AUDIO/"README.md").write_text("# T2 real-exam theme Piper audio\n\nStatic pre-generated Piper fr_FR-siwis-medium audio. No browser TTS or paid API.\n",encoding="utf-8")
    meta_path=DATA/"themes.json";meta=json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}
    meta[slug]={"title":obj["title"],"count":obj["count"],"rows":obj["count"]*15,"translation":"nllb-200-distilled-600M","voice":"fr_FR-siwis-medium"}
    meta_path.write_text(json.dumps(meta,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    # Validate exact theme correspondence and audio coverage before checkpoint commit.
    check=json.loads(data_path.read_text(encoding="utf-8")); man=json.loads(mf.read_text(encoding="utf-8"))
    assert check["count"]==EXPECTED[slug] and len(check["entries"])==EXPECTED[slug]
    assert all(len(q["rows"])==15 for q in check["entries"])
    assert all(r["zh"] for q in check["entries"] for r in q["rows"])
    assert set(all_fr).issubset(set(man["targets"]))
    print(f"VALIDATED {slug}: {EXPECTED[slug]} questions, {EXPECTED[slug]*15} rows, Piper covered",flush=True)
    if do_git:
        git("add",str(data_path.relative_to(ROOT)),str(meta_path.relative_to(ROOT)),str(mf.relative_to(ROOT)),str((AUDIO/"README.md").relative_to(ROOT)),*[str(p.relative_to(ROOT)) for p in newpacks])
        git("commit","-m",f"Complete T2 real-exam theme: {slug}")
        git("push","origin","main")
        print("PUSHED checkpoint",slug,flush=True)

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--piper-model",required=True);ap.add_argument("--all",action="store_true");ap.add_argument("--slug");ap.add_argument("--git-checkpoints",action="store_true");args=ap.parse_args()
    slugs=ORDER if args.all else [args.slug]
    assert all(slugs) and all((SOURCE/f"{s}.json.gz.b64").exists() for s in slugs), "Missing per-theme source checkpoint"
    known=trusted_translations()
    if args.git_checkpoints:
        git("config","user.name","github-actions[bot]");git("config","user.email","41898282+github-actions[bot]@users.noreply.github.com")
    for slug in slugs: build_one(slug,args.piper_model,known,args.git_checkpoints)

if __name__=="__main__":main()

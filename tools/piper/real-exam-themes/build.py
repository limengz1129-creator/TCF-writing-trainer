#!/usr/bin/env python3
import argparse, base64, gzip, hashlib, json, re, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
REAL=ROOT/"tache2"/"real-exams"
DATA=REAL/"data"
AUDIO=REAL/"piper-audio"/"themes"
DATA.mkdir(parents=True,exist_ok=True); AUDIO.mkdir(parents=True,exist_ok=True)

def norm(s):
    return re.sub(r"\s+"," ",str(s or "").replace("’","'").replace("‘","'")).strip().lower()

def js_string(s):
    return json.loads('"'+s.replace('"','\"')+'"')

def existing_translation_map():
    raw=(ROOT/"tache2"/"data.js").read_text(encoding="utf-8")
    out={}
    pat=re.compile(r'\[\d+,\d+,"((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)"\]')
    for fr,zh in pat.findall(raw):
        try: out[norm(js_string(fr))]=js_string(zh)
        except Exception: pass
    # Reuse translations already built for earlier themes.
    for p in DATA.glob("*.json"):
        if p.name=="themes.json": continue
        try:
            obj=json.loads(p.read_text(encoding="utf-8"))
            for q in obj.get("entries",[]):
                for row in q.get("rows",[]):
                    if row.get("fr") and row.get("zh"):
                        out.setdefault(norm(row["fr"]),row["zh"])
        except Exception: pass
    return out

def clean_zh(s):
    s=str(s).replace("▁"," ").strip()
    s=re.sub(r"\s+([，。？！：；、])",r"\1",s)
    for _ in range(3):
        s=re.sub(r"([\u3400-\u9fff])\s+([\u3400-\u9fff])",r"\1\2",s)
    return s

def model_translate(texts):
    if not texts:return {}
    import torch
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    torch.set_num_threads(4)
    print("Loading fr→en translation model",flush=True)
    tok1=AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-fr-en")
    mod1=AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-fr-en")
    print("Loading en→zh translation model",flush=True)
    tok2=AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-en-zh")
    mod2=AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-en-zh")
    result={}
    for start in range(0,len(texts),24):
        batch=texts[start:start+24]
        x=tok1(batch,return_tensors="pt",padding=True,truncation=True,max_length=256)
        with torch.no_grad(): y=mod1.generate(**x,max_new_tokens=256,num_beams=4)
        en=tok1.batch_decode(y,skip_special_tokens=True)
        x2=tok2(en,return_tensors="pt",padding=True,truncation=True,max_length=256)
        with torch.no_grad(): y2=mod2.generate(**x2,max_new_tokens=256,num_beams=4)
        zh=tok2.batch_decode(y2,skip_special_tokens=True)
        for f,z in zip(batch,zh): result[f]=clean_zh(z)
        print(f"Translated {min(start+24,len(texts))}/{len(texts)}",flush=True)
    return result

def load_source(path):
    encoded=Path(path).read_text(encoding="utf-8").strip()
    raw=gzip.decompress(base64.b64decode(encoded))
    return json.loads(raw.decode("utf-8"))

def synthesize(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav"; mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf: voice.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf: duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}

def build_audio(slug,texts,model_path):
    mf=AUDIO/"manifest.json"
    if mf.exists():
        manifest=json.loads(mf.read_text(encoding="utf-8"))
    else:
        manifest={"voice":"fr_FR-siwis-medium","version":1,"count":0,"records":{},"targets":{}}
    missing=[t for t in texts if t not in manifest["targets"]]
    print(f"Piper existing={len(texts)-len(missing)} new={len(missing)}",flush=True)
    if missing:
        voice=PiperVoice.load(model_path)
        pack={}; size=0; num=0
        def flush():
            nonlocal pack,size,num
            if not pack:return
            name=f"{slug}-pack-{num:03}.json"
            (AUDIO/name).write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
            for rid in pack: manifest["records"][rid]={"pack":name,"id":rid}
            print("Audio",name,len(pack),flush=True)
            pack={}; size=0; num+=1
        for i,text in enumerate(missing,1):
            rid=slug+"-"+hashlib.sha1(text.encode()).hexdigest()[:18]
            item=synthesize(voice,text); raw=json.dumps(item,ensure_ascii=False,separators=(",",":"))
            if pack and size+len(raw)>1500000: flush()
            pack[rid]=item; size+=len(raw); manifest["targets"][text]=[{"id":rid,"offset":0}]
            if i%40==0 or i==len(missing): print(f"Audio {i}/{len(missing)}",flush=True)
        flush()
    manifest["voice"]="fr_FR-siwis-medium"
    manifest["count"]=len(manifest["targets"])
    mf.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    (AUDIO/"README.md").write_text("# T2 real-exam theme Piper audio\n\nStatic pre-generated Piper fr_FR-siwis-medium audio. Playback uses no browser TTS or paid API.\n",encoding="utf-8")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",required=True)
    ap.add_argument("--piper-model",required=True)
    args=ap.parse_args()
    obj=load_source(args.source)
    slug=obj["slug"]
    assert obj["count"]==len(obj["entries"])
    assert all(len(q["rows"])==15 for q in obj["entries"])
    known=existing_translation_map()
    all_fr=[]
    for q in obj["entries"]:
        for row in q["rows"]:
            if row["fr"] not in all_fr: all_fr.append(row["fr"])
    missing=[t for t in all_fr if norm(t) not in known]
    print(f"Theme={slug} questions={obj['count']} rows={sum(len(q['rows']) for q in obj['entries'])} unique={len(all_fr)}",flush=True)
    print(f"Chinese reused={len(all_fr)-len(missing)} machine translation needed={len(missing)}",flush=True)
    generated=model_translate(missing)
    for q in obj["entries"]:
        for row in q["rows"]:
            row["zh"]=known.get(norm(row["fr"])) or generated.get(row["fr"]) or ""
    assert all(r.get("zh") for q in obj["entries"] for r in q["rows"])
    (DATA/f"{slug}.json").write_text(json.dumps(obj,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    build_audio(slug,all_fr,args.piper_model)
    meta_file=DATA/"themes.json"
    meta=json.loads(meta_file.read_text(encoding="utf-8")) if meta_file.exists() else {}
    meta[slug]={"title":obj["title"],"count":obj["count"],"rows":sum(len(q["rows"]) for q in obj["entries"])}
    meta_file.write_text(json.dumps(meta,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print("Done",json.dumps(meta[slug],ensure_ascii=False),flush=True)

if __name__=="__main__": main()

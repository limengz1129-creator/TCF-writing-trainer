#!/usr/bin/env python3
import base64, gzip, hashlib, json, re, subprocess, tempfile, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[3]
REAL=ROOT/"tache2"/"real-exams"
SOURCE=REAL/"source"/"themes-source.json.gz.b64"
DATA=REAL/"data"
AUDIO=REAL/"piper-audio"/"themes"
DATA.mkdir(parents=True,exist_ok=True);AUDIO.mkdir(parents=True,exist_ok=True)

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
    return out

def clean_zh(s):
    s=str(s).replace("▁"," ").strip()
    s=re.sub(r"\s+([，。？！：；、])",r"\1",s)
    s=re.sub(r"([\u3400-\u9fff])\s+([\u3400-\u9fff])",r"\1\2",s)
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
        zh_in=[">>cmn_Hans<< "+e for e in en]
        x2=tok2(zh_in,return_tensors="pt",padding=True,truncation=True,max_length=256)
        with torch.no_grad(): y2=mod2.generate(**x2,max_new_tokens=256,num_beams=4)
        zh=tok2.batch_decode(y2,skip_special_tokens=True)
        for f,z in zip(batch,zh): result[f]=clean_zh(z)
        print(f"Translated {min(start+24,len(texts))}/{len(texts)}",flush=True)
    return result

def load_source():
    source_dir=REAL/"source"
    parts=sorted(source_dir.glob("themes-source.part*.b64"))
    if parts:
        encoded="".join(p.read_text().strip() for p in parts)
    else:
        encoded=SOURCE.read_text().strip()
    raw=base64.b64decode(encoded)
    return json.loads(gzip.decompress(raw).decode("utf-8"))

def synthesize(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/"a.wav";mp3=Path(td)/"a.mp3"
        with wave.open(str(wav),"wb") as wf: voice.synthesize_wav(text,wf)
        with wave.open(str(wav),"rb") as wf: duration=wf.getnframes()/wf.getframerate()
        subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-b:a","48k",str(mp3)],check=True)
        audio=base64.b64encode(mp3.read_bytes()).decode("ascii")
    return {"text":text,"audio":audio,"duration":round(duration,4),"timing":[{"start":0,"end":round(duration,4),"from":0,"to":len(text)}],"alignment":"phrase"}

def build_audio(all_texts,model_path):
    for p in AUDIO.glob("pack-*.json"):p.unlink()
    voice=PiperVoice.load(model_path)
    records={};targets={};pack={};size=0;num=0
    def flush():
        nonlocal pack,size,num
        if not pack:return
        name=f"pack-{num:03}.json"
        (AUDIO/name).write_text(json.dumps(pack,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
        for rid in pack:records[rid]={"pack":name,"id":rid}
        print("Audio",name,len(pack),flush=True)
        pack={};size=0;num+=1
    for i,text in enumerate(all_texts,1):
        rid="t2-"+hashlib.sha1(text.encode()).hexdigest()[:18]
        item=synthesize(voice,text);raw=json.dumps(item,ensure_ascii=False,separators=(",",":"))
        if pack and size+len(raw)>1500000:flush()
        pack[rid]=item;size+=len(raw);targets[text]=[{"id":rid,"offset":0}]
        if i%50==0 or i==len(all_texts):print(f"Audio {i}/{len(all_texts)}",flush=True)
    flush()
    manifest={"voice":"fr_FR-siwis-medium","version":1,"count":len(all_texts),"records":records,"targets":targets}
    (AUDIO/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    (AUDIO/"README.md").write_text("# T2 real-exam theme Piper audio\n\nStatic pre-generated Piper fr_FR-siwis-medium audio for the ten 7–10月 Tâche 2 study themes. Playback uses no browser TTS or paid API.\n",encoding="utf-8")

def main():
    import argparse
    ap=argparse.ArgumentParser();ap.add_argument("--piper-model",required=True);args=ap.parse_args()
    themes=load_source()
    known=existing_translation_map()
    all_fr=[]
    for obj in themes.values():
        for q in obj["entries"]:
            for row in q["rows"]:
                if row["fr"] not in all_fr:all_fr.append(row["fr"])
    missing=[t for t in all_fr if norm(t) not in known]
    print(f"Themes={len(themes)} questions={sum(x['count'] for x in themes.values())} rows={sum(len(q['rows']) for x in themes.values() for q in x['entries'])}",flush=True)
    print(f"Unique French={len(all_fr)} existing Chinese={len(all_fr)-len(missing)} machine translation needed={len(missing)}",flush=True)
    generated=model_translate(missing)
    for slug,obj in themes.items():
        for q in obj["entries"]:
            for row in q["rows"]:
                row["zh"]=known.get(norm(row["fr"])) or generated.get(row["fr"]) or ""
        (DATA/f"{slug}.json").write_text(json.dumps(obj,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    build_audio(all_fr,args.piper_model)
    meta={slug:{"title":o["title"],"count":o["count"],"rows":sum(len(q["rows"]) for q in o["entries"])} for slug,o in themes.items()}
    (DATA/"themes.json").write_text(json.dumps(meta,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print("Done",json.dumps(meta,ensure_ascii=False),flush=True)

if __name__=="__main__":main()

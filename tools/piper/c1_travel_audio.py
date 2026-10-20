#!/usr/bin/env python3
"""Generate and audit exact-text static Piper recordings for the C1 travel view.

Build automatically on GitHub Actions; acceptance requires a verified manifest and packs.
"""
import argparse, base64, hashlib, io, json, re, subprocess, wave
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/"eo-tache3-corpus/c1-travel-data.js"
OUT=ROOT/"eo-tache3-corpus/c1-travel-audio"
ZH=re.compile(r"[\u3400-\u9fff]")
FR=re.compile(r"[A-Za-zÀ-ÿ]")
def read_records():
    s=DATA.read_text(encoding="utf-8").strip()
    return json.loads(s.split("=",1)[1].rstrip(";"))
def clean(lines):
    return [x.strip() for x in str(lines or "").splitlines() if x.strip()]
def bilingual(text):
    words=[];carry=""
    for line in clean(text):
        if ZH.search(line):
            if carry:words.append(carry);carry=""
        elif FR.search(line):
            carry+=((" " if carry else "")+line)
            if re.search(r"[.!?。]$",line):words.append(carry);carry=""
        else:
            if carry:words.append(carry);carry=""
    if carry:words.append(carry)
    return words
def vocab(text):
    return [line for line in clean(text) if FR.search(line) and not ZH.search(line) and not line.startswith("类型")]
def targets():
    rows=read_records()
    assert len(rows)==72,f"Expected 72 C1 scenes, got {len(rows)}"
    ret=[]
    for r in rows:
        for field in ("core","chain","text"):
            ret.extend(bilingual(r[field]))
        # Each French logical-chain chunk is a separate Piper playback target.
        for chain in bilingual(r["chain"]):
            for chunk in re.split(r"\s*(?:→|/|\+|[,，、])\s*",chain):
                if chunk.strip():ret.append(chunk.strip())
        # The Exemple-cle chain in the core section uses individual playback buttons.
        example=re.split(r"例子关键词\s*[｜|]\s*Exemple-clé",r["core"])
        if len(example)>1:
            for sentence in bilingual(example[1]):
                for chunk in re.split(r"\s*(?:→|/|\+|[,，、])\s*",sentence):
                    if chunk.strip():ret.append(chunk.strip())
        ret.extend(vocab(r["vocab"]))
    # Regression guard: these four separate buttons must exist in the manifest.
    required=("recherche d’emploi au Canada","entretien","comprendre les consignes","collaboration")
    missing=set(required)-set(ret)
    assert not missing, f"Missing split example audio targets: {sorted(missing)}"
    unique=list(dict.fromkeys(ret))
    # 72 scenes have >1,000 distinct French playback targets after node splitting.
    # Never accept the old whole-chain-only manifest as a complete deployment.
    assert len(unique)>=1200, f"Too few C1 targets after splitting: {len(unique)}"
    print(f"C1 French playback target audit: 72 scenes / {len(unique)} unique utterances",flush=True)
    return unique
def verify():
    expected=targets()
    manifest_file=OUT/"manifest.json"
    assert manifest_file.exists(),"Missing C1 manifest"
    manifest=json.loads(manifest_file.read_text(encoding="utf-8"))
    entries=manifest.get("entries",{})
    missing=set(expected)-set(entries)
    assert not missing, f"{len(missing)} missing C1 utterances: {sorted(missing)[:8]}"
    packs={}
    for text in expected:
        entry=entries[text];path=OUT/entry["pack"]
        assert path.is_file(),f"Missing C1 audio pack: {path}"
        if path not in packs:packs[path]=json.loads(path.read_text(encoding="utf-8"))
        piece=packs[path].get(entry["id"])
        assert piece and piece.get("text")==text and len(piece.get("audio",""))>150,"Missing or mismatched C1 audio: "+text
        decoded=base64.b64decode(piece["audio"],validate=True)
        assert decoded[:3]==b"ID3" or decoded[:2] in [b"\xff\xfb",b"\xff\xf3",b"\xff\xf2"],"Invalid MP3: "+text
    print(f"PASS: {len(read_records())} scenes, {len(expected)} exact French utterances, {len(packs)} verified packs")
def generate(model):
    from piper import PiperVoice
    OUT.mkdir(parents=True,exist_ok=True)
    voice=PiperVoice.load(str(model))
    expected=targets()
    previous={}
    mf=OUT/"manifest.json"
    if mf.exists():previous=json.loads(mf.read_text(encoding="utf-8")).get("entries",{})
    entries={};packs={};batch={};size=0;number=0
    def flush():
        nonlocal batch,size,number
        if not batch:return
        body=json.dumps(batch,ensure_ascii=False,separators=(",",":"))
        digest=hashlib.sha256(body.encode("utf-8")).hexdigest()[:16]
        name=f"pack-{number:04d}-{digest}.json"
        (OUT/name).write_text(body,encoding="utf-8")
        for key,value in batch.items():entries[value["text"]]={"pack":name,"id":key}
        packs[name]=True;number+=1;batch={};size=0
    for i,text in enumerate(expected):
        # Rebuild deterministically, to avoid stale normalized text or missing files.
        pcm=b"".join(ch.audio_int16_bytes for ch in voice.synthesize(text))
        if not pcm:raise RuntimeError("Empty voice synthesis: "+text)
        audio=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-f","s16le","-ar",str(voice.config.sample_rate),"-ac","1","-i","pipe:0","-codec:a","libmp3lame","-b:a","48k","-f","mp3","pipe:1"],input=pcm,capture_output=True,check=True).stdout
        if not audio:raise RuntimeError("Empty MP3: "+text)
        value={"text":text,"audio":base64.b64encode(audio).decode("ascii")}
        encoded=len(value["audio"])
        if size+encoded>1350000:flush()
        batch[f"c{i:05d}"]=value;size+=encoded
        if (i+1)%50==0:print(f"Synthesized {i+1}/{len(expected)}",flush=True)
    flush()
    mf.write_text(json.dumps({"voice":"fr_FR-siwis-medium","version":"content-addressed-v2","entries":entries},ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    verify()
if __name__=="__main__":
    cli=argparse.ArgumentParser()
    cli.add_argument("operation",choices=["generate","verify","count"])
    cli.add_argument("--model")
    args=cli.parse_args()
    if args.operation=="count":print(len(targets()))
    elif args.operation=="verify":verify()
    else:
        if not args.model:cli.error("--model is required")
        generate(Path(args.model))

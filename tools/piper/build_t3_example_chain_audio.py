#!/usr/bin/env python3
"""Generate static siwis MP3 recordings for example-chain chunks, resumably."""
import base64,json,re,subprocess,tempfile,wave
from pathlib import Path
from piper import PiperVoice
root=Path(__file__).resolve().parents[2]/"eo-tache3-corpus"
raw=(root/"example-cards.js").read_text(encoding="utf-8")
cards=json.loads(re.search(r"window.TCF_T3_EXAMPLES=(\{.*\});\s*$",raw,re.S).group(1))
existing=[json.loads((root/d/"manifest.json").read_text(encoding="utf-8"))["entries"] for d in ("argument-audio","chain-audio")]
chunks=sorted({p.strip() for card in cards.values() for p in card["fr"].split("→")})
missing=[p for p in chunks if not any(p in m for m in existing)]
dest=root/"example-audio";dest.mkdir(exist_ok=True)
mf=dest/"manifest.json"
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"voice":"fr_FR-siwis-medium","entries":{}}
voice=None
for batch in range((len(missing)+49)//50):
    selected=missing[50*batch:50*(batch+1)]
    name=f"pack-{batch:03}.json";path=dest/name
    if path.exists():
        records=json.loads(path.read_text(encoding="utf-8"))
        assert all(records[str(i)]["text"]==term for i,term in enumerate(selected))
    else:
        if voice is None:voice=PiperVoice.load("/tmp/fr_FR-siwis-medium.onnx")
        records={}
        with tempfile.TemporaryDirectory() as tmp:
            wav=Path(tmp)/"voice.wav";mp3=Path(tmp)/"voice.mp3"
            for i,term in enumerate(selected):
                with wave.open(str(wav),"wb") as f:voice.synthesize_wav(term,f)
                subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(wav),"-codec:a","libmp3lame","-q:a","5",str(mp3)],check=True)
                records[str(i)]={"text":term,"audio":base64.b64encode(mp3.read_bytes()).decode("ascii")}
        path.write_text(json.dumps(records,ensure_ascii=False),encoding="utf-8")
    for i,term in enumerate(selected):manifest["entries"][term]={"pack":name,"id":str(i)}
    manifest["count"]=len(manifest["entries"])
    mf.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
    print(f"Generated batch {batch+1}/{(len(missing)+49)//50}",flush=True)
assert all(any(p in m for m in existing) or p in manifest["entries"] for p in chunks)
print(f"PASS {len(chunks)} chunks; {len(missing)} new Piper recordings")

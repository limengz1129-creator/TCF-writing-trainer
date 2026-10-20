#!/usr/bin/env python3
"""Generate Piper siwis MP3 packs for Education C1, retaining existing audio catalog."""
import base64, io, json, os, re, subprocess, wave
from pathlib import Path
from piper import PiperVoice

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'eo-tache3-corpus/c1-education-data.js'
OUT=ROOT/'eo-tache3-corpus/c1-education-audio'
raw=DATA.read_text(encoding='utf-8')
rows=json.loads(raw.split('=',1)[1].rstrip().rstrip(';'))
manifest_path=OUT/'manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
entries=manifest.setdefault('entries',{})
voice_path=Path(os.environ.get('PIPER_VOICE','/tmp/fr_FR-siwis-medium.onnx'))
voice=PiperVoice.load(str(voice_path),config_path=str(voice_path)+'.json')
def split_lines(raw):
    return [s.strip() for s in raw.splitlines() if s.strip()]
def is_french(line):
    return bool(re.search(r'[A-Za-zÀ-ÿ]',line)) and not bool(re.search(r'[\u3400-\u9fff]',line))
def joined_french(raw):
    carry=''
    result=[]
    for line in split_lines(raw):
        if not is_french(line):
            if carry:result.append(carry);carry=''
            continue
        carry=(carry+' '+line).strip()
        if re.search(r'[.!?]$',line):result.append(carry);carry=''
    if carry:result.append(carry)
    return result
def phrases(row):
    core=row['core'].split('例子关键词')[0]
    yield from joined_french(core)
    ex=row['core'].split('Exemple-clé')[-1] if 'Exemple-clé' in row['core'] else ''
    for line in joined_french(ex):
        for v in re.split(r'\s*→\s*',line):
            if v.strip():yield v.strip()
    for line in joined_french(row['chain']):
        for v in re.split(r'\s*→\s*',line):
            if v.strip():yield v.strip()
    # Vocab rows are extracted from Word tables, with Chinese labels on the same line.
    for line in split_lines(row['vocab']):
        chunks=re.split(r'\s{2,}',line.strip())
        for v in chunks:
            if is_french(v) and v not in ('法语表达','类型'):yield v
    yield from joined_french(row['text'])
needed=list(dict.fromkeys(v for row in rows for v in phrases(row) if is_french(v) and len(v)<600))
missing=[t for t in needed if t not in entries]
print('C1 phrases',len(needed),'missing',len(missing),flush=True)
if not missing:quit()
pack_num=1000
while (OUT/f'pack-{pack_num:04d}.json').exists():pack_num+=1
for k in range(0,len(missing),60):
    packname=f'pack-{pack_num:04d}.json';pack_num+=1
    pack={}
    for index,t in enumerate(missing[k:k+60]):
        audio=io.BytesIO()
        with wave.open(audio,'wb') as wf:
            wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(voice.config.sample_rate)
            for chunk in voice.synthesize(t):wf.writeframes(chunk.audio_int16_bytes)
        mp3=subprocess.run(['ffmpeg','-v','error','-f','wav','-i','pipe:0','-codec:a','libmp3lame','-q:a','7','-f','mp3','pipe:1'],input=audio.getvalue(),capture_output=True,check=True).stdout
        key=str(index)
        pack[key]={'text':t,'audio':base64.b64encode(mp3).decode('ascii')}
        entries[t]={'pack':packname,'id':key}
    (OUT/packname).write_text(json.dumps(pack,ensure_ascii=False),encoding='utf-8')
    print('generated',packname,len(pack),flush=True)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8')
assert all(t in entries for t in needed)
print('DONE: C1 catalog complete',len(needed),flush=True)

#!/usr/bin/env python3
"""Build only the new BonTCF C1 Piper siwis phrases; preserve existing audio packs."""
import base64, io, json, os, re, subprocess, wave
from pathlib import Path
from piper import PiperVoice
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'eo-tache3-corpus'
rows=json.loads((BASE/'bontcf-t3-supplements.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
dirs={'媒体与文化':'c1-media-audio','家庭与人际':'family-audio','职业与职场':'c1-career-audio','环境与城市':'environment-audio','饮食与健康':'health-audio'}
voice_file=Path(os.environ.get('PIPER_VOICE','/tmp/fr_FR-siwis-medium.onnx'))
voice=PiperVoice.load(str(voice_file),config_path=str(voice_file)+'.json')
def is_french(s):return bool(re.search(r'[a-zA-ZÀ-ÿ]',s)) and not bool(re.search(r'[\u3400-\u9fff]',s))
def phrases(item):
    result=[item['core']]
    result += list(item['logic'])
    result += [w[0] for w in item['words']]
    result += [v[0] for v in item['paragraphs']]
    # Core and full paragraph also appear as standalone sentences.
    return list(dict.fromkeys(x.strip() for x in result if x.strip() and is_french(x)))
for topic,directory in dirs.items():
    chosen=[x for x in rows if x['topic']==topic]
    if not chosen:continue
    out=BASE/directory
    manifest_path=out/'manifest.json'
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    entries=manifest.setdefault('entries',{})
    needed=list(dict.fromkeys(p for item in chosen for p in phrases(item)))
    missing=[p for p in needed if p not in entries]
    print(topic,'needed',len(needed),'missing',len(missing),flush=True)
    n=1900
    while (out/f'pack-{n:04d}.json').exists():n+=1
    for offset in range(0,len(missing),45):
        name=f'pack-{n:04d}.json';n+=1;pack={}
        for i,p in enumerate(missing[offset:offset+45]):
            audio=io.BytesIO()
            with wave.open(audio,'wb') as wf:
                wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(voice.config.sample_rate)
                for chunk in voice.synthesize(p):wf.writeframes(chunk.audio_int16_bytes)
            mp3=subprocess.run(['ffmpeg','-v','error','-f','wav','-i','pipe:0','-codec:a','libmp3lame','-q:a','7','-f','mp3','pipe:1'],input=audio.getvalue(),capture_output=True,check=True).stdout
            key=str(i);pack[key]={'text':p,'audio':base64.b64encode(mp3).decode('ascii')}
            entries[p]={'pack':name,'id':key}
        (out/name).write_text(json.dumps(pack,ensure_ascii=False),encoding='utf-8')
        print('generated',directory,name,len(pack),flush=True)
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8')
    assert all(p in entries for p in needed)
print('BonTCF C1 Piper generated successfully',flush=True)

#!/usr/bin/env python3
"""Generate static Piper fr_FR-siwis-medium audio for 45 compact Travel C1 paragraphs."""
import base64, io, json, os, subprocess, wave
from pathlib import Path
from piper import PiperVoice
root=Path(__file__).resolve().parents[1]
base=root/'eo-tache3-corpus'
source=(base/'c1-travel-minimal45-data.js').read_text(encoding='utf-8')
units=json.loads(source.split('=',1)[1].strip().rstrip(';'))
voice_path=os.environ.get('PIPER_VOICE','/tmp/fr_FR-siwis-medium.onnx')
voice=PiperVoice.load(voice_path,config_path=voice_path+'.json')
out=base/'c1-travel-minimal45-audio';out.mkdir(exist_ok=True)
manifest_path=out/'manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {'voice':'fr_FR-siwis-medium','version':'travel-minimal45-v1','entries':{}}
entries=manifest['entries']
# Reuse exact recordings from the existing C1 travel index, but do not assume modified text matches.
previous=json.loads((base/'c1-travel-audio/manifest.json').read_text(encoding='utf-8'))['entries']
for u in units:
    phrase=u['fr'].strip()
    if phrase in entries:continue
    if phrase in previous:
        entries[phrase]={'reuse':'../c1-travel-audio/'+previous[phrase]['pack'],'id':previous[phrase]['id']}
        continue
    buf=io.BytesIO()
    with wave.open(buf,'wb') as wf:
        wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(voice.config.sample_rate)
        for chunk in voice.synthesize(phrase):wf.writeframes(chunk.audio_int16_bytes)
    mp3=subprocess.run(['ffmpeg','-v','error','-f','wav','-i','pipe:0','-c:a','libmp3lame','-q:a','7','-f','mp3','pipe:1'],input=buf.getvalue(),capture_output=True,check=True).stdout
    name=u['id'].lower()+'.json'
    (out/name).write_text(json.dumps({'0':{'text':phrase,'audio':base64.b64encode(mp3).decode('ascii')}},ensure_ascii=False),encoding='utf-8')
    entries[phrase]={'pack':name,'id':'0'}
    print('Generated',u['id'],len(mp3),'bytes',flush=True)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
assert len(units)==45 and all(u['fr'].strip() in entries for u in units)
for v in entries.values():
    assert (out/v['pack']).is_file() if 'pack' in v else (out/v['reuse']).is_file()
print('Verified 45/45 audio entries',flush=True)

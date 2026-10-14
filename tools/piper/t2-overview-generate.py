#!/usr/bin/env python3
"""Pre-generate Piper SIWIS MP3 for all complete T2 overview sentences."""
import hashlib, json, pathlib, re, subprocess, tempfile, wave
from piper import PiperVoice
root=pathlib.Path(__file__).resolve().parents[2]
js=(root/'combined-expressions/t2-transform.js').read_text(encoding='utf8')
m=re.search(r'const T2_OVERVIEW_PIPER_TEXTS=(\[[^;]+\]);',js)
if not m: raise RuntimeError('T2 overview text list missing')
texts=json.loads(m.group(1))
assert len(texts)==17 and len(texts)==len(set(texts))
out=root/'combined-expressions/t2-overview-audio'
out.mkdir(parents=True,exist_ok=True)
voice=PiperVoice.load('/tmp/fr_FR-siwis-medium.onnx',config_path='/tmp/fr_FR-siwis-medium.onnx.json')
entries={}
for i,text in enumerate(texts,1):
    name=hashlib.sha256(text.encode('utf8')).hexdigest()[:20]+'.mp3'
    target=out/name
    if not target.exists() or target.stat().st_size<256:
        with tempfile.TemporaryDirectory() as d:
            wav=pathlib.Path(d)/'audio.wav'
            with wave.open(str(wav),'wb') as f: voice.synthesize_wav(text,f)
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-qscale:a','4',str(target)],check=True)
    entries[text]=name
    print(f'{i}/{len(texts)}: {text}',flush=True)
(out/'manifest.json').write_text(json.dumps({'voice':'fr_FR-siwis-medium','count':len(entries),'entries':entries},ensure_ascii=False,indent=2)+'\n',encoding='utf8')

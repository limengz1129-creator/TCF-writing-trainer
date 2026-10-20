#!/usr/bin/env python3
"""Generate exact-text fr_FR-siwis-medium static audio for relocated C1 collocations."""
import base64
import io
import json
import os
import subprocess
import wave
from pathlib import Path
from piper import PiperVoice

root=Path(__file__).resolve().parents[1]
source=(root/'combined-expressions/c1-grammar-data.js').read_text(encoding='utf-8')
start=source.index('const C1_GRAMMAR_DATA=')+len('const C1_GRAMMAR_DATA=')
end=source.index(';\nDATA.push',start)
data=json.loads(source[start:end])
excluded='c1-6e3ef78552938130'
rows=[e for e in data['entries'] if e.get('category')==0 and e.get('kind')=='collocation' and e.get('subcategory')=='高频固定搭配' and e.get('id')!=excluded]
preferred={
 'c1-d83371b2df02db43':'Il se peut que nous devions prendre des mesures supplémentaires pour résoudre ce problème.',
 'c1-0ebe5ea405f8af79':'Il est possible que le gouvernement doive intervenir davantage dans certaines situations.'
}
needed=[]
for e in rows:
    needed.append(e['french'])
    sample=preferred.get(e['id']) or next((x.get('french') for x in e.get('examples',[]) if x.get('french')),None)
    if sample: needed.append(sample)
needed=list(dict.fromkeys(needed))
out=root/'combined-expressions/c1-relocated-audio'
out.mkdir(parents=True,exist_ok=True)
manifest={'voice':'fr_FR-siwis-medium','entries':{}}
voice_path=Path(os.getenv('PIPER_VOICE','/tmp/fr_FR-siwis-medium.onnx'))
voice=PiperVoice.load(str(voice_path),config_path=str(voice_path)+'.json')
for batch in range(0,len(needed),40):
    packname=f'pack-{batch//40:03d}.json'
    pack={}
    for i,raw in enumerate(needed[batch:batch+40]):
        wav=io.BytesIO()
        with wave.open(wav,'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(voice.config.sample_rate)
            for c in voice.synthesize(raw.replace(' + ', ', ')):
                wf.writeframes(c.audio_int16_bytes)
        mp3=subprocess.run(['ffmpeg','-v','error','-f','wav','-i','pipe:0','-codec:a','libmp3lame','-q:a','7','-f','mp3','pipe:1'],input=wav.getvalue(),capture_output=True,check=True).stdout
        key=str(i)
        pack[key]={'text':raw,'audio':base64.b64encode(mp3).decode('ascii')}
        manifest['entries'][raw]={'pack':packname,'id':key}
    (out/packname).write_text(json.dumps(pack,ensure_ascii=False),encoding='utf-8')
    print(packname,len(pack),flush=True)
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8')
assert len(manifest['entries'])==len(needed)
print('Piper coverage complete',len(rows),'entries:',len(needed))

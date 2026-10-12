#!/usr/bin/env python3
"""Generate isolated Piper siwis audio for verb120, without changing shared audio."""
import argparse, base64, hashlib, json, subprocess, tempfile, wave, re
from pathlib import Path
from piper import PiperVoice
ROOT=Path(__file__).resolve().parents[3]
DATA=ROOT/'combined-expressions/verb120/data.json'
OUT=ROOT/'combined-expressions/verb120/piper-audio'
def synthesize(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/'phrase.wav';mp3=Path(td)/'phrase.mp3'
        with wave.open(str(wav),'wb') as wf:voice.synthesize_wav(text,wf)
        with wave.open(str(wav),'rb') as wf:duration=wf.getnframes()/wf.getframerate()
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','48k',str(mp3)],check=True)
        return {'text':text,'audio':base64.b64encode(mp3.read_bytes()).decode('ascii'),'duration':round(duration,3),'timing':[{'start':0,'end':round(duration,3),'from':0,'to':len(text)}],'alignment':'phrase'}
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--model',required=True);args=ap.parse_args()
    rows=json.loads(DATA.read_text(encoding='utf-8'))
    assert len(rows)==120
    texts=[]
    for row in rows:
        assert 'qc' not in re.findall(r'\bqc\b',row['pattern']), 'qc remains in visible pattern'
        assert 'qc' not in re.findall(r'\bqc\b',row['speak'])
        assert not re.search(r'\b(?:qch|qn)\b',row['speak']), 'abbreviation remains in spoken text'
        for field in ('speak','example'):
            s=row[field].strip()
            # Remove grammar annotations that are not natural speech.
            s=re.sub(r'\s*\+\s*(indicatif|subjonctif)', '',s)
            if s not in texts:texts.append(s)
    print('Piper target count:',len(texts),flush=True)
    OUT.mkdir(parents=True,exist_ok=True)
    voice=PiperVoice.load(args.model)
    manifest={'voice':'fr_FR-siwis-medium','count':len(texts),'version':1,'records':{},'targets':{}}
    pack={};n=0;size=0
    def flush():
        nonlocal pack,n,size
        if not pack:return
        filename=f'pack-{n:03}.json'
        (OUT/filename).write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
        for rid in pack:manifest['records'][rid]={'id':rid,'pack':filename}
        print(filename,len(pack),flush=True);pack={};size=0;n+=1
    for index,s in enumerate(texts,1):
        rid=hashlib.sha1(s.encode('utf-8')).hexdigest()[:20]
        item=synthesize(voice,s)
        encoded=json.dumps(item,ensure_ascii=False,separators=(',',':'))
        if pack and size+len(encoded)>1400000:flush()
        pack[rid]=item;size+=len(encoded)
        manifest['targets'][s]=[{'id':rid,'offset':0}]
        if index%20==0:print('Audio',index,'/',len(texts),flush=True)
    flush()
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print('Complete:',len(manifest['targets']),'audio targets',flush=True)
if __name__=='__main__':main()

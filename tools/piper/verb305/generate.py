#!/usr/bin/env python3
"""Isolated Piper fr_FR-siwis-medium audio builder for the 305-entry verb preposition module."""
import argparse,base64,hashlib,json,subprocess,tempfile,wave,re
from pathlib import Path
from piper import PiperVoice
ROOT=Path(__file__).resolve().parents[3]
DATA=ROOT/'combined-expressions/verb120/preposition/data.json'
OUT=ROOT/'combined-expressions/verb120/preposition/piper-audio'
def spoken(s):
    s=re.sub(r'\bqch\b','quelque chose',s,flags=re.I)
    s=re.sub(r'\bqn\b',"quelqu'un",s,flags=re.I)
    return re.sub(r'\s*\+\s*(?:indicatif|subjonctif|infinitif)$','',s,flags=re.I).strip()
def build(voice,text):
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/'voice.wav';mp3=Path(td)/'voice.mp3'
        with wave.open(str(wav),'wb') as wf:voice.synthesize_wav(text,wf)
        with wave.open(str(wav),'rb') as wf:duration=wf.getnframes()/wf.getframerate()
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','48k',str(mp3)],check=True)
        return {'text':text,'audio':base64.b64encode(mp3.read_bytes()).decode(),'duration':round(duration,3),'timing':[{'start':0,'end':round(duration,3),'from':0,'to':len(text)}],'alignment':'phrase'}
def main():
    p=argparse.ArgumentParser();p.add_argument('--model',required=True);args=p.parse_args()
    items=json.loads(DATA.read_text(encoding='utf-8'))
    assert len(items)==305 and len({r['id'] for r in items})==305
    strings=list(dict.fromkeys(spoken(s) for r in items for s in [r['pattern'],r.get('example','')] if s.strip()))
    print('Piper targets',len(strings),flush=True)
    OUT.mkdir(parents=True,exist_ok=True);voice=PiperVoice.load(args.model)
    manifest={'voice':'fr_FR-siwis-medium','count':len(strings),'version':1,'targets':{},'records':{}}
    pack={};size=0;n=0
    def flush():
        nonlocal pack,size,n
        if not pack:return
        path=f'pack-{n:03d}.json'
        (OUT/path).write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
        for k in pack:manifest['records'][k]={'id':k,'pack':path}
        print(path,len(pack),flush=True);pack={};size=0;n+=1
    for i,s in enumerate(strings,1):
        rid=hashlib.sha1(s.encode()).hexdigest()[:20]
        entry=build(voice,s);encoded=json.dumps(entry,ensure_ascii=False,separators=(',',':'))
        if size+len(encoded)>1300000 and pack:flush()
        pack[rid]=entry;size+=len(encoded);manifest['targets'][s]=[{'id':rid,'offset':0}]
        if i%30==0:print(i,len(strings),flush=True)
    flush()
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
if __name__=='__main__':main()

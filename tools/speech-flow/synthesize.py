"""Generate missing local Piper speech; existing original-corpus recordings are reused."""
import json,base64,subprocess,hashlib,sys,time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import onnxruntime as ort
ort.disable_telemetry_events()
from piper import PiperVoice
MODEL=sys.argv[1] if len(sys.argv)>1 else '/tmp/t2-piper/fr_FR-siwis-medium.onnx'
CACHE=Path('/tmp/tcf-flow-audio-cache');CACHE.mkdir(exist_ok=True)
def init():
 global voice
 voice=PiperVoice.load(MODEL)
 options=ort.SessionOptions();options.intra_op_num_threads=1;options.inter_op_num_threads=1
 voice.session=ort.InferenceSession(MODEL,sess_options=options,providers=['CPUExecutionProvider'])
def generate(x):
 p=CACHE/(x['id']+'.json')
 if p.exists():return
 chunks=list(voice.synthesize(x['text']));raw=b''.join(c.audio_int16_bytes for c in chunks);rate=chunks[0].sample_rate;duration=len(raw)/2/rate
 mp3=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-f','s16le','-ar',str(rate),'-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','48k','-f','mp3','pipe:1'],input=raw,capture_output=True,check=True).stdout
 p.write_text(json.dumps({'text':x['text'],'audio':base64.b64encode(mp3).decode(),'duration':round(duration,4),'timing':[{'start':0,'end':round(duration,4),'from':0,'to':len(x['text'])}],'alignment':'phrase'},ensure_ascii=False,separators=(',',':')))
def main():
 tasks=json.loads(Path('/tmp/flow-audio-tasks.json').read_text());start=time.time()
 with ProcessPoolExecutor(max_workers=4,initializer=init) as pool:
  for i,_ in enumerate(pool.map(generate,tasks),1):
   if i%40==0 or i==len(tasks): print('Piper',i,'/',len(tasks),'elapsed',round(time.time()-start),'s',flush=True)
 root=Path('combined-expressions/speech-flow-audio');manifest=json.loads((root/'manifest.json').read_text());pack={};size=0;number=0
 def flush():
  nonlocal pack,size,number
  if not pack:return
  name=f'pack-{number:02}.json';(root/name).write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')))
  for id,r in pack.items():manifest['entries'][r['text']]={'pack':name,'id':id}
  number+=1;pack={};size=0
 for x in tasks:
  r=json.loads((CACHE/(x['id']+'.json')).read_text());amount=len(r['audio'])
  if size+amount>1400000:flush()
  pack[x['id']]=r;size+=amount
 flush();(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')));print('Complete',number,'packs',len(manifest['entries']),'texts',flush=True)
if __name__=='__main__':main()

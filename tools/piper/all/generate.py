import ctypes,errno
seccomp=ctypes.CDLL('libseccomp.so.2',use_errno=True)
seccomp.seccomp_init.argtypes=[ctypes.c_uint32];seccomp.seccomp_init.restype=ctypes.c_void_p
seccomp.seccomp_syscall_resolve_name.argtypes=[ctypes.c_char_p]
seccomp.seccomp_rule_add.argtypes=[ctypes.c_void_p,ctypes.c_uint32,ctypes.c_int,ctypes.c_uint]
seccomp.seccomp_load.argtypes=[ctypes.c_void_p]
ctx=seccomp.seccomp_init(0x7fff0000)
if not ctx:raise RuntimeError('Offline isolation unavailable')
for name in [b'socket',b'connect',b'sendto',b'sendmsg',b'sendmmsg']:
 syscall=seccomp.seccomp_syscall_resolve_name(name)
 if syscall>=0 and seccomp.seccomp_rule_add(ctx,0x50000|errno.EPERM,syscall,0)!=0:raise RuntimeError('Cannot disable networking')
if seccomp.seccomp_load(ctx)!=0:raise RuntimeError('Cannot enforce offline mode')
import json,re,base64,subprocess,time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import onnxruntime as ort
ort.disable_telemetry_events()
from piper import PiperVoice
ROOT=Path(__file__).parent;CACHE=ROOT/'cache';PACKS=ROOT/'packs'
CACHE.mkdir(exist_ok=True);PACKS.mkdir(exist_ok=True)
VOICE=None
def init():
 global VOICE
 VOICE=PiperVoice.load(str(ROOT.parent/'piper-build/aligned.onnx'))
 options=ort.SessionOptions();options.intra_op_num_threads=1;options.inter_op_num_threads=1
 VOICE.session=ort.InferenceSession(str(ROOT.parent/'piper-build/aligned.onnx'),sess_options=options,providers=['CPUExecutionProvider'])
def generate(atom):
 dest=CACHE/(atom['id']+'.json')
 if dest.exists():return atom['id']
 text=atom['text'];audio=[];groups=[];offset=0
 for chunk in VOICE.synthesize(text,include_alignments=True):
  audio.append(chunk.audio_int16_bytes);start=None
  for alignment in chunk.phoneme_alignments:
   duration=int(alignment.num_samples)/chunk.sample_rate
   if alignment.phoneme in ('^','$',' '):
    if start is not None:groups.append([round(start,4),round(offset,4)]);start=None
   elif start is None:start=offset
   offset+=duration
  if start is not None:groups.append([round(start,4),round(offset,4)])
 matches=list(re.finditer(r'\S+',text));exact=len(matches)==len(groups)
 timing=[{'start':a,'end':b,'from':m.start(),'to':m.end()} for m,(a,b) in zip(matches,groups)] if exact else [{'start':0,'end':round(offset,4),'from':0,'to':len(text)}]
 result=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-f','s16le','-ar',str(VOICE.config.sample_rate),'-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','48k','-f','mp3','pipe:1'],input=b''.join(audio),capture_output=True,check=True)
 record={'text':text,'audio':base64.b64encode(result.stdout).decode(),'duration':round(offset,4),'timing':timing,'alignment':'word' if exact else 'phrase'}
 dest.write_text(json.dumps(record,ensure_ascii=False,separators=(',',':')))
 return atom['id']
def main():
 catalog=json.loads((ROOT/'catalog.json').read_text());old=json.loads((ROOT.parent/'piper-build/packs/manifest.json').read_text())
 pending=[a for a in catalog['atoms'] if a['text'] not in old['entries']]
 print(f'Offline synthesis: {len(pending)} new, four workers',flush=True);start=time.time()
 with ProcessPoolExecutor(max_workers=4,initializer=init) as pool:
  for index,_ in enumerate(pool.map(generate,pending),1):
   if index%100==0 or index==len(pending):print(f'{index}/{len(pending)}, {round(time.time()-start)}s',flush=True)
 manifest={'voice':'fr_FR-siwis-medium','version':1,'records':{},'targets':{}}
 for a in catalog['atoms']:
  if a['text'] in old['entries']:
   link=old['entries'][a['text']]
   manifest['records'][a['id']]={'pack':'../combined-expressions/piper-audio/'+link['pack'],'id':link['id']}
 pack={};bytesize=0;number=0
 def flush():
  nonlocal pack,bytesize,number
  if not pack:return
  name=f'pack-{number:03}.json';(PACKS/name).write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')))
  for key in pack:manifest['records'][key]={'pack':name,'id':key}
  number+=1;pack={};bytesize=0
 for atom in pending:
  raw=(CACHE/(atom['id']+'.json')).read_text()
  if bytesize+len(raw)>1800000:flush()
  pack[atom['id']]=json.loads(raw);bytesize+=len(raw)
 flush()
 for t in catalog['targets']:manifest['targets'][t['text']]=t['segments']
 # Also keep every combined-page expression available if corpus catalogs differ later.
 for text,link in old['entries'].items():
  if text not in manifest['targets']:
   key='combined:'+link['id'];manifest['records'][key]={'pack':'../combined-expressions/piper-audio/'+link['pack'],'id':link['id']}
   manifest['targets'][text]=[{'id':key,'offset':0}]
 (PACKS/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
 print(f'Done: {number} packs, {len(manifest["targets"])} targets',flush=True)
if __name__=='__main__':main()

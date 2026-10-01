import ctypes,errno
# Kernel-enforced offline generation: deny all new sockets and outbound sends.
seccomp=ctypes.CDLL('libseccomp.so.2',use_errno=True)
seccomp.seccomp_init.argtypes=[ctypes.c_uint32]
seccomp.seccomp_init.restype=ctypes.c_void_p
seccomp.seccomp_syscall_resolve_name.argtypes=[ctypes.c_char_p]
seccomp.seccomp_rule_add.argtypes=[ctypes.c_void_p,ctypes.c_uint32,ctypes.c_int,ctypes.c_uint]
seccomp.seccomp_load.argtypes=[ctypes.c_void_p]
ctx=seccomp.seccomp_init(0x7fff0000)
if not ctx:raise RuntimeError('Offline isolation unavailable')
for name in [b'socket',b'connect',b'sendto',b'sendmsg',b'sendmmsg']:
 syscall=seccomp.seccomp_syscall_resolve_name(name)
 if syscall>=0 and seccomp.seccomp_rule_add(ctx,0x50000|errno.EPERM,syscall,0)!=0:
  raise RuntimeError('Unable to disable networking')
if seccomp.seccomp_load(ctx)!=0:raise RuntimeError('Unable to enforce offline mode')
print('Offline mode enforced: network syscalls denied',flush=True)
import json,re,base64,subprocess,time
from pathlib import Path
import numpy as np
import onnxruntime as ort
ort.disable_telemetry_events()
from piper import PiperVoice

ROOT=Path(__file__).parent
source=(ROOT/'data.js').read_text()
decoder=json.JSONDecoder()
data,_=decoder.raw_decode(source.split('const DATA=',1)[1])
voice=PiperVoice.load(str(ROOT/'aligned.onnx'))
opts=ort.SessionOptions()
opts.intra_op_num_threads=2
opts.inter_op_num_threads=1
voice.session=ort.InferenceSession(str(ROOT/'aligned.onnx'),sess_options=opts,providers=['CPUExecutionProvider'])
packdir=ROOT/'packs'
packdir.mkdir(exist_ok=True)
manifest={'voice':'fr_FR-siwis-medium','count':len(data),'entries':{}}
started=time.time()
for packnum in range((len(data)+63)//64):
 entries=data[packnum*64:(packnum+1)*64]
 dest=packdir/f'pack-{packnum:02}.json'
 if dest.exists():
  pack=json.loads(dest.read_text())
 else:
  pack={}
  for entry in entries:
   text=entry['fr'];audio=[];groups=[];offset=0
   for chunk in voice.synthesize(text,include_alignments=True):
    audio.append(chunk.audio_int16_bytes)
    group_start=None
    for alignment in chunk.phoneme_alignments:
     duration=int(alignment.num_samples)/chunk.sample_rate
     if alignment.phoneme in ('^','$',' '):
      if group_start is not None:
       groups.append([round(group_start,4),round(offset,4)])
       group_start=None
     elif group_start is None:
      group_start=offset
     offset+=duration
    if group_start is not None:groups.append([round(group_start,4),round(offset,4)])
   matches=list(re.finditer(r'\S+',text))
   exact=len(matches)==len(groups)
   timing=[{'start':a,'end':b,'from':m.start(),'to':m.end()} for m,(a,b) in zip(matches,groups)] if exact else [{'start':0,'end':round(offset,4),'from':0,'to':len(text)}]
   result=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-f','s16le','-ar',str(voice.config.sample_rate),'-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','48k','-f','mp3','pipe:1'],input=b''.join(audio),capture_output=True,check=True)
   pack[entry['id']]={'text':text,'audio':base64.b64encode(result.stdout).decode(),'duration':round(offset,4),'timing':timing,'alignment':'word' if exact else 'phrase'}
  dest.write_text(json.dumps(pack,ensure_ascii=False,separators=(',',':')))
 for e in entries:manifest['entries'][e['fr']]={'id':e['id'],'pack':f'pack-{packnum:02}.json'}
 print(f'Pack {packnum+1}: {min((packnum+1)*64,len(data))}/{len(data)}, {round(time.time()-started)}s',flush=True)
(packdir/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')))
print('Done',flush=True)

import generate as g
import json,re,base64,subprocess,time
from concurrent.futures import ProcessPoolExecutor
COUNTS={}
def spoken(s):return any(c.isalpha() and c not in 'ˈˌ' for c in s)
def count(token):
 if token not in COUNTS:
  COUNTS[token]=sum(spoken(p) for ps in g.VOICE.phonemize(token) for p in ''.join(ps).split(' '))
 return COUNTS[token]
def upgrade(atom):
 dest=g.CACHE/(atom['id']+'.json')
 try:old=json.loads(dest.read_text())
 except (FileNotFoundError,json.JSONDecodeError):return 'missing'
 if old['alignment']=='word':return 'word'
 text=atom['text'];audio=[];groups=[];offset=0
 for chunk in g.VOICE.synthesize(text,include_alignments=True):
  audio.append(chunk.audio_int16_bytes);start=None;phonemes=''
  for alignment in chunk.phoneme_alignments:
   duration=int(alignment.num_samples)/chunk.sample_rate
   if alignment.phoneme in ('^','$',' '):
    if start is not None and spoken(phonemes):groups.append([round(start,4),round(offset,4)])
    start=None;phonemes=''
   else:
    if start is None:start=offset
    phonemes+=alignment.phoneme
   offset+=duration
  if start is not None and spoken(phonemes):groups.append([round(start,4),round(offset,4)])
 matches=list(re.finditer(r'\S+',text));counts=[count(m[0]) for m in matches]
 if sum(counts)!=len(groups):return 'phrase'
 timing=[];position=0
 for m,n in zip(matches,counts):
  if n:timing.append({'start':groups[position][0],'end':groups[position+n-1][1],'from':m.start(),'to':m.end()});position+=n
 if not timing:return 'phrase'
 result=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-f','s16le','-ar',str(g.VOICE.config.sample_rate),'-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','48k','-f','mp3','pipe:1'],input=b''.join(audio),capture_output=True,check=True)
 record={'text':text,'audio':base64.b64encode(result.stdout).decode(),'duration':round(offset,4),'timing':timing,'alignment':'word'}
 temp=dest.with_suffix('.tmp');temp.write_text(json.dumps(record,ensure_ascii=False,separators=(',',':')));temp.replace(dest)
 return 'improved'
def main():
 catalog=json.loads((g.ROOT/'catalog.json').read_text());todo=[]
 for atom in catalog['atoms']:
  try:r=json.loads((g.CACHE/(atom['id']+'.json')).read_text())
  except (FileNotFoundError,json.JSONDecodeError):continue
  if r['alignment']=='phrase':todo.append(atom)
 print(f'Checking {len(todo)} phrase alignments offline',flush=True)
 start=time.time();totals={}
 with ProcessPoolExecutor(max_workers=3,initializer=g.init) as pool:
  for index,status in enumerate(pool.map(upgrade,todo),1):
   totals[status]=totals.get(status,0)+1
   if index%100==0 or index==len(todo):print(f'{index}/{len(todo)}, {round(time.time()-start)}s, {totals}',flush=True)
 print('Alignment pass done',totals,flush=True)
if __name__=='__main__':main()

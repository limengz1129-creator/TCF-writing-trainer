(()=>{'use strict';
const $=id=>document.getElementById(id);
const table=$('tableStudy'),main=document.querySelector('.layout'),rows=$('tableRows'),player=$('tableAudio');
let data=[],page=0,manifest=null,packCache=new Map(),blobUrl=null,token=0,shuffle=false,order=[];
const speechStatus=$('tableSpeechStatus');
const spoken=x=>x.speak.replace(/\s*\+\s*(indicatif|subjonctif)$/,'').trim();
function visible(){
 let a=data.filter(x=>
   (!$('level').value||x.level===$('level').value)&&
   (!$('task').value||x.task===$('task').value)&&
   (!$('scope').value||($('scope').value==='new'?!status(x.id)?.attempts:$('scope').value==='wrong'?status(x.id)?.wrong&&!status(x.id)?.correct:true))&&
   (!$('search').value||[x.zh,x.pattern,x.example].some(t=>t.toLowerCase().includes($('search').value.toLowerCase())))
 );
 if(shuffle)a.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
 return a;
}
function status(id){try{return JSON.parse(localStorage.getItem('TCF-VERB120-ONLY-v1')||'{}')[id]||null}catch{return null}}
function stop(){
 token++;player.pause();player.removeAttribute('src');player.load();
 if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}
 document.querySelectorAll('.batch-speaking').forEach(x=>x.classList.remove('batch-speaking'));
}
async function play(text,button){
 stop();let seq=token;
 button.disabled=true;speechStatus.textContent='正在载入 Piper 法语音频……';
 try{
  if(!manifest){const r=await fetch('piper-audio/manifest.json');if(!r.ok)throw Error('音频索引尚未部署');manifest=await r.json()}
  const lookup=manifest.targets[text]?.[0];if(!lookup)throw Error('该法语文本没有匹配音频');
  const ref=manifest.records[lookup.id];if(!ref)throw Error('音频索引不完整');
  if(!packCache.has(ref.pack)){const r=await fetch('piper-audio/'+ref.pack);if(!r.ok)throw Error('音频包尚未部署');packCache.set(ref.pack,await r.json())}
  const recording=packCache.get(ref.pack)[ref.id];
  if(!recording||recording.text!==text)throw Error('音频文本校验失败');
  if(seq!==token)return;
  const bytes=Uint8Array.from(atob(recording.audio),c=>c.charCodeAt(0));
  blobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
  player.src=blobUrl;player.playbackRate=Number($('tableSpeed').value);
  player.preservesPitch=true;button.classList.add('batch-speaking');
  await player.play();speechStatus.textContent='正在朗读 · Piper fr_FR-siwis-medium';
 }catch(e){if(seq===token)speechStatus.textContent=e.message}
 finally{button.disabled=false}
}
function audioButton(text,label){
 const b=document.createElement('button');b.type='button';b.className='batch-audio';
 b.textContent='🔊';b.title='Piper朗读'+label;b.setAttribute('aria-label','朗读'+label);
 b.onclick=()=>play(text,b);return b;
}
function render(){
 if(table.hidden)return;
 stop();
 const a=visible(),totalPages=Math.max(1,Math.ceil(a.length/20));
 page=Math.min(page,totalPages-1);
 const slice=a.slice(page*20,(page+1)*20);
 rows.replaceChildren();
 for(const x of slice){
  const tr=document.createElement('tr');
  const zh=document.createElement('td'),pattern=document.createElement('td'),ex=document.createElement('td');
  const num=document.createElement('small');num.className='batch-index';num.textContent=String(x.id).padStart(3,'0')+' · '+x.level+' / '+x.task;
  const name=document.createElement('div');name.textContent=x.zh;zh.append(num,name);
  const phrase=document.createElement('span');phrase.className='batch-fr';phrase.lang='fr';phrase.textContent=x.pattern;
  const example=document.createElement('span');example.className='batch-fr';example.lang='fr';example.textContent=x.example;
  pattern.append(phrase,audioButton(spoken(x),'动词搭配'));
  ex.append(example,audioButton(x.example,'法语例句'));
  tr.append(zh,pattern,ex);rows.append(tr);
 }
 $('tableHeading').textContent='批量表格 · '+slice.length+' / 20 条';
 $('tablePage').textContent='第 '+(page+1)+' / '+totalPages+' 批 · 共 '+a.length+' 条';
 $('tablePrev').disabled=page===0;$('tableNext').disabled=page>=totalPages-1;
 if(!slice.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=3;td.textContent='当前筛选没有内容';tr.append(td);rows.append(tr)}
 speechStatus.textContent='';
}
function changeMode(show){
 table.hidden=!show;main.hidden=show;
 // The original app's .layout grid rule must never override hidden.
 $('tableMode').setAttribute('aria-pressed',String(show));
 $('singleMode').setAttribute('aria-pressed',String(!show));
 stop();if(show)render();
}
$('tableMode').onclick=()=>changeMode(true);
$('singleMode').onclick=()=>changeMode(false);
$('tablePrev').onclick=()=>{if(page>0){page--;render()}};
$('tableNext').onclick=()=>{page++;render()};
$('tableStop').onclick=()=>{stop();speechStatus.textContent='朗读已停止'};
$('tableSpeed').onchange=()=>{player.playbackRate=Number($('tableSpeed').value)};
player.onended=()=>{document.querySelectorAll('.batch-speaking').forEach(x=>x.classList.remove('batch-speaking'));speechStatus.textContent='朗读完成'};
for(const id of ['level','task','scope','search']) $(id).addEventListener(id==='search'?'input':'change',()=>{page=0;render()});
$('shuffle').addEventListener('click',()=>{shuffle=!shuffle;order=data.map(x=>x.id);if(shuffle)for(let i=order.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}page=0;render()});
$('import').addEventListener('change',()=>setTimeout(()=>render(),100));
window.addEventListener('pagehide',stop);
fetch('data.json').then(r=>{if(!r.ok)throw Error('无法加载数据');return r.json()}).then(x=>{if(!Array.isArray(x)||x.length!==120)throw Error('120 条数据校验失败');data=x;render()}).catch(e=>{speechStatus.textContent=e.message});
})();
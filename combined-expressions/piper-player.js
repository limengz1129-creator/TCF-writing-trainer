(()=>{
'use strict';
const box=document.createElement('section');
box.id='piperSpeech';box.style.cssText='margin:12px 0;max-width:100%';
box.innerHTML='<button type="button" id="openFrenchSpeech" aria-expanded="false" aria-controls="frenchSpeechPanel">🔊 朗读原文</button><div id="frenchSpeechPanel" hidden style="margin-top:10px;padding:14px;border:1px solid #dce0ee;border-radius:10px;min-width:0"><p class="note">Piper · 法语 siwis</p><div id="speechOriginal" lang="fr" style="font-size:1.2rem;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere"></div><audio id="piperAudio" controls preload="none" style="display:block;width:100%;max-width:100%;margin:12px 0"></audio><div class="row"><button type="button" id="speakFrench">重新朗读</button><button type="button" id="stopFrench">停止</button><button type="button" id="closeFrenchSpeech">收起</button></div><label for="frenchRate">语速</label><select id="frenchRate"><option value="0.75">慢速 0.75×</option><option value="0.85">稍慢 0.85×</option><option value="1" selected>正常 1×</option><option value="1.15">稍快 1.15×</option><option value="1.25">快速 1.25×</option></select><p id="speechStatus" class="note" role="status"></p></div>';
document.querySelector('#answer').before(box);
const get=id=>box.querySelector('#'+id),panel=get('frenchSpeechPanel'),opener=get('openFrenchSpeech'),original=get('speechOriginal'),status=get('speechStatus'),audio=get('piperAudio'),rate=get('frenchRate');
const root=new URL('piper-audio/',document.baseURI);
let version=0,blobUrl=null,entry=null,spans=[],active=null,frame=0,manifestPromise=null,questionManifestPromise=null,topicManifestPromise=null;
const packs=new Map();
function mark(time){
 const current=entry?.timing.find(t=>time>=t.start&&time<t.end);
 const next=current?spans.find(s=>s.from===current.from&&s.to===current.to)?.el:null;
 if(next===active)return;
 if(active){active.style.background='';active.style.color='';active.removeAttribute('aria-current');}
 active=next||null;
 if(active){active.style.background='#ffe277';active.style.color='#202030';active.setAttribute('aria-current','true');}
}
function loop(){mark(audio.currentTime);if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(loop);}
function stop(){audio.pause();if(audio.readyState)audio.currentTime=0;cancelAnimationFrame(frame);mark(-1);}
function close(){
 version++;stop();panel.hidden=true;opener.setAttribute('aria-expanded','false');
 audio.removeAttribute('src');audio.load();if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl=null;entry=null;original.replaceChildren();
}
function render(text,timing){
 spans=[];original.replaceChildren();let cursor=0;
 for(const t of timing){original.append(document.createTextNode(text.slice(cursor,t.from)));const el=document.createElement('span');el.textContent=text.slice(t.from,t.to);original.append(el);spans.push({from:t.from,to:t.to,el});cursor=t.to;}
 original.append(document.createTextNode(text.slice(cursor)));
}
async function readJson(url){const response=await fetch(url);if(!response.ok)throw Error('音频文件加载失败');return response.json();}
async function load(text){
 if(!manifestPromise)manifestPromise=readJson(new URL('manifest.json?v=siwis-subject-1',root)).catch(e=>{manifestPromise=null;throw e;});
 const manifest=await manifestPromise;
 let link=manifest.entries[text];
 if(!link){
  if(!questionManifestPromise)questionManifestPromise=readJson(new URL('../question-audio/manifest.json?v=1',root)).catch(e=>{questionManifestPromise=null;throw e;});
  const extra=await questionManifestPromise,q=extra.entries[text];
  if(q)link={...q,pack:'../question-audio/'+q.pack};
 }
 if(!link){
  if(!topicManifestPromise)topicManifestPromise=readJson(new URL('../topic-audio/manifest.json?v=eo-t3-1',root)).catch(e=>{topicManifestPromise=null;throw e;});
  const extra=await topicManifestPromise,t=extra.entries[text];
  if(t)link={...t,pack:'../topic-audio/'+t.pack};
 }
 if(!link)throw Error('当前词条尚未生成 Piper 音频');
 let promise=packs.get(link.pack);
 if(!promise){promise=readJson(new URL(link.pack,root)).catch(e=>{packs.delete(link.pack);throw e;});packs.set(link.pack,promise);if(packs.size>3)packs.delete(packs.keys().next().value);}
 const data=(await promise)[link.id];
 if(!data||data.text!==text)throw Error('音频与当前原文不一致');
 return data;
}
window.TCF_AUDIO={load,stop:close};
async function play(){
 try{await audio.play();}
 catch{if(!panel.hidden)status.textContent='音频已就绪，请点击播放器的播放按钮试听。';}
}
async function open(){
 const text=window.TCF_SPEECH_TARGET?.()?.fr||window.TCF_GRAMMAR_TARGET?.()?.fr||'';
 panel.hidden=false;opener.setAttribute('aria-expanded','true');original.textContent=text;
 status.textContent='正在加载 Piper 法语音频……';
 const request=++version;stop();entry=null;
 if(!text){status.textContent='请先选择练习词条。';return;}
 try{
  const data=await load(text);if(request!==version)return;
  entry=data;render(text,data.timing);
  if(blobUrl)URL.revokeObjectURL(blobUrl);
  const bytes=Uint8Array.from(atob(data.audio),c=>c.charCodeAt(0));
  blobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));audio.src=blobUrl;audio.playbackRate=Number(rate.value);audio.preservesPitch=true;
  status.textContent=data.alignment==='word'?'音频已就绪 · 黄色高亮当前词语':'音频已就绪 · 当前表达按整句高亮';
  await play();
 }catch(e){if(request!==version)return;status.textContent=e.message+'。请检查网络后收起重试。';}
}
opener.onclick=()=>panel.hidden?open():close();
get('speakFrench').onclick=()=>{if(entry){stop();play();}else open();};
get('stopFrench').onclick=()=>{stop();status.textContent='已停止朗读。';};
get('closeFrenchSpeech').onclick=close;
rate.onchange=()=>{audio.playbackRate=Number(rate.value);};
audio.addEventListener('play',()=>{status.textContent=entry?.alignment==='word'?'正在朗读 · 黄色高亮当前词语':'正在朗读 · 当前表达按整句高亮';cancelAnimationFrame(frame);loop();});
audio.addEventListener('timeupdate',()=>mark(audio.currentTime));
audio.addEventListener('seeking',()=>mark(audio.currentTime));
audio.addEventListener('pause',()=>cancelAnimationFrame(frame));
audio.addEventListener('ended',()=>{mark(-1);status.textContent='朗读完成，可以重听或调整语速。';});
audio.addEventListener('error',()=>{if(!panel.hidden&&entry)status.textContent='音频播放失败，请收起后重试。';});
new MutationObserver(close).observe(document.querySelector('#prompt'),{childList:true,subtree:true,characterData:true});
document.querySelectorAll('[data-module]').forEach(e=>e.addEventListener('click',close));
window.addEventListener('pagehide',close);
})();


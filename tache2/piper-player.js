(()=>{
'use strict';
const scriptUrl=document.currentScript.src,answer=document.querySelector('#answer, #answerBox');
if(!answer||document.getElementById('piperSpeech'))return;
const box=document.createElement('section');box.id='piperSpeech';box.style.cssText='margin:12px 0;max-width:100%;min-width:0';
box.innerHTML='<button type="button" id="openFrenchSpeech" aria-expanded="false" aria-controls="frenchSpeechPanel">🔊 朗读原文</button><div id="frenchSpeechPanel" hidden style="margin-top:10px;padding:14px;border:1px solid #dce0ee;border-radius:10px;min-width:0"><p style="font-size:.85rem;color:#6d7487;margin:0 0 8px">Piper · 法语 siwis</p><div id="speechOriginal" lang="fr" style="font-size:1.2rem;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;padding:4px"></div><audio id="piperAudio" controls preload="none" style="display:block;width:100%;max-width:100%;margin:12px 0"></audio><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="speakFrench">从头重听</button><button type="button" id="stopFrench">停止</button><button type="button" id="closeFrenchSpeech">收起</button></div><label for="frenchRate" style="display:block;margin-top:10px">语速</label><select id="frenchRate" style="width:100%;max-width:100%"><option value="0.75">慢速 0.75×</option><option value="0.85">稍慢 0.85×</option><option value="1" selected>正常 1×</option><option value="1.15">稍快 1.15×</option><option value="1.25">快速 1.25×</option></select><p id="speechStatus" style="font-size:.85rem;color:#6d7487" role="status"></p></div>';
answer.before(box);
const get=id=>box.querySelector('#'+id),panel=get('frenchSpeechPanel'),opener=get('openFrenchSpeech'),original=get('speechOriginal'),status=get('speechStatus'),audio=get('piperAudio'),rate=get('frenchRate');
const root=new URL('../piper-audio/',scriptUrl);
let version=0,blobUrl=null,playlist=[],segment=0,spans=[],active=null,frame=0,manifestPromise=null,currentText='';
const packs=new Map();
function mark(time){
 const item=playlist[segment],t=item?.data.timing.find(t=>time>=t.start&&time<t.end);
 const next=t?spans.find(s=>s.from===t.from+item.offset&&s.to===t.to+item.offset)?.el:null;
 if(next===active)return;
 if(active){active.style.background='';active.style.color='';active.removeAttribute('aria-current');}
 active=next||null;
 if(active){
  active.style.background='#ffe277';active.style.color='#202030';active.setAttribute('aria-current','true');
  const a=active.getClientRects()[0]||active.getBoundingClientRect(),b=original.getBoundingClientRect();
  if(a.bottom>b.bottom)original.scrollTop+=a.bottom-b.bottom+16;
  else if(a.top<b.top)original.scrollTop+=a.top-b.top-16;
 }
}
function loop(){mark(audio.currentTime);if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(loop);}
function stop(){window.TCF_T2_SPEECH?.stop();audio.pause();if(audio.readyState)audio.currentTime=0;cancelAnimationFrame(frame);mark(-1);}
function close(){
 version++;stop();panel.hidden=true;opener.setAttribute('aria-expanded','false');
 audio.removeAttribute('src');audio.load();if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl=null;playlist=[];segment=0;currentText='';original.replaceChildren();
}
function render(text){
 spans=[];original.replaceChildren();let cursor=0;
 for(const item of playlist)for(const t of item.data.timing){
  const from=t.from+item.offset,to=t.to+item.offset;
  original.append(document.createTextNode(text.slice(cursor,from)));
  const el=document.createElement('span');el.textContent=text.slice(from,to);original.append(el);spans.push({from,to,el});cursor=to;
 }
 original.append(document.createTextNode(text.slice(cursor)));original.scrollTop=0;
}
async function readJson(url){const response=await fetch(url);if(!response.ok)throw Error('音频文件加载失败');return response.json();}
async function getPack(name){
 let promise=packs.get(name);
 if(!promise){promise=readJson(new URL(name,root)).catch(e=>{packs.delete(name);throw e;});packs.set(name,promise);if(packs.size>8)packs.delete(packs.keys().next().value);}
 return promise;
}
async function load(text){
 if(!manifestPromise)manifestPromise=readJson(new URL('manifest.json?v=1',root)).catch(e=>{manifestPromise=null;throw e;});
 const manifest=await manifestPromise,links=manifest.targets[text];
 if(!links)throw Error('当前原文尚未生成 Piper 音频');
 return Promise.all(links.map(async item=>{
  const record=manifest.records[item.id];if(!record)throw Error('音频索引缺失');
  const data=(await getPack(record.pack))[record.id];
  if(!data||text.slice(item.offset,item.offset+data.text.length)!==data.text)throw Error('音频与原文不一致');
  return {data,offset:item.offset};
 }));
}
window.TCF_PIPER_AUDIO={load,stop:close};
async function play(request=version){
 try{await audio.play();}
 catch{if(request===version&&!panel.hidden)status.textContent='音频已就绪，请点击播放器的播放按钮试听。';}
}
function segmentNote(){return playlist.length>1?'第 '+(segment+1)+' / '+playlist.length+' 段 · ':'';}
function setSegment(index){
 stop();segment=index;const item=playlist[index];if(!item)return;
 if(blobUrl)URL.revokeObjectURL(blobUrl);
 const bytes=Uint8Array.from(atob(item.data.audio),c=>c.charCodeAt(0));
 blobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));audio.src=blobUrl;audio.playbackRate=Number(rate.value);audio.preservesPitch=true;
}
async function open(){
 const text=window.TCF_GRAMMAR_TARGET?.()?.fr||'';
 panel.hidden=false;opener.setAttribute('aria-expanded','true');original.textContent=text;currentText=text;
 status.textContent='正在加载 Piper 法语音频……';
 const request=++version;stop();playlist=[];audio.removeAttribute('src');audio.load();
 if(!text){status.textContent='请先选择练习内容。';return;}
 if(window.TCF_T2_SPEECH?.edited(text)){window.TCF_T2_SPEECH.speak(text,status,rate.value);return;}
 try{
  const data=await load(text);if(request!==version)return;
  playlist=data;render(text);setSegment(0);
  status.textContent='音频已就绪';await play(request);
 }catch(e){if(request===version)window.TCF_T2_SPEECH.speak(text,status,rate.value);}
}
opener.onclick=()=>panel.hidden?open():close();
get('speakFrench').onclick=()=>{if(playlist.length){original.scrollTop=0;setSegment(0);play();}else open();};
get('stopFrench').onclick=()=>{stop();status.textContent='已停止朗读。点击播放器可继续当前段，或从头重听。';};
get('closeFrenchSpeech').onclick=close;
rate.onchange=()=>{audio.playbackRate=Number(rate.value);};
audio.addEventListener('play',()=>{status.textContent=segmentNote()+(playlist[segment]?.data.alignment==='word'?'正在朗读 · 黄色高亮当前词语':'正在朗读 · 当前段按整段高亮');cancelAnimationFrame(frame);loop();});
audio.addEventListener('timeupdate',()=>mark(audio.currentTime));
audio.addEventListener('seeking',()=>mark(audio.currentTime));
audio.addEventListener('pause',()=>cancelAnimationFrame(frame));
audio.addEventListener('ended',()=>{mark(-1);if(segment+1<playlist.length){setSegment(segment+1);play();}else status.textContent='朗读完成，可以从头重听或调整语速。';});
audio.addEventListener('error',()=>{if(!panel.hidden&&playlist.length){playlist=[];window.TCF_T2_SPEECH.speak(currentText,status,rate.value);}});
const observer=new MutationObserver(()=>{if(!panel.hidden&&(window.TCF_GRAMMAR_TARGET?.()?.fr||'')!==currentText)close();});
for(const selector of ['#prompt','#promptText','#promptZh','#position','#topicCounter','#questionCounter','#paragraphTabs','#cardCounter']){
 const element=document.querySelector(selector);if(element)observer.observe(element,{childList:true,subtree:true,characterData:true});
}
document.querySelectorAll('[data-module],[data-view]').forEach(e=>e.addEventListener('click',close));
window.addEventListener('pagehide',close);
})();


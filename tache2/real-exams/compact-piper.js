/* Piper · fr_FR-siwis-medium · static compact Tâche 2 playback.
 * Exact-text lookup: reuse existing theme recordings first, then compact additions.
 * No browser TTS and no online synthesis endpoint.
 */
(()=>{'use strict';
const script=document.currentScript;
if(!script||window.TCF_COMPACT_PIPER)return;
const root=new URL('piper-audio/',script.src);
const existingRoot=new URL('themes/',root),compactRoot=new URL('compact/',root);
const questions=[...document.querySelectorAll('.fr[lang="fr"]')];
if(!questions.length)return;
let manifests=null,token=0,currentButton=null,currentUrl=null,currentStatus=null;
const packs=new Map();
const audio=new Audio();audio.preload='none';audio.preservesPitch=true;
const panel=document.createElement('div');
panel.className='compact-piper-toolbar';
panel.innerHTML='<span>Piper · fr_FR-siwis-medium</span><label>语速 <select aria-label="Piper 朗读语速"><option value="0.75">0.75×</option><option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option><option value="1.25">1.25×</option></select></label><button type="button" class="compact-stop">停止朗读</button><span class="compact-piper-status" role="status" aria-live="polite">点击每句右下方的播放按钮</span>';
const target=document.querySelector('.intro')||document.querySelector('h1');
target.after(panel);
const select=panel.querySelector('select'),stopButton=panel.querySelector('.compact-stop'),status=panel.querySelector('.compact-piper-status');
const cacheBreaker='?v=t2compact-20261111';
function manifest(url){return fetch(new URL('manifest.json'+cacheBreaker,url)).then(r=>{if(!r.ok)throw Error('音频索引尚未部署');return r.json()})}
function indexes(){
 if(!manifests)manifests=Promise.all([manifest(existingRoot),manifest(compactRoot)]).catch(e=>{manifests=null;throw e});
 return manifests;
}
async function pack(root,name){
 const url=new URL(name,root).href;
 if(!packs.has(url))packs.set(url,fetch(url).then(r=>{if(!r.ok)throw Error('音频文件未部署');return r.json()}).catch(e=>{packs.delete(url);throw e}));
 return packs.get(url);
}
function clean(s){return s.replace(/\s*†\s*$/,'').trim()}
function reset(){
 token++;audio.pause();audio.removeAttribute('src');
 if(currentUrl){URL.revokeObjectURL(currentUrl);currentUrl=null}
 if(currentButton){currentButton.textContent='🔊 播放';currentButton.setAttribute('aria-pressed','false')}
 currentButton=null;currentStatus=null;
}
function message(t){status.textContent=t}
async function getClip(text){
 const [old,extra]=await indexes();
 if(old.targets?.[text]?.length){
  const links=old.targets[text];if(links.length!==1)throw Error('音频索引需要分段播放');
  const rec=old.records?.[links[0].id];if(!rec)throw Error('旧索引记录缺失');
  const p=await pack(existingRoot,rec.pack),clip=p[rec.id];
  if(!clip||clip.text!==text)throw Error('旧音频与法语原文不一致');
  return clip;
 }
 const ref=extra.entries?.[text];if(!ref)throw Error('当前句子尚无 Piper 音频');
 const p=await pack(compactRoot,ref.pack),clip=p[ref.id];
 if(!clip||clip.text!==text)throw Error('新音频与法语原文不一致');
 return clip;
}
async function play(button,phrase){
 if(currentButton===button&&!audio.paused){audio.pause();button.textContent='▶ 继续';message('朗读已暂停');return}
 if(currentButton===button&&audio.src&&audio.paused){audio.playbackRate=Number(select.value);try{await audio.play();button.textContent='⏸ 暂停';message('Piper · siwis · 正在朗读')}catch(e){message('点击播放按钮以继续朗读')}return}
 reset();const id=++token;currentButton=button;currentStatus=phrase;
 button.textContent='加载中…';button.setAttribute('aria-pressed','true');
 message('正在加载 Piper 法语音频……');
 try{
  const clip=await getClip(phrase);
  if(id!==token)return;
  const binary=Uint8Array.from(atob(clip.audio),c=>c.charCodeAt(0));
  currentUrl=URL.createObjectURL(new Blob([binary],{type:'audio/mpeg'}));
  audio.src=currentUrl;audio.playbackRate=Number(select.value);
  try{await audio.play();if(id===token){button.textContent='⏸ 暂停';message('Piper · siwis · 正在朗读')}}catch(e){if(id===token){button.textContent='▶ 播放';message('音频已就绪，请再次点击播放')}}
 }catch(err){if(id===token){reset();message('播放不可用：'+(err?.message||'音频加载失败'))}}
}
questions.forEach(fr=>{
 const phrase=clean(fr.textContent||'');
 const container=fr.closest('li')||fr.parentElement;
 const button=document.createElement('button');button.type='button';
 button.className='compact-piper-play';button.textContent='🔊 播放';
 button.setAttribute('aria-label','Piper 朗读法语：'+phrase);
 button.setAttribute('aria-pressed','false');
 container.append(button);button.addEventListener('click',()=>play(button,phrase));
});
select.addEventListener('change',()=>{audio.playbackRate=Number(select.value)});
stopButton.addEventListener('click',()=>{reset();message('已停止朗读')});
audio.addEventListener('ended',()=>{if(currentButton){currentButton.textContent='↻ 重听';message('朗读完成');audio.currentTime=0}});
audio.addEventListener('error',()=>{if(currentButton)message('音频播放发生错误，请重新点击')});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&currentButton&&!audio.paused)audio.pause()});
window.addEventListener('pagehide',reset);
window.TCF_COMPACT_PIPER={stop:reset};
})();

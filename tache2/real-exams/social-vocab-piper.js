(()=>{'use strict';
const root=new URL('piper-audio-social-vocab/',document.currentScript.src);
let manifestPromise=null,request=0,blobUrl=null,current=null;
const packs=new Map(),audio=new Audio();audio.preload='auto';audio.preservesPitch=true;
function setStatus(el,msg){if(el)el.textContent=msg}
async function readJson(url){const r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw Error('Piper 音频文件加载失败');return r.json()}
async function manifest(){if(!manifestPromise)manifestPromise=readJson(new URL('manifest.json?v=1',root)).catch(e=>{manifestPromise=null;throw e});return manifestPromise}
async function load(text){const m=await manifest(),links=m.targets[text];if(!links?.length)throw Error('当前词块或例句尚未生成 Piper siwis 音频');const rec=m.records[links[0].id];if(!rec)throw Error('Piper 音频索引缺失');let p=packs.get(rec.pack);if(!p){p=readJson(new URL(rec.pack,root)).catch(e=>{packs.delete(rec.pack);throw e});packs.set(rec.pack,p);if(packs.size>6)packs.delete(packs.keys().next().value)}const data=(await p)[rec.id];if(!data||data.text!==text)throw Error('Piper 音频与当前法语文本不一致');return data}
function stop(){request++;try{audio.pause();audio.currentTime=0}catch(_){}current=null;if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}audio.removeAttribute('src')}
async function play(text,status,rate=1){const clean=String(text||'').trim();if(!clean)return false;stop();const token=++request;setStatus(status,'正在加载 Piper · fr_FR-siwis-medium…');try{const data=await load(clean);if(token!==request)return false;const bytes=Uint8Array.from(atob(data.audio),c=>c.charCodeAt(0));blobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));audio.src=blobUrl;audio.playbackRate=Number(rate)||1;audio.preservesPitch=true;current={status};setStatus(status,'Piper · siwis · 正在朗读');await audio.play();return true}catch(e){if(token===request)setStatus(status,e.message+'。');return false}}
audio.addEventListener('ended',()=>{if(current)setStatus(current.status,'Piper · siwis · 朗读完成，可以重听。')});
audio.addEventListener('error',()=>{if(current)setStatus(current.status,'Piper 音频播放失败，请刷新后重试。')});
window.TCF_SOCIAL_VOCAB_PIPER={play,stop,load};window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();
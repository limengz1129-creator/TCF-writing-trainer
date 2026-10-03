'use strict';
(()=>{
 const initial=state.vocabularyStudy;
 const s=state.vocabularyStudy=initial&&typeof initial==='object'?initial:{};
 s.enabled=s.enabled===true;s.size=Number.isInteger(s.size)&&s.size>0?Math.min(s.size,1133):10;
 s.ids=Array.isArray(s.ids)?[...new Set(s.ids)].filter(id=>DATA.some(x=>x.id===id&&x.module===5)):[];
 s.used=Array.isArray(s.used)?s.used:[];
 const button=document.createElement('button');button.id='studyEnable';button.type='button';button.textContent='学习模式';$('batchEnable').after(button);
 const view=document.createElement('section');view.id='studyView';view.className='batch-view hidden';
 view.innerHTML='<h2>未覆盖词汇 · 学习模式</h2><p class="note">直接学习中文与法语，点击词条旁的按钮听发音。</p><table class="batch-table"><caption id="studyCaption"></caption><thead><tr><th scope="col">中文意思</th><th scope="col">法语词条</th></tr></thead><tbody id="studyRows"></tbody></table><audio id="studyAudio" controls preload="none" hidden style="width:100%;margin-top:12px"></audio><p id="studyStatus" role="status" aria-live="polite" class="note"></p><div class="row"><button id="studyNext" type="button">下一批</button><button id="studyStop" type="button">停止发音</button></div>';
 $('batchView').before(view);
 const active=()=>mode===5&&s.enabled;
 const sig=()=>JSON.stringify([selectedSource(),$('category').value,$('status').value,$('search').value,state.topicOverlap||'',state.topicLevels?.[5]||'']);
 const audio=$('studyAudio');let request=0,url=null;
 function stop(){request++;audio.pause();audio.removeAttribute('src');audio.load();audio.hidden=true;if(url)URL.revokeObjectURL(url);url=null;}
 async function pronounce(x){
  stop();window.TCF_AUDIO?.stop();const token=request;$('studyStatus').textContent='正在加载 '+x.fr+' 的法语发音……';
  try{const data=await window.TCF_AUDIO.load(x.fr);if(token!==request||!active())return;
   url=URL.createObjectURL(new Blob([Uint8Array.from(atob(data.audio),c=>c.charCodeAt(0))],{type:'audio/mpeg'}));audio.src=url;audio.hidden=false;audio.playbackRate=Number($('frenchRate')?.value||1);
   $('studyStatus').textContent='正在朗读：'+x.fr;
   try{await audio.play();}catch{if(token===request)$('studyStatus').textContent='音频已就绪，请点击播放器播放：'+x.fr;}
  }catch(e){if(token===request)$('studyStatus').textContent=e.message+'，请点击发音按钮重试。';}
 }
 audio.addEventListener('error',()=>{$('studyStatus').textContent='音频播放失败，请重试。';});
 audio.addEventListener('ended',()=>{$('studyStatus').textContent='朗读完成，可点击词条重听。';});
 function render(){stop();$('studyRows').replaceChildren();$('studyStatus').textContent='复用现有 Piper 法语音频。学习不会计入默写成绩或错题。';
  const rows=s.ids.map(id=>DATA.find(x=>x.id===id)).filter(Boolean);
  $('studyCaption').textContent='当前筛选 '+filtered().length+' 个词条；本批 '+rows.length+' 个。';
  for(const [i,x] of rows.entries()){
   const tr=document.createElement('tr'),zh=document.createElement('td'),fr=document.createElement('td'),text=document.createElement('span'),level=document.createElement('small'),play=document.createElement('button');
   zh.textContent=(i+1)+'. '+topicMeaning(x);level.textContent='参考等级 '+x.niveau;zh.append(level);text.textContent=x.fr;text.lang='fr';text.style.cssText='font-size:1.15rem;margin-right:12px';play.type='button';play.textContent='🔊 发音';play.setAttribute('aria-label','朗读 '+x.fr);play.onclick=()=>pronounce(x);fr.append(text,play);tr.append(zh,fr);$('studyRows').append(tr);
  }
  $('studyNext').disabled=!rows.length;
 }
 function start(reset){const n=Number($('batchSize').value);if(!Number.isInteger(n)||n<1||n>1133){$('batchSize').setCustomValidity('请输入 1 到 1133 之间的整数。');$('batchSize').reportValidity();return;}
  $('batchSize').setCustomValidity('');s.size=n;if(reset||s.scope!==sig()){s.used=[];s.scope=sig();}
  const pool=filtered(),used=new Set(s.used),rows=pool.filter(x=>!used.has(x.id)).slice(0,n);
  if(!rows.length&&pool.length&&!reset){$('studyStatus').textContent='当前筛选已全部学完。点击“开始这一批”可重新开始。';return;}
  s.ids=rows.map(x=>x.id);s.used=[...new Set([...s.used,...s.ids])];s.enabled=true;sync(false);render();if(!pool.length)$('studyStatus').textContent='当前筛选没有词条，请调整筛选条件。';persist();
 }
 function sync(refresh=true){button.classList.toggle('hidden',mode!==5);button.classList.toggle('primary',active());button.setAttribute('aria-pressed',String(active()));view.classList.toggle('hidden',!active());
  if(active()){$('batchView').classList.add('hidden');$('practice').classList.add('hidden');for(const id of ['batchSingle','batchEnable']){$(id).classList.remove('primary');$(id).setAttribute('aria-pressed','false');}
   $('batchSize').value=s.size;if(refresh){if(s.scope!==sig()||!s.ids.length)start(true);else render();}}
 }
 const oldShow=show;show=function(x){oldShow(x);sync();};
 const oldSet=setModule;setModule=function(m,fresh=false){if(m===5&&fresh)s.enabled=false;stop();oldSet(m,fresh);sync();};
 for(const id of ['batchSingle','batchReturn','batchEnable']){const old=$(id).onclick;$(id).onclick=()=>{s.enabled=false;stop();if(mode===5)$('batchSize').value=state.vocabularyBatch.size;old();sync(false);persist();};}
 const oldStart=$('batchStart').onclick;$('batchStart').onclick=()=>active()?start(true):oldStart();
 document.querySelectorAll('[data-batch-size]').forEach(b=>{const old=b.onclick;b.onclick=()=>{if(active()){$('batchSize').value=b.dataset.batchSize;start(true);}else old();};});
 button.onclick=()=>{s.enabled=true;state.vocabularyBatch.enabled=false;$('batchSize').value=s.size;sync();persist();};
 $('studyNext').onclick=()=>start(false);$('studyStop').onclick=()=>{stop();$('studyStatus').textContent='已停止朗读。';};
 window.addEventListener('pagehide',stop);sync();
})();

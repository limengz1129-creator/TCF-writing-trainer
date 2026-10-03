'use strict';
(()=>{
 const initial=state.vocabularyStudy;
 const s=state.vocabularyStudy=initial&&typeof initial==='object'?initial:{};
 s.enabled=s.enabled===true;s.size=Number.isInteger(s.size)&&s.size>0?Math.min(s.size,1133):10;
 s.ids=Array.isArray(s.ids)?[...new Set(s.ids)].filter(id=>DATA.some(x=>x.id===id&&x.module===5)):[];
 s.used=Array.isArray(s.used)?s.used:[];
 const button=document.createElement('button');button.id='studyEnable';button.type='button';button.textContent='学习模式';$('batchEnable').after(button);
 const reviewButton=document.createElement('button');reviewButton.id='studyReviewEnable';reviewButton.type='button';reviewButton.textContent='复习模式';button.after(reviewButton);
 const r=state.vocabularyStudyReview=state.vocabularyStudyReview||{};r.enabled=r.enabled===true;r.ids=Array.isArray(r.ids)?r.ids.filter(id=>DATA.some(x=>x.id===id&&x.module===5)):[];r.drafts=r.drafts||{};r.results=r.results||{};
 const review=document.createElement('section');review.id='studyReviewView';review.className='batch-view hidden';review.innerHTML='<h2>未覆盖词汇 · 复习模式</h2><p class="note">只复习当前学习批次，词条及顺序与学习模式一致。</p><p id="studyReviewSummary" class="batch-summary" role="status" aria-live="polite"></p><table class="batch-table"><caption id="studyReviewCaption"></caption><thead><tr><th scope="col">中文意思</th><th scope="col">你的法语答案</th></tr></thead><tbody id="studyReviewRows"></tbody></table><div class="row"><button id="studyReviewSubmit" type="button" class="primary">提交本批复习</button><button id="studyReviewReturn" type="button">返回学习这一批</button></div><p class="note">未填写项不计错。提交后保存成绩与错题；修改后可再次提交订正。</p>';$('batchView').before(review);
 const reviewing=()=>mode===5&&r.enabled;
 function reviewResults(){let correct=0,wrong=0,blank=0,pending=0;for(const id of r.ids){const result=r.results[id],draft=r.drafts[id]||'',valid=result&&result.answer===draft;const feedback=$('studyReviewResult-'+id);if(!draft.trim())blank++;else if(!valid)pending++;else if(result.ok)correct++;else wrong++;if(feedback){feedback.className='batch-result'+(valid?(result.ok?' ok':' bad'):'');feedback.textContent=valid?(result.ok?'✓ 正确':'✗ 正确词汇：'+DATA.find(x=>x.id===id).fr):'';}$('studyReviewAnswer-'+id)?.setAttribute('aria-invalid',String(!!(valid&&!result.ok)));}$('studyReviewSummary').textContent=r.submitted?'本批 '+r.ids.length+' 个：正确 '+correct+'，错误 '+wrong+'，未填写 '+blank+(pending?'，待核对 '+pending:''):'本批 '+r.ids.length+' 个词条，来自刚才的学习批次。';}
 function renderReview(){stop();$('studyReviewRows').replaceChildren();$('studyReviewCaption').textContent='当前学习批次 · '+r.ids.length+' 个词条';for(const [i,id] of r.ids.entries()){const x=DATA.find(x=>x.id===id),tr=document.createElement('tr'),zh=document.createElement('td'),answer=document.createElement('td'),input=document.createElement('input'),feedback=document.createElement('p');zh.textContent=(i+1)+'. '+topicMeaning(x);const noun=window.TCF_STUDY_NOUNS?.hint(x);if(noun){const hint=document.createElement('small');hint.textContent=noun.label;zh.append(hint);}input.id='studyReviewAnswer-'+id;input.type='text';input.lang='fr';input.autocomplete='off';input.spellcheck=false;input.value=r.drafts[id]||'';input.setAttribute('aria-label',topicMeaning(x)+'：复习法语答案');input.oninput=()=>{r.drafts[id]=input.value;reviewResults();persist();};feedback.id='studyReviewResult-'+id;answer.append(input,feedback);tr.append(zh,answer);$('studyReviewRows').append(tr);}reviewResults();$('studyReviewSubmit').disabled=!r.ids.length;}
 function enterReview(){if(!s.ids.length)return;const same=JSON.stringify(r.ids)===JSON.stringify(s.ids);if(!same){r.ids=s.ids.slice();r.drafts={};r.results={};r.submitted=false;}r.enabled=true;s.enabled=false;state.vocabularyBatch.enabled=false;stop();sync();persist();}
 $('studyReviewSubmit').onclick=()=>{if(!reviewing())return;for(const id of r.ids){const draft=r.drafts[id]||'';if(!draft.trim()||r.results[id]?.answer===draft)continue;const x=DATA.find(x=>x.id===id),record=rec(id),result=grade(draft.trim(),x);record.attempts++;record.last=result.ok;record[result.ok?'correct':'wrong']++;if(!result.ok)record.error={...(record.error||{}),answer:draft.trim(),count:(record.error?.count||0)+1,resolved:false,date:new Date().toISOString()};else if(record.error)record.error.resolved=true;r.results[id]={answer:draft,ok:result.ok};}r.submitted=true;persist();list();reviewResults();};
 reviewButton.onclick=enterReview;
 const view=document.createElement('section');view.id='studyView';view.className='batch-view hidden';
 view.innerHTML='<h2>未覆盖词汇 · 学习模式</h2><p class="note">直接学习中文与法语，点击词条旁的按钮听发音。</p><table class="batch-table"><caption id="studyCaption"></caption><thead><tr><th scope="col">中文意思</th><th scope="col">法语词条</th></tr></thead><tbody id="studyRows"></tbody></table><audio id="studyAudio" controls preload="none" hidden style="width:100%;margin-top:12px"></audio><p id="studyStatus" role="status" aria-live="polite" class="note"></p><div class="row"><button id="studyReviewStart" type="button" class="primary">复习这一批</button><button id="studyNext" type="button">下一批</button><button id="studyStop" type="button">停止发音</button></div>';
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
   zh.textContent=(i+1)+'. '+topicMeaning(x);level.textContent='参考等级 '+x.niveau;zh.append(level);const noun=window.TCF_STUDY_NOUNS?.hint(x);if(noun){const tag=document.createElement('small');tag.textContent=noun.label;tag.style.cssText='font-weight:600;color:'+(noun.gender==='f'?'#92265a':noun.gender==='m'?'#17497a':'#455468');if(noun.note)tag.title=noun.note;zh.append(tag);}text.textContent=x.fr;text.lang='fr';text.style.cssText='font-size:1.15rem;margin-right:12px';play.type='button';play.textContent='🔊 发音';play.setAttribute('aria-label','朗读 '+x.fr);play.onclick=()=>pronounce(x);fr.append(text,play);tr.append(zh,fr);$('studyRows').append(tr);
  }
  $('studyNext').disabled=!rows.length;
 }
 function start(reset){const n=Number($('batchSize').value);if(!Number.isInteger(n)||n<1||n>1133){$('batchSize').setCustomValidity('请输入 1 到 1133 之间的整数。');$('batchSize').reportValidity();return;}
  $('batchSize').setCustomValidity('');s.size=n;if(reset||s.scope!==sig()){s.used=[];s.scope=sig();}
  const pool=filtered(),used=new Set(s.used),rows=pool.filter(x=>!used.has(x.id)).slice(0,n);
  if(!rows.length&&pool.length&&!reset){$('studyStatus').textContent='当前筛选已全部学完。点击“开始这一批”可重新开始。';return;}
  r.enabled=false;s.ids=rows.map(x=>x.id);s.used=[...new Set([...s.used,...s.ids])];s.enabled=true;sync(false);render();if(!pool.length)$('studyStatus').textContent='当前筛选没有词条，请调整筛选条件。';persist();
 }
 function sync(refresh=true){for(const el of [$('batchSize'),$('batchStart'),...document.querySelectorAll('[data-batch-size]')])el.disabled=reviewing();reviewButton.classList.toggle('hidden',mode!==5);reviewButton.disabled=!s.ids.length;reviewButton.classList.toggle('primary',reviewing());reviewButton.setAttribute('aria-pressed',String(reviewing()));review.classList.toggle('hidden',!reviewing());if(reviewing()){$('batchView').classList.add('hidden');$('practice').classList.add('hidden');for(const id of ['batchSingle','batchEnable']){$(id).classList.remove('primary');$(id).setAttribute('aria-pressed','false');}$('batchSize').value=s.size;if(refresh)renderReview();}button.classList.toggle('hidden',mode!==5);button.classList.toggle('primary',active());button.setAttribute('aria-pressed',String(active()));view.classList.toggle('hidden',!active());
  if(active()){$('batchView').classList.add('hidden');$('practice').classList.add('hidden');for(const id of ['batchSingle','batchEnable']){$(id).classList.remove('primary');$(id).setAttribute('aria-pressed','false');}
   $('batchSize').value=s.size;if(refresh){if(s.scope!==sig()||!s.ids.length)start(true);else render();}}
 }
 const oldShow=show;show=function(x){oldShow(x);sync();};
 const oldSet=setModule;setModule=function(m,fresh=false){if(m===5&&fresh){s.enabled=false;r.enabled=false;}stop();oldSet(m,fresh);sync();};
 for(const id of ['batchSingle','batchReturn','batchEnable']){const old=$(id).onclick;$(id).onclick=()=>{s.enabled=false;r.enabled=false;stop();if(mode===5)$('batchSize').value=state.vocabularyBatch.size;old();sync(false);persist();};}
 const oldStart=$('batchStart').onclick;$('batchStart').onclick=()=>active()?start(true):oldStart();
 document.querySelectorAll('[data-batch-size]').forEach(b=>{const old=b.onclick;b.onclick=()=>{if(active()){$('batchSize').value=b.dataset.batchSize;start(true);}else old();};});
 button.onclick=()=>{r.enabled=false;s.enabled=true;state.vocabularyBatch.enabled=false;$('batchSize').value=s.size;sync();persist();};
 $('studyReviewStart').onclick=enterReview;$('studyReviewReturn').onclick=button.onclick;
 $('studyNext').onclick=()=>start(false);$('studyStop').onclick=()=>{stop();$('studyStatus').textContent='已停止朗读。';};
 window.addEventListener('pagehide',stop);sync();
})();

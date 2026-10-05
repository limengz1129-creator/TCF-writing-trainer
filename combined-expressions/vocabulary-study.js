'use strict';
(()=>{
 for(const [m,key,reviewKey] of [[3,'conjugationStudy','conjugationStudyReview'],[5,'vocabularyStudy','vocabularyStudyReview'],[6,'phraseStudy','phraseStudyReview']]){
  const initial=state[key],saved=state[key]=initial&&typeof initial==='object'?initial:{};
  const max=DATA.filter(x=>x.module===m).length;
  saved.enabled=saved.enabled===true;saved.size=Number.isInteger(saved.size)&&saved.size>0?Math.min(saved.size,max):10;
  saved.ids=Array.isArray(saved.ids)?[...new Set(saved.ids)].filter(id=>DATA.some(x=>x.id===id&&x.module===m)):[];
  saved.used=Array.isArray(saved.used)?saved.used:[];
  const r=state[reviewKey]=state[reviewKey]||{};r.enabled=r.enabled===true;r.ids=Array.isArray(r.ids)?r.ids.filter(id=>DATA.some(x=>x.id===id&&x.module===m)):[];r.drafts=r.drafts||{};r.results=r.results||{};
 }
 const supported=()=>[3,5,6].includes(mode);
 const study=()=>mode===3?state.conjugationStudy:mode===6?state.phraseStudy:state.vocabularyStudy;
 const reviewState=()=>mode===3?state.conjugationStudyReview:mode===6?state.phraseStudyReview:state.vocabularyStudyReview;
 const batchState=()=>mode===3?state.conjugationStudyBatch||(state.conjugationStudyBatch={}):mode===6?state.phraseBatch:state.vocabularyBatch;
 const maximum=()=>mode===3?new Set(DATA.filter(x=>x.module===3).map(x=>x.lemma)).size:DATA.filter(x=>x.module===(mode===6?6:5)).length;
 const meaning=x=>x.module===3?'原形：'+x.lemma+' · 第 '+VERB_GROUPS[x.lemma]+' 组\n人称：'+subjunctivePersonLabel(x)+'\n时态：'+x.tense:topicMeaning(x);
 const display=x=>x.module===3?conjugationForm(x):x.fr;
 const heading=()=>mode===3?'动词变位':'未覆盖'+label();
 const label=()=>mode===3?'动词变位':mode===6?'词组':'词汇';
 const preset30=document.createElement('button');preset30.type='button';preset30.dataset.batchSize='30';preset30.textContent='30 个';$('batchControls').querySelector('[data-batch-size="50"]').before(preset30);
 const button=document.createElement('button');button.id='studyEnable';button.type='button';button.textContent='批量列表学习';$('batchEnable').after(button);
 const reviewButton=document.createElement('button');reviewButton.id='studyReviewEnable';reviewButton.type='button';reviewButton.textContent='复习模式';button.after(reviewButton);
 const review=document.createElement('section');review.id='studyReviewView';review.className='batch-view compact-study hidden';review.innerHTML='<h2>未覆盖词汇 · 复习模式</h2><p class="note">只复习当前学习批次，词条及顺序与学习模式一致。</p><p id="studyReviewSummary" class="batch-summary" role="status" aria-live="polite"></p><table class="batch-table"><caption id="studyReviewCaption"></caption><thead><tr><th scope="col">中文意思</th><th scope="col">你的法语答案</th></tr></thead><tbody id="studyReviewRows"></tbody></table><div class="row"><button id="studyReviewSubmit" type="button" class="primary">提交本批复习</button><button id="studyReviewReturn" type="button">返回学习这一批</button></div><p class="note">未填写项不计错。提交后保存成绩与错题；修改后可再次提交订正。</p>';$('batchView').before(review);
 const reviewing=()=>supported()&&reviewState().enabled;
 function reviewResults(){let correct=0,wrong=0,blank=0,pending=0;for(const id of reviewState().ids){const result=reviewState().results[id],draft=reviewState().drafts[id]||'',valid=result&&result.answer===draft;const feedback=$('studyReviewResult-'+id);if(!draft.trim())blank++;else if(!valid)pending++;else if(result.ok)correct++;else wrong++;if(feedback){feedback.className='batch-result'+(valid?(result.ok?' ok':' bad'):'');feedback.textContent=valid?(result.ok?'✓ 正确':'✗ 正确'+label()+'：'+display(DATA.find(x=>x.id===id))):'';}$('studyReviewAnswer-'+id)?.setAttribute('aria-invalid',String(!!(valid&&!result.ok)));}$('studyReviewSummary').textContent=reviewState().submitted?'本批 '+reviewState().ids.length+' 个：正确 '+correct+'，错误 '+wrong+'，未填写 '+blank+(pending?'，待核对 '+pending:''):'本批 '+reviewState().ids.length+' 个词条，来自刚才的学习批次。';}
 function renderReview(){stop();$('studyReviewRows').replaceChildren();$('studyReviewCaption').textContent='当前学习批次 · '+reviewState().ids.length+' 个词条';for(const [i,id] of reviewState().ids.entries()){const x=DATA.find(x=>x.id===id),tr=document.createElement('tr'),zh=document.createElement('td'),answer=document.createElement('td'),input=document.createElement('input'),feedback=document.createElement('p');zh.textContent=(i+1)+'. '+meaning(x);zh.style.whiteSpace='pre-line';const noun=mode===5?window.TCF_STUDY_NOUNS?.hint(x):null;if(noun){const hint=document.createElement('small');hint.textContent=noun.label;zh.append(hint);}input.id='studyReviewAnswer-'+id;input.type='text';input.lang='fr';input.autocomplete='off';input.spellcheck=false;input.value=reviewState().drafts[id]||'';input.setAttribute('aria-label',meaning(x)+'：复习法语答案');input.oninput=()=>{reviewState().drafts[id]=input.value;reviewResults();persist();};feedback.id='studyReviewResult-'+id;answer.append(input,feedback);tr.append(zh,answer);if(mode===3){const meaningCell=document.createElement('td');meaningCell.textContent=conjugationMeaning(x);tr.append(meaningCell);}$('studyReviewRows').append(tr);}reviewResults();$('studyReviewSubmit').disabled=!reviewState().ids.length;}
 function enterReview(){if(!study().ids.length)return;const same=JSON.stringify(reviewState().ids)===JSON.stringify(study().ids);if(!same){reviewState().ids=study().ids.slice();reviewState().drafts={};reviewState().results={};reviewState().submitted=false;}reviewState().enabled=true;study().enabled=false;batchState().enabled=false;stop();sync();persist();}
 $('studyReviewSubmit').onclick=()=>{if(!reviewing())return;for(const id of reviewState().ids){const draft=reviewState().drafts[id]||'';if(!draft.trim()||reviewState().results[id]?.answer===draft)continue;const x=DATA.find(x=>x.id===id),record=rec(id),result=grade(draft.trim(),x);record.attempts++;record.last=result.ok;record[result.ok?'correct':'wrong']++;if(!result.ok)record.error={...(record.error||{}),answer:draft.trim(),count:(record.error?.count||0)+1,resolved:false,date:new Date().toISOString()};else if(record.error)record.error.resolved=true;reviewState().results[id]={answer:draft,ok:result.ok};}reviewState().submitted=true;persist();list();reviewResults();};
 reviewButton.onclick=enterReview;
 const view=document.createElement('section');view.id='studyView';view.className='batch-view compact-study hidden';
 view.innerHTML='<h2>未覆盖词汇 · 批量列表学习</h2><p class="note">直接学习中文与法语，点击词条旁的按钮听发音。</p><table class="batch-table"><caption id="studyCaption"></caption><thead><tr><th scope="col">中文意思</th><th scope="col">法语词条</th></tr></thead><tbody id="studyRows"></tbody></table><audio id="studyAudio" controls preload="none" hidden style="width:100%;margin-top:12px"></audio><p id="studyStatus" role="status" aria-live="polite" class="note"></p><div class="row"><button id="studyReviewStart" type="button" class="primary">复习这一批</button><button id="studyPrev" type="button">上一批</button><button id="studyNext" type="button">下一批</button><button id="studyComplete" type="button">完成这一批</button><button id="studyStop" type="button">停止发音</button></div>';
 $('batchView').before(view);
 const active=()=>supported()&&study().enabled;
 const sig=()=>JSON.stringify([selectedSource(),$('category').value,$('status').value,$('search').value,mode===5?state.topicOverlap||'':'',state.topicLevels?.[mode]||'',mode===3?$('verbGroup').value:'',mode===3?$('verbLemma').value:'',mode===3?$('verbPerson').value:'',mode===3?state.subjunctiveTier||'':'',mode===3?state.subjunctiveSort||'':'',order||null]);
 const audio=$('studyAudio');let request=0,url=null;
 function stop(){request++;audio.pause();audio.removeAttribute('src');audio.load();audio.hidden=true;if(url)URL.revokeObjectURL(url);url=null;}
 async function pronounce(x){
  stop();window.TCF_AUDIO?.stop();const token=request;const spoken=display(x);$('studyStatus').textContent='正在加载 '+spoken+' 的法语发音……';
  try{const data=await window.TCF_AUDIO.load(spoken);if(token!==request||!active())return;
   url=URL.createObjectURL(new Blob([Uint8Array.from(atob(data.audio),c=>c.charCodeAt(0))],{type:'audio/mpeg'}));audio.src=url;audio.hidden=false;audio.playbackRate=Number($('frenchRate')?.value||1);
   $('studyStatus').textContent='正在朗读：'+spoken;
   try{await audio.play();}catch{if(token===request)$('studyStatus').textContent='音频已就绪，请点击播放器播放：'+spoken;}
  }catch(e){if(token!==request)return;$('studyStatus').textContent=e.message+'，请点击发音按钮重试。';}
 }
 audio.addEventListener('error',()=>{$('studyStatus').textContent='音频播放失败，请重试。';});
 audio.addEventListener('ended',()=>{$('studyStatus').textContent='朗读完成，可点击词条重听。';});
 // A batch is a list of words, or complete verb groups, in filtered() order.
 function units(){const pool=filtered();if(mode!==3)return pool.map(x=>({key:x.id,rows:[x]}));const groups=new Map();for(const x of pool){if(!groups.has(x.lemma))groups.set(x.lemma,{key:x.lemma,rows:[]});groups.get(x.lemma).rows.push(x);}return [...groups.values()].map(u=>({...u,rows:orderSubjunctivePersons(u.rows)}));}
 function currentUnits(){const ids=new Set(study().ids);return units().map(u=>({...u,rows:u.rows.filter(x=>ids.has(x.id))})).filter(u=>u.rows.length);}
 function batchKey(){return JSON.stringify([study().scope,study().ids]);}
 function render(){
  stop();$('studyRows').replaceChildren();
  const rows=currentUnits(),pool=units(),offset=study().offset||0;
  const done=!!study().completed?.[batchKey()];
  $('studyCaption').textContent=pool.length?'当前：第 '+(offset+1)+'–'+(offset+rows.length)+' / '+pool.length+' 个'+(mode===3?'动词':'词条')+(done?' · 本批已完成':''):'当前筛选没有词条';
  const head=view.querySelector('thead tr');head.replaceChildren();
  for(const label of (mode===3?['中文含义 / 动词','已收录变位 · 按时态排列']:['中文','法语 / 搭配 / 例句'])){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}
  for(const [i,u] of rows.entries()){
   const tr=document.createElement('tr'),zh=document.createElement('td'),fr=document.createElement('td'),x=u.rows[0];tr.dataset.itemKey=u.key;
   zh.textContent=(offset+i+1)+'. '+(mode===3?conjugationMeaning(x):topicMeaning(x));
   if(mode===3){const lemma=document.createElement('strong');lemma.className='compact-lemma';lemma.textContent=x.lemma;zh.append(lemma);}
   else {const noun=mode===5?window.TCF_STUDY_NOUNS?.hint(x):null;if(noun){const tag=document.createElement('small');tag.textContent=noun.label;zh.append(tag);}}
   const tenses=new Map();for(const form of u.rows){const tense=mode===3?form.tense:'';if(!tenses.has(tense))tenses.set(tense,[]);tenses.get(tense).push(form);}
   for(const [tense,forms] of tenses){
    const block=document.createElement('div');block.className='compact-tense';
    if(tense){const title=document.createElement('span');title.className='compact-tense-label';title.textContent=tense;block.append(title);}
    for(const form of forms){
     const line=document.createElement('div');line.className='compact-form';line.dataset.formId=form.id;
     const text=document.createElement('span');text.className='compact-french';text.lang='fr';text.textContent=display(form);
     const play=document.createElement('button');play.type='button';play.textContent='🔊';play.title='朗读 '+display(form);play.setAttribute('aria-label',play.title);play.onclick=()=>pronounce(form);line.append(text,play);
     window.TCF_ITEM_TOOLS?.mount(line,form,()=>render());block.append(line);
    }
    fr.append(block);
   }
   const examples=[...new Set(u.rows.flatMap(x=>(x.members||[]).filter(m=>selectedSource()===''||m.sourceIndex===Number(selectedSource())).flatMap(m=>[m.usage,m.example]).filter(Boolean)))];
   if(examples.length){const details=document.createElement('details');details.className='compact-examples';const summary=document.createElement('summary');summary.textContent='搭配 / 例句（'+examples.length+'）';details.append(summary);for(const example of examples){const p=document.createElement('p');p.textContent=example;details.append(p);}fr.append(details);}
   tr.append(zh,fr);$('studyRows').append(tr);
  }
  $('studyPrev').disabled=!rows.length||offset===0;$('studyNext').disabled=!rows.length||offset+rows.length>=pool.length;
  $('studyComplete').disabled=!rows.length||done;$('studyComplete').textContent=done?'本批已完成':'完成这一批';
  $('studyReviewStart').disabled=!rows.length;
  $('studyStatus').textContent=done?'已保存本批学习进度。':'本批同时展示 '+rows.length+' 个'+(mode===3?'动词；同一动词的人称和时态集中显示。':'词条。');
 }
 function start(reset,delta=1){
  const n=Number($('batchSize').value);if(!Number.isInteger(n)||n<1||n>maximum()){$('batchSize').setCustomValidity('请输入 1 到 '+maximum()+' 之间的整数。');$('batchSize').reportValidity();return;}
  $('batchSize').setCustomValidity('');const changed=study().scope!==sig()||study().size!==n;
  study().size=n;const pool=units();
  let offset=reset||changed?0:(study().offset||0)+delta*n;
  offset=Math.max(0,Math.min(offset,Math.max(0,Math.floor((pool.length-1)/n)*n)));
  study().offset=offset;study().scope=sig();study().savedFilters=Object.fromEntries(['sourceFilter','category','status','search','verbGroup','verbLemma','verbPerson'].map(id=>[id,$(id).value]));study().savedOrder=order?order.slice():null;study().layoutVersion=2;study().subjunctiveDataVersion=2;
  const rows=pool.slice(offset,offset+n);
  reviewState().enabled=false;batchState().enabled=false;study().ids=rows.flatMap(u=>u.rows.map(x=>x.id));study().enabled=true;
  sync(false);view.classList.remove('hidden');$('practice').classList.add('hidden');$('batchView').classList.add('hidden');render();persist();
  setTimeout(()=>view.scrollIntoView({behavior:'smooth',block:'start'}),0);
 }
 function sync(refresh=true){for(const section of [view,review]){section.querySelector('table').classList.toggle('conjugation-table',mode===3);const head=section.querySelector('thead tr');head.querySelector('.conjugation-meaning-heading')?.remove();if(mode===3){const th=document.createElement('th');th.scope='col';th.className='conjugation-meaning-heading';th.textContent='中文词义（原形）';head.append(th);}}view.querySelector('h2').textContent=heading()+' · 批量列表学习';review.querySelector('h2').textContent=heading()+' · 复习模式';view.querySelectorAll('th')[0].textContent=mode===3?'动词原形 · 人称 · 时态':'中文意思';review.querySelectorAll('th')[0].textContent=mode===3?'动词原形 · 人称 · 时态':'中文意思';view.querySelectorAll('th')[1].textContent=mode===3?'主语＋法语变位':'法语'+label();$('batchControls').classList.toggle('hidden',!supported());$('batchEnable').classList.toggle('hidden',mode===3);$('batchSingle').textContent='单条学习 / 练习';if(mode===3)$('batchModeLabel').textContent='动词变位练习方式';route.classList.toggle('hidden',mode!==3);syncRoute();for(const el of [$('batchSize'),$('batchStart'),...document.querySelectorAll('[data-batch-size]')])el.disabled=reviewing();reviewButton.classList.toggle('hidden',!supported());reviewButton.disabled=!study().ids.length;reviewButton.classList.toggle('primary',reviewing());reviewButton.setAttribute('aria-pressed',String(reviewing()));review.classList.toggle('hidden',!reviewing());if(reviewing()){$('batchView').classList.add('hidden');$('practice').classList.add('hidden');for(const id of ['batchSingle','batchEnable']){$(id).classList.remove('primary');$(id).setAttribute('aria-pressed','false');}$('batchSize').value=study().size;if(refresh)renderReview();}button.classList.toggle('hidden',!supported());button.classList.toggle('primary',active());button.setAttribute('aria-pressed',String(active()));view.classList.toggle('hidden',!active());
  if(active()){$('batchSize').max=maximum();$('batchView').classList.add('hidden');$('practice').classList.add('hidden');for(const id of ['batchSingle','batchEnable']){$(id).classList.remove('primary');$(id).setAttribute('aria-pressed','false');}
   $('batchSize').value=study().size;if(refresh){if(mode===3&&study().subjunctiveDataVersion!==2&&study().ids.some(id=>DATA.find(x=>x.id===id)?.tense.includes('虚拟式'))){start(false,0);return;}if(study().scope!==sig()||study().layoutVersion!==2||!study().ids.length)start(true);else render();}}
 }
 const oldShow=show;show=function(x){oldShow(x);sync();};
 const oldSet=setModule;setModule=function(m,fresh=false){if([3,5,6].includes(m)&&fresh){state[m===3?'conjugationStudy':m===6?'phraseStudy':'vocabularyStudy'].enabled=false;state[m===3?'conjugationStudyReview':m===6?'phraseStudyReview':'vocabularyStudyReview'].enabled=false;}stop();oldSet(m,fresh);sync();};
 for(const id of ['batchSingle','batchReturn','batchEnable']){const old=$(id).onclick;$(id).onclick=()=>{study().enabled=false;reviewState().enabled=false;stop();if(mode===3){show(current||filtered()[0]||null);persist();}else{if(supported())$('batchSize').value=batchState().size;old();}sync(false);persist();};}
 const oldStart=$('batchStart').onclick;$('batchStart').onclick=()=>{if(mode===3||active()){reviewState().enabled=false;study().enabled=true;batchState().enabled=false;start(true);}else oldStart();};
 document.querySelectorAll('[data-batch-size]').forEach(b=>{const old=b.onclick;b.onclick=()=>{if(mode===3||active()){$('batchSize').value=b.dataset.batchSize;if(active())start(true);}else if(old)old();else{$('batchSize').value=b.dataset.batchSize;$('batchStart').click();}};});
 button.onclick=()=>{reviewState().enabled=false;study().enabled=true;batchState().enabled=false;$('batchSize').value=study().size;sync();persist();};
 $('studyReviewStart').onclick=enterReview;$('studyReviewReturn').onclick=button.onclick;
 $('studyPrev').onclick=()=>start(false,-1);$('studyNext').onclick=()=>start(false);$('studyComplete').onclick=()=>{study().completed=study().completed||{};study().completed[batchKey()]=new Date().toISOString();for(const id of study().ids)rec(id).studyCompletedAt=study().completed[batchKey()];persist();render();};$('studyStop').onclick=()=>{stop();$('studyStatus').textContent='已停止朗读。';};
 const route=document.createElement('div');route.id='conjugationStudyRoute';route.className='hidden';route.innerHTML='<strong>学习分类方式</strong><div class="row"><button id="conjugationByTense" type="button">按时态学习</button><button id="conjugationByGroup" type="button">按动词组别学习</button></div><label id="conjugationStudyFilterLabel" for="conjugationStudyFilter">时态</label><select id="conjugationStudyFilter"></select><p class="note">每批数量按动词计算；同一个动词的人称／时态合并在一个紧凑区块中；虚拟式固定按 je → tu → il → nous → vous → ils 排列。复习可写主语＋变位，兼容旧版只写变位。中文列为动词原形词义；命令式、分词不强加主语。</p>';$('batchModeLabel').after(route);
 state.conjugationStudyRoute=state.conjugationStudyRoute==='group'?'group':'tense';
 function syncRoute(){if(mode!==3)return;const group=state.conjugationStudyRoute==='group';$('conjugationByTense').classList.toggle('primary',!group);$('conjugationByGroup').classList.toggle('primary',group);$('conjugationStudyFilterLabel').textContent=group?'动词组别':'时态';const target=$(group?'verbGroup':'category'),select=$('conjugationStudyFilter');select.replaceChildren(...Array.from(target.options).map(o=>new Option(o.value?o.textContent:group?'全部三组动词':'全部时态',o.value)));select.value=target.value;select.disabled=reviewing();$('conjugationByTense').disabled=reviewing();$('conjugationByGroup').disabled=reviewing();}
 function chooseRoute(group){state.conjugationStudyRoute=group?'group':'tense';const opposite=$(group?'category':'verbGroup');opposite.value='';opposite.dispatchEvent(new Event('change'));syncRoute();persist();}
 $('conjugationByTense').onclick=()=>chooseRoute(false);$('conjugationByGroup').onclick=()=>chooseRoute(true);$('conjugationStudyFilter').onchange=()=>{const target=$(state.conjugationStudyRoute==='group'?'verbGroup':'category');target.value=$('conjugationStudyFilter').value;target.dispatchEvent(new Event('change'));};
 if(supported()&&study().enabled&&study().layoutVersion===2&&Array.isArray(study().savedOrder))order=study().savedOrder.slice();window.TCF_COMPACT_STUDY={start,units,currentUnits,render};window.addEventListener('pagehide',stop);setTimeout(()=>{if(supported()&&study().enabled&&study().layoutVersion===2&&study().savedFilters){const f=study().savedFilters;for(const id of ['sourceFilter','category','status','search','verbGroup'])if(f[id]!==undefined)$(id).value=f[id];if(mode===3)buildVerbFilters();for(const id of ['verbLemma','verbPerson'])if(f[id]!==undefined)$(id).value=f[id];}sync();},0);
})();


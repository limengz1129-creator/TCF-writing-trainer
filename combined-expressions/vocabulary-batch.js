'use strict';
(function(){
 const style=document.createElement('style');
 style.textContent='.batch-controls{margin:16px 0;padding:12px;border:1px solid #dce1ef;border-radius:10px}.batch-controls .row{flex-wrap:wrap}.batch-controls input{width:100%;margin:6px 0}.batch-table{width:100%;border-collapse:collapse;table-layout:fixed}.batch-table th,.batch-table td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #e3e7ef;overflow-wrap:anywhere}.batch-table th:first-child{width:40%}.batch-table input{width:100%;min-width:0;box-sizing:border-box}.batch-result{margin:7px 0 0;white-space:pre-wrap;font-size:.92rem}.batch-result.ok{color:#166534}.batch-result.bad{color:#b91c1c}.batch-table input[aria-invalid=true]{border-color:#c32942}.batch-table small{display:block;color:#626b82;margin-top:5px}.batch-summary{padding:12px;background:#f1f4fb;border-radius:10px;margin:12px 0}.batch-table caption{text-align:left;margin:12px 0;color:#626b82}.batch-view .row{flex-wrap:wrap}@media(max-width:600px){.batch-table th,.batch-table td{padding:10px 6px}.batch-table th:first-child{width:38%}}';
 document.head.append(style);
 const controls=document.createElement('div');controls.id='batchControls';controls.className='batch-controls hidden';
 controls.innerHTML='<strong>词汇练习方式</strong><div class="row"><button id="batchSingle" type="button">逐条练习</button><button id="batchEnable" type="button">表格批量练习</button></div><label for="batchSize">每批词条数量</label><input id="batchSize" type="number" min="1" max="1133" step="1" value="10" inputmode="numeric"><div class="row"><button type="button" data-batch-size="10">10 个</button><button type="button" data-batch-size="20">20 个</button><button type="button" data-batch-size="50">50 个</button></div><button id="batchStart" type="button">开始这一批</button><p class="note">按当前所有筛选抽取。草稿自动保存；下一批继续练未抽过的词条。</p>';
 $('practiceFilters').prepend(controls);
 const view=document.createElement('section');view.id='batchView';view.className='batch-view hidden';view.setAttribute('aria-label','未覆盖词汇批量练习');
 view.innerHTML='<h2>未覆盖词汇 · 批量练习</h2><p id="batchScope" class="note"></p><div id="batchSummary" class="batch-summary" role="status" aria-live="polite"></div><table class="batch-table"><caption id="batchCaption"></caption><thead><tr><th scope="col">中文提示</th><th scope="col">你的法语词汇</th></tr></thead><tbody id="batchRows"></tbody></table><div class="row"><button id="batchSubmit" class="primary" type="button">提交整批答案</button><button id="batchNext" type="button">下一批</button><button id="batchReturn" type="button">返回逐条练习</button></div><p class="note">接受原清单已收录词形；忽略大小写、句末标点和多余空格，保留重音、连字符。未填写项不计错。</p>';
 $('practice').before(view);
 const initial=state.vocabularyBatch;
 const b=state.vocabularyBatch=initial&&typeof initial==='object'&&!Array.isArray(initial)?initial:{};
 b.enabled=b.enabled===true;b.size=Number.isInteger(b.size)&&b.size>0?Math.min(b.size,1133):10;
 b.ids=Array.isArray(b.ids)?[...new Set(b.ids)].filter(id=>DATA.some(x=>x.id===id&&x.module===5)):[];
 b.used=Array.isArray(b.used)?b.used.filter(id=>typeof id==='string'):[];
 b.results=b.results&&typeof b.results==='object'&&!Array.isArray(b.results)?b.results:{};
 const active=()=>mode===5&&b.enabled;
 const signature=()=>JSON.stringify([selectedSource(),$('category').value,$('status').value,$('search').value,state.topicOverlap||'',state.topicLevels?.[5]||'']);
 const items=()=>b.ids.map(id=>DATA.find(x=>x.id===id)).filter(Boolean);
 $('batchSize').value=b.size;
 function size(){
  const n=Number($('batchSize').value);
  if(!Number.isInteger(n)||n<1||n>1133){$('batchSize').setCustomValidity('请输入 1 到 1133 之间的整数。');$('batchSize').reportValidity();return null;}
  $('batchSize').setCustomValidity('');return n;
 }
 function drawResults(){
  let correct=0,wrong=0,blank=0,unchecked=0;
  for(const x of items()){
   const answer=rec(x.id).draft||'',result=b.results[x.id];
   const input=document.getElementById('batchAnswer-'+x.id),feedback=document.getElementById('batchResult-'+x.id);
   const valid=result&&result.answer===answer;
   input?.setAttribute('aria-invalid',String(!!(valid&&!result.ok)));
   if(!answer.trim())blank++;else if(!valid)unchecked++;else if(result.ok)correct++;else wrong++;
   if(feedback){feedback.className='batch-result'+(valid?(result.ok?' ok':' bad'):'');feedback.textContent=valid?(result.ok?'✓ 正确':'✗ 正确词汇：'+x.fr):(!answer.trim()&&b.submitted?'未填写，不计错':'');}
  }
  $('batchSummary').textContent=b.submitted?'本批 '+b.ids.length+' 个：正确 '+correct+'，错误 '+wrong+'，未填写 '+blank+(unchecked?'，待核对 '+unchecked:''):'本批 '+b.ids.length+' 个词条。填写右列后，点击“提交整批答案”。';
 }
 function render(){
  if(!active())return;
  const rows=items();$('batchRows').replaceChildren();
  $('batchScope').textContent=[$('sourceFilter').selectedOptions[0]?.textContent,state.topicOverlap==='absent'?'未出现在词组中':state.topicOverlap==='present'?'已出现在词组中':'全部词汇',state.topicLevels?.[5]||'全部等级',$('category').value||'全部分类'].join(' · ');
  $('batchCaption').textContent='当前筛选 '+filtered().length+' 个词条；本批 '+rows.length+' 个。';
  for(const [i,x] of rows.entries()){
   const tr=document.createElement('tr'),meaning=document.createElement('td'),answer=document.createElement('td'),input=document.createElement('input'),feedback=document.createElement('p'),level=document.createElement('small');
   meaning.textContent=(i+1)+'. '+topicMeaning(x);level.textContent='参考等级 '+x.niveau;meaning.append(level);
   input.id='batchAnswer-'+x.id;input.type='text';input.lang='fr';input.spellcheck=false;input.autocomplete='off';input.value=rec(x.id).draft||'';input.setAttribute('aria-label',topicMeaning(x)+'：法语答案');
   feedback.id='batchResult-'+x.id;feedback.className='batch-result';
   input.oninput=()=>{rec(x.id).draft=input.value;if(current?.id===x.id)$('answer').value=input.value;drawResults();persist();};
   input.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();submit();}};
   answer.append(input,feedback);tr.append(meaning,answer);$('batchRows').append(tr);
  }
  $('batchSubmit').disabled=!rows.length;$('batchNext').disabled=!rows.length;drawResults();
 }
 function makeBatch(reset=false){
  const n=size();if(n===null)return;
  b.size=n;const sig=signature();
  if(reset||sig!==b.scope){b.used=[];b.scope=sig;}
  const pool=filtered(),used=new Set(b.used),rows=pool.filter(x=>!used.has(x.id)).slice(0,n);
  if(!rows.length&&pool.length&&!reset){$('batchSummary').textContent='当前筛选的词条已全部抽完。点击“开始这一批”可从头开始。';return;}
  b.ids=rows.map(x=>x.id);b.used=[...new Set([...b.used,...b.ids])];b.results={};b.submitted=false;
  b.enabled=true;sync(false);render();
  if(!pool.length)$('batchSummary').textContent='当前筛选没有词条，请调整筛选条件。';
  else if(rows.length<n)$('batchSummary').textContent='剩余 '+rows.length+' 个词条，已全部放入本批。';
  persist();
 }
 function sync(refresh=true){
  controls.classList.toggle('hidden',mode!==5);view.classList.toggle('hidden',!active());
  if(mode===5)$('practice').classList.toggle('hidden',active()||!current);
  $('batchSingle').classList.toggle('primary',!b.enabled);$('batchEnable').classList.toggle('primary',b.enabled);
  $('batchSingle').setAttribute('aria-pressed',String(!b.enabled));$('batchEnable').setAttribute('aria-pressed',String(b.enabled));
  if(active()&&refresh){if(b.scope!==signature()||!b.ids.length)makeBatch(true);else render();}
 }
 function submit(){
  if(!active())return;
  for(const x of items()){
   const r=rec(x.id),draft=r.draft||'',answer=draft.trim();if(!answer)continue;
   if(b.results[x.id]?.answer===draft)continue;
   const result=grade(answer,x);r.attempts++;r.last=result.ok;r[result.ok?'correct':'wrong']++;
   if(!result.ok)r.error={...(r.error||{}),answer,count:(r.error?.count||0)+1,resolved:false,date:new Date().toISOString()};
   else if(r.error)r.error.resolved=true;
   b.results[x.id]={answer:draft,ok:result.ok};
  }
  b.submitted=true;persist();list();drawResults();
 }
 const oldSave=saveDraft;
 saveDraft=function(){if(active()&&current)$('answer').value=rec(current.id).draft||'';oldSave();};
 const oldShow=show;
 show=function(x){oldShow(x);sync();};
 const oldSet=setModule;
 setModule=function(m,fresh=false){if(m===5&&fresh)b.enabled=false;oldSet(m,fresh);sync();};
 function single(){b.enabled=false;sync(false);if(current)show(current);else show(filtered()[0]||null);persist();}
 $('batchSingle').onclick=single;$('batchReturn').onclick=single;
 $('batchEnable').onclick=()=>{if(b.scope===signature()&&b.ids.length){b.enabled=true;sync();persist();}else makeBatch(true);};
 $('batchStart').onclick=()=>makeBatch(true);$('batchNext').onclick=()=>makeBatch(false);$('batchSubmit').onclick=submit;
 $('batchSize').oninput=()=>{$('batchSize').setCustomValidity('');};
 controls.querySelectorAll('[data-batch-size]').forEach(button=>button.onclick=()=>{$('batchSize').value=button.dataset.batchSize;makeBatch(true);});
 sync();
})();

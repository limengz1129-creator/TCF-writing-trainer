'use strict';
(()=>{
 const B1=['être','avoir','pouvoir','faire','prendre','venir','savoir','falloir','mettre','apprendre','choisir','devenir','tenir','connaître','répondre','réduire','proposer','rester','trouver','développer','améliorer','protéger','établir','utiliser'];
 const B2=['adapter','limiter','offrir','organiser','préparer','privilégier','renforcer','respecter','accompagner','communiquer','comparer','constituer','contrôler','convenir','donner','douter','encadrer','envisager','garantir','imposer','laisser','passer','présenter','prévoir','profiter','remplacer','sentir','souhaiter','veiller','vérifier'];
 const TIERS={b1:new Set(B1),b2:new Set(B2)};
 function buildFrequencyStats(){
  const map=new Map();
  for(const x of DATA.filter(x=>x.module===3&&x.tense==='虚拟式现在时'&&!x.supplemental)){
   let st=map.get(x.lemma);
   if(!st){st={lemma:x.lemma,occurrences:0,sources:new Set(),forms:new Set(),persons:new Set()};map.set(x.lemma,st);}
   const members=Array.isArray(x.members)?x.members:[];
   st.occurrences+=members.length||1;
   for(const m of members)if(Number.isInteger(m.sourceIndex))st.sources.add(m.sourceIndex);
   st.forms.add(x.fr);
   if(x.person)st.persons.add(x.person);
  }
  return map;
 }
 const FREQ=buildFrequencyStats();
 // Added person rows never count as empirical occurrences. New verbs use whole-corpus coverage only as a zero-frequency tie breaker.
 for(const x of DATA.filter(x=>x.module===3&&x.tense==='虚拟式现在时'))if(!FREQ.has(x.lemma))FREQ.set(x.lemma,{lemma:x.lemma,occurrences:0,sources:new Set(),forms:new Set(),persons:new Set()});
 const corpusCoverage=lemma=>DATA.filter(x=>x.module===3&&x.lemma===lemma&&!x.supplemental).reduce((n,x)=>n+x.members.length,0);
 function counts(tier=''){const rows=DATA.filter(x=>x.module===3&&x.tense==='虚拟式现在时'&&(!tier||TIERS[tier].has(x.lemma)));return {verbs:new Set(rows.map(x=>x.lemma)).size,forms:rows.length};}
 function countText(tier=''){const c=counts(tier);return c.verbs+' 动词 / '+c.forms+' 变位';}
 state.subjunctiveTier=state.subjunctiveTier||'';
 state.subjunctiveSort=state.subjunctiveSort||'frequency';
 state.subjunctiveReturn=!!state.subjunctiveReturn;
 const $=id=>document.getElementById(id);
 function tierLabel(){return state.subjunctiveTier==='b1'?'B1 核心必熟 · '+countText('b1'):state.subjunctiveTier==='b2'?'B2 高频扩展 · '+countText('b2'):'';}
 function returnToSubjunctiveCourse(){
  state.subjunctiveReturn=false;
  state.subjunctiveTier='';
  persist();
  setModule(9,true);
  setTimeout(()=>{
   window.C1_COURSE?.openLesson?.(15);
   setTimeout(()=>document.getElementById('c1-subjunctive-b')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
  },0);
 }
 function ensureReturnButton(){
  const box=$('practiceFilters');if(!box)return;
  let b=$('subjunctiveBackBtn');
  if(mode===3&&state.subjunctiveReturn){
   if(!b){
    b=document.createElement('button');b.id='subjunctiveBackBtn';b.type='button';b.className='primary';
    b.textContent='← 返回虚拟式专项';b.onclick=returnToSubjunctiveCourse;
    box.prepend(b);
   }
   b.classList.remove('hidden');
  }else if(b)b.classList.add('hidden');
 }
 function compareFrequency(a,b){
  const A=FREQ.get(a.lemma)||{occurrences:0,sources:new Set(),forms:new Set()};
  const B=FREQ.get(b.lemma)||{occurrences:0,sources:new Set(),forms:new Set()};
  return B.occurrences-A.occurrences
   ||B.sources.size-A.sources.size
   ||B.forms.size-A.forms.size
   ||(!A.occurrences&&!B.occurrences?corpusCoverage(b.lemma)-corpusCoverage(a.lemma):0)
   ||a.lemma.localeCompare(b.lemma,'fr')
   ||SUBJUNCTIVE_PERSON_ORDER.indexOf(a.person)-SUBJUNCTIVE_PERSON_ORDER.indexOf(b.person);
 }
 function topVerbsForCurrentTier(limit=10){
  const allowed=state.subjunctiveTier&&TIERS[state.subjunctiveTier]?TIERS[state.subjunctiveTier]:null;
  return [...FREQ.values()]
   .filter(x=>!allowed||allowed.has(x.lemma))
   .sort((a,b)=>b.occurrences-a.occurrences||b.sources.size-a.sources.size||b.forms.size-a.forms.size||a.lemma.localeCompare(b.lemma,'fr'))
   .slice(0,limit);
 }
 function ensureSortFilter(){
  const box=$('verbFilters');if(!box||$('subjunctiveSort'))return;
  const label=document.createElement('label');label.htmlFor='subjunctiveSort';label.textContent='虚拟式排序';
  const sel=document.createElement('select');sel.id='subjunctiveSort';
  sel.append(new Option('TCF 实战频率 ↓','frequency'),new Option('原数据顺序','original'));
  sel.value=state.subjunctiveSort||'frequency';
  sel.onchange=()=>{state.subjunctiveSort=sel.value;order=null;show(filtered()[0]||null);syncNote();persist();};
  box.prepend(sel);box.prepend(label);
 }
 function ensureTierFilter(){
  const box=$('verbFilters');if(!box||$('subjunctiveTier'))return;
  const label=document.createElement('label');label.htmlFor='subjunctiveTier';label.textContent='虚拟式专项猛攻';
  const sel=document.createElement('select');sel.id='subjunctiveTier';
  sel.append(new Option('关闭专项筛选',''),new Option('B1 核心必熟 · 24 个动词','b1'),new Option('B2 高频扩展 · 30 个动词','b2'));
  sel.value=state.subjunctiveTier;
  sel.onchange=()=>{state.subjunctiveTier=sel.value;if(sel.value)$('category').value='虚拟式现在时';order=null;show(filtered()[0]||null);buildSource();persist();syncNote();};
  box.prepend(sel);box.prepend(label);
 }
 const baseFiltered=filtered;
 filtered=function(){
  let rs=baseFiltered();
  if(mode===3&&state.subjunctiveTier&&TIERS[state.subjunctiveTier]){
   const allowed=TIERS[state.subjunctiveTier];
   rs=rs.filter(x=>x.tense==='虚拟式现在时'&&allowed.has(x.lemma));
  }
  if(mode===3&&state.subjunctiveSort==='frequency'&&!order&&(state.subjunctiveTier||$('category')?.value==='虚拟式现在时')){
   rs=[...rs].sort(compareFrequency);
  }
  return mode===3?orderSubjunctivePersons(rs):rs;
 };
 const baseBuildVerbFilters=buildVerbFilters;
 buildVerbFilters=function(){baseBuildVerbFilters();if(mode===3){ensureTierFilter();ensureSortFilter();$('subjunctiveTier').value=state.subjunctiveTier||'';$('subjunctiveSort').value=state.subjunctiveSort||'frequency';}};
 const baseSetModule=setModule;
 setModule=function(m,fresh=false){
  if(m===3&&fresh&&!window.__openingSubjunctiveBridge)state.subjunctiveTier='';
  baseSetModule(m,fresh);
  if(m===3){ensureTierFilter();$('subjunctiveTier').value=state.subjunctiveTier||'';syncNote();}
  ensureReturnButton();
 };
 function syncNote(reviewMode){
  if(mode!==3||!$('sourceNote'))return;
  const label=tierLabel()||($('category')?.value==='虚拟式现在时'?'全部虚拟式现在时':'');
  if(!label)return;
  const top=topVerbsForCurrentTier(5).map((x,i)=>(i+1)+'. '+x.lemma+'（'+x.occurrences+' 次 / '+x.sources.size+' 来源）').join(' · ');
  const random=reviewMode==='random'||!!order;
  $('sourceNote').textContent=label+'。'+(random?'当前：随机顺序复习。':'当前：按 TCF 实战频率从高到低依次复习；同频再看来源覆盖与变位覆盖。Top 5：'+top+'。');
 }
 $('category')?.addEventListener('change',()=>{if(mode===3&&state.subjunctiveTier&&$('category').value!=='虚拟式现在时'){state.subjunctiveTier='';if($('subjunctiveTier'))$('subjunctiveTier').value='';show(filtered()[0]||null);buildSource();syncNote();persist();}});
 function openTier(tier,reviewMode='frequency'){
  // 专项入口必须从“全部五任务来源”开始，避免继承其它模块/上一次练习的残留筛选。
  state.source='';
  state.subjunctiveReturn=true;
  window.__openingSubjunctiveBridge=true;
  setModule(3,true);
  window.__openingSubjunctiveBridge=false;
  state.subjunctiveTier=tier==='b1'||tier==='b2'?tier:'';
  state.subjunctiveSort=reviewMode==='random'?'frequency':'frequency';
  buildSource();
  if($('sourceFilter'))$('sourceFilter').value='';
  if($('status'))$('status').value='';
  if($('search'))$('search').value='';
  if($('verbLemma'))$('verbLemma').value='';
  if($('verbPerson'))$('verbPerson').value='';
  buildVerbFilters();
  $('category').value='虚拟式现在时';
  if($('subjunctiveTier'))$('subjunctiveTier').value=state.subjunctiveTier;
  if($('subjunctiveSort'))$('subjunctiveSort').value='frequency';
  order=null;
  if(reviewMode==='random'){
   const ids=filtered().map(x=>x.id);
   for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
   order=ids;
  }
  show(filtered()[0]||null);
  syncNote(reviewMode);ensureReturnButton();persist();
  $('practice')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function addPanel(){
  const d=$('c1CourseDialog');if(!d||!d.open)return;
  const h=d.querySelector('h2');if(!h?.textContent.includes('#15 Le subjonctif'))return;
  if(d.querySelector('#c1-subjunctive-b'))return;
  const anchor=d.querySelector('#c1-frames');if(!anchor)return;
  const sec=document.createElement('section');sec.className='c1-course-section';sec.id='c1-subjunctive-b';
  const title=document.createElement('h3');title.textContent='B · 虚拟式动词变位专项猛攻';
  const p=document.createElement('p');p.className='note';p.textContent='这里直接调用动词变位模块的同一份数据。B1 先练到自动化，B2 再稳定扩展；全部虚拟式现在时：'+countText()+'。原稿频次不因补充人称而增加。';
  const p2=document.createElement('p');p2.className='note';p2.textContent='原稿数据与 TCF 主动输出补充共用词条库。重点补齐 nous 和 il / ils，互动高频动词补齐六组；低频动词保留原有范围。falloir 为无人称动词，仅 qu’il faille。';
  const row=document.createElement('div');row.className='c1-actions';
  const mk=(label,tier,primary=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(primary)b.className='primary';b.onclick=()=>{d.close();openTier(tier)};return b;};
  row.append(mk('猛攻 B1 · '+countText('b1'),'b1',true),mk('猛攻 B2 · '+countText('b2'),'b2'),mk('练全部虚拟式现在时 · '+countText(),''));
  const review=document.createElement('div');review.className='c1-lesson-card';
  const rh=document.createElement('h4');rh.textContent='复习模式';
  const rp=document.createElement('p');rp.className='note';rp.textContent='先选复习范围，再选择“按高频顺序依次复习”或“随机顺序复习”。';
  const rsel=document.createElement('select');rsel.id='subjunctiveReviewTier';
  rsel.append(new Option('B1 · '+countText('b1'),'b1'),new Option('B2 · '+countText('b2'),'b2'),new Option('全部虚拟式现在时 · '+countText(),''));
  const ractions=document.createElement('div');ractions.className='c1-actions';
  const seq=document.createElement('button');seq.type='button';seq.className='primary';seq.textContent='按高频顺序依次复习';seq.onclick=()=>{d.close();openTier(rsel.value,'frequency');};
  const rnd=document.createElement('button');rnd.type='button';rnd.textContent='随机顺序复习';rnd.onclick=()=>{d.close();openTier(rsel.value,'random');};
  ractions.append(seq,rnd);review.append(rh,rp,rsel,ractions);
  const details=document.createElement('details');const sum=document.createElement('summary');sum.textContent='查看 B1 / B2 动词名单';const body=document.createElement('p');body.className='note';body.textContent='B1：'+B1.join(' · ')+'\n\nB2：'+B2.join(' · ');details.append(sum,body);
  const rank=document.createElement('details');const rsum=document.createElement('summary');rsum.textContent='查看 TCF 实战频率 Top 15';const rb=document.createElement('p');rb.className='note';
  rb.textContent=[...FREQ.values()].sort((a,b)=>b.occurrences-a.occurrences||b.sources.size-a.sources.size||b.forms.size-a.forms.size||a.lemma.localeCompare(b.lemma,'fr')).slice(0,15).map((x,i)=>(i+1)+'. '+x.lemma+' · '+x.occurrences+' 次 · '+x.sources.size+' 个任务来源 · '+x.forms.size+' 个变位形式').join('\n');
  rank.append(rsum,rb);
  sec.append(title,p,p2,row,review,details,rank);
  anchor.after(sec);
 }
 const mo=new MutationObserver(()=>setTimeout(addPanel,0));
 function watch(){const d=$('c1CourseDialog');if(!d){setTimeout(watch,100);return;}mo.observe(d,{childList:true,subtree:true});d.addEventListener('toggle',addPanel);d.addEventListener('click',()=>setTimeout(addPanel,0));addPanel();}
 setTimeout(watch,0);
 setTimeout(ensureReturnButton,0);
 window.C1_SUBJUNCTIVE_BRIDGE={B1,B2,FREQ,open:openTier,back:returnToSubjunctiveCourse};
})();


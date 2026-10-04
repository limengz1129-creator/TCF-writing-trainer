'use strict';
(()=>{
 const B1=['être','avoir','pouvoir','faire','prendre','venir','savoir','falloir','mettre','apprendre','choisir','devenir','tenir','connaître','répondre','réduire','proposer','rester','trouver','développer','améliorer','protéger','établir','utiliser'];
 const B2=['adapter','limiter','offrir','organiser','préparer','privilégier','renforcer','respecter','accompagner','communiquer','comparer','constituer','contrôler','convenir','donner','douter','encadrer','envisager','garantir','imposer','laisser','passer','présenter','prévoir','profiter','remplacer','sentir','souhaiter','veiller','vérifier'];
 const TIERS={b1:new Set(B1),b2:new Set(B2)};
 state.subjunctiveTier=state.subjunctiveTier||'';
 state.subjunctiveReturn=!!state.subjunctiveReturn;
 const $=id=>document.getElementById(id);
 function tierLabel(){return state.subjunctiveTier==='b1'?'B1 核心必熟 · 24 动词 / 41 变位':state.subjunctiveTier==='b2'?'B2 高频扩展 · 30 动词 / 36 变位':'';}
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
  return rs;
 };
 const baseBuildVerbFilters=buildVerbFilters;
 buildVerbFilters=function(){baseBuildVerbFilters();if(mode===3){ensureTierFilter();$('subjunctiveTier').value=state.subjunctiveTier||'';}};
 const baseSetModule=setModule;
 setModule=function(m,fresh=false){
  if(m===3&&fresh&&!window.__openingSubjunctiveBridge)state.subjunctiveTier='';
  baseSetModule(m,fresh);
  if(m===3){ensureTierFilter();$('subjunctiveTier').value=state.subjunctiveTier||'';syncNote();}
  ensureReturnButton();
 };
 function syncNote(){
  if(mode!==3||!$('sourceNote'))return;
  const label=tierLabel();
  if(label)$('sourceNote').textContent=label+'。只调用 613 动词库中真实出现过的虚拟式现在时人称 / 变位；不要求机械补齐六个人称。';
 }
 $('category')?.addEventListener('change',()=>{if(mode===3&&state.subjunctiveTier&&$('category').value!=='虚拟式现在时'){state.subjunctiveTier='';if($('subjunctiveTier'))$('subjunctiveTier').value='';show(filtered()[0]||null);buildSource();syncNote();persist();}});
 function openTier(tier){
  // 专项入口必须从“全部五任务来源”开始，避免继承其它模块/上一次练习的残留筛选。
  state.source='';
  state.subjunctiveReturn=true;
  window.__openingSubjunctiveBridge=true;
  setModule(3,true);
  window.__openingSubjunctiveBridge=false;
  state.subjunctiveTier=tier==='b1'||tier==='b2'?tier:'';
  buildSource();
  if($('sourceFilter'))$('sourceFilter').value='';
  if($('status'))$('status').value='';
  if($('search'))$('search').value='';
  if($('verbLemma'))$('verbLemma').value='';
  if($('verbPerson'))$('verbPerson').value='';
  buildVerbFilters();
  $('category').value='虚拟式现在时';
  if($('subjunctiveTier'))$('subjunctiveTier').value=state.subjunctiveTier;
  order=null;
  show(filtered()[0]||null);
  syncNote();ensureReturnButton();persist();
  $('practice')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function addPanel(){
  const d=$('c1CourseDialog');if(!d||!d.open)return;
  const h=d.querySelector('h2');if(!h?.textContent.includes('#15 Le subjonctif'))return;
  if(d.querySelector('#c1-subjunctive-b'))return;
  const anchor=d.querySelector('#c1-frames');if(!anchor)return;
  const sec=document.createElement('section');sec.className='c1-course-section';sec.id='c1-subjunctive-b';
  const title=document.createElement('h3');title.textContent='B · 虚拟式动词变位专项猛攻';
  const p=document.createElement('p');p.className='note';p.textContent='不在 #15 重复造一套变位题。这里直接调用“动词变位 613”同一份数据：B1 先练到自动化，B2 再稳定扩展；全部 81 个动词 / 106 个变位留给后续有余力时继续。';
  const p2=document.createElement('p');p2.className='note';p2.textContent='B1 / B2 都按你五个任务真实语料里已经出现过的人称来练，不要求每个动词机械背齐 je / tu / il / nous / vous / ils 六格。';
  const row=document.createElement('div');row.className='c1-actions';
  const mk=(label,tier,primary=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(primary)b.className='primary';b.onclick=()=>{d.close();openTier(tier)};return b;};
  row.append(mk('猛攻 B1 · 24 动词 / 41 变位','b1',true),mk('猛攻 B2 · 30 动词 / 36 变位','b2'),mk('练全部虚拟式现在时 · 81 / 106',''));
  const details=document.createElement('details');const sum=document.createElement('summary');sum.textContent='查看 B1 / B2 动词名单';const body=document.createElement('p');body.className='note';body.textContent='B1：'+B1.join(' · ')+'\n\nB2：'+B2.join(' · ');details.append(sum,body);
  sec.append(title,p,p2,row,details);
  anchor.after(sec);
 }
 const mo=new MutationObserver(()=>setTimeout(addPanel,0));
 function watch(){const d=$('c1CourseDialog');if(!d){setTimeout(watch,100);return;}mo.observe(d,{childList:true,subtree:true});d.addEventListener('toggle',addPanel);d.addEventListener('click',()=>setTimeout(addPanel,0));addPanel();}
 setTimeout(watch,0);
 setTimeout(ensureReturnButton,0);
 window.C1_SUBJUNCTIVE_BRIDGE={B1,B2,open:openTier,back:returnToSubjunctiveCourse};
})();

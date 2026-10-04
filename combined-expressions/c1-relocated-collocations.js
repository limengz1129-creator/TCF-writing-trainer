'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const ALL=C1_GRAMMAR_DATA.entries.filter(e=>e.category===0&&e.kind==='collocation'&&e.subcategory==='高频固定搭配');
 const KEEP_IN_15=new Set(['c1-6e3ef78552938130']); // veiller à ce que + subjonctif 已保留在 #15 主专项
 const M15=new Set(['c1-fe02d110d4660a86','c1-d83371b2df02db43','c1-0ebe5ea405f8af79']);
 const M2=new Set(['c1-ce9f432c6da362a7','c1-54d94689aeb7e0c8','c1-4121167a629e579c']);
 const hidden=ALL.filter(e=>!KEEP_IN_15.has(e.id));
 const M8=hidden.filter(e=>!M15.has(e.id)&&!M2.has(e.id));
 const rowsFor=n=>n===8?M8:n===2?hidden.filter(e=>M2.has(e.id)):n===15?hidden.filter(e=>M15.has(e.id)):[];
 const titleFor=n=>n===8?'安家语料 · 40 条高频动词固定搭配':n===2?'安家语料 · 3 条形容词 / 状态表达':'安家语料 · 3 条虚拟式高价值搭配';
 const noteFor=n=>n===8?'这些词条原本跟随“虚拟式核心动词”资料进入旧专项，但它们本质是可跨时态复用的动词固定搭配，因此归到 #8。原词条、例句和来源不删除。':n===2?'这 3 条核心是 être + 形容词 / 状态补语，不属于虚拟式本身，因此归到 #2。':'这 3 条本身直接包含虚拟式触发，因此继续归 #15；veiller à ce que + subjonctif 已经保留在 #15 主结构中，不在这里重复。';
 function speak(text){
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(String(text||'').replace(/\+/g,', '));
  const voices=speechSynthesis.getVoices().filter(v=>/^fr(?:[-_]|$)/i.test(v.lang));
  if(voices.length)u.voice=voices.find(v=>v.lang.toLowerCase()==='fr-fr')||voices[0];
  u.lang=u.voice?.lang||'fr-FR';u.rate=.92;speechSynthesis.speak(u);
 }
 function group8(rows){
  const order=['faire','prendre','mettre','savoir','pouvoir','avoir','favoriser','encourager','protéger','garantir','proposer','permettre','veiller'];
  const group=new Map(order.map(x=>[x,[]]));
  for(const e of rows){
   const k=order.find(x=>e.french.toLowerCase().startsWith(x+' '))||'autres';
   if(!group.has(k))group.set(k,[]);group.get(k).push(e);
  }
  return [...group.entries()].filter(([,rs])=>rs.length);
 }
 function makeTable(rows){
  const t=document.createElement('table');t.className='c1-course-table';
  const thead=document.createElement('thead'),tr=document.createElement('tr');
  for(const x of ['中文','法语固定搭配','原资料例句']){const th=document.createElement('th');th.textContent=x;tr.append(th);}
  thead.append(tr);t.append(thead);
  const body=document.createElement('tbody');
  for(const e of rows){
   const r=document.createElement('tr');
   const zh=document.createElement('td');zh.textContent=e.chinese;
   const fr=document.createElement('td');const strong=document.createElement('strong');strong.textContent=e.french;
   const b=document.createElement('button');b.type='button';b.className='c1-audio-mini';b.textContent='🔊';b.onclick=()=>speak(e.french);fr.append(strong,document.createTextNode(' '),b);
   const ex=document.createElement('td');
   const preferredSample={
    'c1-d83371b2df02db43':'Il se peut que nous devions prendre des mesures supplémentaires pour résoudre ce problème.',
    'c1-0ebe5ea405f8af79':'Il est possible que le gouvernement doive intervenir davantage dans certaines situations.'
   };
   const sample=preferredSample[e.id]||e.examples?.find(x=>x.french)?.french||'';
   ex.textContent=sample;
   if(sample){const sb=document.createElement('button');sb.type='button';sb.className='c1-audio-mini';sb.textContent='🔊';sb.onclick=()=>speak(sample);ex.append(document.createTextNode(' '),sb);}
   r.append(zh,fr,ex);body.append(r);
  }
  t.append(body);return t;
 }
 function sectionFor(n){
  const sec=document.createElement('section');sec.className='c1-course-section c1-relocated-collocations';sec.dataset.relocated=String(n);
  const h=document.createElement('h3');h.textContent=titleFor(n);
  const p=document.createElement('p');p.className='note';p.textContent=noteFor(n);sec.append(h,p);
  const rows=rowsFor(n);
  if(n===8){
   for(const [verb,rs] of group8(rows)){
    const d=document.createElement('details');d.open=['faire','prendre','mettre','savoir'].includes(verb);
    const sum=document.createElement('summary');sum.textContent=verb+' · '+rs.length+' 条';d.append(sum,makeTable(rs));sec.append(d);
   }
  }else sec.append(makeTable(rows));
  return sec;
 }
 function maybeAdd(){
  const d=$('c1CourseDialog');if(!d||!d.open)return;
  const h=d.querySelector('h2');if(!h)return;
  const m=h.textContent.match(/^#(\d+)/);if(!m)return;
  const n=Number(m[1]);if(![2,8,15].includes(n))return;
  if(d.querySelector('[data-relocated="'+n+'"]'))return;
  const anchor=d.querySelector('#c1-frames')||d.querySelector('#c1-lessons');
  if(anchor)anchor.after(sectionFor(n));
 }
 function watch(){
  const d=$('c1CourseDialog');if(!d){setTimeout(watch,100);return;}
  const mo=new MutationObserver(()=>setTimeout(maybeAdd,0));mo.observe(d,{childList:true,subtree:true});
  d.addEventListener('toggle',maybeAdd);d.addEventListener('click',()=>setTimeout(maybeAdd,0));maybeAdd();
 }
 setTimeout(watch,0);
 window.C1_RELOCATED_COLLOCATIONS={hiddenCount:hidden.length,module8:M8.length,module2:M2.size,module15:M15.size};
})();

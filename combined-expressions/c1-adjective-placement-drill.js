'use strict';
(()=>{
 const KEY='tcf-c1-adjective-placement-v1';
 const CORE=[
  ['bon / bonne','好的','une bonne idée','通常前置'],
  ['mauvais / mauvaise','不好的','un mauvais choix','通常前置'],
  ['meilleur / meilleure','更好的','une meilleure qualité de vie','通常前置'],
  ['grand / grande','大的；重要的','un grand avantage','通常前置'],
  ['petit / petite','小的','une petite entreprise','通常前置'],
  ['jeune','年轻的','les jeunes adultes','通常前置'],
  ['nouveau / nouvelle','新的','une nouvelle méthode','通常前置'],
  ['dernier / dernière','最后的；最近的','ces dernières années','依含义前置'],
  ['principal / principale','主要的','la principale raison','常用前置'],
  ['seul / seule','唯一的','la seule solution','表“唯一”时前置'],
  ['même','相同的','la même situation','表“相同”时前置'],
  ['autre','另一个；其他的','une autre possibilité','常规表达前置'],
  ['nombreux / nombreuse','许多的','de nombreux avantages','表“许多”时常前置'],
  ['certain / certaine','某些；某种','certaines personnes','泛指时前置'],
  ['propre','自己的','ses propres choix','表“自己的”时前置'],
  ['fort / forte','高的；强的','une forte augmentation','高频搭配前置'],
  ['faible','低的；弱的','un faible revenu','高频搭配前置'],
  ['grave','严重的','de graves conséquences','高频搭配前置']
 ];
 const OUT=[
  {zh:'一个好主意',a:'une bonne idée'},
  {zh:'一个不好的选择',a:'un mauvais choix'},
  {zh:'更好的生活质量',a:'une meilleure qualité de vie'},
  {zh:'一个很大的优势',a:'un grand avantage'},
  {zh:'一种新的方法',a:'une nouvelle méthode'},
  {zh:'主要原因',a:'la principale raison'},
  {zh:'唯一的解决办法',a:'la seule solution'},
  {zh:'相同的情况',a:'la même situation'},
  {zh:'另一种可能性',a:'une autre possibilité'},
  {zh:'某些人',a:'certaines personnes'},
  {zh:'自己的选择',a:'ses propres choix'},
  {zh:'大幅增长',a:'une forte augmentation'}
 ];
 const DES=[
  {zh:'认识新朋友',pre:'faire connaissance avec ',post:'',a:'de nouveaux amis',note:'复数不定冠词 des + 前置形容词 nouveaux → de nouveaux amis。'},
  {zh:'新的可能性',pre:'',post:'',a:'de nouvelles possibilités',note:'des possibilités → de nouvelles possibilités。'},
  {zh:'许多优势',pre:'',post:'',a:'de nombreux avantages',note:'des avantages → de nombreux avantages。'},
  {zh:'严重后果',pre:'',post:'',a:'de graves conséquences',note:'des conséquences → de graves conséquences。'},
  {zh:'更好的解决方案',pre:'chercher ',post:'',a:'de meilleures solutions',note:'des solutions → de meilleures solutions。'},
  {zh:'新的工作机会',pre:'créer ',post:'',a:"de nouvelles possibilités d’emploi",alts:["de nouvelles possibilités d'emploi"],note:'复数不定冠词 des 在 nouvelles 前通常变 de。'},
  {zh:'重要的变化',pre:'connaître ',post:'',a:"d’importants changements",alts:["d'importants changements"],note:'元音开头的前置形容词前用 d’。'},
  {zh:'长期失业可能造成负面影响。',pre:'',post:' peuvent avoir des effets négatifs.',a:'De longues périodes de chômage',type:'des → de',note:'des périodes → de longues périodes；long 在时间名词前是高频搭配。'},
  {zh:'一些严重问题',pre:'rencontrer ',post:'',a:'de graves problèmes',note:'des problèmes → de graves problèmes。'},
  {zh:'一些真正的机会',pre:'offrir ',post:'',a:'de réelles possibilités',note:'des possibilités → de réelles possibilités。'}
 ];
 const $=id=>document.getElementById(id);
 const E=(tag,cls='',txt='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=txt;return e};
 const norm=s=>(s||'').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
 function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
 function right(q,v){const n=norm(v);return [q.a,...(q.alts||[])].some(x=>norm(x)===n)}
 function say(t){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=.92;window.speechSynthesis.speak(u)}
 function addOverview(){
   const host=$('c1-practice');if(!host||$('c1AdjPlacementBlock'))return;
   const wrap=E('section','c1-adj-block');wrap.id='c1AdjPlacementBlock';
   wrap.append(E('div','eyebrow','#2 L’adjectif · TCF 高频主动掌握'),E('h3','','前置形容词：18 项核心 + des → de 专项'),E('p','note','依据你的《形容词前置_两层规律表》筛选。不是把整张表全部刷完：先把高频项目练到主动输出，其余保留为认识。'));
   const t=E('table','c1-adj-core-table');const h=document.createElement('thead');const hr=document.createElement('tr');['形容词','中文','TCF 高频搭配','位置'].forEach(x=>hr.append(E('th','',x)));h.append(hr);t.append(h);const body=document.createElement('tbody');
   CORE.forEach(r=>{const tr=document.createElement('tr');r.forEach((x,i)=>{const td=E('td',i===2?'c1-adj-example':'',x);if(i===2){const b=E('button','c1-audio-mini','🔊');b.type='button';b.onclick=()=>say(x);td.append(document.createTextNode(' '),b)}tr.append(td)});body.append(tr)});t.append(body);const sc=E('div','c1-adj-scroll');sc.append(t);wrap.append(sc);

   const s1=E('section','c1-adj-sub');s1.append(E('h4','','主动输出 · 12 题'),E('p','note','中文 → 法语完整词组。'));const grid=E('div','c1-adj-grid');
   OUT.forEach((q,i)=>{const card=E('article','c1-adj-card');card.append(E('strong','',q.zh));const input=document.createElement('input');input.type='text';input.placeholder='输入法语词组';input.value=load()['o'+i]?.v||'';const fb=E('div','c1-adj-fb hidden');const b=E('button','','检查');b.type='button';b.onclick=()=>{const ok=norm(input.value)===norm(q.a);fb.textContent=(ok?'✓ ':'✗ 正确答案：')+q.a;fb.className='c1-adj-fb '+(ok?'ok':'bad');const st=load();st['o'+i]={v:input.value,ok};save(st)};input.oninput=()=>{const st=load();st['o'+i]={v:input.value};save(st);fb.className='c1-adj-fb hidden'};card.append(input,b,fb);grid.append(card)});s1.append(grid);wrap.append(s1);

   const s2=E('section','c1-adj-sub');s2.append(E('h4','','des → de · 10 题专项'),E('p','note','重点：这里只练“复数不定冠词 des + 前置形容词 → de / d’”。如果 des 是 de + les 的缩合，不适用这条规则。'));
   const table=E('table','c1-adj-drill-table');const hh=document.createElement('thead');const rr=document.createElement('tr');rr.append(E('th','','中文'),E('th','','法语填空'));hh.append(rr);table.append(hh);const bb=document.createElement('tbody');
   DES.forEach((q,i)=>{const tr=document.createElement('tr');const zh=E('td','',q.zh);const fr=document.createElement('td');const line=E('div','c1-adj-fill');line.append(document.createTextNode(q.pre));const input=document.createElement('input');input.type='text';input.placeholder='________';input.value=load()['d'+i]?.v||'';line.append(input,document.createTextNode(q.post));const row=E('div','c1-row-actions');const ck=E('button','','检查');const au=E('button','c1-audio-mini','🔊 整句朗读');ck.type=au.type='button';const fb=E('div','c1-adj-fb hidden');ck.onclick=()=>{const ok=right(q,input.value);fb.replaceChildren(E('div',ok?'ok':'bad',ok?'✓ 正确':'✗ 正确答案：'+q.a),E('p','',q.note));fb.classList.remove('hidden');const st=load();st['d'+i]={v:input.value,ok};save(st)};au.onclick=()=>say(q.pre+q.a+q.post);input.oninput=()=>{const st=load();st['d'+i]={v:input.value};save(st);fb.className='c1-adj-fb hidden'};row.append(ck,au);fr.append(line,row,fb);tr.append(zh,fr);bb.append(tr)});table.append(bb);const sc2=E('div','c1-adj-scroll');sc2.append(table);s2.append(sc2);wrap.append(s2);
   host.insertAdjacentElement('afterend',wrap);
 }
 function watch(){const d=$('c1CourseDialog');if(!d)return;new MutationObserver(()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#2 L’adjectif'))setTimeout(addOverview,0)}).observe(d,{childList:true,subtree:true});d.addEventListener('toggle',()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#2 L’adjectif'))setTimeout(addOverview,0)})}
 setTimeout(watch,0);
})();
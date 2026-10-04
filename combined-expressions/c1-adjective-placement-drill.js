'use strict';
(()=>{
 const KEY='tcf-c1-adjective-placement-v2';
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
  {zh:'这是一个好主意。',pre:"C’est ",post:'.',a:'une bonne idée',type:'高频前置',note:'bon / bonne 通常放在名词前：une bonne idée。'},
  {zh:'这可能是一个不好的选择。',pre:'Cela peut être ',post:'.',a:'un mauvais choix',type:'高频前置',note:'mauvais / mauvaise 通常前置：un mauvais choix。'},
  {zh:'我们需要找到一个更好的解决方案。',pre:'Nous devons trouver ',post:'.',a:'une meilleure solution',type:'高频前置',note:'meilleur / meilleure 通常前置，并与名词配合。'},
  {zh:'远程办公可以带来更好的生活质量。',pre:'Le télétravail peut offrir ',post:'.',a:'une meilleure qualité de vie',type:'高频前置',note:'meilleure 与 qualité（阴性）配合。'},
  {zh:'灵活性是远程办公的一大优势。',pre:'La flexibilité constitue ',post:' du télétravail.',a:'un grand avantage',type:'高频前置',note:'grand 表“很大的、重要的”时常前置。'},
  {zh:'一家小企业也可以提供良好的工作环境。',pre:'',post:' peut aussi offrir un bon environnement de travail.',a:'Une petite entreprise',type:'高频前置',note:'petit / petite 通常前置。'},
  {zh:'年轻成年人经常面临住房问题。',pre:'',post:' sont souvent confrontés à des problèmes de logement.',a:'Les jeunes adultes',type:'高频前置',note:'jeune 通常放在年龄类名词前。'},
  {zh:'我们应该尝试一种新的方法。',pre:'Nous devrions essayer ',post:'.',a:'une nouvelle méthode',type:'高频前置',note:'nouveau / nouvelle 通常前置。'},
  {zh:'找到一份新工作可能需要时间。',pre:'Trouver ',post:' peut prendre du temps.',a:'un nouvel emploi',type:'高频前置',note:'nouveau 在阳性单数元音开头名词前变为 nouvel。'},
  {zh:'近年来，远程办公变得越来越普遍。',pre:'',post:', le télétravail est devenu de plus en plus courant.',a:'Ces dernières années',type:'位置随意义',note:'ces dernières années = 近几年；dernier 表“最近的”时前置。'},
  {zh:'主要原因是生活成本太高。',pre:'',post:' est que le coût de la vie est trop élevé.',a:'La principale raison',type:'常用前置',note:'principal / principale 常用前置；后置也可以。'},
  {zh:'这不是唯一的解决办法。',pre:"Ce n’est pas ",post:'.',a:'la seule solution',type:'意义决定位置',note:'seul 表“唯一的”时前置。'},
  {zh:'并不是每个人都处于相同的情况。',pre:"Tout le monde n’est pas dans ",post:'.',a:'la même situation',type:'意义决定位置',note:'même 表“相同的、同一个”时前置。'},
  {zh:'我们还应该考虑另一种可能性。',pre:'Nous devrions aussi envisager ',post:'.',a:'une autre possibilité',type:'高频前置',note:'autre 在常规表达中放在名词前。'},
  {zh:'这项政策有许多优势。',pre:'Cette politique présente ',post:'.',a:'de nombreux avantages',type:'高频前置 + des→de',note:'nombreux 常前置；复数不定冠词 des 在前置形容词前通常变 de。'},
  {zh:'这个项目取得了一定程度的成功。',pre:'Ce projet a connu ',post:'.',a:'un certain succès',type:'意义决定位置',note:'certain 前置表示“某种、一定程度的”；后置时含义不同。'},
  {zh:'年轻人应该能够做出自己的选择。',pre:'Les jeunes devraient pouvoir faire ',post:'.',a:'leurs propres choix',type:'意义决定位置',note:'propre 表“自己的”时通常与物主限定词连用并前置。'},
  {zh:'这座城市经历了租金的大幅上涨。',pre:'La ville connaît ',post:' des loyers.',a:'une forte augmentation',type:'高频搭配前置',note:'fort / forte 在 augmentation 等高频搭配中常前置。'},
  {zh:'低收入人群往往需要更多支持。',pre:'Les personnes ayant ',post:' ont souvent besoin de davantage de soutien.',a:'un faible revenu',type:'高频搭配前置',note:'faible 在 revenu / proportion 等高频搭配中常前置；faible ≠ fiable。'},
  {zh:'这可能是一个严重错误。',pre:'Cela pourrait être ',post:'.',a:'une grave erreur',type:'高频搭配前置',note:'grave 在 erreur / conséquences 等搭配中常前置。'},

  {zh:'参加当地活动可以帮助新移民认识新朋友。',pre:'Participer à des activités locales peut aider les nouveaux arrivants à faire connaissance avec ',post:'.',a:'de nouveaux amis',type:'des → de 联动',note:'des amis → de nouveaux amis：复数不定冠词 des + 前置形容词。'},
  {zh:'学习一门语言可以带来新的可能性。',pre:"Apprendre une langue peut ouvrir ",post:'.',a:'de nouvelles possibilités',type:'des → de 联动',note:'des possibilités → de nouvelles possibilités。'},
  {zh:'远程办公有许多优势。',pre:'Le télétravail présente ',post:'.',a:'de nombreux avantages',type:'des → de 联动',note:'des avantages → de nombreux avantages。'},
  {zh:'这个决定可能带来严重后果。',pre:'Cette décision pourrait avoir ',post:'.',a:'de graves conséquences',type:'des → de 联动',note:'des conséquences → de graves conséquences。'},
  {zh:'政府应该寻找更好的解决方案。',pre:'Le gouvernement devrait chercher ',post:'.',a:'de meilleures solutions',type:'des → de 联动',note:'des solutions → de meilleures solutions。'},

  {zh:'这是一个可靠的信息来源。',pre:"C’est ",post:'.',a:'une source fiable',type:'前置 / 后置对比',note:'fiable 通常后置：une source fiable；不要受 faible 前置搭配影响。'},
  {zh:'教育在社会融入中发挥重要作用。',pre:"L’éducation joue ",post:" dans l’intégration sociale.",a:'un rôle important',type:'前置 / 后置对比',note:'important 在论证中常见自然表达是后置：un rôle important。'},
  {zh:'这是一个严重的问题。',pre:"C’est ",post:'.',a:'un problème grave',type:'前置 / 后置对比',note:'grave 可以后置；un problème grave 很自然。不要把 grave 机械地永远前置。'},
  {zh:'污染对公共健康构成真实威胁。',pre:'La pollution représente ',post:' pour la santé publique.',a:'un danger réel',type:'前置 / 后置对比',note:'réel 可以后置：un danger réel；前置 un réel danger 带更强的强调意味。'},
  {zh:'我们需要一种不同的解决方案。',pre:'Nous avons besoin ',post:'.',a:"d’une solution différente",alts:["d'une solution différente"],type:'前置 / 后置对比',note:'différent 表“不同的”时，单数自然用法通常后置：une solution différente。'}
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

   const s1=E('section','c1-adj-sub');s1.append(E('h4','','前置形容词 · 30题主动训练'),E('p','note','20题高频前置 + 5题 des→de 联动 + 5题前置/后置对比。中文提示 → 法语核心词块填空；重点练位置、配合和真实 TCF 句子。'));
   const t1=E('table','c1-adj-drill-table');const h1=document.createElement('thead');const r1=document.createElement('tr');r1.append(E('th','','中文'),E('th','','法语填空'));h1.append(r1);t1.append(h1);const b1=document.createElement('tbody');
   OUT.forEach((q,i)=>{const tr=document.createElement('tr');const zh=E('td','',(i+1)+'. '+q.zh);const fr=document.createElement('td');const line=E('div','c1-adj-fill');line.append(document.createTextNode(q.pre));const input=document.createElement('input');input.type='text';input.placeholder='________';input.value=load()['o'+i]?.v||'';line.append(input,document.createTextNode(q.post));const row=E('div','c1-row-actions');const ck=E('button','','检查');const show=E('button','','显示答案');const au=E('button','c1-audio-mini','🔊 整句朗读');ck.type=show.type=au.type='button';const fb=E('div','c1-adj-fb hidden');ck.onclick=()=>{const ok=right(q,input.value);fb.replaceChildren(E('div',ok?'ok':'bad',ok?'✓ 正确':'✗ 正确答案：'+q.a),E('span','c1-rule-tag',q.type),E('p','',q.note));fb.classList.remove('hidden');const st=load();st['o'+i]={v:input.value,ok};save(st)};show.onclick=()=>{input.value=q.a;fb.replaceChildren(E('div','ok','✓ '+q.a),E('span','c1-rule-tag',q.type),E('p','',q.note));fb.classList.remove('hidden');const st=load();st['o'+i]={v:q.a,ok:true};save(st)};au.onclick=()=>say(q.pre+q.a+q.post);input.oninput=()=>{const st=load();st['o'+i]={v:input.value};save(st);fb.className='c1-adj-fb hidden'};row.append(ck,show,au);fr.append(line,row,fb);tr.append(zh,fr);b1.append(tr)});t1.append(b1);const sc1=E('div','c1-adj-scroll');sc1.append(t1);s1.append(sc1);wrap.append(s1);

   const s2=E('section','c1-adj-sub');s2.append(E('h4','','des → de · 10 题专项'),E('p','note','重点：这里只练“复数不定冠词 des + 前置形容词 → de / d’”。如果 des 是 de + les 的缩合，不适用这条规则。'));
   const table=E('table','c1-adj-drill-table');const hh=document.createElement('thead');const rr=document.createElement('tr');rr.append(E('th','','中文'),E('th','','法语填空'));hh.append(rr);table.append(hh);const bb=document.createElement('tbody');
   DES.forEach((q,i)=>{const tr=document.createElement('tr');const zh=E('td','',q.zh);const fr=document.createElement('td');const line=E('div','c1-adj-fill');line.append(document.createTextNode(q.pre));const input=document.createElement('input');input.type='text';input.placeholder='________';input.value=load()['d'+i]?.v||'';line.append(input,document.createTextNode(q.post));const row=E('div','c1-row-actions');const ck=E('button','','检查');const au=E('button','c1-audio-mini','🔊 整句朗读');ck.type=au.type='button';const fb=E('div','c1-adj-fb hidden');ck.onclick=()=>{const ok=right(q,input.value);fb.replaceChildren(E('div',ok?'ok':'bad',ok?'✓ 正确':'✗ 正确答案：'+q.a),E('p','',q.note));fb.classList.remove('hidden');const st=load();st['d'+i]={v:input.value,ok};save(st)};au.onclick=()=>say(q.pre+q.a+q.post);input.oninput=()=>{const st=load();st['d'+i]={v:input.value};save(st);fb.className='c1-adj-fb hidden'};row.append(ck,au);fr.append(line,row,fb);tr.append(zh,fr);bb.append(tr)});table.append(bb);const sc2=E('div','c1-adj-scroll');sc2.append(table);s2.append(sc2);wrap.append(s2);
   host.insertAdjacentElement('afterend',wrap);
 }
 function watch(){const d=$('c1CourseDialog');if(!d)return;new MutationObserver(()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#2 L’adjectif'))setTimeout(addOverview,0)}).observe(d,{childList:true,subtree:true});d.addEventListener('toggle',()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#2 L’adjectif'))setTimeout(addOverview,0)})}
 setTimeout(watch,0);
})();
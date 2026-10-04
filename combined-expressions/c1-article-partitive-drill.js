'use strict';
(()=>{
 const KEY='tcf-c1-article-partitive-drill-v1';
 const Q=[
  {zh:'我早上喝咖啡。',pre:'Je bois ',post:' le matin.',a:'du café',type:'部分冠词',note:'不可数名词 café 的不确定数量：du café。'},
  {zh:'她每天喝牛奶。',pre:'Elle boit ',post:' tous les jours.',a:'du lait',type:'部分冠词',note:'不可数名词 lait 的不确定数量：du lait。'},
  {zh:'这份工作需要耐心。',pre:'Ce travail demande ',post:'.',a:'de la patience',type:'部分冠词',note:'patience 是阴性不可数抽象名词：de la patience。'},
  {zh:'为了成功，需要勇气。',pre:'Pour réussir, il faut ',post:'.',a:'du courage',type:'部分冠词',note:'courage 在这里表示不确定数量：du courage。'},
  {zh:'年轻人需要一定的自主性。',pre:'Les jeunes ont besoin ',post:' pour devenir plus indépendants.',a:"d’autonomie",alts:["d'autonomie"],type:'固定结构 + de',note:'avoir besoin de + nom；元音前 de → d’。'},
  {zh:'运动可以给人带来能量。',pre:'Le sport peut donner ',post:' aux gens.',a:"de l’énergie",alts:["de l'energie","de l’énergie"],type:'部分冠词',note:'énergie 以元音开头：de l’énergie。'},
  {zh:'这个项目需要钱。',pre:'Ce projet nécessite ',post:'.',a:"de l’argent",alts:["de l'argent"],type:'部分冠词',note:'argent 是元音开头的不可数名词：de l’argent。'},
  {zh:'很多人在工作中承受压力。',pre:'Beaucoup de personnes subissent ',post:' au travail.',a:'du stress',type:'部分冠词',note:'stress 在这里表示不确定数量：du stress。'},
  {zh:'劳动力市场的运作发生了变化。',pre:'Le fonctionnement ',post:' a changé.',a:'du marché du travail',type:'de + le = du',note:'le fonctionnement de + le marché du travail → du marché du travail。'},
  {zh:'政府应该改善教育体系的质量。',pre:'Le gouvernement devrait améliorer la qualité ',post:'.',a:'du système éducatif',type:'de + le = du',note:'la qualité de + le système éducatif → du système éducatif。'},
  {zh:'住房的价格越来越高。',pre:'Le prix ',post:' est de plus en plus élevé.',a:'du logement',type:'de + le = du',note:'le prix de + le logement → du logement。'},
  {zh:'这是远程工作的一个主要优点。',pre:"C’est l’un des principaux avantages ",post:'.',a:'du télétravail',type:'de + le = du',note:'un avantage de + le télétravail → du télétravail。'},
  {zh:'父母的支持对孩子很重要。',pre:'Le soutien ',post:' est important pour les enfants.',a:'des parents',type:'de + les = des',note:'le soutien de + les parents → des parents。'},
  {zh:'市中心的生活成本很高。',pre:'Le coût de la vie ',post:' est élevé.',a:'du centre-ville',type:'de + le = du',note:'de + le centre-ville → du centre-ville。'},
  {zh:'我不喝咖啡。',pre:'Je ne bois pas ',post:'.',a:'de café',type:'否定后 de',note:'否定句中，部分冠词 du 通常变为 de：pas de café。'},
  {zh:'这个社区没有适合儿童的活动。',pre:"Il n’y a pas ",post:' pour les enfants dans ce quartier.',a:"d’activités",alts:["d'activités"],type:'否定后 de',note:'否定中的复数不定冠词 des 通常变 de；元音前为 d’。'},
  {zh:'我们没有钱完成这个项目。',pre:'Nous n’avons pas ',post:' pour terminer ce projet.',a:"d’argent",alts:["d'argent"],type:'否定后 de',note:'pas de + nom；元音前 de → d’。'},
  {zh:'目前还没有理想的解决方案。',pre:"Il n’y a pas ",post:' idéale pour le moment.',a:'de solution',type:'否定后 de',note:'否定中的不定冠词 une 通常变为 de。'},
  {zh:'我们没有太多时间。',pre:'Nous n’avons pas beaucoup ',post:'.',a:'de temps',type:'数量表达 + de',note:'beaucoup de + nom；不保留部分冠词。'},
  {zh:'这种政策可以创造更多机会。',pre:'Cette politique peut créer plus ',post:'.',a:'de possibilités',type:'数量表达 + de',note:'plus de + nom。'},
  {zh:'学校应该提供足够的资源。',pre:'Les écoles devraient fournir suffisamment ',post:'.',a:'de ressources',type:'数量表达 + de',note:'suffisamment de + nom。'},
  {zh:'这个城市提供多少活动？',pre:'Combien ',post:' cette ville propose-t-elle ?',a:"d’activités",alts:["d'activités"],type:'数量表达 + de',note:'combien de + nom；元音前为 d’。'},
  {zh:'新移民需要时间适应新环境。',pre:'Les nouveaux arrivants ont besoin ',post:' pour s’adapter à leur nouvel environnement.',a:'de temps',type:'固定结构 + de',note:'avoir besoin de + nom。这里不是部分冠词。'},
  {zh:'有些年轻人需要家人的支持。',pre:'Certains jeunes ont besoin ',post:' de leur famille.',a:'de soutien',type:'固定结构 + de',note:'avoir besoin de soutien：固定结构 de + 抽象名词。'},
  {zh:'孩子需要自由去探索自己的兴趣。',pre:'Les enfants ont besoin ',post:' pour explorer leurs propres centres d’intérêt.',a:'de liberté',type:'固定结构 + de',note:'avoir besoin de + nom：de liberté。'},
  {zh:'有困难时，不要害怕寻求帮助。',pre:'En cas de difficulté, il ne faut pas avoir peur de demander ',post:'.',a:"de l’aide",alts:["de l'aide"],type:'固定结构 + de',note:'demander de l’aide：这里 de l’ 是部分冠词，整个搭配高频记忆。'},
  {zh:'适应一个新国家需要时间。',pre:'Il faut ',post:' pour s’adapter à un nouveau pays.',a:'du temps',type:'部分冠词',note:'il faut du temps：这里是“不确定数量的时间”，用部分冠词 du。'},
  {zh:'我们没有足够的时间准备。',pre:'Nous n’avons pas assez ',post:' pour nous préparer.',a:'de temps',type:'数量表达 + de',note:'assez de + nom；即使 temps 不可数，也不保留 du。'},
  {zh:'政府的作用是提供一个公平的框架。',pre:'Le rôle ',post:' est de fournir un cadre équitable.',a:'du gouvernement',type:'de + le = du',note:'le rôle de + le gouvernement → du gouvernement。'},
  {zh:'我采访过的那些学生中，很多人支持这个措施。',pre:'Beaucoup ',post:' soutiennent cette mesure.',a:"des étudiants que j’ai interrogés",alts:["des étudiants que j'ai interrogés"],type:'特指群体：de + les = des',note:'这里指“我采访过的那些学生中的很多人”，所以 de + les → des；不是普通的 beaucoup de + nom。'}
 ];
 const $=id=>document.getElementById(id);
 const E=(tag,cls='',txt='')=>{const e=document.createElement(tag);e.className=cls;e.textContent=txt;return e};
 const norm=s=>(s||'').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
 function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
 function say(fr){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(fr);u.lang='fr-FR';u.rate=.92;window.speechSynthesis.speak(u)}
 function isRight(q,v){const n=norm(v);return [q.a,...(q.alts||[])].some(x=>norm(x)===n)}
 function full(q,answer=q.a){return q.pre+answer+q.post}
 function feedbackInto(fb,q,ok){
   fb.replaceChildren();
   fb.append(E('div',ok?'c1-answer-ok':'c1-answer-bad',ok?'✓ 正确':'✗ 再看一下'));
   const ans=E('div','c1-answer-line');ans.append(E('strong','','正确答案：'),document.createTextNode(q.a));fb.append(ans,E('span','c1-rule-tag',q.type),E('p','',q.note));fb.classList.remove('hidden');
 }
 function build(){
  const host=$('c1-practice');if(!host||$('c1ArticlePartitiveDrill'))return;
  const wrap=E('section','c1-partitive-drill');wrap.id='c1ArticlePartitiveDrill';
  const head=E('div','c1-partitive-head');
  const title=E('div');title.append(E('div','eyebrow','#3 Les articles · 30 题专项训练'),E('h3','','部分冠词 vs de 缩合'),E('p','note','中文提示 → 法语核心词块填空。只挖空冠词 / de 结构，不做整句默写。检查后再看来源和规则。'));
  const stat=E('div','c1-partitive-stat','0 / 30 已检查');stat.id='c1PartitiveStat';head.append(title,stat);wrap.append(head);
  const tools=E('div','c1-partitive-tools');
  const checkAll=E('button','primary','检查全部');const reveal=E('button','','显示全部答案');const mistakes=E('button','','只练错题');const reset=E('button','','重置本专项');
  [checkAll,reveal,mistakes,reset].forEach(b=>{b.type='button';tools.append(b)});wrap.append(tools);
  const scroller=E('div','c1-partitive-scroll');const table=E('table','c1-partitive-table');const thead=document.createElement('thead');const trh=document.createElement('tr');trh.append(E('th','','中文'),E('th','','法语填空'));thead.append(trh);table.append(thead);const tb=document.createElement('tbody');
  const state=load();
  Q.forEach((q,i)=>{
   const tr=document.createElement('tr');tr.dataset.i=i;
   const zh=E('td','c1-partitive-zh',(i+1)+'. '+q.zh);
   const fr=document.createElement('td');fr.className='c1-partitive-fr';
   const line=E('div','c1-fill-line');line.append(document.createTextNode(q.pre));
   const input=document.createElement('input');input.type='text';input.className='c1-blank-input';input.placeholder='________';input.autocomplete='off';input.spellcheck=false;input.value=state[i]?.value||'';input.setAttribute('aria-label','第 '+(i+1)+' 题填空');
   line.append(input,document.createTextNode(q.post));fr.append(line);
   const actions=E('div','c1-row-actions');const check=E('button','','检查');const show=E('button','','显示答案');const audio=E('button','c1-audio-mini','🔊 整句朗读');[check,show,audio].forEach(b=>b.type='button');actions.append(check,show,audio);fr.append(actions);
   const fb=E('div','c1-row-feedback hidden');fr.append(fb);
   function renderFeedback(force=false){
    const ok=isRight(q,input.value);const has=input.value.trim()!=='';
    if(!has&&!force){fb.classList.add('hidden');return}
    feedbackInto(fb,q,ok);
    const st=load();st[i]={value:input.value,checked:true,ok};save(st);updateStat();
   }
   input.addEventListener('input',()=>{const st=load();st[i]={...(st[i]||{}),value:input.value,checked:false};save(st);tr.classList.remove('is-wrong','is-right');fb.classList.add('hidden');updateStat()});
   check.onclick=()=>{renderFeedback(true);tr.classList.toggle('is-right',isRight(q,input.value));tr.classList.toggle('is-wrong',!isRight(q,input.value))};
   show.onclick=()=>{input.value=q.a;renderFeedback(true);tr.classList.add('is-right');tr.classList.remove('is-wrong')};
   audio.onclick=()=>say(full(q));
   if(state[i]?.checked){renderFeedback(true);tr.classList.toggle('is-right',!!state[i].ok);tr.classList.toggle('is-wrong',!state[i].ok)}
   tr.append(zh,fr);tb.append(tr);
  });
  table.append(tb);scroller.append(table);wrap.append(scroller);
  function updateStat(){const st=load();const vals=Object.values(st);const checked=vals.filter(x=>x?.checked).length;const right=vals.filter(x=>x?.checked&&x?.ok).length;const el=$('c1PartitiveStat');if(el)el.textContent=checked+' / 30 已检查 · '+right+' 正确'}
  checkAll.onclick=()=>{tb.querySelectorAll('tr').forEach((tr,i)=>{const input=tr.querySelector('input');const q=Q[i];const ok=isRight(q,input.value);feedbackInto(tr.querySelector('.c1-row-feedback'),q,ok);tr.classList.toggle('is-right',ok);tr.classList.toggle('is-wrong',!ok);const st=load();st[i]={value:input.value,checked:true,ok};save(st)});updateStat()};
  reveal.onclick=()=>{tb.querySelectorAll('tr').forEach((tr,i)=>{const input=tr.querySelector('input');input.value=Q[i].a;feedbackInto(tr.querySelector('.c1-row-feedback'),Q[i],true);tr.classList.add('is-right');tr.classList.remove('is-wrong');const st=load();st[i]={value:input.value,checked:true,ok:true};save(st)});updateStat()};
  let onlyWrong=false;mistakes.onclick=()=>{onlyWrong=!onlyWrong;const st=load();tb.querySelectorAll('tr').forEach((tr,i)=>{tr.hidden=onlyWrong&&!(st[i]?.checked&&!st[i]?.ok)});mistakes.textContent=onlyWrong?'显示全部 30 题':'只练错题'};
  reset.onclick=()=>{if(!confirm('确定重置这 30 题的填写与错题记录吗？'))return;localStorage.removeItem(KEY);tb.querySelectorAll('tr').forEach(tr=>{tr.hidden=false;tr.classList.remove('is-right','is-wrong');tr.querySelector('input').value='';tr.querySelector('.c1-row-feedback').classList.add('hidden')});onlyWrong=false;mistakes.textContent='只练错题';updateStat()};
  updateStat();
  host.insertAdjacentElement('afterend',wrap);
 }
 function watch(){const d=$('c1CourseDialog');if(!d)return;new MutationObserver(()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#3 Les articles'))setTimeout(build,0)}).observe(d,{childList:true,subtree:true});d.addEventListener('toggle',()=>{if(d.open&&d.querySelector('h2')?.textContent.includes('#3 Les articles'))setTimeout(build,0)})}
 setTimeout(watch,0);
})();
'use strict';
(()=>{
 const COURSE=[
  {n:1,name:'Le nom 名词',p:'B',d:2,stage:4},
  {n:2,name:"L’adjectif 形容词与数词",p:'A',d:4,stage:3},
  {n:3,name:'Les articles 冠词',p:'A+',d:4,stage:1,ready:true},
  {n:4,name:'Les démonstratifs 指示词',p:'B',d:2,stage:4},
  {n:5,name:'Les possessifs 主有词',p:'B',d:2,stage:4},
  {n:6,name:'Les indéfinis 泛指词',p:'B',d:3,stage:3},
  {n:7,name:'Les pronoms personnels 人称代词',p:'A+',d:4,stage:2},
  {n:8,name:'Les constructions verbales 动词句法 / 固定搭配',p:'A+',d:4,stage:1},
  {n:9,name:'Auxiliaires / semi-auxiliaires',p:'B',d:3,stage:4},
  {n:10,name:'Accord sujet-verbe 主谓一致',p:'A+',d:4,stage:1},
  {n:11,name:'La forme passive 被动态',p:'B',d:2,stage:4},
  {n:12,name:'La forme pronominale 代词式动词',p:'A',d:4,stage:2},
  {n:13,name:'Constructions impersonnelles 无人称结构',p:'A',d:4,stage:2},
  {n:14,name:"L’indicatif 直陈式 / 时态",p:'A',d:4,stage:3},
  {n:15,name:'Le subjonctif 虚拟式',p:'A',d:4,stage:1,existing:0},
  {n:16,name:'Le conditionnel 条件式',p:'A',d:4,stage:1,existing:1},
  {n:17,name:"L’impératif 命令式",p:'C',d:2,stage:4},
  {n:18,name:"L’infinitif 不定式",p:'A',d:4,stage:2},
  {n:19,name:'Le participe 分词',p:'B',d:3,stage:4},
  {n:20,name:'Les prépositions 介词',p:'A+',d:4,stage:1},
  {n:21,name:'Les adverbes 副词',p:'B+',d:3,stage:3},
  {n:22,name:'La phrase interrogative 疑问句',p:'A+',d:4,stage:1},
  {n:23,name:'La phrase négative 否定句',p:'A',d:4,stage:1,existing:3},
  {n:24,name:'La phrase exclamative 感叹句',p:'D',d:1,stage:4},
  {n:25,name:'La mise en relief 强调结构',p:'B',d:3,stage:3,existing:4},
  {n:26,name:'La relative 关系从句',p:'A',d:4,stage:2,existing:4},
  {n:27,name:'La complétive en que 补语从句',p:'A',d:4,stage:2},
  {n:28,name:'Le discours rapporté 间接引语',p:'C',d:2,stage:4},
  {n:29,name:'Expression de la cause 原因',p:'A',d:4,stage:2,existing:2},
  {n:30,name:'Expression de la conséquence 结果',p:'A',d:4,stage:2,existing:2},
  {n:31,name:'Expression du but 目的',p:'A',d:4,stage:2,existing:2},
  {n:32,name:'Expression du temps 时间',p:'A',d:4,stage:3},
  {n:33,name:"Opposition / concession 对立与让步",p:'A',d:4,stage:2,existing:2},
  {n:34,name:'Condition / hypothèse 条件与假设',p:'A',d:4,stage:3,existing:1},
  {n:35,name:'Comparaison 比较',p:'B+',d:3,stage:3}
 ];
 const STAGES={
  1:{title:'第一阶段 · 高频扣分底盘 + C1 同步',desc:'先压住会反复扣分的结构，同时维持虚拟式与条件式的主动输出。'},
  2:{title:'第二阶段 · 稳定复杂句控制',desc:'代词、从句、不定式与逻辑表达同步建立稳定控制。'},
  3:{title:'第三阶段 · 推向稳定 C1',desc:'时态、假设、比较、强调和副词，提升表达成熟度。'},
  4:{title:'第四阶段 · 低成本补齐',desc:'以速览、语料和少量练习完成覆盖，不做低收益题海。'}
 };
 const ARTICLE={
  title:'#3 Les articles · 冠词',
  meta:'A+ 个人核心弱点 · 讲解深度 ④ · 第一阶段',
  quick:[
   ['泛指类别','les jeunes · la technologie · le télétravail'],
   ['一个 / 一些','un avantage · une solution · des activités'],
   ['数量表达','beaucoup de · peu de · plus de · assez de + nom'],
   ['否定','pas de + nom（但定冠词表达类别时通常保留）'],
   ['缩合','à + le = au · à + les = aux · de + le = du · de + les = des'],
   ['高频搭配','profiter de · avoir besoin de · participer à · faire face à'],
   ['核心原则','不要逐词拼冠词；把高频名词组和固定搭配整体记忆']
  ],
  lessons:[
   {h:'1. 不定冠词 un / une / des',b:'第一次引入、不特定的一个或一些对象。口语里不要把所有复数名词都机械理解成 des；先判断是不是“不特定的一些”。',ex:'rejoindre des associations locales · participer à des activités de quartier'},
   {h:'2. 定冠词 le / la / les',b:'用于明确对象、已经知道的对象，也常用于泛指一个类别或抽象概念。TCF Tâche 3 大量抽象论证都依赖这一层。',ex:'la barrière linguistique · la maîtrise de la langue · le marché du travail'},
   {h:'3. 部分冠词 du / de la / de l’',b:'表示不可数事物的不确定数量。注意 du 也可能只是 de + le 的缩合，两种来源必须区分。',ex:'du café（部分冠词） ≠ le fonctionnement du marché du travail（de + le）'},
   {h:'4. 数量表达后用 de',b:'beaucoup / peu / assez / trop / plus / moins 等数量表达后，一般使用 de + nom。这个结构要整体自动化。',ex:'beaucoup de personnes · beaucoup de jeunes · plus de possibilités'},
   {h:'5. 否定后的 de',b:'不定冠词、部分冠词在很多否定句中变为 de / d’：J’ai une voiture → Je n’ai pas de voiture。但定冠词表达类别时通常保留：Je n’aime pas le bruit。',ex:'Il y a des activités → Il n’y a pas d’activités.'},
   {h:'6. 缩合冠词',b:'à + le → au；à + les → aux；de + le → du；de + les → des。à la / à l’ / de la / de l’ 不缩合。',ex:'participer au festival · profiter du séjour · profiter des ressources disponibles'},
   {h:'7. 固定搭配决定介词，再决定冠词',b:'先记整个动词结构，再处理后面的名词。不要临场分成三步拼装。',ex:'profiter de quelque chose → profiter des ressources disponibles'}
  ],
  errors:[
   {bad:'beaucoup des enfants',good:"beaucoup d’enfants",why:'一般泛指“很多孩子”时，数量表达 beaucoup 后直接接 de / d’。'},
   {bad:'beaucoup des personnes',good:'beaucoup de personnes',why:'同一模式：beaucoup de + nom。'},
   {bad:'combien des activités sont offertes ?',good:"combien d’activités sont offertes ?",why:'combien de + nom；元音前 de → d’。'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Le petit-déjeuner est-il inclus dans le prix ?',zh:'早餐包含在价格里吗？',focus:'定冠词 + dans le prix'},
   {src:'口语 Tâche 2',fr:'Y a-t-il des restaurants ou des commerces à proximité ?',zh:'附近有餐厅或商店吗？',focus:'复数不定冠词 des'},
   {src:'口语 Tâche 3',fr:'La barrière linguistique peut considérablement ralentir le processus d’intégration.',zh:'语言障碍会显著减缓融入过程。',focus:'抽象概念的定冠词'},
   {src:'口语 Tâche 3',fr:'La maîtrise de la langue locale joue un rôle essentiel dans l’insertion professionnelle.',zh:'掌握当地语言对职业融入起着关键作用。',focus:'抽象名词组 + 定冠词'},
   {src:'口语 Tâche 3',fr:'Il faudrait que les nouveaux arrivants profitent des ressources disponibles.',zh:'新移民应当充分利用现有资源。',focus:'profiter de + de les → des'}
  ],
  frames:[
   ['beaucoup de + nom','beaucoup de personnes / difficultés / possibilités'],
   ['profiter de + nom','profiter du séjour / des ressources / d’une occasion'],
   ['avoir besoin de + nom / infinitif','avoir besoin de soutien / de se préparer'],
   ['participer à + nom','participer à une activité / au festival / aux ateliers'],
   ['faire face à + nom','faire face à un problème / aux difficultés']
  ],
  practice:[
   {level:'Level 1 · 识别',q:'beaucoup ___ personnes',a:'de',note:'数量表达 beaucoup 后用 de。'},
   {level:'Level 1 · 识别',q:'profiter ___ séjour',a:'du',note:'profiter de + le séjour → du séjour。'},
   {level:'Level 2 · 改错',q:'beaucoup des jeunes utilisent les réseaux sociaux.',a:'beaucoup de jeunes utilisent les réseaux sociaux.',note:'泛指数量：beaucoup de + nom。'},
   {level:'Level 2 · 改错',q:'Il n’y a pas des activités pour les enfants.',a:"Il n’y a pas d’activités pour les enfants.",note:'否定中的不定冠词 des 通常变 de / d’。'},
   {level:'Level 3 · 语块',q:'充分利用现有资源',a:'profiter des ressources disponibles',note:'profiter de + les ressources → des ressources。'},
   {level:'Level 3 · 语块',q:'参加当地活动',a:'participer à des activités locales',note:'participer à + 名词。'},
   {level:'Level 4 · 中文 → 法语',q:'附近有餐厅或商店吗？',a:'Y a-t-il des restaurants ou des commerces à proximité ?',note:'来自你的 Tâche 2 语料。'},
   {level:'Level 4 · 中文 → 法语',q:'掌握当地语言对职业融入起着关键作用。',a:"La maîtrise de la langue locale joue un rôle essentiel dans l’insertion professionnelle.",note:'来自你的 Tâche 3 语料。'},
   {level:'Level 5 · 口语迁移',q:'新移民应该充分利用现有资源。',a:'Il faudrait que les nouveaux arrivants profitent des ressources disponibles.',note:'同时覆盖冠词、固定搭配、主谓一致、虚拟式。'}
  ]
 };
 const $=id=>document.getElementById(id);
 const E=(tag,cls='',txt='')=>{const x=document.createElement(tag);x.className=cls;x.textContent=txt;return x;};
 const P='tcf-c1-course-progress-v1';
 const getProgress=()=>{try{return JSON.parse(localStorage.getItem(P)||'{}')}catch{return{}}};
 const saveProgress=x=>localStorage.setItem(P,JSON.stringify(x));
 let observerBusy=false;
 function updateBadge(){const b=document.querySelector('[data-module="9"] span');if(b)b.textContent='35 个模块';}
 function openExisting(cat){if(window.C1_GRAMMAR){window.C1_GRAMMAR.enter(cat);document.getElementById('c1CourseDialog')?.close();}}
 function courseCard(m){
  const b=E('button','c1-course-card');b.type='button';
  const top=E('div','c1-course-card-top');top.append(E('span','c1-num','#'+m.n),E('span','c1-priority p-'+m.p.replace('+','plus'),m.p),E('span','c1-depth','讲解 '+['','①','②','③','④'][m.d]));
  b.append(top,E('strong','',m.name),E('small','',m.ready?'完整母版已上线':m.existing!==undefined?'已有专项可复用 · 课程化升级中':'按课程路线建设中'));
  b.onclick=()=>m.n===3?openArticle():m.existing!==undefined?openExisting(m.existing):alert('这个模块已经排入课程路线，后续会按同一母版补齐。');
  return b;
 }
 function injectMap(){
  updateBadge();
  const view=$('c1View'); if(!view||view.classList.contains('hidden'))return;
  const h=[...view.querySelectorAll('h2')].find(x=>x.textContent.trim()==='C1 语法专项训练');
  if(!h||view.querySelector('#c1CourseMap'))return;
  observerBusy=true;
  const box=E('section','c1-course-map');box.id='c1CourseMap';
  const hero=E('div','c1-course-hero');hero.append(E('div','eyebrow','TCF Canada · 个人化语法课程'),E('h2','','35 模块课程地图'),E('p','note','不是按语法书平均用力：A+ 先压高频扣分，A 建立稳定输出，B/C/D 按考试收益控制投入。例句优先来自你的错题本、口语 Tâche 2 和口语 Tâche 3。'));
  const legend=E('div','c1-course-legend');['A+ 个人核心 / 任务核心','A 必须掌握','B 高频','C 次要','D 查阅'].forEach(x=>legend.append(E('span','',x)));hero.append(legend);box.append(hero);
  for(const s of [1,2,3,4]){
   const sec=E('details','c1-stage');if(s===1)sec.open=true;
   const sum=E('summary');sum.append(E('strong','',STAGES[s].title),E('span','',STAGES[s].desc));sec.append(sum);
   const grid=E('div','c1-course-grid');COURSE.filter(x=>x.stage===s).forEach(x=>grid.append(courseCard(x)));sec.append(grid);box.append(sec);
  }
  const oldNote=h.nextElementSibling;h.replaceWith(box);if(oldNote?.classList.contains('note'))oldNote.remove();
  observerBusy=false;
 }
 function section(title){
  const sec=E('section','c1-lesson-section');sec.append(E('h3','',title));return sec;
 }
 function speak(fr){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(fr);u.lang='fr-FR';u.rate=.92;window.speechSynthesis.speak(u);}
 function openArticle(){
  const d=$('c1CourseDialog');d.replaceChildren();
  const head=E('header','c1-course-dialog-head');const left=E('div');left.append(E('div','eyebrow','TCF Canada · C1 语法专项训练'),E('h2','',ARTICLE.title),E('p','c1-course-meta',ARTICLE.meta));const close=E('button','', '✕ 关闭');close.type='button';close.onclick=()=>d.close();head.append(left,close);d.append(head);
  const nav=E('div','c1-lesson-nav');[['速览','quick'],['系统讲解','lessons'],['我的错题','errors'],['我的语料','corpus'],['迁移骨架','frames'],['分层训练','practice'],['掌握度','mastery']].forEach(([a,id])=>{const x=E('a','',a);x.href='#c1-'+id;nav.append(x)});d.append(nav);
  let s=section('考试速览');s.id='c1-quick';const table=E('table','c1-course-table');for(const [a,b] of ARTICLE.quick){const tr=E('tr');tr.append(E('th','',a),E('td','',b));table.append(tr)}s.append(table);d.append(s);
  s=section('系统讲解');s.id='c1-lessons';for(const x of ARTICLE.lessons){const c=E('article','c1-lesson-card');c.append(E('h4','',x.h),E('p','',x.b),E('div','c1-example',x.ex));c.append(audioBtn(()=>x.ex));s.append(c)}d.append(s);
  s=section('我的真实错题');s.id='c1-errors';s.append(E('p','note','只放你真实出现过的错误模式，用来消灭“同一种错误反复出现”，不是为了堆题。'));for(const x of ARTICLE.errors){const c=E('article','c1-error-card');c.append(E('div','c1-bad','✗ '+x.bad),E('div','c1-good','✓ '+x.good),E('p','',x.why));s.append(c)}d.append(s);
  s=section('我的 Tâche 2 / Tâche 3 语料');s.id='c1-corpus';for(const x of ARTICLE.corpus){const c=E('article','c1-corpus-card');c.append(E('span','c1-source-tag',x.src),E('p','c1-fr',x.fr),E('p','',x.zh),E('small','', '本句重点：'+x.focus),audioBtn(()=>x.fr));s.append(c)}d.append(s);
  s=section('可迁移句型骨架');s.id='c1-frames';const ft=E('table','c1-course-table');for(const [a,b] of ARTICLE.frames){const tr=E('tr');tr.append(E('th','',a),E('td','',b));ft.append(tr)}s.append(ft);d.append(s);
  s=section('分层训练');s.id='c1-practice';for(const [i,x] of ARTICLE.practice.entries()){const c=E('article','c1-practice-card');c.append(E('span','c1-level',x.level),E('p','c1-practice-q',x.q));const ans=E('div','c1-practice-answer hidden');ans.append(E('strong','',x.a),E('p','',x.note),audioBtn(()=>x.a));const b=E('button','', '显示答案');b.type='button';b.onclick=()=>{ans.classList.toggle('hidden');b.textContent=ans.classList.contains('hidden')?'显示答案':'隐藏答案'};c.append(b,ans);s.append(c)}d.append(s);
  s=section('掌握度');s.id='c1-mastery';s.append(E('p','note','真正“学会”不是选择题全对，而是完整口语里不需要停下来想冠词。'));const checks=[['understand','理解：我能解释规则'],['recognize','识别：我能发现错误'],['write','书面输出：中文→法语能写对'],['oral','口语自动化：完整句中无需停顿拼冠词']];const prog=getProgress();for(const [k,label] of checks){const l=E('label','c1-mastery-check');const input=document.createElement('input');input.type='checkbox';input.checked=!!prog['3-'+k];input.onchange=()=>{const p=getProgress();p['3-'+k]=input.checked;saveProgress(p)};l.append(input,document.createTextNode(' '+label));s.append(l)}d.append(s);
  d.showModal();
 }
 function audioBtn(get){const b=E('button','c1-audio-mini','🔊 法语朗读');b.type='button';b.onclick=()=>speak(get());return b}
 function buildDialog(){if($('c1CourseDialog'))return;const d=document.createElement('dialog');d.id='c1CourseDialog';d.className='c1-course-dialog';document.body.append(d);d.addEventListener('click',e=>{if(e.target===d)d.close()});}
 updateBadge();buildDialog();
 const obs=new MutationObserver(()=>{if(observerBusy)return;requestAnimationFrame(injectMap)});const root=$('c1View');if(root)obs.observe(root,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});
 document.querySelector('[data-module="9"]')?.addEventListener('click',()=>setTimeout(injectMap,0));
 setTimeout(injectMap,0);
 window.C1_COURSE={COURSE,ARTICLE,openArticle,injectMap};
})();
'use strict';
(()=>{
 const GROUPS=[
  {title:'A1 · 愿望 / 意愿 / 期待',items:[
   ['Je souhaiterais que + subjonctif','Je souhaiterais que les autorités prennent davantage de mesures pour favoriser l’intégration des nouveaux arrivants.','我希望有关部门采取更多措施来促进新移民融入。','迁移例句'],
   ['Je voudrais que + subjonctif','Je voudrais que les écoles proposent davantage d’activités afin que les élèves puissent développer leurs compétences.','我希望学校提供更多活动，以便学生能够发展自己的能力。','迁移例句'],
   ['J’aimerais que + subjonctif','J’aimerais que chacun puisse avoir accès à une éducation de qualité.','我希望每个人都能获得优质教育。','迁移例句'],
   ['Je préférerais que + subjonctif','Je préférerais que les entreprises mettent en place des règles claires pour protéger la vie privée des employés.','我更希望企业制定明确规则来保护员工隐私。','迁移例句']
  ]},
  {title:'A2 · 必要性 / 建议 / 评价',items:[
   ['Il faut que + subjonctif','Il faut que les autorités prennent des mesures adaptées pour protéger l’environnement.','有关部门必须采取适当措施来保护环境。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['Il faudrait que + subjonctif','Il faudrait que les autorités favorisent l’intégration des nouveaux arrivants.','有关部门应该促进新移民的社会融入。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['Il est important que + subjonctif','Il est important que les jeunes aient accès à des ressources éducatives adaptées.','年轻人能够获得合适的教育资源很重要。','语料库原句','TCF_Canada_C1_15个高频虚拟式句型(2).docx'],
   ['Il est essentiel que + subjonctif','Il est essentiel que chacun prenne conscience des conséquences de ses choix.','每个人都意识到自己选择所带来的后果至关重要。','语料库原句','TCF_Canada_Tache3_C1_结尾虚拟式核心词汇(2).docx'],
   ['Il est nécessaire que + subjonctif','Il est nécessaire que les entreprises offrent de meilleures conditions de travail.','企业有必要提供更好的工作条件。','语料库原句','TCF_Canada_C1_15个高频第三人称结构(2).docx'],
   ['Il est indispensable que + subjonctif','Il est indispensable que chacun sache distinguer les informations fiables des informations douteuses.','每个人都必须懂得区分可靠信息和可疑信息。','迁移例句'],
   ['Il est souhaitable que + subjonctif','Il est souhaitable que les autorités encouragent davantage la participation citoyenne.','有关部门最好进一步鼓励公民参与。','迁移例句'],
   ['Il serait souhaitable que + subjonctif','Il serait souhaitable que les entreprises proposent davantage de formations à leurs employés.','企业最好为员工提供更多培训。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['Il est préférable que + subjonctif','Il est préférable que les jeunes apprennent à gérer leur temps de manière autonome.','年轻人最好学会自主安排自己的时间。','迁移例句'],
   ['Il vaut mieux que + subjonctif','Il vaut mieux que les parents mettent des limites raisonnables à l’utilisation des écrans.','父母最好对电子屏幕的使用设定合理限制。','迁移例句'],
   ['Il ne suffit pas que + subjonctif','Il ne suffit pas que le gouvernement prenne des mesures ; il faut aussi que les citoyens changent certaines habitudes.','仅仅由政府采取措施是不够的；公民也需要改变一些习惯。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx']
  ]},
  {title:'A3 · 要求 / 建议 / 措施',items:[
   ['demander que + subjonctif','Les citoyens peuvent demander que les autorités prennent des mesures plus adaptées.','公民可以要求有关部门采取更合适的措施。','迁移例句'],
   ['proposer que + subjonctif','Je propose que les écoles mettent en place davantage d’activités pratiques.','我建议学校开展更多实践活动。','迁移例句'],
   ['recommander que + subjonctif','Je recommande que les entreprises proposent davantage de formations à leurs employés.','我建议企业为员工提供更多培训。','迁移例句'],
   ['exiger que + subjonctif','Il est légitime d’exiger que les plateformes protègent mieux les données personnelles des utilisateurs.','要求平台更好地保护用户个人数据是合理的。','迁移例句'],
   ['insister pour que + subjonctif','Il faudrait insister pour que les jeunes sachent utiliser les réseaux sociaux de manière responsable.','应该强调让年轻人懂得负责任地使用社交网络。','迁移例句'],
   ['veiller à ce que + subjonctif','Les autorités doivent veiller à ce que chacun ait accès à des services de qualité.','有关部门必须确保每个人都能获得优质服务。','迁移例句']
  ]},
  {title:'A4 · 目的',items:[
   ['pour que + subjonctif','Pour que les immigrants puissent mieux s’intégrer, il faut leur offrir des cours de langue accessibles.','为了让移民更好地融入，应当为他们提供容易获得的语言课程。','语料库原句','TCF_Canada_C1_15个高频虚拟式句型(2).docx'],
   ['afin que + subjonctif','Les autorités devraient renforcer les programmes d’intégration afin que chacun puisse trouver sa place dans la société.','有关部门应该加强融入项目，以便每个人都能在社会中找到自己的位置。','语料库原句','TCF_Canada_C1_目的_8个核心句型(2).docx']
  ]},
  {title:'A5 · 让步 / 对立',items:[
   ['bien que + subjonctif','Bien que le télétravail soit pratique, il peut entraîner un certain isolement.','尽管远程办公很方便，但它也可能导致一定程度的孤立。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['quoique + subjonctif','Quoique les réseaux sociaux aient certains avantages, leur utilisation excessive peut poser problème.','尽管社交网络有一些优点，但过度使用仍可能带来问题。','迁移例句'],
   ['sans que + subjonctif','Certaines personnes utilisent les réseaux sociaux pendant des heures sans qu’elles se rendent compte du temps passé en ligne.','有些人连续数小时使用社交网络，却没有意识到自己花了多少时间在线上。','语料库原句','TCF_Canada_C1_15个高频虚拟式句型(2).docx']
  ]},
  {title:'A6 · 条件 / 限制',items:[
   ['à condition que + subjonctif','Le télétravail peut être bénéfique à condition que les salariés sachent bien organiser leur temps.','远程办公可以带来好处，前提是员工懂得合理安排自己的时间。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['à moins que + subjonctif','La situation risque de s’aggraver à moins que les autorités ne prennent rapidement des mesures adaptées.','除非有关部门迅速采取适当措施，否则情况可能恶化。','语料库原句','TCF_Canada_C1_8个核心条件假设句型(2).docx'],
   ['pourvu que + subjonctif','Les outils numériques peuvent être très utiles, pourvu que les jeunes sachent gérer leur temps.','数字工具可以很有用，只要年轻人懂得管理自己的时间。','迁移例句']
  ]},
  {title:'A7 · 时间',items:[
   ['avant que + subjonctif','Il vaut mieux agir avant que la situation ne s’aggrave.','最好在情况恶化之前采取行动。','迁移例句'],
   ['jusqu’à ce que + subjonctif','Il faudrait poursuivre ces efforts jusqu’à ce que chacun puisse bénéficier des mêmes possibilités.','应该继续这些努力，直到每个人都能够享有同等机会。','迁移例句']
  ]},
  {title:'A8 · 情感 / 怀疑 / 不确定',items:[
   ['être content(e) que + subjonctif','Je suis contente que de plus en plus de jeunes prennent conscience des enjeux environnementaux.','我很高兴越来越多的年轻人开始意识到环境问题。','迁移例句'],
   ['être heureux / heureuse que + subjonctif','Je suis heureuse que chacun puisse avoir accès à davantage de ressources éducatives.','我很高兴每个人都能获得更多教育资源。','迁移例句'],
   ['regretter que + subjonctif','Je regrette que certaines personnes passent encore trop de temps sur les réseaux sociaux.','我很遗憾有些人仍然在社交网络上花太多时间。','迁移例句'],
   ['être surpris(e) que + subjonctif','Je suis surprise que certaines entreprises ne proposent pas davantage de formations à leurs employés.','我很惊讶有些企业没有为员工提供更多培训。','迁移例句'],
   ['douter que + subjonctif','Je doute que cette mesure suffise à résoudre le problème à elle seule.','我怀疑仅靠这项措施是否足以解决问题。','迁移例句'],
   ['Il est possible que + subjonctif','Il est possible que certaines personnes aient du mal à s’adapter à un nouvel environnement.','有些人可能难以适应新的环境。','语料库原句','TCF_Canada_C1_15个高频第三人称结构(2).docx'],
   ['Il se peut que + subjonctif','Il se peut que certains métiers disparaissent avec le développement de l’intelligence artificielle.','随着人工智能的发展，一些职业有可能消失。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['Il n’est pas certain que + subjonctif','Il n’est pas certain que cette solution soit adaptée à toutes les situations.','这项解决方案未必适用于所有情况。','迁移例句'],
   ['Je ne pense pas que + subjonctif','Je ne pense pas qu’un diplôme soit la seule condition nécessaire pour réussir.','我不认为文凭是取得成功的唯一必要条件。','语料库原句','TCF_Canada_Tache3_C1_虚拟式10句型_15高频动词_中法对照_全小分类覆盖(2).docx'],
   ['Je ne crois pas que + subjonctif','Je ne crois pas que les réseaux sociaux soient nécessairement nuisibles aux jeunes.','我不认为社交网络一定对年轻人有害。','迁移例句']
  ]},
  {title:'A+ · C1 扩展',items:[
   ['de peur que + subjonctif','Certaines personnes évitent de changer d’emploi de peur que leur situation ne devienne plus instable.','有些人避免换工作，担心自己的处境变得更加不稳定。','语料库原句','TCF_Canada_C1_目的_8个核心句型(2).docx'],
   ['de crainte que + subjonctif','Certains parents limitent l’utilisation des écrans de crainte que leurs enfants n’en deviennent dépendants.','有些父母限制电子屏幕的使用，担心孩子会对其产生依赖。','迁移例句']
  ]}
 ];
 const C=[
  ['être content(e) que + subjonctif passé','Je suis contente que les autorités aient mis en place de nouvelles mesures.','我很高兴有关部门已经实施了新的措施。'],
  ['être heureux / heureuse que + subjonctif passé','Je suis heureuse que les nouveaux arrivants aient trouvé un emploi plus facilement.','我很高兴新移民已经更容易找到工作。'],
  ['regretter que + subjonctif passé','Je regrette que certaines personnes aient passé trop de temps sur les réseaux sociaux.','我很遗憾有些人在社交网络上花了太多时间。'],
  ['être surpris(e) que + subjonctif passé','Je suis surprise que cette mesure ait eu un impact aussi positif.','我很惊讶这项措施已经产生了如此积极的影响。'],
  ['Il est dommage que + subjonctif passé','Il est dommage que certaines personnes n’aient pas eu accès à ces ressources.','很遗憾有些人没能获得这些资源。'],
  ['être satisfait(e) que + subjonctif passé','Nous sommes satisfaits que les entreprises aient proposé davantage de formations.','我们很满意企业已经提供了更多培训。']
 ];
 const $=id=>document.getElementById(id);
 function speak(t){if(!speechSynthesis||!window.SpeechSynthesisUtterance)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);const vs=speechSynthesis.getVoices().filter(v=>/^fr(?:[-_]|$)/i.test(v.lang));if(vs.length)u.voice=vs.find(v=>v.lang.toLowerCase()==='fr-fr')||vs[0];u.lang=u.voice?.lang||'fr-FR';u.rate=.92;speechSynthesis.speak(u);}
 function row(item){
  const tr=document.createElement('tr');
  const a=document.createElement('td');a.textContent=item[0];
  const b=document.createElement('td');const fr=document.createElement('div');fr.className='c1-fr';fr.textContent=item[1];const zh=document.createElement('small');zh.textContent=item[2];const bt=document.createElement('button');bt.type='button';bt.className='c1-audio-mini';bt.textContent='🔊';bt.onclick=()=>speak(item[1]);b.append(fr,zh,document.createTextNode(' '),bt);
  const c=document.createElement('td');const tag=document.createElement('span');tag.className='c1-source-tag';tag.textContent=item[3]||'迁移例句';c.append(tag);if(item[4]){const src=document.createElement('small');src.textContent=' '+item[4];c.append(src);}
  tr.append(a,b,c);return tr;
 }
 function table(items){const t=document.createElement('table');t.className='c1-course-table';const h=document.createElement('thead'),r=document.createElement('tr');['句型','例句','来源'].forEach(x=>{const th=document.createElement('th');th.textContent=x;r.append(th)});h.append(r);const b=document.createElement('tbody');items.forEach(x=>b.append(row(x)));t.append(h,b);return t;}
 function add(){
  const d=$('c1CourseDialog');if(!d?.open||!d.querySelector('h2')?.textContent.includes('#15 Le subjonctif'))return;
  if(d.querySelector('#c1-subj-examples'))return;
  const sec=document.createElement('section');sec.className='c1-course-section';sec.id='c1-subj-examples';
  const h=document.createElement('h3');h.textContent='A / C · 逐句型例句库';
  const p=document.createElement('p');p.className='note';p.textContent='每个主动掌握句型都配完整例句。优先复用现有 TCF 语料原句；没有对应原句时，使用语料库里已经出现的主题词、搭配和论点生成“迁移例句”，并明确标记。';
  sec.append(h,p);
  for(const g of GROUPS){const det=document.createElement('details');det.open=['A1 · 愿望 / 意愿 / 期待','A2 · 必要性 / 建议 / 评价','A4 · 目的'].includes(g.title);const s=document.createElement('summary');s.textContent=g.title+' · '+g.items.length+' 个';det.append(s,table(g.items));sec.append(det);}
  /* C · Subjonctif passé is intentionally hidden during sprint phase. Data remains in C for future re-enable. */
  const anchor=d.querySelector('#c1-practice')||d.querySelector('#c1-frames');anchor?.before(sec);
 }
 function watch(){const d=$('c1CourseDialog');if(!d){setTimeout(watch,100);return;}new MutationObserver(()=>setTimeout(add,0)).observe(d,{childList:true,subtree:true});d.addEventListener('toggle',add);d.addEventListener('click',()=>setTimeout(add,0));add();}
 setTimeout(watch,0);
 window.C1_SUBJUNCTIVE_EXAMPLES={GROUPS,C};
})();

'use strict';
(()=>{
 const C=window.C1_COURSE;if(!C)return;
 const L=C.LESSONS;
 const pushUnique=(arr,items,keyFn=x=>JSON.stringify(x))=>{
   const seen=new Set((arr||[]).map(keyFn));
   for(const x of items){const k=keyFn(x);if(!seen.has(k)){arr.push(x);seen.add(k);}}
 };
 const enrich=(n,{quick=[],lessons=[],errors=[],corpus=[],frames=[],practice=[]})=>{
   const x=L[n];if(!x)return;
   pushUnique(x.quick,quick,z=>z[0]+'|'+z[1]);
   pushUnique(x.lessons,lessons,z=>z.h);
   pushUnique(x.errors,errors,z=>z.bad+'|'+z.good);
   pushUnique(x.corpus,corpus,z=>z.fr);
   pushUnique(x.frames,frames,z=>z[0]+'|'+z[1]);
   pushUnique(x.practice,practice,z=>z.level+'|'+z.q);
 };

 enrich(2,{
  quick:[
   ['你的重点','先保证配合和自然位置，再追求“高级词”'],
   ['口语自动化','人 / 事物的形容词选择要整体记：motivé / motivant']
  ],
  lessons:[
   {h:'6. 人和事物常用的形容词不要混',b:'很多错误不是配合问题，而是词义角色选错。例如 motivé 通常形容“受到激励的人”，motivant 形容“能激励人的事物”。',ex:'un élève motivé · une activité motivante'},
   {h:'7. 形容词位置也可以改变意义',b:'少量高频词前置/后置语义不同，考试里只需要掌握高频搭配，不需要系统背冷门意义。',ex:'un grand homme ≠ un homme grand'}
  ],
  errors:[
   {bad:'une source faible（想表达“可靠度低/不可靠来源”）',good:'une source peu fiable / une source non fiable',why:'faible 不等于“不可靠”，词义选择要和名词搭配。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cette expérience peut être particulièrement enrichissante pour les jeunes.',zh:'这种经历对年轻人尤其有益。',focus:'enrichissante 阴性单数配合'},
   {src:'口语 Tâche 3',fr:'Ils peuvent devenir plus motivés et plus autonomes.',zh:'他们可以变得更有动力、更独立。',focus:'motivé / autonome 描述人'}
  ],
  frames:[
   ['sujet + devenir + adjectif','Les jeunes deviennent plus autonomes.'],
   ['une + adjectif féminin + nom','une meilleure solution · une nouvelle méthode']
  ],
  practice:[
   {level:'Level 3 · 词义',q:'“一个有动力的学生”',a:'un étudiant motivé',note:'motivated person = motivé。'},
   {level:'Level 4 · 中文 → 法语',q:'这种经历对年轻人尤其有益。',a:'Cette expérience peut être particulièrement enrichissante pour les jeunes.',note:'形容词配合 + 位置。'}
  ]
 });

 enrich(7,{
  quick:[
   ['代词 + 不定式','情态动词后，代词通常放在不定式前：je peux lui parler'],
   ['命令式','肯定命令式代词位置另有规则；TCF 先掌握陈述句高频顺序']
  ],
  lessons:[
   {h:'6. 情态动词 + 代词 + 不定式',b:'pouvoir / devoir / vouloir 后面如果接另一个动词，代词通常放在真正支配它的不定式前。',ex:'Je peux lui parler. · Je dois en discuter.'},
   {h:'7. en 还能代替数量结构',b:'当数量表达后面的名词已知，可用 en 代替名词。',ex:'J’ai trois livres. → J’en ai trois.'},
   {h:'8. y / en 和固定搭配必须一起判断',b:'先还原原始结构，再替换：penser à → y penser；avoir besoin de → en avoir besoin。',ex:'Tu penses à ce projet ? Oui, j’y pense.'}
  ],
  errors:[
   {bad:'Je pense ce projet.',good:'Je pense à ce projet. / J’y pense.',why:'penser à quelque chose；代词替换后用 y。'},
   {bad:'J’ai besoin ces informations.',good:'J’ai besoin de ces informations. / J’en ai besoin.',why:'avoir besoin de；代词替换后用 en。'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Pouvez-vous m’en dire un peu plus ?',zh:'您能再多告诉我一些吗？',focus:'en = de cela'},
   {src:'口语 Tâche 2',fr:'Est-ce que je peux vous en parler maintenant ?',zh:'我现在可以和您谈这件事吗？',focus:'vous + en'}
  ],
  frames:[
   ['pouvoir + pronom + infinitif','Je peux lui parler.'],
   ['en + quantité','J’en voudrais deux.']
  ],
  practice:[
   {level:'Level 2 · 替换',q:'Je parle de ce problème. →',a:'J’en parle.',note:'de + chose → en。'},
   {level:'Level 2 · 替换',q:'Je vais à cette activité. →',a:'J’y vais.',note:'地点 → y。'},
   {level:'Level 4 · 口语',q:'您能再多告诉我一些吗？',a:'Pouvez-vous m’en dire un peu plus ?',note:'Tâche 2 追问高频。'}
  ]
 });

 enrich(12,{
  quick:[
   ['反身 vs 固定结构','有些 se 是词汇结构，不是“自己对自己”'],
   ['时态','代词式动词的 passé composé 用 être']
  ],
  lessons:[
   {h:'5. 并不是所有代词式动词都能翻成“自己”',b:'se rendre compte de、se souvenir de、s’agir de 等必须整体理解。',ex:'se rendre compte de = 意识到'},
   {h:'6. s’intégrer / s’adapter / se familiariser 是你的高频三件套',b:'移民、学习、工作、旅行等主题都能反复迁移。',ex:'s’intégrer dans la société · s’adapter à un nouvel environnement · se familiariser avec les règles'}
  ],
  errors:[
   {bad:'se familiariser à le système',good:'se familiariser avec le système',why:'固定搭配 se familiariser avec。'},
   {bad:'s’adapter avec la vie locale',good:'s’adapter à la vie locale',why:'固定搭配 s’adapter à。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Les nouveaux arrivants peuvent progressivement s’intégrer dans la société d’accueil.',zh:'新移民可以逐步融入接收社会。',focus:'s’intégrer dans'},
   {src:'口语 Tâche 3',fr:'Ils doivent aussi se familiariser avec les règles et les codes sociaux.',zh:'他们也必须熟悉规则和社会规范。',focus:'se familiariser avec'}
  ],
  frames:[
   ['se rendre compte de + nom / que','se rendre compte de la difficulté · se rendre compte que…'],
   ['s’intégrer dans + milieu','s’intégrer dans la société d’accueil']
  ],
  practice:[
   {level:'Level 2 · 改错',q:'se familiariser à la culture locale',a:'se familiariser avec la culture locale',note:'固定搭配。'},
   {level:'Level 4 · 中文 → 法语',q:'新移民必须适应新的环境。',a:'Les nouveaux arrivants doivent s’adapter à leur nouvel environnement.',note:'s’adapter à。'}
  ]
 });

 enrich(13,{
  quick:[
   ['建议强度','il faut > il faudrait / il serait souhaitable'],
   ['自然表达','il vaut mieux + inf 比 il est mieux de 更稳']
  ],
  lessons:[
   {h:'5. il faut 与 il faudrait 的语气差异',b:'il faut 更直接；il faudrait 更柔和、更适合 Tâche 3 建议和结尾。',ex:'Il faut agir. · Il faudrait mettre en place des mesures concrètes.'},
   {h:'6. il serait souhaitable que + subjonctif',b:'这是比 il faut que 更正式、更委婉的建议表达，但只需要掌握少量高频结构。',ex:'Il serait souhaitable que les autorités renforcent l’accompagnement.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Il serait souhaitable que les autorités mettent en place des mesures adaptées.',zh:'有关部门最好采取适当措施。',focus:'无人称建议 + 虚拟式'}
  ],
  frames:[
   ['Il serait souhaitable que + subj.','Il serait souhaitable que les entreprises…'],
   ['Il est essentiel de + inf','Il est essentiel de maintenir un équilibre.']
  ],
  practice:[
   {level:'Level 3 · 强度转换',q:'把 Il faut agir. 改得更委婉。',a:'Il faudrait agir.',note:'条件式降低语气。'}
  ]
 });

 enrich(14,{
  quick:[
   ['核心对比','passé composé = 事件；imparfait = 背景/状态'],
   ['复合叙述','同一段过去经历里两者常一起出现']
  ],
  lessons:[
   {h:'6. passé composé + imparfait 必须学会配合',b:'不要把过去时当成二选一。一个句子里，背景用 imparfait，发生的事件用 passé composé。',ex:'Quand je travaillais à Montréal, j’ai rencontré beaucoup de personnes intéressantes.'},
   {h:'7. futur proche vs futur simple',b:'口语里近期计划常用 aller + infinitif；正式预测和安排可用 futur simple。',ex:'Je vais partir ce week-end. · Je partirai lundi prochain.'}
  ],
  errors:[
   {bad:'Quand j’étais arrivé…（想表达“当我到达时”）',good:'Quand je suis arrivé(e)…',why:'到达是完成事件，用 passé composé；若描述已处于某状态才考虑 imparfait。'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Quand êtes-vous parti(e) ?',zh:'您什么时候出发的？',focus:'passé composé 事件'},
   {src:'口语 Tâche 2',fr:'Comment était l’ambiance ?',zh:'当时气氛怎么样？',focus:'imparfait 状态'}
  ],
  frames:[
   ['Quand + imparfait, passé composé','Quand je travaillais…, j’ai rencontré…'],
   ['aller + infinitif','Je vais partir ce week-end.']
  ],
  practice:[
   {level:'Level 2 · 时态选择',q:'“当时气氛很轻松” → être 用什么时态？',a:'L’ambiance était détendue.',note:'背景状态 → imparfait。'},
   {level:'Level 3 · 组合',q:'我在蒙特利尔工作的时候，认识了很多人。',a:'Quand je travaillais à Montréal, j’ai rencontré beaucoup de personnes.',note:'背景 + 事件。'}
  ]
 });

 enrich(18,{
  quick:[
   ['同主语简化','de / à / pour / sans / avant / plutôt que 等后接 infinitif'],
   ['避免重复主语','能用不定式时通常比重复 que 从句更简洁']
  ],
  lessons:[
   {h:'5. faute de + nom ≠ faute de + infinitif',b:'faute de 常接名词；若要说“没能做某事”，通常用 faute de pouvoir / faute d’avoir… 但考试优先使用简单自然结构。',ex:'Faute de temps, je n’ai pas pu participer.'},
   {h:'6. pour éviter de / afin de 是高收益骨架',b:'解决方案段落里非常实用。',ex:'Pour éviter de perdre du temps, il vaut mieux réserver à l’avance.'}
  ],
  errors:[
   {bad:'plutôt que de comparer avec les autres（后面逻辑不完整）',good:'plutôt que de se comparer aux autres',why:'除了 de，代词式结构和介词也要完整。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Pour éviter de créer davantage de stress, il vaut mieux fixer des limites raisonnables.',zh:'为了避免造成更多压力，最好设定合理限制。',focus:'pour éviter de + infinitif'}
  ],
  frames:[
   ['pour éviter de + inf','pour éviter de perdre du temps'],
   ['sans + infinitif','sans dépenser trop d’argent']
  ],
  practice:[
   {level:'Level 3 · 结构',q:'为了避免浪费时间',a:'pour éviter de perdre du temps',note:'pour éviter de + infinitif。'}
  ]
 });

 enrich(26,{
  quick:[
   ['dont 核心','先还原：avoir besoin de / profiter de / parler de'],
   ['où 核心','地点和时间都可以']
  ],
  lessons:[
   {h:'6. dont 不是“高级版 de”',b:'只有当从句内部原本需要 de + 先行词时才用 dont。',ex:'les ressources dont j’ai besoin ← j’ai besoin de ces ressources'},
   {h:'7. où 也能表示时间',b:'除了地点，où 还能对应一个时间点/阶段。',ex:'une période où beaucoup de personnes travaillaient à distance'}
  ],
  errors:[
   {bad:'la ville que j’habite',good:'la ville où j’habite / la ville dans laquelle j’habite',why:'habiter 这里需要地点补语，不是直接宾语。'},
   {bad:'une ressource que j’ai besoin',good:'une ressource dont j’ai besoin',why:'avoir besoin de → dont。'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Y a-t-il un endroit où l’on peut se détendre ?',zh:'有可以放松的地方吗？',focus:'où 表地点'},
   {src:'口语 Tâche 3',fr:'Il existe des ressources dont les nouveaux arrivants peuvent profiter.',zh:'有一些新移民可以利用的资源。',focus:'profiter de → dont'}
  ],
  frames:[
   ['nom + dont + sujet + verbe','des ressources dont ils peuvent profiter'],
   ['nom de lieu + où','un quartier où il fait bon vivre']
  ],
  practice:[
   {level:'Level 2 · 改错',q:'une ressource que j’ai besoin',a:'une ressource dont j’ai besoin',note:'avoir besoin de。'},
   {level:'Level 3 · 组合',q:'一个可以放松的地方',a:'un endroit où l’on peut se détendre',note:'où 表地点。'}
  ]
 });

 enrich(27,{
  quick:[
   ['观点 + que','je pense / je trouve / je dirais que → indicatif'],
   ['建议 + que','il faut / il faudrait / il est important que → souvent subjonctif']
  ],
  lessons:[
   {h:'4. 肯定观点和否定/怀疑的语气不同',b:'Je pense que 通常接直陈式；Je ne pense pas que / Je doute que 更容易触发虚拟式。',ex:'Je pense qu’il est utile. · Je ne pense pas qu’il soit nécessaire.'},
   {h:'5. 口语里避免 que 从句套太深',b:'C1 不等于一个句子套三四层从句。优先保证结构清晰。',ex:'Je pense que cette mesure est utile, mais elle présente aussi des limites.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Il me semble que cette approche est plus équilibrée.',zh:'在我看来，这种方法更平衡。',focus:'il me semble que + indicatif'}
  ],
  frames:[
   ['Il me semble que + indicatif','Il me semble que cette mesure est utile.'],
   ['Je ne pense pas que + subj.','Je ne pense pas que ce soit suffisant.']
  ],
  practice:[
   {level:'Level 2 · 判断',q:'Je ne pense pas que ce ___ suffisant. (être)',a:'soit',note:'否定判断常用虚拟式。'}
  ]
 });

 enrich(29,{
  quick:[
   ['你的易错','grâce à / à cause de 语义正负要分清'],
   ['高频','faute de temps = 因缺少时间']
  ],
  lessons:[
   {h:'5. grâce à 和 à cause de 不只是语法区别',b:'两者都接名词，但语义评价不同：grâce à 通常正面；à cause de 通常负面。',ex:'grâce au télétravail · à cause du stress'},
   {h:'6. faute de 是你值得直接背的高级短语',b:'特别适合“由于缺少时间/资源/信息”。',ex:'Faute de temps, certaines personnes renoncent.'}
  ],
  errors:[
   {bad:'grâce à le soutien',good:'grâce au soutien',why:'à + le → au。'},
   {bad:'à cause que…',good:'parce que… / à cause de + nom',why:'à cause de 后接名词，不直接接普通从句。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Faute de temps, certaines personnes préfèrent rester chez elles.',zh:'由于缺少时间，有些人更愿意待在家里。',focus:'faute de + nom'}
  ],
  frames:[
   ['Faute de + nom','Faute de temps / de moyens / d’informations…'],
   ['En raison de + nom','En raison du coût élevé…']
  ],
  practice:[
   {level:'Level 2 · 改错',q:'à cause que le prix est élevé',a:'parce que le prix est élevé / à cause du prix élevé',note:'从句和名词结构分开。'}
  ]
 });

 enrich(30,{
  quick:[
   ['因果链','cause → conséquence 用不同结构避免重复 donc'],
   ['C1高频','ce qui permet de / ce qui peut entraîner']
  ],
  lessons:[
   {h:'4. 结果结构要区分正面与负面',b:'permettre de 常引出积极或中性结果；entraîner / conduire à 常用于后果。',ex:'ce qui permet de gagner du temps · ce qui peut entraîner de l’isolement'},
   {h:'5. éviter“所以所以所以”',b:'Tâche 3 可以交替使用 donc、ainsi、ce qui、entraîner / conduire à。',ex:'Cela réduit les coûts. Ainsi, davantage de personnes peuvent y accéder.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cela facilite les échanges, ce qui permet de créer des liens plus rapidement.',zh:'这促进了交流，从而可以更快建立联系。',focus:'ce qui permet de'}
  ],
  frames:[
   ['…, ce qui + verbe','…, ce qui améliore…'],
   ['Cela peut conduire à + nom','Cela peut conduire à l’isolement.']
  ],
  practice:[
   {level:'Level 3 · 连接',q:'“这降低成本，因此更多人可以参加。” 用 ce qui',a:'Cela réduit les coûts, ce qui permet à davantage de personnes de participer.',note:'结果链。'}
  ]
 });

 enrich(31,{
  quick:[
   ['同主语','pour + inf 最省力'],
   ['不同主语','pour que + subj 最清楚']
  ],
  lessons:[
   {h:'4. 不要滥用 afin que',b:'afin que 没有比 pour que“更 C1”到必须优先。口语里自然和准确比堆高级连接词更重要。',ex:'pour que chacun puisse participer'},
   {h:'5. 目的结构特别适合建议段',b:'措施 + pour / pour que 可以把建议和目标连成一个完整论证。',ex:'Il faudrait proposer des cours pour aider les nouveaux arrivants à s’intégrer.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Il faudrait proposer des cours accessibles pour aider les nouveaux arrivants à mieux s’intégrer.',zh:'应该提供易获得的课程，以帮助新移民更好地融入。',focus:'pour + inf'}
  ],
  frames:[
   ['mesure + pour aider à + inf','proposer des cours pour aider à s’intégrer']
  ],
  practice:[
   {level:'Level 3 · 转换',q:'Il faut proposer des cours. Les immigrants peuvent mieux s’intégrer. → pour que',a:'Il faut proposer des cours pour que les immigrants puissent mieux s’intégrer.',note:'不同主语。'}
  ]
 });

 enrich(32,{
  quick:[
   ['易混','depuis ≠ pendant ≠ il y a ≠ dans'],
   ['T2追问','depuis combien de temps / pendant combien de temps']
  ],
  lessons:[
   {h:'6. depuis combien de temps vs pendant combien de temps',b:'depuis 问持续到现在；pendant 问一个已结束/限定阶段的持续时间。',ex:'Depuis combien de temps travaillez-vous ici ? · Pendant combien de temps êtes-vous resté(e) ?'},
   {h:'7. avant de / après avoir + participe passé',b:'同主语时可以高效表达先后顺序。',ex:'Avant de partir… · Après avoir réservé…'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Pendant combien de temps êtes-vous resté(e) sur place ?',zh:'您在那里待了多久？',focus:'pendant + durée'},
   {src:'口语 Tâche 2',fr:'Dans combien de temps comptez-vous partir ?',zh:'您打算多久以后出发？',focus:'dans + durée'}
  ],
  frames:[
   ['Depuis combien de temps + présent ?','Depuis combien de temps habitez-vous ici ?'],
   ['Pendant combien de temps + passé composé ?','Pendant combien de temps êtes-vous resté(e) ?']
  ],
  practice:[
   {level:'Level 2 · 选择',q:'“您在这里工作多久了？” depuis 还是 pendant？',a:'Depuis combien de temps travaillez-vous ici ?',note:'持续到现在。'}
  ]
 });

 enrich(33,{
  quick:[
   ['你常用','certes… mais… · cependant · en revanche'],
   ['核心对比','bien que + subj / même si + indicatif']
  ],
  lessons:[
   {h:'5. certes… mais… 是高性价比让步框架',b:'不用复杂变位，也能自然表达承认优点后转向限制。',ex:'Certes, cette solution est pratique, mais elle peut aussi présenter certains inconvénients.'},
   {h:'6. en revanche 不是万能 however',b:'更适合强对比两个方面；一般转折可用 cependant。',ex:'Cette solution est moins coûteuse. En revanche, elle est moins flexible.'}
  ],
  errors:[
   {bad:'Bien que c’est pratique…',good:'Bien que ce soit pratique…',why:'bien que + subjonctif。'},
   {bad:'Malgré il y a des avantages…',good:'Malgré les avantages… / Bien qu’il y ait des avantages…',why:'malgré 后接名词；从句则用 bien que。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Certes, cette solution présente plusieurs avantages, mais elle peut aussi entraîner certaines difficultés.',zh:'诚然，这个方案有多个优点，但也可能带来一些困难。',focus:'certes… mais…'}
  ],
  frames:[
   ['Certes, …, mais…','Certes, X…, mais Y…'],
   ['En revanche, + phrase','En revanche, cette solution est plus coûteuse.']
  ],
  practice:[
   {level:'Level 2 · 改错',q:'Malgré il y a plusieurs avantages…',a:'Malgré plusieurs avantages… / Bien qu’il y ait plusieurs avantages…',note:'名词结构 vs 从句。'}
  ]
 });

 enrich(34,{
  quick:[
   ['别混','si + imparfait 与 à condition que + subj 是两套系统'],
   ['口语策略','先把 si 现实/假设两类练稳，再碰过去未实现']
  ],
  lessons:[
   {h:'5. 过去未实现是假设系统里最低优先级',b:'si + plus-que-parfait → conditionnel passé 要会认、会用少量，但不值得冲刺阶段大量练。',ex:'Si j’avais su, je serais parti(e) plus tôt.'},
   {h:'6. à condition de + inf 用于同主语简化',b:'同一主语时可避免重复 que 从句。',ex:'On peut utiliser cet outil à condition de respecter certaines règles.'}
  ],
  errors:[
   {bad:'Si j’aurais plus de temps…',good:'Si j’avais plus de temps…',why:'si 从句不用 conditionnel。'},
   {bad:'à condition que respecter…',good:'à condition de respecter… / à condition que l’on respecte…',why:'同主语用 de + infinitif；从句用 que + subjonctif。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'On peut utiliser cette solution à condition de respecter certaines limites.',zh:'只要遵守一些限制，就可以使用这种方案。',focus:'à condition de + inf'}
  ],
  frames:[
   ['à condition de + inf','à condition de respecter…'],
   ['si + plus-que-parfait → conditionnel passé','Si j’avais su, je serais…']
  ],
  practice:[
   {level:'Level 3 · 转换',q:'À condition que nous respections les règles → 同主语简化',a:'À condition de respecter les règles.',note:'同主语可用 infinitif。'}
  ]
 });

 // mark enriched high-priority modules
 for(const n of [2,7,12,13,14,18,26,27,29,30,31,32,33,34]){
   const m=C.COURSE.find(x=>x.n===n); if(m)m.ready=true;
 }
 setTimeout(()=>C.injectMap(),0);
})();
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
  {n:8,name:'Les constructions verbales 动词句法 / 固定搭配',p:'A+',d:4,stage:1,ready:true},
  {n:9,name:'Auxiliaires / semi-auxiliaires',p:'B',d:3,stage:4},
  {n:10,name:'Accord sujet-verbe 主谓一致',p:'A+',d:4,stage:1,ready:true},
  {n:11,name:'La forme passive 被动态',p:'B',d:2,stage:4},
  {n:12,name:'La forme pronominale 代词式动词',p:'A',d:4,stage:2},
  {n:13,name:'Constructions impersonnelles 无人称结构',p:'A',d:4,stage:2},
  {n:14,name:"L’indicatif 直陈式 / 时态",p:'A',d:4,stage:3},
  {n:15,name:'Le subjonctif 虚拟式',p:'A',d:4,stage:1,existing:0,ready:true},
  {n:16,name:'Le conditionnel 条件式',p:'A',d:4,stage:1,existing:1,ready:true},
  {n:17,name:"L’impératif 命令式",p:'C',d:2,stage:4},
  {n:18,name:"L’infinitif 不定式",p:'A',d:4,stage:2},
  {n:19,name:'Le participe 分词',p:'B',d:3,stage:4},
  {n:20,name:'Les prépositions 介词',p:'A+',d:4,stage:1,ready:true},
  {n:21,name:'Les adverbes 副词',p:'B+',d:3,stage:3},
  {n:22,name:'La phrase interrogative 疑问句',p:'A+',d:4,stage:1,ready:true},
  {n:23,name:'La phrase négative 否定句',p:'A',d:4,stage:1,existing:3,ready:true},
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

 const LESSONS={3:ARTICLE,
  8:{
   title:'#8 Les constructions verbales · 动词句法 / 固定搭配',meta:'A+ 个人核心弱点 · 讲解深度 ④ · 第一阶段',
   quick:[
    ['核心原则','不要只背动词意思；连介词和后续动词形式一起背'],
    ['无介词 + infinitif','pouvoir / devoir / vouloir / savoir + infinitif'],
    ['à + infinitif','aider qn à · apprendre à · contribuer à · avoir tendance à'],
    ['de + infinitif','permettre à qn de · décider de · éviter de · avoir besoin de'],
    ['名词补语','faire face à · profiter de · bénéficier de · tenir compte de'],
    ['TCF重点','固定搭配错误会同时影响准确度、流利度和复杂句控制']
   ],
   lessons:[
    {h:'1. 动词支配要整体记忆',b:'法语动词常常规定后面接 à、de 或零介词。考试现场如果逐词拼，最容易在小词上出错。',ex:'faire face à · profiter de · bénéficier de · contribuer à'},
    {h:'2. 情态动词后直接接不定式',b:'pouvoir / devoir / vouloir 等后面直接接动词原形，不加 à 或 de。',ex:'pourrait entretenir une bonne relation · devrait continuer à parler'},
    {h:'3. permettre 的两个高频结构',b:'permettre de faire = 使做某事成为可能；permettre à quelqu’un de faire = 使某人能够做某事。',ex:'Cela permet de gagner du temps. · Cela permet aux jeunes de devenir plus autonomes.'},
    {h:'4. aider / encourager / apprendre + à',b:'aider quelqu’un à faire；encourager quelqu’un à faire；apprendre à quelqu’un à faire。人和动作之间的小词不能省。',ex:'aider le gouvernement à prendre des décisions · encourager les jeunes à participer'},
    {h:'5. 固定搭配优先于中文直译',b:'“认识新朋友”不是 faire connaissance de，而是 faire connaissance avec。类似结构必须作为完整语块存储。',ex:'faire connaissance avec de nouveaux amis'},
    {h:'6. 一个搭配可跨多个语法模块复用',b:'例如 profiter des ressources 同时涉及 profiter de、介词 de 和冠词缩合 des。学习时不要人为割裂。',ex:'profiter des ressources disponibles'}
   ],
   errors:[
    {bad:'pourrait, reste une bonne relation',good:'pourrait entretenir une bonne relation',why:'pourrait 后接不定式；“维系关系”用 entretenir une relation。'},
    {bad:'faire connaissance de nouveaux amis',good:'faire connaissance avec de nouveaux amis',why:'固定搭配 faire connaissance avec quelqu’un。'},
    {bad:'aider le gouvernement de faire quelques décisions',good:'aider le gouvernement à prendre des décisions',why:'aider quelqu’un à faire；同时说 prendre une décision。'},
    {bad:'les amis permettraient nous rendre…',good:'les amis permettraient de nous rendre…',why:'permettre de faire；若明确对象则 permettre à quelqu’un de faire。'}
   ],
   corpus:[
    {src:'口语 Tâche 3',fr:'Les parents doivent toujours faire face à certaines difficultés.',zh:'父母仍然必须面对一些困难。',focus:'faire face à'},
    {src:'口语 Tâche 3',fr:'Certains parents peuvent avoir tendance à en tenir l’enseignant responsable.',zh:'有些家长可能倾向于认为老师对此负责。',focus:'avoir tendance à + infinitif'},
    {src:'口语 Tâche 3',fr:'Une expérience à l’étranger peut permettre à un candidat de se démarquer sur le marché du travail.',zh:'海外经历可以让候选人在就业市场上脱颖而出。',focus:'permettre à qn de + infinitif'},
    {src:'口语 Tâche 3',fr:'Il serait souhaitable de profiter des ressources numériques disponibles.',zh:'最好充分利用现有的数字资源。',focus:'profiter de'}
   ],
   frames:[
    ['permettre à quelqu’un de + infinitif','Cela permet aux jeunes de devenir plus autonomes.'],
    ['aider quelqu’un à + infinitif','aider les nouveaux arrivants à s’intégrer'],
    ['faire face à + nom','faire face aux difficultés'],
    ['avoir tendance à + infinitif','avoir tendance à remettre ses devoirs au lendemain'],
    ['profiter de + nom','profiter des ressources disponibles']
   ],
   practice:[
    {level:'Level 1 · 识别',q:'aider quelqu’un ___ faire',a:'à',note:'aider quelqu’un à + infinitif。'},
    {level:'Level 1 · 识别',q:'permettre à quelqu’un ___ faire',a:'de',note:'permettre à quelqu’un de + infinitif。'},
    {level:'Level 2 · 改错',q:'faire connaissance de nouveaux amis',a:'faire connaissance avec de nouveaux amis',note:'固定搭配 with = avec。'},
    {level:'Level 2 · 改错',q:'les parents sachent de ne pas comparer',a:'les parents sachent ne pas comparer',note:'savoir + infinitif，不加 de。'},
    {level:'Level 3 · 语块',q:'面对困难',a:'faire face aux difficultés',note:'faire face à + les → aux。'},
    {level:'Level 4 · 中文 → 法语',q:'这可以让年轻人变得更加独立。',a:'Cela peut permettre aux jeunes de devenir plus autonomes.',note:'完整调用 permettre à qn de。'},
    {level:'Level 5 · 口语迁移',q:'海外经历可以让求职者在就业市场上脱颖而出。',a:'Une expérience à l’étranger peut permettre à un candidat de se démarquer sur le marché du travail.',note:'来自你的 Tâche 3 语料。'}
   ]
  },
  10:{
   title:'#10 Accord sujet-verbe · 主谓一致',meta:'A+ 高频真实错误 · 讲解深度 ④ · 第一阶段',
   quick:[
    ['先找真正主语','不要被主语后的介词短语或复数名词干扰'],
    ['复数主语','ils / elles / les jeunes / les personnes → 复数动词'],
    ['单数主语','le travail / la maîtrise / une expérience → 单数动词'],
    ['关系从句','qui 后动词跟先行词的性数走'],
    ['情态 / 条件式','nous pourrions · ils devraient · les parents seraient'],
    ['口语重点','说长句前先锁定主语，再启动动词']
   ],
   lessons:[
    {h:'1. 先确定句子的真正主语',b:'主语后面即使出现多个复数名词，也不改变核心主语的数。',ex:'Le bonheur partagé avec les amis est essentiel.'},
    {h:'2. 复数主语必须使用复数动词',b:'这是你错题本里出现频率最高的明确模式之一。尤其注意 parents / personnes / jeunes / autorités。',ex:'Nos parents seraient… · Les autorités prennent…'},
    {h:'3. 单数抽象名词最容易被后面词干扰',b:'le bonheur、la maîtrise、une expérience、le travail 都是单数。',ex:'La maîtrise de la langue joue un rôle essentiel.'},
    {h:'4. qui 后的动词看先行词',b:'deux personnes qui sont…；une personne qui souhaite…。不要只看 qui 本身。',ex:'deux personnes qui sont très différentes'},
    {h:'5. 条件式也必须按人称变位',b:'pourrait / pourraient / pourrions、devrait / devraient 都要和主语一致。',ex:'nous pourrions · les parents devraient'},
    {h:'6. 口语自动化方法',b:'说长句前先在脑中抓住“谁在做动作”，再说动词；不要等到动词位置才回头找主语。',ex:'Les nouveaux arrivants profitent… / La barrière linguistique ralentit…'}
   ],
   errors:[
    {bad:'Notre parent serait…',good:'Nos parents seraient…',why:'泛指父母是复数，限定词、名词和动词都要统一。'},
    {bad:'le bonheur avec les amis sont très essentiels',good:'le bonheur partagé avec les amis est essentiel',why:'真正主语 le bonheur 为单数。'},
    {bad:'l’école doivent…',good:'l’école doit…',why:'école 是单数。'},
    {bad:'deux personnes qui est très différente',good:'deux personnes qui sont très différentes',why:'先行词 personnes 为复数，动词和形容词都用复数。'},
    {bad:'nous, pourrait…',good:'nous pourrions…',why:'nous 对应条件式 pourrions。'}
   ],
   corpus:[
    {src:'口语 Tâche 3',fr:'La maîtrise de la langue locale joue un rôle essentiel dans l’insertion professionnelle.',zh:'掌握当地语言对职业融入起着关键作用。',focus:'单数主语 maîtrise → joue'},
    {src:'口语 Tâche 3',fr:'De nombreux employés doivent faire face à une charge de travail importante.',zh:'很多员工必须面对很大的工作量。',focus:'复数主语 employés → doivent'},
    {src:'口语 Tâche 3',fr:'Les immigrants peuvent occuper des postes dans des secteurs qui peinent à recruter.',zh:'移民可以在难以招聘的行业任职。',focus:'关系从句 sectors qui peinent'},
    {src:'口语 Tâche 3',fr:'Si les employés dormaient trop longtemps, cela pourrait perturber l’organisation de l’entreprise.',zh:'如果员工睡太久，这可能扰乱企业组织。',focus:'复数 dormaient + 单数 cela pourrait'}
   ],
   frames:[
    ['La / Le + nom singulier + verbe singulier','La maîtrise joue…'],
    ['Les + nom pluriel + verbe pluriel','Les jeunes peuvent…'],
    ['nom pluriel + qui + verbe pluriel','des secteurs qui peinent à recruter'],
    ['nous + conditionnel','nous pourrions / nous devrions'],
    ['ils / elles + conditionnel','ils pourraient / elles devraient']
   ],
   practice:[
    {level:'Level 1 · 识别',q:'La maîtrise de la langue ___ un rôle essentiel. (jouer)',a:'joue',note:'主语 maîtrise 是单数。'},
    {level:'Level 1 · 识别',q:'Les nouveaux arrivants ___ des difficultés. (rencontrer)',a:'rencontrent',note:'主语复数。'},
    {level:'Level 2 · 改错',q:'L’école doivent mieux préparer les jeunes.',a:'L’école doit mieux préparer les jeunes.',note:'主语 école 单数。'},
    {level:'Level 2 · 改错',q:'Deux personnes qui est très différentes…',a:'Deux personnes qui sont très différentes…',note:'qui 指代 personnes。'},
    {level:'Level 3 · 变位',q:'nous + pouvoir（条件式现在时）',a:'nous pourrions',note:'不要说 nous pourrait。'},
    {level:'Level 4 · 中文 → 法语',q:'很多员工必须面对很大的工作量。',a:'De nombreux employés doivent faire face à une charge de travail importante.',note:'来自你的 Tâche 3 语料。'},
    {level:'Level 5 · 口语迁移',q:'掌握当地语言对职业融入起着关键作用。',a:'La maîtrise de la langue locale joue un rôle essentiel dans l’insertion professionnelle.',note:'说完整句时锁定主语 maîtrise。'}
   ]
  },
  15:{
   title:'#15 Le subjonctif · 虚拟式',meta:'A C1 高收益结构 · 讲解深度 ④ · 第一阶段同步',
   quick:[
    ['必要 / 建议','il faut que · il faudrait que · il est important que'],
    ['让步','bien que + subjonctif'],
    ['目的','pour que / afin que + subjonctif'],
    ['条件','à condition que + subjonctif'],
    ['同主语简化','pour / afin de · à condition de + infinitif'],
    ['高频变位','soit / soient · puisse / puissent · fasse / fassent · prenne / prennent · sache / sachions']
   ],
   lessons:[
    {h:'1. 虚拟式不是“高级装饰”',b:'在 TCF 里它最有价值的地方，是把建议、必要性、目的、让步和条件表达得自然准确。',ex:'Il faudrait que les entreprises établissent des règles claires.'},
    {h:'2. il faut / il faudrait que 后用虚拟式',b:'主句用了条件式 faudrait，并不改变从句需要虚拟式。不要再叠加 devoir。',ex:'Il faudrait que les autorités prennent des mesures.'},
    {h:'3. bien que 后用虚拟式',b:'bien que 表示让步；même si 通常接直陈式，两者不要混。',ex:'Bien qu’il s’agisse d’un emploi à temps partiel, ils peuvent développer des compétences utiles.'},
    {h:'4. pour que 表目的',b:'两边主语不同时常用 pour que + subjonctif；同主语时更自然地用 pour + infinitif。',ex:'Pour que les immigrants puissent mieux s’intégrer…'},
    {h:'5. à condition que 表条件',b:'à condition que 后用虚拟式；同一主语时可改成 à condition de + infinitif。',ex:'à condition que sa durée reste raisonnable'},
    {h:'6. 优先背高频不规则形式',b:'不用一次背完所有动词。先把 être / avoir / pouvoir / faire / prendre / savoir 等你语料里反复出现的形式练熟。',ex:'soit · aient · puissent · fassent · prennent · sachions'}
   ],
   errors:[
    {bad:'il faudrait les autorités prennent…',good:'il faudrait que les autorités prennent…',why:'从句必须由 que 引出。'},
    {bad:'Bien qu’ils sont…',good:'Bien qu’ils soient…',why:'bien que 后用虚拟式。'},
    {bad:'il faudrait que les autorités doivent…',good:'il faudrait que les autorités prennent des mesures',why:'il faudrait que 已经表达建议，从句直接用虚拟式，不叠加 devoir。'},
    {bad:'à condition que nous pouvons…',good:'à condition que nous puissions…',why:'à condition que 后用虚拟式。'},
    {bad:'il faut que nous reconnaissons…',good:'il faut que nous reconnaissions…',why:'reconnaître 的 nous 虚拟式为 reconnaissions。'}
   ],
   corpus:[
    {src:'口语 Tâche 3',fr:'Parallèlement, il faudrait que les entreprises établissent des règles claires afin de trouver un équilibre.',zh:'与此同时，企业应制定明确规则，以找到平衡。',focus:'il faudrait que + subjonctif'},
    {src:'口语 Tâche 3',fr:'Bien qu’il s’agisse d’un emploi à temps partiel sans lien direct avec leur domaine d’études, ils peuvent développer des compétences utiles.',zh:'虽然这是一份与专业无直接关系的兼职，他们仍能培养有用技能。',focus:'bien que + subjonctif'},
    {src:'口语 Tâche 3',fr:'La sieste peut être bénéfique, à condition que sa durée reste raisonnable.',zh:'午睡可以有益，条件是时间保持合理。',focus:'à condition que + subjonctif'}
   ],
   frames:[
    ['Il faudrait que + sujet + subjonctif','Il faudrait que les autorités prennent…'],
    ['Bien que + subjonctif','Bien qu’il soit difficile…'],
    ['Pour que + subjonctif','Pour que les jeunes puissent…'],
    ['À condition que + subjonctif','À condition que la durée reste raisonnable…'],
    ['同主语：pour / à condition de + infinitif','pour progresser · à condition de le faire avec modération']
   ],
   practice:[
    {level:'Level 1 · 识别',q:'Bien que les personnes âgées ___ utiliser ces outils… (pouvoir)',a:'puissent',note:'bien que + 虚拟式。'},
    {level:'Level 1 · 识别',q:'Il faudrait que les autorités ___ des mesures. (prendre)',a:'prennent',note:'prendre 的 ils/elles 虚拟式 = prennent。'},
    {level:'Level 2 · 改错',q:'Bien qu’ils sont motivés…',a:'Bien qu’ils soient motivés…',note:'être → soient。'},
    {level:'Level 2 · 改错',q:'Il faudrait que nous devons agir.',a:'Il faudrait que nous agissions.',note:'避免 il faudrait que + devoir 叠加。'},
    {level:'Level 3 · 结构',q:'为了让新移民更好地融入',a:'pour que les nouveaux arrivants puissent mieux s’intégrer',note:'不同主语时用 pour que。'},
    {level:'Level 4 · 中文 → 法语',q:'条件是时间保持合理。',a:'À condition que sa durée reste raisonnable.',note:'你的 Tâche 3 高频结构。'},
    {level:'Level 5 · 口语迁移',q:'与此同时，企业应制定明确规则。',a:'Parallèlement, il faudrait que les entreprises établissent des règles claires.',note:'建议型 C1 结尾结构。'}
   ]
  },
  16:{
   title:'#16 Le conditionnel · 条件式',meta:'A 高收益表达 · 讲解深度 ④ · 第一阶段同步',
   quick:[
    ['建议 / 委婉','je conseillerais · il serait préférable · il faudrait'],
    ['可能结果','cela pourrait + infinitif'],
    ['si 假设','si + imparfait → conditionnel présent'],
    ['人称一致','je pourrais · nous pourrions · ils pourraient'],
    ['TCF T2 礼貌','Pourriez-vous… ? · Voudriez-vous… ?'],
    ['不要混淆','si 从句本身通常不用 conditionnel']
   ],
   lessons:[
    {h:'1. 条件式的考试价值',b:'它不只是“假设时态”，还承担建议、礼貌、降低语气和预测结果的功能，Tâche 2 和 Tâche 3 都很实用。',ex:'Je lui conseillerais de visiter Pékin. · Pourriez-vous me donner plus de détails ?'},
    {h:'2. si + imparfait → conditionnel présent',b:'较不确定或与现实相反的现在/未来假设：si 从句用未完成过去时，主句用条件式现在时。',ex:'Si les employés dormaient trop longtemps, cela pourrait perturber l’organisation.'},
    {h:'3. 条件式后仍接动词原形',b:'pourrait / devrait / voudrait 作为情态用法时，后面的动作保持不定式。',ex:'pourrait réduire · devrait continuer · voudrait participer'},
    {h:'4. 人称变位不能丢',b:'条件式结尾与 imparfait 类似：je -ais, nous -ions, vous -iez, ils -aient。',ex:'je pourrais · nous pourrions · ils pourraient'},
    {h:'5. 用条件式做建议更自然',b:'在口语 T2/T3 中，je conseillerais / il serait préférable / il faudrait 比直接命令更自然。',ex:'Je lui conseillerais de passer quelques jours à Shanghai.'},
    {h:'6. 不要在 si 后直接放条件式',b:'条件连词 si 后不能机械使用 conditionnel；应根据假设类型选 présent / imparfait / plus-que-parfait。',ex:'Si une personne réduisait son temps de travail, elle pourrait voir ses revenus diminuer.'}
   ],
   errors:[
    {bad:'nous, pourrait…',good:'nous pourrions…',why:'nous 对应条件式 -ions。'},
    {bad:'il sera difficile（在 si + imparfait 假设中）',good:'il serait difficile',why:'主句应与 si + imparfait 搭配条件式现在时。'},
    {bad:'Cela serait poser…',good:'Cela pourrait avoir des effets positifs.',why:'serait poser 结构不成立；情态条件式后接不定式。'}
   ],
   corpus:[
    {src:'口语 Tâche 3',fr:'Si une personne réduisait considérablement son temps de travail, elle pourrait également voir ses revenus diminuer.',zh:'如果一个人大幅减少工作时间，他的收入也可能下降。',focus:'si + imparfait → conditionnel'},
    {src:'口语 Tâche 3',fr:'Si les employés dormaient trop longtemps, cela pourrait perturber l’organisation de l’entreprise.',zh:'如果员工睡太久，这可能扰乱企业组织。',focus:'假设 + 可能结果'},
    {src:'口语 Tâche 3',fr:'Je lui conseillerais sans hésiter de visiter Pékin.',zh:'我会毫不犹豫地建议他去北京。',focus:'条件式表达建议'},
    {src:'口语 Tâche 2',fr:'Quels conseils me donneriez-vous pour bien préparer ce voyage ?',zh:'为了准备好这次旅行，您会给我什么建议？',focus:'条件式礼貌提问'}
   ],
   frames:[
    ['Si + imparfait, conditionnel','Si X faisait…, cela pourrait…'],
    ['Je conseillerais de + infinitif','Je conseillerais de réserver à l’avance.'],
    ['Il serait préférable de + infinitif','Il serait préférable de comparer les prix.'],
    ['Pourriez-vous + infinitif ?','Pourriez-vous me donner plus de détails ?'],
    ['sujet + pourrait + infinitif','Cela pourrait réduire les coûts.']
   ],
   practice:[
    {level:'Level 1 · 变位',q:'nous + pouvoir（conditionnel présent）',a:'nous pourrions',note:'nous → -ions。'},
    {level:'Level 1 · 选择',q:'Si les employés dormaient trop longtemps, cela ___ perturber l’organisation.',a:'pourrait',note:'si + imparfait → conditionnel présent。'},
    {level:'Level 2 · 改错',q:'Si c’était moins cher, il sera plus accessible.',a:'Si c’était moins cher, il serait plus accessible.',note:'主句用 conditionnel présent。'},
    {level:'Level 3 · 语块',q:'我会建议您提前预订。',a:'Je vous conseillerais de réserver à l’avance.',note:'条件式降低语气。'},
    {level:'Level 4 · Tâche 2',q:'为了准备好这次旅行，您会给我什么建议？',a:'Quels conseils me donneriez-vous pour bien préparer ce voyage ?',note:'来自你的 Tâche 2 语料。'},
    {level:'Level 5 · 口语迁移',q:'如果一个人大幅减少工作时间，他的收入也可能下降。',a:'Si une personne réduisait considérablement son temps de travail, elle pourrait également voir ses revenus diminuer.',note:'完整假设链。'}
   ]
  },
  20:{
   title:'#20 Les prépositions · 介词',meta:'A+ 个人核心弱点 · 讲解深度 ④ · 第一阶段',
   quick:[
    ['动词固定介词','participer à · profiter de · dépendre de · contribuer à'],
    ['地点 / 环境','sur le marché du travail · en ligne · sur Internet · dans une entreprise'],
    ['原因 / 让步','grâce à · à cause de · en raison de · malgré'],
    ['时间 / 计划','à l’avance · pendant · depuis · dans + durée'],
    ['并列重复','de / à 等介词在并列补语中常需要重复以保持结构完整'],
    ['核心原则','介词优先按固定搭配和意义单位记，不按中文逐词翻译']
   ],
   lessons:[
    {h:'1. 介词首先由动词支配',b:'很多介词不是“地点意思”，而是动词固定要求。',ex:'participer à · profiter de · contribuer à · dépendre de'},
    {h:'2. 高频固定表达必须整体记',b:'sur le marché du travail、en ligne、à l’avance 等不适合临场逐词组装。',ex:'sur le marché du travail · en ligne · à l’avance'},
    {h:'3. à / de 与冠词会发生缩合',b:'介词模块和冠词模块相互连接：à + les = aux；de + les = des。',ex:'faire face aux difficultés · profiter des ressources'},
    {h:'4. 原因表达的介词不同',b:'grâce à 多为正面；à cause de 多为负面；en raison de 中性正式；faute de 表示因缺少。',ex:'grâce au soutien · à cause du manque de temps · faute de temps'},
    {h:'5. 不要重复已经包含的介词',b:'en ligne 本身完整，不能说 sur en ligne；但可以说 sur Internet。',ex:'en ligne / sur Internet'},
    {h:'6. 并列结构里的介词完整性',b:'当两个并列补语都受同一介词支配时，口语快速输出时最容易漏第二个介词。高频结构应整体练。',ex:'des chambres ou des logements · à la maison et au travail'}
   ],
   errors:[
    {bad:'dans le marché de travail',good:'sur le marché du travail',why:'固定表达 sur le marché du travail。'},
    {bad:'sur en ligne',good:'en ligne / sur Internet',why:'en ligne 已经包含介词。'},
    {bad:'participent de bénévolat',good:'participent à des activités bénévoles',why:'participer à + nom。'},
    {bad:'jeux en hasard',good:'jeux de hasard',why:'固定名词结构 jeux de hasard。'},
    {bad:'faire connaissance de nouveaux amis',good:'faire connaissance avec de nouveaux amis',why:'固定搭配要求 avec。'}
   ],
   corpus:[
    {src:'口语 Tâche 2',fr:'Faut-il s’inscrire ou réserver à l’avance ?',zh:'需要提前报名或预订吗？',focus:'à l’avance'},
    {src:'口语 Tâche 2',fr:'Est-ce que c’est facilement accessible en transport en commun ?',zh:'坐公共交通方便到达吗？',focus:'en transport en commun'},
    {src:'口语 Tâche 3',fr:'Une expérience à l’étranger peut constituer un véritable atout sur le marché du travail.',zh:'海外经历可以成为就业市场上的真正优势。',focus:'sur le marché du travail'},
    {src:'口语 Tâche 3',fr:'Les parents doivent faire face à certaines difficultés.',zh:'父母必须面对一些困难。',focus:'faire face à'},
    {src:'口语 Tâche 3',fr:'Il faudrait que les nouveaux arrivants profitent des ressources disponibles.',zh:'新移民应该利用现有资源。',focus:'profiter de + des'}
   ],
   frames:[
    ['participer à + nom','participer à une activité / aux échanges'],
    ['profiter de + nom','profiter des ressources'],
    ['sur le marché du travail','se démarquer sur le marché du travail'],
    ['en ligne / sur Internet','chercher des informations en ligne'],
    ['à l’avance','réserver à l’avance']
   ],
   practice:[
    {level:'Level 1 · 识别',q:'participer ___ une activité',a:'à',note:'participer à。'},
    {level:'Level 1 · 识别',q:'profiter ___ ressources disponibles',a:'des',note:'profiter de + les。'},
    {level:'Level 2 · 改错',q:'dans le marché de travail',a:'sur le marché du travail',note:'固定表达。'},
    {level:'Level 2 · 改错',q:'chercher des informations sur en ligne',a:'chercher des informations en ligne',note:'en ligne 本身已完整。'},
    {level:'Level 3 · 语块',q:'提前预订',a:'réserver à l’avance',note:'高频 Tâche 2 语块。'},
    {level:'Level 4 · 中文 → 法语',q:'坐公共交通方便到达吗？',a:'Est-ce que c’est facilement accessible en transport en commun ?',note:'来自你的 Tâche 2 语料。'},
    {level:'Level 5 · 口语迁移',q:'海外经历可以让一个人在就业市场上脱颖而出。',a:'Une expérience à l’étranger peut permettre à une personne de se démarquer sur le marché du travail.',note:'固定介词 + 动词结构联动。'}
   ]
  },
  22:{
   title:'#22 La phrase interrogative · 疑问句',meta:'A+ Tâche 2 核心 · 讲解深度 ④ · 第一阶段',
   quick:[
    ['一般问句','Est-ce que + sujet + verbe ?'],
    ['倒装','Avez-vous… ? · Faut-il… ? · Y a-t-il… ?'],
    ['疑问词','quel / quelle / quels / quelles · combien de · comment · pourquoi'],
    ['礼貌提问','Pourriez-vous… ? · Pouvez-vous me dire… ?'],
    ['Tâche 2 核心','主问题 → 听答案 → 抓关键词 → 追问'],
    ['口语目标','自然、清楚、角色一致；不追求全程复杂倒装']
   ],
   lessons:[
    {h:'1. Est-ce que 是最稳定的口语骨架',b:'后面保持陈述语序：Est-ce que + sujet + verbe。考试紧张时它最可靠。',ex:'Est-ce que les chambres sont bien ventilées ?'},
    {h:'2. 高频固定倒装直接整体记',b:'Y a-t-il、Faut-il、Avez-vous、Pourriez-vous 都值得练到自动化。',ex:'Y a-t-il des frais supplémentaires ? · Faut-il réserver à l’avance ?'},
    {h:'3. quel 必须和名词性数配合',b:'Quel tarif ? Quelle destination ? Quels documents ? Quelles activités ?',ex:'Quelle destination me conseillez-vous ?'},
    {h:'4. 数量问句用 combien de',b:'combien de + nom；元音前 de → d’。不要说 combien des activités。',ex:'Combien de personnes peuvent participer ?'},
    {h:'5. 礼貌条件式提升自然度',b:'Pourriez-vous… / Quels conseils me donneriez-vous… 比直接命令更自然，但不要为了“高级”把每个问题都复杂化。',ex:'Pourriez-vous me donner plus de détails ?'},
    {h:'6. Tâche 2 真正拉分的是互动',b:'问题模板只是保险库。更重要的是根据考官刚才的回答追问一层，再自然切到下一个维度。',ex:'D’accord, je vois. Et concernant le transport, comment peut-on s’y rendre ?'}
   ],
   errors:[
    {bad:'combien des activités sont offertes ?',good:"combien d’activités sont offertes ?",why:'combien de + nom。'},
    {bad:'y a-t-il activités pour les enfants ?',good:'Y a-t-il des activités pour les enfants ?',why:'复数不定名词前需要 des。'},
    {bad:'s’agit-il…（用在陈述句）',good:'il s’agit de…',why:'s’agit-il de 只用于疑问；陈述句用 il s’agit de。'}
   ],
   corpus:[
    {src:'口语 Tâche 2',fr:'Combien ça coûte ?',zh:'多少钱？',focus:'最简洁价格问法'},
    {src:'口语 Tâche 2',fr:'Y a-t-il des frais supplémentaires à prévoir ?',zh:'还有需要额外支付的费用吗？',focus:'Y a-t-il'},
    {src:'口语 Tâche 2',fr:'Quelle destination me conseillez-vous ?',zh:'您推荐我去哪个目的地？',focus:'quelle + 名词'},
    {src:'口语 Tâche 2',fr:'Est-ce que c’est facilement accessible en transport en commun ?',zh:'坐公共交通方便到达吗？',focus:'Est-ce que'},
    {src:'口语 Tâche 2',fr:'Quels conseils me donneriez-vous pour bien préparer ce voyage ?',zh:'为了准备好这次旅行，您会给我什么建议？',focus:'条件式礼貌问句'}
   ],
   frames:[
    ['Est-ce que + sujet + verbe ?','Est-ce que les chambres sont bien ventilées ?'],
    ['Y a-t-il + nom ?','Y a-t-il des activités pour les enfants ?'],
    ['Faut-il + infinitif ?','Faut-il réserver à l’avance ?'],
    ['Quel(le)(s) + nom ?','Quels sont les horaires ?'],
    ['Combien de + nom ?','Combien de personnes peuvent participer ?']
   ],
   practice:[
    {level:'Level 1 · 结构',q:'___ des frais supplémentaires ?',a:'Y a-t-il',note:'高频存在问句。'},
    {level:'Level 1 · 配合',q:'___ destination me conseillez-vous ?',a:'Quelle',note:'destination 阴性单数。'},
    {level:'Level 2 · 改错',q:'Combien des personnes peuvent participer ?',a:'Combien de personnes peuvent participer ?',note:'combien de。'},
    {level:'Level 3 · 语块',q:'需要提前预订吗？',a:'Faut-il réserver à l’avance ?',note:'Tâche 2 高频。'},
    {level:'Level 4 · 中文 → 法语',q:'有哪些活动适合家庭或儿童？',a:'Y a-t-il des activités adaptées aux familles ou aux enfants ?',note:'来自你的 Tâche 2 语料。'},
    {level:'Level 4 · 中文 → 法语',q:'您推荐哪种住宿？',a:'Quel type d’hébergement me conseillez-vous ?',note:'quel type de + nom。'},
    {level:'Level 5 · 互动迁移',q:'考官刚说“周末人比较少”。请自然追问具体时间。',a:'D’accord, je vois. À quelle heure y a-t-il le moins de monde ?',note:'回答 → 反应 → 追问。'}
   ]
  },
  23:{
   title:'#23 La phrase négative · 否定句',meta:'A 高频准确度模块 · 讲解深度 ④ · 第一阶段',
   quick:[
    ['基础否定','ne…pas'],
    ['频率 / 时间','ne…plus · ne…jamais'],
    ['数量 / 对象','ne…rien · ne…personne · ne…aucun'],
    ['限制','ne…que = 只'],
    ['不定式否定','ne pas + infinitif'],
    ['冠词联动','pas de / d’ + nom（常见情况）']
   ],
   lessons:[
    {h:'1. 变位动词：ne 和 pas 包住动词',b:'现在时等简单时态中，ne 在变位动词前，pas / plus / jamais 通常在后。',ex:'Je ne regarde pas la télévision.'},
    {h:'2. 不定式否定要整体放前面',b:'当被否定的是动词原形，通常用 ne pas + infinitif。',ex:'Je préfère ne pas regarder la télévision.'},
    {h:'3. plus / jamais / rien / personne 各有功能',b:'plus = 不再；jamais = 从不；rien = 什么也不；personne = 没有人。它们的位置要跟句法功能一起学。',ex:'Je ne regarde plus les informations. · Je ne vois personne.'},
    {h:'4. ne…que 不是否定意义，而是限制',b:'ne…que = seulement，但结构位置不同。',ex:'Cette solution n’offre qu’un avantage.'},
    {h:'5. 否定与冠词联动',b:'不定冠词和部分冠词在很多否定句里变成 de / d’。',ex:'Il y a des activités → Il n’y a pas d’activités.'},
    {h:'6. 口语不要为了自然把 ne 全删掉',b:'日常法语中 ne 常省，但 TCF 正式口语建议保持结构完整，尤其你在建立自动化阶段。',ex:'Il ne faut pas généraliser.'}
   ],
   errors:[
    {bad:'sachent de ne pas comparer',good:'sachent ne pas comparer',why:'savoir + infinitif 不加 de；否定不定式为 ne pas + infinitif。'},
    {bad:'Il n’y a pas des activités…',good:"Il n’y a pas d’activités…",why:'否定后不定冠词 des 常变 de / d’。'},
    {bad:'je veux ne pas regarder…',good:'je ne veux pas regarder… / je préfère ne pas regarder…',why:'若否定“想要”本身，用 ne…pas 包住 veux；若否定后面的动作，可用 ne pas + infinitif。'}
   ],
   corpus:[
    {src:'口语 Tâche 3',fr:'Il ne faut pas généraliser.',zh:'不能一概而论。',focus:'ne…pas'},
    {src:'口语 Tâche 3',fr:'Cela ne signifie pas que…',zh:'这并不意味着……',focus:'ne…pas + que 从句'},
    {src:'口语 Tâche 3',fr:'Le travail ne devrait pas se faire au détriment de leurs études.',zh:'工作不应该以牺牲学业为代价。',focus:'条件式否定'},
    {src:'口语 Tâche 3',fr:'Ils ne peuvent pas compter uniquement sur leurs enfants pour s’intégrer.',zh:'他们不能只依赖孩子来融入。',focus:'情态动词否定'}
   ],
   frames:[
    ['ne + verbe + pas','Il ne faut pas généraliser.'],
    ['ne + verbe + plus','Je ne regarde plus les informations télévisées.'],
    ['ne pas + infinitif','préférer ne pas sortir'],
    ['ne…que','Cette solution n’offre qu’un avantage.'],
    ['pas de + nom','Il n’y a pas d’activités.']
   ],
   practice:[
    {level:'Level 1 · 识别',q:'Il ___ faut ___ généraliser.',a:'ne / pas',note:'ne…pas。'},
    {level:'Level 1 · 结构',q:'préférer + 否定 sortir',a:'préférer ne pas sortir',note:'不定式否定。'},
    {level:'Level 2 · 改错',q:'Il n’y a pas des activités.',a:"Il n’y a pas d’activités.",note:'否定后 des → de / d’。'},
    {level:'Level 2 · 改错',q:'les parents sachent de ne pas comparer',a:'les parents sachent ne pas comparer',note:'savoir + infinitif。'},
    {level:'Level 3 · 语块',q:'这并不意味着……',a:'Cela ne signifie pas que…',note:'Tâche 3 高频让步补充。'},
    {level:'Level 4 · 中文 → 法语',q:'他们不能只依赖孩子来融入。',a:'Ils ne peuvent pas compter uniquement sur leurs enfants pour s’intégrer.',note:'来自你的 Tâche 3 语料。'},
    {level:'Level 5 · 口语迁移',q:'不能一概而论，因为每个人的情况不同。',a:'Il ne faut pas généraliser, car la situation de chacun est différente.',note:'否定 + 原因表达。'}
   ]
  }
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
  b.onclick=()=>LESSONS[m.n]?openLesson(m.n):m.existing!==undefined?openExisting(m.existing):alert('这个模块已经排入课程路线，后续会按同一母版补齐。');
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
 function openLesson(num){
  const lesson=LESSONS[num];if(!lesson)return;
  const d=$('c1CourseDialog');d.replaceChildren();
  const head=E('header','c1-course-dialog-head');const left=E('div');left.append(E('div','eyebrow','TCF Canada · C1 语法专项训练'),E('h2','',lesson.title),E('p','c1-course-meta',lesson.meta));const close=E('button','', '✕ 关闭');close.type='button';close.onclick=()=>d.close();head.append(left,close);d.append(head);
  const nav=E('div','c1-lesson-nav');[['速览','quick'],['系统讲解','lessons'],['我的错题','errors'],['我的语料','corpus'],['迁移骨架','frames'],['分层训练','practice'],['掌握度','mastery']].forEach(([a,id])=>{const x=E('a','',a);x.href='#c1-'+id;nav.append(x)});d.append(nav);
  let s=section('考试速览');s.id='c1-quick';const table=E('table','c1-course-table');for(const [a,b] of lesson.quick){const tr=E('tr');tr.append(E('th','',a),E('td','',b));table.append(tr)}s.append(table);d.append(s);
  s=section('系统讲解');s.id='c1-lessons';for(const x of lesson.lessons){const card=E('article','c1-lesson-card');card.append(E('h4','',x.h),E('p','',x.b),E('div','c1-example',x.ex));card.append(audioBtn(()=>x.ex));s.append(card)}d.append(s);
  s=section('我的真实错题');s.id='c1-errors';s.append(E('p','note','只放你真实出现过的错误模式，用来消灭“同一种错误反复出现”，不是为了堆题。'));for(const x of lesson.errors){const card=E('article','c1-error-card');card.append(E('div','c1-bad','✗ '+x.bad),E('div','c1-good','✓ '+x.good),E('p','',x.why));s.append(card)}d.append(s);
  s=section('我的 Tâche 2 / Tâche 3 语料');s.id='c1-corpus';for(const x of lesson.corpus){const card=E('article','c1-corpus-card');card.append(E('span','c1-source-tag',x.src),E('p','c1-fr',x.fr),E('p','',x.zh),E('small','', '本句重点：'+x.focus),audioBtn(()=>x.fr));s.append(card)}d.append(s);
  s=section('可迁移句型骨架');s.id='c1-frames';const ft=E('table','c1-course-table');for(const [a,b] of lesson.frames){const tr=E('tr');tr.append(E('th','',a),E('td','',b));ft.append(tr)}s.append(ft);d.append(s);
  s=section('分层训练');s.id='c1-practice';for(const x of lesson.practice){const card=E('article','c1-practice-card');card.append(E('span','c1-level',x.level),E('p','c1-practice-q',x.q));const ans=E('div','c1-practice-answer hidden');ans.append(E('strong','',x.a),E('p','',x.note),audioBtn(()=>x.a));const b=E('button','', '显示答案');b.type='button';b.onclick=()=>{ans.classList.toggle('hidden');b.textContent=ans.classList.contains('hidden')?'显示答案':'隐藏答案'};card.append(b,ans);s.append(card)}d.append(s);
  s=section('掌握度');s.id='c1-mastery';s.append(E('p','note','真正“学会”= 理解规则 + 能识别错误 + 能主动写出 + 在完整口语里自动使用。'));const checks=[['understand','理解：我能解释这个模块的核心规则'],['recognize','识别：我能发现自己的同类错误'],['write','书面输出：中文→法语能稳定写对'],['oral','口语自动化：完整句中无需停顿拼结构']];const prog=getProgress();for(const [k,label] of checks){const l=E('label','c1-mastery-check');const input=document.createElement('input');input.type='checkbox';input.checked=!!prog[num+'-'+k];input.onchange=()=>{const p=getProgress();p[num+'-'+k]=input.checked;saveProgress(p)};l.append(input,document.createTextNode(' '+label));s.append(l)}d.append(s);
  if(COURSE.find(x=>x.n===num)?.existing!==undefined){const x=COURSE.find(x=>x.n===num);const row=E('div','c1-existing-link');row.append(E('p','note','这个模块还可以继续进入你原来已经整理好的专项词条库，做批量学习 / 练习 / 复习。'));const btn=E('button','primary','进入原专项词条库 →');btn.type='button';btn.onclick=()=>openExisting(x.existing);row.append(btn);d.append(row);}
  d.showModal();
 }
 function openArticle(){openLesson(3);}
 function audioBtn(get){const b=E('button','c1-audio-mini','🔊 法语朗读');b.type='button';b.onclick=()=>speak(get());return b}
 function buildDialog(){if($('c1CourseDialog'))return;const d=document.createElement('dialog');d.id='c1CourseDialog';d.className='c1-course-dialog';document.body.append(d);d.addEventListener('click',e=>{if(e.target===d)d.close()});}
 updateBadge();buildDialog();
 const obs=new MutationObserver(()=>{if(observerBusy)return;requestAnimationFrame(injectMap)});const root=$('c1View');if(root)obs.observe(root,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});
 document.querySelector('[data-module="9"]')?.addEventListener('click',()=>setTimeout(injectMap,0));
 setTimeout(injectMap,0);
 window.C1_COURSE={COURSE,ARTICLE,LESSONS,openArticle,openLesson,injectMap};
})();
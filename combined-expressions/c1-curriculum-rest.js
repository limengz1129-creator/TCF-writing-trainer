'use strict';
(()=>{
 const C=window.C1_COURSE;if(!C)return;
 const L=C.LESSONS, course=C.COURSE;
 const add=(n,data)=>{L[n]=data;const m=course.find(x=>x.n===n);if(m)m.ready=true;};
 const mk=(title,meta,quick,lessons,errors,corpus,frames,practice)=>({title,meta,quick,lessons,errors,corpus,frames,practice});

 add(1,mk('#1 Le nom · 名词','B 高频 · 讲解深度 ② · 第四阶段',
 [['核心','只学 TCF 高频阴阳性、复数和抽象名词'],['重点','名词性别影响冠词、形容词和代词'],['策略','优先整块记：la langue / le travail / la société']],
 [
  {h:'1. 名词性别要和冠词一起记',b:'不要单独背“词义”，而要把 le / la 一起存储。',ex:'la langue · la société · le travail · le logement'},
  {h:'2. 复数多数加 -s，但高频不规则要识别',b:'考试里更重要的是在完整句中保持冠词、名词、形容词一致。',ex:'un travail → des travaux · un animal → des animaux'},
  {h:'3. 抽象名词是 Tâche 3 主力',b:'很多论证都围绕 travail, éducation, intégration, autonomie 等名词展开。',ex:'l’intégration professionnelle · la vie quotidienne'}
 ],
 [],
 [
  {src:'口语 Tâche 3',fr:'La maîtrise de la langue locale joue un rôle essentiel dans l’insertion professionnelle.',zh:'掌握当地语言对职业融入起着关键作用。',focus:'抽象名词 + 性别'},
  {src:'口语 Tâche 2',fr:'Quel type de logement recherchez-vous ?',zh:'您在找哪种住房？',focus:'logement 阳性'}
 ],
 [['la + nom féminin','la langue · la société'],['le + nom masculin','le travail · le logement']],
 [
  {level:'Level 1 · 识别',q:'___ société',a:'la société',note:'société 阴性。'},
  {level:'Level 2 · 语块',q:'职业融入',a:'l’insertion professionnelle',note:'整体记忆。'}
 ]));

 add(2,mk('#2 L’adjectif · 形容词与数词','A 必须掌握 · 讲解深度 ④ · 第三阶段',
 [['配合','形容词与所修饰名词性数配合'],['位置','大多数后置；一批高频形容词常前置'],['意义变化','部分形容词前后位置会改变语义'],['重点','bon / mauvais / meilleur / grand / petit / nouveau / vieux / jeune'],['数词','基数词不配合；premier / deuxième 等序数词要配合']],
 [
  {h:'1. 配合优先于位置',b:'先保证性数一致，再考虑前置后置。',ex:'une solution efficace · des solutions efficaces'},
  {h:'2. 高频前置形容词',b:'bon, mauvais, grand, petit, beau, jeune, vieux, nouveau, premier 等在口语里非常常见。',ex:'une bonne idée · une nouvelle méthode · un grand avantage'},
  {h:'3. 不是所有“评价词”都前置',b:'fiable、important、utile 等通常后置；不要把前置规律机械扩大。',ex:'une source fiable · un rôle important'},
  {h:'4. 比较级形容词也要配合',b:'meilleur / meilleure / meilleurs / meilleures。',ex:'une meilleure solution'},
  {h:'5. 形容词作表语时仍配合主语',b:'être / sembler / paraître / devenir 等后面的形容词与主语一致。',ex:'Elles semblent motivées.'}
 ],
 [
  {bad:'plus motivant（说人）',good:'plus motivé',why:'描述“人受到激励”通常用 motivé；motivante 更常描述能激励人的事物。'},
  {bad:'deux personnes très différente',good:'deux personnes très différentes',why:'personnes 为阴性复数。'}
 ],
 [
  {src:'口语 Tâche 3',fr:'Une expérience à l’étranger peut constituer un véritable atout sur le marché du travail.',zh:'海外经历可以成为就业市场上的真正优势。',focus:'véritable 后置于冠词后、名词前'},
  {src:'口语 Tâche 3',fr:'Les jeunes peuvent devenir plus autonomes.',zh:'年轻人可以变得更加独立。',focus:'autonomes 与 jeunes 配合'}
 ],
 [['une bonne / meilleure + nom','une bonne idée · une meilleure solution'],['nom + adjectif','une solution efficace · une source fiable']],
 [
  {level:'Level 1 · 配合',q:'des solutions ___ (efficace)',a:'des solutions efficaces',note:'复数加 -s。'},
  {level:'Level 2 · 改错',q:'deux personnes très différente',a:'deux personnes très différentes',note:'阴性复数。'},
  {level:'Level 4 · 中文 → 法语',q:'一个更好的解决方案',a:'une meilleure solution',note:'meilleure 与 solution 配合。'}
 ]));

 add(4,mk('#4 Les démonstratifs · 指示词','B 高频 · 讲解深度 ② · 第四阶段',
 [['限定词','ce / cet / cette / ces'],['代词','celui / celle / ceux / celles'],['强调','-ci / -là 用于区分'],['TCF用途','指代前文观点、方案、选择']],
 [
  {h:'1. ce / cet / cette / ces 与名词配合',b:'cet 用在阳性单数元音或哑音 h 前。',ex:'ce problème · cet avantage · cette solution · ces mesures'},
  {h:'2. celui / celle 等代替名词',b:'常用于避免重复，后面可接 de 或关系从句。',ex:'celle qui me semble la plus pratique'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Cette solution peut avoir plusieurs avantages.',zh:'这个方案可能有多个优点。',focus:'cette + 阴性单数'}],
 [['ce/cet/cette/ces + nom','cette solution · ces mesures'],['celui/celle + qui/que/de','celle qui convient le mieux']],
 [{level:'Level 1 · 选择',q:'___ avantage',a:'cet avantage',note:'元音前 cet。'}]));

 add(5,mk('#5 Les possessifs · 主有词','B 高频 · 讲解深度 ② · 第四阶段',
 [['限定词','mon/ma/mes · ton/ta/tes · son/sa/ses'],['复数所有者','notre/nos · votre/vos · leur/leurs'],['原则','看被拥有名词的性数，不看拥有者性别'],['元音','阴性单数元音前用 mon/ton/son']],
 [
  {h:'1. 物主限定词看名词，不看人',b:'son amie 里的 son 不代表拥有者是男性。',ex:'son amie · sa famille'},
  {h:'2. leur / leurs',b:'leur + 单数名词；leurs + 复数名词。',ex:'leur travail · leurs enfants'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Ils ne peuvent pas compter uniquement sur leurs enfants pour s’intégrer.',zh:'他们不能只依赖孩子来融入。',focus:'leurs + enfants'}],
 [['leur + nom singulier','leur travail'],['leurs + nom pluriel','leurs enfants']],
 [{level:'Level 1 · 选择',q:'___ enfants（他们的）',a:'leurs enfants',note:'复数名词 enfants。'}]));

 add(6,mk('#6 Les indéfinis · 泛指词','B 高频 · 讲解深度 ③ · 第三阶段',
 [['高频','chaque · chacun · plusieurs · certains · tout/tous · aucun'],['论证','certains… d’autres… 可用于泛指，但不要机械套模板'],['配合','tout/toute/tous/toutes 要随名词变化'],['否定','aucun + nom… ne']],
 [
  {h:'1. chaque + 单数名词',b:'表示“每一个”，后面用单数。',ex:'chaque personne · chaque situation'},
  {h:'2. chacun 独立使用',b:'不直接跟名词；可说 chacun de nous。',ex:'Chacun devrait faire des efforts.'},
  {h:'3. plusieurs 不加冠词',b:'直接接复数名词。',ex:'plusieurs raisons · plusieurs possibilités'},
  {h:'4. aucun 与否定',b:'aucun/aucune 作限定词时，句中常配 ne。',ex:'Aucune solution ne convient parfaitement.'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Chacun devrait faire des efforts pour mieux s’intégrer.',zh:'每个人都应该努力更好地融入。',focus:'chacun + conditionnel'}],
 [['chaque + nom singulier','chaque personne'],['plusieurs + nom pluriel','plusieurs raisons'],['aucun(e) + nom + ne','Aucune solution ne…']],
 [{level:'Level 1 · 识别',q:'___ raisons',a:'plusieurs raisons',note:'plusieurs 后不加冠词。'}]));

 add(7,mk('#7 Les pronoms personnels · 人称代词','A+ 核心弱点 · 讲解深度 ④ · 第二阶段',
 [['COD','le / la / les'],['COI','lui / leur'],['y','à + chose / lieu'],['en','de + chose / quantity'],['顺序','me/te/se/nous/vous → le/la/les → lui/leur → y → en'],['目标','不要重复名词，也不要漏小词']],
 [
  {h:'1. 先判断动词结构，再选代词',b:'代词不是靠中文翻译选，而是看动词本来接直接宾语、à 还是 de。',ex:'aider quelqu’un → l’aider · parler à quelqu’un → lui parler'},
  {h:'2. y 替代 à + 事物或地点',b:'一般不替代具体的人。',ex:'penser à ce projet → y penser'},
  {h:'3. en 替代 de + 事物或数量',b:'avoir besoin de → en avoir besoin；parler de → en parler。',ex:'J’en ai besoin.'},
  {h:'4. lui / leur 是间接宾语',b:'parler à Marie → lui parler；parler aux étudiants → leur parler。',ex:'Je leur parle souvent.'},
  {h:'5. 代词顺序要自动化',b:'多个代词并用时位置固定，适合通过短句反复练。',ex:'Je le lui explique. · J’en parle.'}
 ],
 [
  {bad:'permettre nous rendre…',good:'nous permettre de devenir… / permettre aux jeunes de devenir…',why:'先确定 permettre à quelqu’un de 的结构，再决定是否用 nous。'}
 ],
 [
  {src:'口语 Tâche 3',fr:'Ils ne peuvent pas compter uniquement sur leurs enfants pour s’intégrer.',zh:'他们不能只依赖孩子来融入。',focus:'反身代词 se'},
  {src:'口语 Tâche 3',fr:'Cela leur permet de mieux comprendre la culture locale.',zh:'这使他们能够更好地理解当地文化。',focus:'leur = à eux'}
 ],
 [['penser à qch → y penser','J’y pense souvent.'],['avoir besoin de qch → en avoir besoin','J’en ai besoin.'],['parler à qn → lui/leur parler','Je leur parle.']],
 [
  {level:'Level 1 · 替换',q:'Je pense à ce projet. →',a:'J’y pense.',note:'à + chose → y。'},
  {level:'Level 1 · 替换',q:'J’ai besoin de ces documents. →',a:'J’en ai besoin.',note:'de + chose → en。'},
  {level:'Level 3 · 口语',q:'我经常和他们谈这件事。',a:'Je leur en parle souvent.',note:'leur + en 顺序。'}
 ]));

 add(9,mk('#9 Auxiliaires et semi-auxiliaires · 助动词与半助动词','B 高频 · 讲解深度 ③ · 第四阶段',
 [['avoir / être','复合时态助动词'],['aller + inf','近期将来'],['venir de + inf','最近过去'],['devoir / pouvoir','义务、可能、建议'],['être en train de','正在进行']],
 [
  {h:'1. passé composé 先选 avoir / être',b:'多数动词用 avoir；运动/状态变化的常见动词和代词式动词多用 être。',ex:'j’ai travaillé · je suis parti(e) · je me suis adapté(e)'},
  {h:'2. devoir / pouvoir 后直接接不定式',b:'不加 de / à。',ex:'peut faciliter · doit respecter'},
  {h:'3. aller / venir de 构成时间意义',b:'aller + inf = 即将；venir de + inf = 刚刚。',ex:'je vais partir · je viens d’arriver'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Cela peut faciliter la communication.',zh:'这可以促进沟通。',focus:'pouvoir + infinitif'}],
 [['pouvoir + inf','peut améliorer'],['devoir + inf','doit respecter'],['aller + inf','va commencer']],
 [{level:'Level 1 · 结构',q:'peut ___ (améliorer)',a:'peut améliorer',note:'直接接不定式。'}]));

 add(11,mk('#11 La forme passive · 被动态','B 高频 · 讲解深度 ② · 第四阶段',
 [['结构','être + participe passé'],['配合','过去分词与主语配合'],['用途','正式说明规则、服务、措施、结果'],['策略','会用高频被动即可，不做复杂文学转换']],
 [
  {h:'1. 被动结构',b:'主动句宾语变主语，être 按时态变位，过去分词与新主语配合。',ex:'Les documents sont vérifiés.'},
  {h:'2. Tâche 2 常见服务表达',b:'inclus, proposé, organisé, autorisé 等被动形容词化形式很常见。',ex:'Le petit-déjeuner est-il inclus dans le prix ?'}
 ],
 [],
 [{src:'口语 Tâche 2',fr:'Le petit-déjeuner est-il inclus dans le prix ?',zh:'早餐包含在价格里吗？',focus:'être + participe passé'}],
 [['être + participe passé','Les activités sont organisées…']],
 [{level:'Level 1 · 识别',q:'Les activités ___ organisées le week-end.',a:'sont',note:'被动结构。'}]));

 add(12,mk('#12 La forme pronominale · 代词式动词','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['高频','s’adapter à · se familiariser avec · s’intégrer · se rendre compte de'],['反身代词','me/te/se/nous/vous/se'],['复合时态','通常用 être'],['介词','反身结构后仍要保留固定介词']],
 [
  {h:'1. 反身代词随主语变化',b:'je m’adapte, nous nous adaptons, ils s’adaptent。',ex:'Nous nous adaptons progressivement.'},
  {h:'2. 固定介词不能丢',b:'s’adapter à, se familiariser avec, s’occuper de, se rendre compte de。',ex:'se familiariser avec le système'},
  {h:'3. 代词式动词常用于移民与生活主题',b:'s’intégrer, s’adapter, se sentir, se concentrer 等非常高频。',ex:'s’intégrer dans la société d’accueil'},
  {h:'4. 过去时通常用 être',b:'je me suis adapté(e)；但过去分词配合还要看 se 的句法功能。',ex:'Elle s’est adaptée rapidement.'}
 ],
 [],
 [
  {src:'口语 Tâche 3',fr:'Les nouveaux arrivants doivent apprendre à s’adapter à leur nouvel environnement.',zh:'新移民必须学会适应新环境。',focus:'s’adapter à'},
  {src:'口语 Tâche 3',fr:'Ils peuvent se familiariser progressivement avec les codes sociaux.',zh:'他们可以逐步熟悉社会规则。',focus:'se familiariser avec'}
 ],
 [['s’adapter à + nom','s’adapter à la vie locale'],['se familiariser avec + nom','se familiariser avec le système']],
 [{level:'Level 1 · 结构',q:'s’adapter ___ la vie locale',a:'à',note:'固定搭配。'}]));

 add(13,mk('#13 Constructions impersonnelles · 无人称结构','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['必要','il faut / il faudrait'],['建议','il vaut mieux'],['评价','il est important / essentiel / nécessaire'],['可能','il est possible de / que'],['TCF价值','论证开头、建议、结尾非常高频']],
 [
  {h:'1. il 不指具体的人',b:'这些结构用于客观表达必要性、建议和评价。',ex:'Il faut agir. · Il est important de rester prudent.'},
  {h:'2. 同主语常用 de + infinitif',b:'Il est important de respecter les règles.',ex:'Il est essentiel de trouver un équilibre.'},
  {h:'3. 不同主语常用 que + 从句',b:'Il est important que les autorités prennent des mesures.',ex:'Il faudrait que chacun fasse un effort.'},
  {h:'4. il vaut mieux + infinitif',b:'表达“最好……”，后面直接接不定式。',ex:'Il vaut mieux comparer les prix.'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Il ne faut pas généraliser.',zh:'不能一概而论。',focus:'il faut 非人称结构'}],
 [['Il faudrait que + subj.','Il faudrait que chacun participe.'],['Il vaut mieux + inf','Il vaut mieux réserver.'],['Il est important de + inf','Il est important de vérifier.']],
 [{level:'Level 1 · 结构',q:'最好提前预订。',a:'Il vaut mieux réserver à l’avance.',note:'il vaut mieux + inf。'}]));

 add(14,mk('#14 L’indicatif · 直陈式与核心时态','A 必须掌握 · 讲解深度 ④ · 第三阶段',
 [['présent','当前事实、习惯、观点'],['passé composé','完成的过去事件'],['imparfait','过去背景、状态、重复习惯'],['futur','未来计划、预测'],['T2重点','先判断题目时间框架再提问']],
 [
  {h:'1. présent 是口语主干',b:'观点、事实、常规服务、当前情况都主要用现在时。',ex:'Quels services proposez-vous ?'},
  {h:'2. passé composé 讲已完成经历',b:'强调事件发生和完成。',ex:'Qu’est-ce que tu as préféré ?'},
  {h:'3. imparfait 讲背景与持续状态',b:'过去环境、人物状态、习惯。',ex:'Comment étaient tes collègues ?'},
  {h:'4. futur / futur proche 讲计划',b:'Tâche 2 未来安排很常见。',ex:'Quand allez-vous partir ? · Que ferez-vous sur place ?'},
  {h:'5. T2 时态先于句型',b:'先判断场景是现在、过去经历还是未来计划，再选问题形式。',ex:'présent / passé composé + imparfait / futur'}
 ],
 [],
 [
  {src:'口语 Tâche 2',fr:'Qu’est-ce que tu as préféré ?',zh:'你最喜欢什么？',focus:'passé composé'},
  {src:'口语 Tâche 2',fr:'Comment étaient tes collègues ?',zh:'你的同事当时怎么样？',focus:'imparfait'}
 ],
 [['过去事件','passé composé'],['过去背景','imparfait'],['未来计划','futur / aller + inf']],
 [{level:'Level 1 · 判断',q:'描述过去工作的环境 → 用什么时态？',a:'imparfait',note:'背景/状态。'}]));

 add(17,mk('#17 L’impératif · 命令式','C 次要 · 讲解深度 ② · 第四阶段',
 [['用途','建议、指令、操作'],['形式','tu / nous / vous'],['TCF策略','会高频形式即可，不做大量专项']],
 [
  {h:'1. 命令式省略主语',b:'用于明确指令或建议。',ex:'Prenez le métro. · N’oubliez pas de réserver.'},
  {h:'2. 否定命令',b:'ne…pas 包住命令式动词。',ex:'Ne vous inquiétez pas.'}
 ],
 [],
 [{src:'口语 Tâche 2',fr:'Pouvez-vous me conseiller ?',zh:'您能给我建议吗？',focus:'正式考试更常用礼貌问句而非直接命令'}],
 [['vous 命令式','Prenez… / Réservez…']],
 [{level:'Level 1 · 转换',q:'vous prenez → 命令式',a:'Prenez !',note:'省略 vous。'}]));

 add(18,mk('#18 L’infinitif · 不定式','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['目的','pour / afin de + inf'],['时间','avant de + inf'],['替代','plutôt que de + inf'],['否定','ne pas + inf'],['固定搭配','决定是否有 à / de']],
 [
  {h:'1. 同主语时优先用不定式',b:'pour que 往往用于主语不同；同主语可用 pour + inf。',ex:'Je travaille pour économiser.'},
  {h:'2. plutôt que de',b:'表示“与其……”，de 不能漏。',ex:'Plutôt que de rester chez soi, il vaut mieux sortir.'},
  {h:'3. avant de',b:'同主语时“在……之前”用 avant de + inf。',ex:'avant de partir'},
  {h:'4. ne pas + infinitif',b:'否定不定式整体放在动词原形前。',ex:'préférer ne pas regarder la télévision'}
 ],
 [
  {bad:'plutôt que rester',good:'plutôt que de rester',why:'固定结构 plutôt que de + infinitif。'}
 ],
 [{src:'口语 Tâche 3',fr:'Plutôt que de rester isolé, il vaut mieux participer à des activités locales.',zh:'与其保持孤立，不如参加当地活动。',focus:'plutôt que de + inf'}],
 [['pour + inf','pour progresser'],['avant de + inf','avant de partir'],['plutôt que de + inf','plutôt que de rester']],
 [{level:'Level 1 · 填空',q:'plutôt que ___ rester',a:'de',note:'固定结构。'}]));

 add(19,mk('#19 Le participe · 分词','B 高频 · 讲解深度 ③ · 第四阶段',
 [['participe passé','复合时态 / 被动'],['participe présent','-ant 形式'],['gérondif','en + participe présent'],['策略','掌握高频，不钻文学结构']],
 [
  {h:'1. participe passé 用于复合时态',b:'与 avoir / être 构成过去时，也可作形容词。',ex:'j’ai terminé · une activité organisée'},
  {h:'2. en + participe présent',b:'表示同时、方式或原因，逻辑主语通常与主句一致。',ex:'On apprend en pratiquant.'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'On peut progresser en pratiquant régulièrement.',zh:'可以通过规律练习来进步。',focus:'gérondif'}],
 [['en + -ant','en pratiquant · en utilisant']],
 [{level:'Level 1 · 转换',q:'pratiquer → gérondif',a:'en pratiquant',note:'en + participe présent。'}]));

 add(21,mk('#21 Les adverbes · 副词','B+ 高频 · 讲解深度 ③ · 第三阶段',
 [['位置','多数副词靠近所修饰动词/形容词'],['高频','souvent · seulement · également · davantage · progressivement'],['比较','plus / moins / mieux'],['论证','cependant / néanmoins 等属连接副词']],
 [
  {h:'1. seulement 位置影响焦点',b:'放在不同位置会突出不同成分。',ex:'Il travaille seulement le week-end.'},
  {h:'2. davantage 更正式且高频',b:'可替代 plus 表示“更多地”。',ex:'participer davantage à la vie locale'},
  {h:'3. progressivement 表过程',b:'适合移民、学习、适应类主题。',ex:'se familiariser progressivement avec le système'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Ils peuvent se familiariser progressivement avec les codes sociaux.',zh:'他们可以逐步熟悉社会规则。',focus:'progressivement'}],
 [['verbe + davantage','participer davantage'],['progressivement + groupe','s’intégrer progressivement']],
 [{level:'Level 1 · 语块',q:'逐步熟悉',a:'se familiariser progressivement',note:'副词位置自然。'}]));

 add(24,mk('#24 La phrase exclamative · 感叹句','D 查阅 · 讲解深度 ① · 第四阶段',
 [['用途','反应、惊讶、积极评价'],['T2实用','短反应比复杂感叹句更重要'],['推荐','C’est super ! · Quelle bonne idée !']],
 [
  {h:'TCF 里不用专门深练',b:'会几个自然感叹和反应就够了，真正得分点仍是互动和后续提问。',ex:'C’est super ! · Quelle bonne idée !'}
 ],
 [],
 [{src:'口语 Tâche 2',fr:'C’est pratique !',zh:'这很方便！',focus:'自然短反应'}],
 [['Quelle + nom !','Quelle bonne idée !']],
 [{level:'查阅',q:'多么好的主意！',a:'Quelle bonne idée !',note:'够用即可。'}]));

 add(25,mk('#25 La mise en relief · 强调结构','B 高频 · 讲解深度 ③ · 第三阶段',
 [['c’est…qui','强调主语'],['c’est…que','强调宾语/补语'],['ce qui / ce que','把整件事名词化'],['TCF用途','突出重点、避免重复']],
 [
  {h:'1. c’est…qui 强调主语',b:'qui 后面的动词跟被强调成分一致。',ex:'C’est cette expérience qui m’a beaucoup aidée.'},
  {h:'2. c’est…que 强调其他成分',b:'用于突出宾语、时间、地点等。',ex:'C’est ce point que je voudrais souligner.'},
  {h:'3. ce qui / ce que',b:'ce qui 作从句主语；ce que 作宾语。',ex:'Ce qui me plaît… · Ce que je préfère…'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Ce qui est essentiel, c’est de trouver un équilibre.',zh:'最关键的是找到平衡。',focus:'ce qui + c’est'}],
 [['Ce qui + verbe…','Ce qui me semble important…'],['Ce que + sujet + verbe…','Ce que je préfère…']],
 [{level:'Level 1 · 选择',q:'___ me plaît, c’est la flexibilité.',a:'Ce qui',note:'从句中作主语。'}]));

 add(26,mk('#26 La proposition relative · 关系从句','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['qui','作主语'],['que','作直接宾语'],['dont','代替 de + 补语'],['où','地点 / 时间'],['目标','避免简单句堆砌，提升 C1 句子连接']],
 [
  {h:'1. qui 在从句中作主语',b:'后面直接接动词。',ex:'une personne qui travaille à distance'},
  {h:'2. que 作直接宾语',b:'后面通常接主语。',ex:'une activité que je recommande'},
  {h:'3. dont 对应 de',b:'如果原动词/结构要求 de，可用 dont。',ex:'une activité dont tout le monde peut profiter'},
  {h:'4. où 表地点或时间',b:'适合 T2 地点、住宿、旅行场景。',ex:'un endroit où l’on peut se détendre'},
  {h:'5. 先看原结构再选代词',b:'不要凭中文感觉选 qui/que/dont。',ex:'profiter de cette activité → une activité dont…'}
 ],
 [
  {bad:'c’est une bonne manière dont tout le monde peut profiter（若 manner 是“方式”且逻辑不自然）',good:'c’est une bonne activité dont tout le monde peut profiter / c’est une bonne manière de…',why:'dont 必须能还原为 de + 先行词。'}
 ],
 [{src:'口语 Tâche 3',fr:'Les immigrants peuvent occuper des postes dans des secteurs qui peinent à recruter.',zh:'移民可以在难以招聘的行业任职。',focus:'qui 作主语'}],
 [['nom + qui + verbe','des secteurs qui peinent…'],['nom + que + sujet + verbe','une activité que je recommande'],['nom + dont','une ressource dont j’ai besoin']],
 [{level:'Level 1 · 选择',q:'une activité ___ tout le monde peut profiter',a:'dont',note:'profiter de。'}]));

 add(27,mk('#27 Les complétives en que · que 补语从句','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['观点','je pense que · je trouve que · il me semble que'],['必要','il faut que · il est important que'],['语气','不是看到 que 就用虚拟式'],['关键','先看主句触发条件']],
 [
  {h:'1. que 只是连接词，不自动触发虚拟式',b:'je pense que / je trouve que 通常接直陈式。',ex:'Je pense que cette solution est utile.'},
  {h:'2. 必要性/愿望常触发虚拟式',b:'il faut que, il est important que, je souhaite que。',ex:'Il faut que les autorités prennent des mesures.'},
  {h:'3. Tâche 3 开头高度依赖 que 从句',b:'观点、立场、判断通常通过 que 引出。',ex:'À mes yeux, je dirais que…'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'À mes yeux, je dirais que cette solution peut apporter plusieurs avantages.',zh:'在我看来，我会说这个方案可以带来多个优点。',focus:'观点 + que 从句'}],
 [['Je pense que + indicatif','Je pense que c’est utile.'],['Il faut que + subj.','Il faut que chacun participe.']],
 [{level:'Level 1 · 判断',q:'Je pense que → indicatif 还是 subjonctif ?',a:'indicatif',note:'肯定观点通常接直陈式。'}]));

 add(28,mk('#28 Le discours rapporté · 间接引语','C 次要 · 讲解深度 ② · 第四阶段',
 [['用途','复述别人说法或建议'],['现在复述','时态通常可保持'],['过去引语','复杂时态转换低优先'],['策略','会实用复述，不做题海']],
 [
  {h:'1. dire que / expliquer que / conseiller de',b:'先掌握最常用的复述动词。',ex:'Il m’a expliqué que… · Elle m’a conseillé de…'},
  {h:'2. TCF 不需要文学式时态倒退',b:'你的目标是自然复述，不是做复杂语法转换题。',ex:'Il m’a dit que le service était fermé.'}
 ],
 [],
 [{src:'口语 Tâche 2',fr:'Vous m’avez dit que le week-end était plus calme.',zh:'您刚才说周末更安静。',focus:'追问前复述关键词'}],
 [['dire que','Vous m’avez dit que…'],['conseiller de + inf','Il m’a conseillé de réserver.']],
 [{level:'Level 1 · 复述',q:'“Réservez à l’avance.” → Il m’a conseillé…',a:'Il m’a conseillé de réserver à l’avance.',note:'conseiller de + inf。'}]));

 add(29,mk('#29 L’expression de la cause · 原因表达','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['直接原因','parce que'],['已知/明显原因','puisque'],['正面原因','grâce à'],['负面原因','à cause de'],['正式中性','en raison de'],['缺失原因','faute de']],
 [
  {h:'1. because 从句优先用 parce que',b:'口语最稳定、最自然。',ex:'Je préfère cette solution parce qu’elle est plus flexible.'},
  {h:'2. grâce à / à cause de 后接名词',b:'正面与负面色彩不同。',ex:'grâce au soutien · à cause du manque de temps'},
  {h:'3. en raison de 更正式',b:'适合 Tâche 3 和写作。',ex:'En raison du coût élevé, certains renoncent.'},
  {h:'4. faute de 表缺少',b:'非常适合表达“因为缺乏时间/资源”。',ex:'Faute de temps, beaucoup de personnes…'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Grâce à ces activités, les nouveaux arrivants peuvent créer des liens.',zh:'得益于这些活动，新移民可以建立联系。',focus:'grâce à'}],
 [['parce que + indicatif','parce que cela facilite…'],['grâce à + nom','grâce au soutien'],['à cause de + nom','à cause du stress']],
 [{level:'Level 1 · 选择',q:'正面原因：___ soutien de la famille',a:'grâce au',note:'grâce à + le = au。'}]));

 add(30,mk('#30 L’expression de la conséquence · 结果表达','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['基础','donc'],['正式','par conséquent · ainsi'],['动词','entraîner · conduire à · provoquer'],['高频骨架','ce qui permet de · ce qui peut entraîner']],
 [
  {h:'1. donc 最稳定',b:'口语里自然清楚，不需要每次都追求复杂连接词。',ex:'Cela coûte moins cher, donc c’est plus accessible.'},
  {h:'2. ce qui + 结果',b:'把前面整件事作为主语，引出后果。',ex:'Cela réduit les coûts, ce qui permet à davantage de personnes de participer.'},
  {h:'3. entraîner / conduire à',b:'适合负面或中性后果。',ex:'entraîner des difficultés · conduire à l’isolement'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Cela peut entraîner un sentiment d’isolement.',zh:'这可能导致孤独感。',focus:'entraîner + nom'}],
 [['ce qui permet de + inf','…, ce qui permet de…'],['entraîner + nom','entraîner des difficultés'],['conduire à + nom','conduire à l’isolement']],
 [{level:'Level 1 · 语块',q:'导致孤独感',a:'entraîner un sentiment d’isolement',note:'高频结果语块。'}]));

 add(31,mk('#31 L’expression du but · 目的表达','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['同主语','pour / afin de + infinitif'],['不同主语','pour que / afin que + subjonctif'],['TCF用途','建议、措施、解决方案']],
 [
  {h:'1. 同主语 → pour + inf',b:'最简洁也最自然。',ex:'Je prends le métro pour gagner du temps.'},
  {h:'2. 不同主语 → pour que + subj.',b:'主从句主语不同时非常常用。',ex:'Il faut proposer des cours pour que les nouveaux arrivants puissent progresser.'},
  {h:'3. afin de / afin que 更正式',b:'写作和 Tâche 3 可适量使用。',ex:'afin de trouver un équilibre'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Parallèlement, il faudrait que les entreprises établissent des règles claires afin de trouver un équilibre.',zh:'与此同时，企业应制定明确规则，以找到平衡。',focus:'afin de + inf'}],
 [['pour + inf','pour améliorer la situation'],['pour que + subj.','pour que chacun puisse participer']],
 [{level:'Level 1 · 判断',q:'同一主语表达目的 → pour que 还是 pour + inf ?',a:'pour + infinitif',note:'更简洁。'}]));

 add(32,mk('#32 L’expression du temps · 时间表达','A 必须掌握 · 讲解深度 ④ · 第三阶段',
 [['持续到现在','depuis + présent'],['一段时长','pendant'],['多久以前','il y a + durée'],['多久以后','dans + durée'],['先后关系','avant de / après avoir / lorsque / quand']],
 [
  {h:'1. depuis + présent',b:'过去开始并持续到现在，法语常用现在时。',ex:'J’habite ici depuis deux ans.'},
  {h:'2. pendant 表持续时长',b:'不强调延续到现在。',ex:'J’ai travaillé là-bas pendant six mois.'},
  {h:'3. dans 表未来多久之后',b:'dans deux jours = 两天后。',ex:'Je partirai dans deux jours.'},
  {h:'4. il y a 表多久以前',b:'il y a deux ans = 两年前。',ex:'Je suis arrivé il y a deux ans.'},
  {h:'5. T2 先判断场景时间',b:'现在服务、过去经历、未来计划要对应不同问法。',ex:'Quels sont… / Qu’est-ce que tu as… / Quand allez-vous…'}
 ],
 [],
 [{src:'口语 Tâche 2',fr:'Depuis combien de temps travaillez-vous ici ?',zh:'您在这里工作多久了？',focus:'depuis + présent'}],
 [['depuis + durée','depuis deux ans'],['pendant + durée','pendant trois jours'],['dans + durée','dans une semaine']],
 [{level:'Level 1 · 选择',q:'两天后',a:'dans deux jours',note:'未来。'}]));

 add(33,mk('#33 Opposition et concession · 对立与让步','A 必须掌握 · 讲解深度 ④ · 第二阶段',
 [['转折','cependant · pourtant · néanmoins'],['对比','en revanche · à l’inverse'],['让步从句','bien que + subj.'],['让步条件','même si + indicatif'],['名词让步','malgré + nom'],['双面论证','Certes… mais…']],
 [
  {h:'1. même si + indicatif',b:'表达“即使”，通常接直陈式。',ex:'Même si cette solution est pratique, elle peut coûter cher.'},
  {h:'2. bien que + subjonctif',b:'更书面、更 C1，但要保证变位准确。',ex:'Bien qu’il soit utile, cet outil a des limites.'},
  {h:'3. malgré + nom',b:'后面直接接名词，不接普通变位从句。',ex:'Malgré les difficultés, ils continuent.'},
  {h:'4. Certes… mais…',b:'非常适合 Tâche 3 双面论证。',ex:'Certes, cette solution est pratique, mais elle présente aussi des limites.'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Cela étant dit, il faut reconnaître que cette solution présente aussi certaines limites.',zh:'话虽如此，必须承认这个方案也有一些局限。',focus:'让步转折'}],
 [['Bien que + subj.','Bien qu’il soit…'],['Même si + indicatif','Même si c’est…'],['Malgré + nom','Malgré les difficultés']],
 [{level:'Level 1 · 判断',q:'même si 后一般接什么语气？',a:'indicatif',note:'不要和 bien que 混。'}]));

 add(34,mk('#34 Condition et hypothèse · 条件与假设','A 必须掌握 · 讲解深度 ④ · 第三阶段',
 [['现实可能','si + présent → présent/futur/impératif'],['假设','si + imparfait → conditionnel présent'],['过去未实现','si + plus-que-parfait → conditionnel passé'],['其他条件','à condition que + subj.'],['简化','à condition de + inf']],
 [
  {h:'1. 现实可能',b:'si + présent，主句可用 futur。',ex:'Si j’ai le temps, je viendrai.'},
  {h:'2. 现在/未来假设',b:'si + imparfait → conditionnel présent。',ex:'Si c’était moins cher, davantage de personnes pourraient participer.'},
  {h:'3. si 后不用 conditionnel',b:'这是最重要的限制之一。',ex:'Si j’avais…（不是 si j’aurais）'},
  {h:'4. à condition que + subj.',b:'表达明确条件。',ex:'à condition que la durée reste raisonnable'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Si les employés dormaient trop longtemps, cela pourrait perturber l’organisation de l’entreprise.',zh:'如果员工睡太久，这可能扰乱企业组织。',focus:'si + imparfait → conditionnel'}],
 [['Si + présent','Si j’ai le temps…'],['Si + imparfait','Si c’était… cela pourrait…'],['À condition que + subj.','À condition que…']],
 [{level:'Level 1 · 纠错',q:'Si j’aurais le temps…',a:'Si j’avais le temps…',note:'si 后不用 conditionnel。'}]));

 add(35,mk('#35 L’expression de la comparaison · 比较表达','B+ 高频 · 讲解深度 ③ · 第三阶段',
 [['形容词','plus / moins / aussi + adj + que'],['数量','plus / moins / autant de + nom'],['动词','verbe + plus / moins / autant que'],['最高级','le/la/les plus / moins'],['不规则','meilleur / mieux']],
 [
  {h:'1. 形容词比较',b:'plus / moins / aussi + adjectif + que。',ex:'plus pratique que · aussi efficace que'},
  {h:'2. 数量比较',b:'plus / moins / autant de + nom。',ex:'plus de possibilités · moins de temps'},
  {h:'3. meilleur vs mieux',b:'meilleur 修饰名词；mieux 修饰动词。',ex:'une meilleure solution · mieux comprendre'}
 ],
 [],
 [{src:'口语 Tâche 3',fr:'Cette solution est plus flexible et peut être moins coûteuse.',zh:'这个方案更灵活，也可能成本更低。',focus:'plus / moins + adjectif'}],
 [['plus + adj + que','plus pratique que'],['plus de + nom','plus de possibilités'],['mieux + verbe','mieux comprendre']],
 [{level:'Level 1 · 选择',q:'更好的解决方案',a:'une meilleure solution',note:'meilleur 修饰名词。'}]));

 setTimeout(()=>C.injectMap(),0);
})();
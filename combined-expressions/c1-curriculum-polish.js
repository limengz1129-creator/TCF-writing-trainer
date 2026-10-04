'use strict';
(()=>{
 const C=window.C1_COURSE;if(!C)return;
 const L=C.LESSONS, COURSE=C.COURSE;
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

 enrich(1,{
  quick:[
   ['高频名词块','la qualité de vie · le marché du travail · la vie quotidienne · le sentiment d’isolement'],
   ['学习单位','名词最好连冠词和常见搭配一起记']
  ],
  lessons:[
   {h:'4. 名词要连常见介词一起记',b:'TCF 里很多名词并不是孤立出现，而是固定搭配的一部分。',ex:'le marché du travail · le sentiment d’isolement · la qualité de vie'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cette situation peut provoquer un sentiment d’isolement.',zh:'这种情况可能造成孤独感。',focus:'sentiment 阳性 + de'},
   {src:'口语 Tâche 3',fr:'Cela peut améliorer la qualité de vie.',zh:'这可以改善生活质量。',focus:'qualité 阴性 + de vie'}
  ],
  practice:[
   {level:'Level 2 · 语块',q:'生活质量',a:'la qualité de vie',note:'不要只记 qualité。'},
   {level:'Level 2 · 语块',q:'孤独感',a:'un sentiment d’isolement',note:'高频 Tâche 3 名词块。'}
  ]
 });

 enrich(4,{
  lessons:[
   {h:'3. 指示代词适合做比较',b:'celui/celle/ceux/celles 可以避免重复名词，特别适合比较两个方案。',ex:'Cette solution est plus pratique que celle proposée auparavant.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cette approche me semble plus équilibrée que celle qui consiste à tout interdire.',zh:'这种方法比完全禁止的做法更均衡。',focus:'celle qui 避免重复'}
  ],
  practice:[
   {level:'Level 2 · 替换',q:'Cette solution est meilleure que la solution proposée hier.',a:'Cette solution est meilleure que celle proposée hier.',note:'用 celle 避免重复。'}
  ]
 });

 enrich(5,{
  lessons:[
   {h:'3. son/sa/ses 看“被拥有物”',b:'这是中文母语者容易受“他/她”影响的点。必须先看后面的名词。',ex:'son expérience? ✗ → son expérience 其实 expérience 阴性但元音前仍用 son'},
   {h:'4. 元音前阴性名词用 mon/ton/son',b:'这是为了发音顺畅，不代表名词变成阳性。',ex:'mon amie · son expérience'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Comment s’est passée votre expérience ?',zh:'您的经历怎么样？',focus:'votre + expérience'},
   {src:'口语 Tâche 3',fr:'Chaque personne doit trouver son propre équilibre.',zh:'每个人都必须找到自己的平衡。',focus:'son propre équilibre'}
  ],
  practice:[
   {level:'Level 1 · 选择',q:'___ expérience（她的）',a:'son expérience',note:'expérience 阴性，但元音前用 son。'}
  ]
 });

 enrich(6,{
  lessons:[
   {h:'5. tout 的四种形式要看名词',b:'tout / toute / tous / toutes 是高频，但不要把 tous/tout 发音与书写混淆。',ex:'tous les jours · toutes les personnes · toute la journée'},
   {h:'6. certains 可用于有限泛指',b:'比 beaucoup de 更适合表达“某些人/一些情况”，但不要每段都用。',ex:'Certaines personnes préfèrent travailler à distance.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Certaines personnes préfèrent travailler à distance afin de gagner du temps.',zh:'有些人更喜欢远程工作以节省时间。',focus:'certaines + 阴性复数'},
   {src:'口语 Tâche 3',fr:'Tous les participants n’ont pas les mêmes besoins.',zh:'并非所有参与者都有相同需求。',focus:'tous les + nom'}
  ],
  practice:[
   {level:'Level 2 · 配合',q:'___ les personnes',a:'toutes les personnes',note:'personnes 阴性复数。'}
  ]
 });

 enrich(9,{
  lessons:[
   {h:'4. venir de + infinitif = 刚刚',b:'适合 Tâche 2 追问刚发生的经历。',ex:'Vous venez de rentrer de voyage ?'},
   {h:'5. être en train de 不要滥用',b:'只有真正强调“正在进行中”时才需要；普通现在时更自然。',ex:'Je suis en train de préparer mon voyage.'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Vous venez de rentrer de voyage ?',zh:'您刚旅行回来吗？',focus:'venir de + infinitif'}
  ],
  practice:[
   {level:'Level 2 · 转换',q:'“我刚到。”',a:'Je viens d’arriver.',note:'venir de + infinitif。'}
  ]
 });

 enrich(11,{
  lessons:[
   {h:'3. 被动句不一定比主动句更高级',b:'如果主动句更直接，就优先主动句。被动最适合不知道/不强调执行者时。',ex:'Les activités sont organisées chaque week-end.'},
   {h:'4. Tâche 2 高频 participes 要当词块记',b:'inclus, compris, autorisé, proposé, organisé 等常直接出现在问句里。',ex:'Le matériel est-il fourni ? · Les repas sont-ils compris ?'}
  ],
  corpus:[
   {src:'口语 Tâche 2',fr:'Le matériel est-il fourni sur place ?',zh:'设备会在现场提供吗？',focus:'être fourni'},
   {src:'口语 Tâche 2',fr:'Les repas sont-ils compris dans le prix ?',zh:'餐食包含在价格里吗？',focus:'être compris'}
  ],
  practice:[
   {level:'Level 2 · 问句',q:'设备包含在价格里吗？',a:'Le matériel est-il compris dans le prix ?',note:'被动 + 倒装。'}
  ]
 });

 enrich(19,{
  lessons:[
   {h:'3. gérondif 最适合表达“通过……来……”',b:'在 Tâche 3 里可用于方法和手段，但不要每句都用。',ex:'On peut améliorer son niveau en pratiquant régulièrement.'},
   {h:'4. gérondif 逻辑主语通常和主句一致',b:'如果两个动作不是同一主语，最好改用从句。',ex:'En travaillant régulièrement, on progresse plus vite.'}
  ],
  errors:[
   {bad:'En les parents travaillant…',good:'Quand les parents travaillent… / En travaillant…, les parents…',why:'gérondif 的逻辑主语通常与主句主语一致。'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'En participant à des activités locales, les nouveaux arrivants peuvent créer des liens plus facilement.',zh:'通过参加当地活动，新移民可以更容易建立联系。',focus:'en + participe présent'}
  ],
  practice:[
   {level:'Level 3 · 转换',q:'“通过参加当地活动，新移民可以建立联系。”',a:'En participant à des activités locales, les nouveaux arrivants peuvent créer des liens.',note:'同一逻辑主语。'}
  ]
 });

 enrich(21,{
  lessons:[
   {h:'4. 副词别放到句子里“哪里都行”',b:'某些副词位置变化会改变焦点或听起来不自然，建议把高频搭配整体记。',ex:'participer davantage · mieux comprendre · travailler efficacement'},
   {h:'5. également / aussi 的位置不同',b:'également 通常更正式；aussi 在口语里更灵活。',ex:'Cela peut également réduire les coûts. · Cela peut aussi réduire les coûts.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cette solution peut également réduire les coûts.',zh:'这种方案还可以降低成本。',focus:'également 位于情态动词后 / 不定式前的语流'},
   {src:'口语 Tâche 3',fr:'Les nouveaux arrivants peuvent mieux comprendre les codes sociaux.',zh:'新移民可以更好地理解社会规范。',focus:'mieux + infinitif'}
  ],
  practice:[
   {level:'Level 2 · 语序',q:'peuvent / mieux / comprendre',a:'peuvent mieux comprendre',note:'mieux 放在不定式前。'}
  ]
 });

 enrich(25,{
  lessons:[
   {h:'4. ce qui / ce que 很适合口语衔接',b:'它们可以把前面观点变成后句成分，减少短句堆砌。',ex:'Ce qui me semble important, c’est de rester flexible.'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Ce qui me semble important, c’est de maintenir un équilibre.',zh:'我认为重要的是保持平衡。',focus:'ce qui + c’est'},
   {src:'口语 Tâche 2',fr:'Ce que j’aimerais surtout savoir, c’est le prix total.',zh:'我最想知道的是总价。',focus:'ce que 作宾语'}
  ],
  practice:[
   {level:'Level 2 · 选择',q:'___ j’aimerais savoir, c’est le prix.',a:'Ce que',note:'在从句中作 savoir 的宾语。'}
  ]
 });

 enrich(35,{
  lessons:[
   {h:'4. autant de + nom 是数量“同样多”',b:'不要说 aussi de。',ex:'autant de possibilités que…'},
   {h:'5. aussi + adjectif，autant + 动词',b:'两套结构不要混。',ex:'aussi pratique que · travailler autant que'}
  ],
  corpus:[
   {src:'口语 Tâche 3',fr:'Cette solution offre autant de flexibilité que l’autre, mais elle coûte moins cher.',zh:'这个方案和另一个一样灵活，但更便宜。',focus:'autant de + nom que'}
  ],
  practice:[
   {level:'Level 2 · 选择',q:'和另一个方案一样灵活',a:'aussi flexible que l’autre solution',note:'形容词用 aussi。'},
   {level:'Level 2 · 选择',q:'同样多的机会',a:'autant de possibilités',note:'数量用 autant de。'}
  ]
 });

 const P='tcf-c1-course-progress-v1';
 const progress=()=>{try{return JSON.parse(localStorage.getItem(P)||'{}')}catch{return{}}};
 const stageModules=s=>COURSE.filter(x=>x.stage===s).map(x=>x.n);
 const masteredModule=(n,p)=>{
   const keys=['understand','recognize','write','oral'];
   return keys.every(k=>!!p[n+'-'+k]);
 };
 function continueStage(stage){
   const p=progress(), nums=stageModules(stage);
   const next=nums.find(n=>L[n]&&!masteredModule(n,p)) || nums.find(n=>L[n]);
   if(next)C.openLesson(next);
 }
 function stageProgress(stage){
   const p=progress(), nums=stageModules(stage).filter(n=>L[n]);
   const done=nums.filter(n=>masteredModule(n,p)).length;
   return {done,total:nums.length};
 }
 function enhanceStageControls(){
   const map=document.getElementById('c1CourseMap');if(!map)return;
   const details=[...map.querySelectorAll('.c1-stage')];
   details.forEach((d,i)=>{
     const stage=i+1;if(d.querySelector('.c1-stage-actions'))return;
     const area=document.createElement('div');area.className='c1-stage-actions';
     const prog=document.createElement('span');prog.className='c1-stage-progress';
     const paint=()=>{const x=stageProgress(stage);prog.textContent='已完整掌握 '+x.done+' / '+x.total+' 个模块';};
     const start=document.createElement('button');start.type='button';start.className='primary';start.textContent='▶ 开始 / 继续本阶段';
     start.onclick=e=>{e.preventDefault();e.stopPropagation();continueStage(stage);};
     const review=document.createElement('button');review.type='button';review.textContent='随机打开一个模块';
     review.onclick=e=>{e.preventDefault();e.stopPropagation();const nums=stageModules(stage).filter(n=>L[n]);if(nums.length)C.openLesson(nums[Math.floor(Math.random()*nums.length)]);};
     area.append(start,review,prog);d.append(area);paint();
     d.addEventListener('toggle',paint);
   });
 }
 const originalInject=C.injectMap;
 C.injectMap=function(){originalInject();setTimeout(enhanceStageControls,0);};
 const root=document.getElementById('c1View');
 if(root)new MutationObserver(()=>setTimeout(enhanceStageControls,0)).observe(root,{childList:true,subtree:true});
 setTimeout(()=>{C.injectMap();enhanceStageControls();},0);
})();
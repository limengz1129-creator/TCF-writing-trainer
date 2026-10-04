'use strict';
(()=>{
 const C=window.C1_COURSE;if(!C)return;
 const TOPICS=[
  {
   id:'participe',title:'A. 过去分词特殊配合',level:'写作重点 · 口语认识',
   why:'写作 C1 中容易在关系从句、代词式动词和复合时态里暴露准确度问题。',
   rules:[
    ['être + participe passé','过去分词通常与主语配合：Elle est partie. / Elles sont arrivées.'],
    ['avoir + COD placé avant','COD 在过去分词前时，常需配合：Les décisions qu’elle a prises.'],
    ['代词式动词','先判断 se 的句法功能；高频只需掌握常见情况，不做冷门陷阱。']
   ],
   examples:[
    ['Les décisions qu’elle a prises ont été efficaces.','她所作出的决定是有效的。'],
    ['Elles se sont adaptées rapidement à leur nouvel environnement.','她们很快适应了新环境。']
   ],
   practice:[
    ['Les mesures qu’ils ont ___ (prendre).','prises'],
    ['Elles sont ___ (arriver) hier.','arrivées']
   ]
  },
  {
   id:'relatifs-composes',title:'B. 复合关系代词',level:'写作认识 + 少量主动使用',
   why:'主模块 #26 的 qui / que / dont / où 已够大多数口语；这一组用于更正式、更复杂的书面表达。',
   rules:[
    ['lequel / laquelle / lesquels / lesquelles','常接在介词后，代替明确名词。'],
    ['auquel / auxquels / auxquelles','= à + lequel 系列。'],
    ['duquel / desquels / desquelles','= de + lequel 系列，常见于介词短语之后。'],
    ['ce dont / ce à quoi','没有具体先行词时，分别对应 de + chose / à + chose。']
   ],
   examples:[
    ['C’est une question à laquelle il faut réfléchir sérieusement.','这是一个需要认真思考的问题。'],
    ['Ce à quoi je tiens le plus, c’est l’équilibre entre le travail et la vie privée.','我最重视的是工作与生活之间的平衡。']
   ],
   practice:[
    ['C’est un problème ___ il faut faire face.','auquel'],
    ['Voilà ce ___ j’ai besoin pour progresser.','dont']
   ]
  },
  {
   id:'faire-laisser',title:'C. faire / laisser + infinitif',level:'口语 + 写作高频补充',
   why:'自然法语里很常见，可以让表达更紧凑；尤其适合“让/使某人做某事”。',
   rules:[
    ['faire + infinitif','强调“使 / 让某事发生”：faire réfléchir, faire réparer, faire comprendre。'],
    ['laisser + infinitif','强调“允许 / 任由”：laisser choisir, laisser parler。'],
    ['faire + COD + infinitif','注意宾语位置和代词顺序，先掌握简单高频结构。']
   ],
   examples:[
    ['Cette expérience peut faire réfléchir les jeunes sur leur avenir.','这种经历可以让年轻人思考自己的未来。'],
    ['Il faut laisser les enfants faire leurs propres choix.','应该让孩子做出自己的选择。']
   ],
   practice:[
    ['这会让人们思考这个问题。','Cela fera réfléchir les gens à cette question.'],
    ['应该让年轻人自己选择。','Il faut laisser les jeunes choisir eux-mêmes.']
   ]
  },
  {
   id:'de-structures',title:'D. 高频特殊 de 结构',level:'口语 + 写作必会补充',
   why:'这些结构本身不值得开新主模块，但在 C1 输出里非常常见，而且能减少冠词错误。',
   rules:[
    ['de nombreux / nombreuses + nom','比 beaucoup de 更书面：de nombreux avantages。'],
    ['la plupart des + nom','la plupart des personnes / des étudiants。'],
    ['un certain nombre de + nom','表示“一定数量的……”。'],
    ['l’un / l’une des + superlatif + nom','l’un des principaux avantages。'],
    ['de + adjectif + nom pluriel','des solutions → de nouvelles solutions（形容词前置时）。']
   ],
   examples:[
    ['Cette mesure présente de nombreux avantages.','这项措施有很多优点。'],
    ['C’est l’un des principaux défis auxquels les nouveaux arrivants doivent faire face.','这是新移民必须面对的主要挑战之一。']
   ],
   practice:[
    ['很多新的机会','de nombreuses nouvelles possibilités'],
    ['主要优点之一','l’un des principaux avantages']
   ]
  },
  {
   id:'concordance',title:'E. 时态一致 / futur dans le passé',level:'写作重点 · 口语会用即可',
   why:'不是为了做传统“时态一致题”，而是保证过去视角下的复述和预测自然。',
   rules:[
    ['过去视角下的未来','Il a dit qu’il viendrait.'],
    ['过去判断 + conditionnel','Je pensais que ce serait plus simple.'],
    ['复述不机械倒退','如果事实仍然有效，现代法语里时态不一定机械后移；TCF 优先自然和清晰。']
   ],
   examples:[
    ['Je pensais que cette solution serait plus efficace.','我原以为这个方案会更有效。'],
    ['Il m’a expliqué qu’il viendrait le lendemain.','他向我解释说他第二天会来。']
   ],
   practice:[
    ['Je pensais que ce ___ plus simple. (être)','serait'],
    ['Il a dit : “Je viendrai.” → discours rapporté','Il a dit qu’il viendrait.']
   ]
  },
  {
   id:'nominalisation',title:'F. 名词化 nominalisation',level:'写作 C1 高收益',
   why:'这不是单纯“语法规则”，但能显著提升写作密度和书面感，也是从口语素材迁移到写作的高收益手段。',
   rules:[
    ['动词 → 名词','améliorer → l’amélioration；réduire → la réduction；intégrer → l’intégration。'],
    ['避免动词链过长','Cela permet de mieux intégrer… → Cela favorise l’intégration…'],
    ['不要为了高级而名词化','口语中过度名词化会显得僵硬；写作适量使用。']
   ],
   examples:[
    ['Cette mesure favorise l’intégration des nouveaux arrivants.','这项措施有利于新移民的融入。'],
    ['La réduction du temps de travail peut améliorer la qualité de vie.','减少工作时间可以改善生活质量。']
   ],
   practice:[
    ['améliorer →','l’amélioration'],
    ['développer →','le développement'],
    ['“促进新移民融入” 用名词化表达','favoriser l’intégration des nouveaux arrivants']
   ]
  },
  {
   id:'compression',title:'G. 书面语衔接与句法压缩',level:'写作 C1 加分项',
   why:'把已经会的简单结构压缩成更紧凑、更成熟的书面表达，比继续学冷门语法更值得。',
   rules:[
    ['tout en + gérondif','“同时又……”：tout en restant prudent。'],
    ['sans pour autant + infinitif','“但并不因此……”：sans pour autant supprimer…'],
    ['d’où + nom','用一个名词概括前文结果：d’où l’importance de…'],
    ['dans la mesure où','表示“在……程度/因为……的情况下”，书面感较强。'],
    ['à cet égard','用于承接前文观点，“在这方面”。']
   ],
   examples:[
    ['Il est possible de profiter des avantages du télétravail tout en maintenant des contacts réguliers avec ses collègues.','可以享受远程工作的优点，同时保持与同事的定期联系。'],
    ['Cette solution est utile sans pour autant résoudre tous les problèmes.','这个方案有用，但并不因此解决所有问题。'],
    ['Les besoins varient selon les individus, d’où l’importance de proposer des solutions flexibles.','个人需求各不相同，因此提供灵活方案非常重要。']
   ],
   practice:[
    ['“同时保持平衡”','tout en maintenant un équilibre'],
    ['“但并不因此完全禁止”','sans pour autant tout interdire'],
    ['“因此有必要……”','d’où la nécessité de…']
   ]
  }
 ];
 const $=id=>document.getElementById(id);
 const E=(tag,cls='',txt='')=>{const x=document.createElement(tag);x.className=cls;x.textContent=txt;return x;};
 function speak(fr){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(fr);u.lang='fr-FR';u.rate=.92;window.speechSynthesis.speak(u);}
 function audio(fr){const b=E('button','c1-audio-mini','🔊 法语朗读');b.type='button';b.onclick=()=>speak(fr);return b;}
 function openAppendix(){
  let d=$('c1AppendixDialog');
  if(!d){d=document.createElement('dialog');d.id='c1AppendixDialog';d.className='c1-course-dialog c1-appendix-dialog';document.body.append(d);d.addEventListener('click',e=>{if(e.target===d)d.close();});}
  d.replaceChildren();
  const head=E('header','c1-course-dialog-head');const left=E('div');left.append(E('div','eyebrow','TCF Canada · C1 语法专项训练'),E('h2','','C1 语法补充附录'),E('p','c1-course-meta','35 个主模块之外 · 只补高收益遗漏 · 不计入主课程模块数'));const close=E('button','','✕ 关闭');close.type='button';close.onclick=()=>d.close();head.append(left,close);d.append(head);
  const intro=E('section','c1-lesson-section');intro.append(E('h3','','怎么用这个附录'),E('p','note','先学完主课程的第一、第二阶段，再按需要看这里。这里不是新的“第 36 模块”，也不建议从头到尾死磕；写作优先 F / G / A / E，口语优先 C / D。'));d.append(intro);
  for(const t of TOPICS){
    const sec=E('section','c1-lesson-section c1-appendix-topic');sec.id='appendix-'+t.id;
    sec.append(E('h3','',t.title),E('span','c1-source-tag',t.level),E('p','',t.why));
    const rules=E('table','c1-course-table');for(const [a,b] of t.rules){const tr=E('tr');tr.append(E('th','',a),E('td','',b));rules.append(tr);}sec.append(rules);
    const examples=E('div','c1-appendix-examples');for(const [fr,zh] of t.examples){const card=E('article','c1-corpus-card');card.append(E('p','c1-fr',fr),E('p','',zh),audio(fr));examples.append(card);}sec.append(examples);
    const ptitle=E('h4','','快速练习');sec.append(ptitle);
    for(const [q,a] of t.practice){const card=E('article','c1-practice-card');card.append(E('p','c1-practice-q',q));const ans=E('div','c1-practice-answer hidden');ans.append(E('strong','',a),audio(a));const b=E('button','','显示答案');b.type='button';b.onclick=()=>{ans.classList.toggle('hidden');b.textContent=ans.classList.contains('hidden')?'显示答案':'隐藏答案';};card.append(b,ans);sec.append(card);}
    d.append(sec);
  }
  d.showModal();
 }
 function inject(){
  const map=$('c1CourseMap');if(!map||map.querySelector('#c1AppendixEntry'))return;
  const box=E('section','c1-appendix-entry');box.id='c1AppendixEntry';
  const text=E('div');text.append(E('div','eyebrow','35 个主模块之外'),E('h3','','C1 语法补充附录'),E('p','note','7 个高收益补充：过去分词特殊配合、复合关系代词、faire/laisser + infinitif、特殊 de 结构、时态一致、名词化、书面语句法压缩。'));
  const b=E('button','primary','打开补充附录 →');b.type='button';b.onclick=openAppendix;box.append(text,b);map.append(box);
 }
 const root=$('c1View');if(root)new MutationObserver(()=>setTimeout(inject,0)).observe(root,{childList:true,subtree:true});
 document.querySelector('[data-module="9"]')?.addEventListener('click',()=>setTimeout(inject,0));
 setTimeout(inject,0);
 window.C1_APPENDIX={TOPICS,openAppendix,inject};
})();
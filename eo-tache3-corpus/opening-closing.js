'use strict';
(() => {
  const OPENING=[
    {title:'普通观点 / 同意不同意型',count:94,recognize:'Qu’en pensez-vous ? / Êtes-vous d’accord ? / Partagez-vous cet avis ?',logic:'改写题目 → 明确总体立场 → 必要时加一个轻微限制',skeleton:'De nos jours, la question de savoir si … suscite beaucoup de débats. → À mes yeux, je dirais que …',chunks:['la question de savoir si…','suscite beaucoup de débats','À mes yeux, je dirais que…','dans l’ensemble…'],samples:[['旅行与移民',1],['职业与职场',1],['科技与网络',2]]},
    {title:'绝对化 / 必要性 / 边界型',count:46,recognize:'toujours / jamais / indispensable / suffisant / impossible / il faut / le plus important',logic:'承认合理部分 → 拒绝绝对化 → 补充条件或其他因素',skeleton:'X joue effectivement un rôle important → Toutefois, il serait exagéré d’affirmer que X suffit à lui seul → d’autres facteurs doivent également être pris en compte.',chunks:['ne suffit pas à lui seul','il serait exagéré d’affirmer que…','cela ne signifie pas pour autant que…','d’autres facteurs jouent également un rôle essentiel'],samples:[['旅行与移民',5],['饮食与健康',9],['社会与公共事务',9]]},
    {title:'比较 / 选择 / 权衡型',count:8,recognize:'A ou B / vaut-il mieux / plus… que / plutôt que',logic:'A 的优势 → B 的优势 → 不做绝对化选择 / 说明取决条件',skeleton:'Les deux possibilités présentent des avantages et des inconvénients. → Le choix dépend surtout de…',chunks:['les deux possibilités présentent…','à l’inverse…','tandis que…','le choix dépend surtout de…'],samples:[['旅行与移民',18],['职业与职场',12],['环境与城市',3]]},
    {title:'原因 / 动机 / 解释型',count:6,recognize:'Pourquoi… ? / Pour quelles raisons… ? / Comment expliquez-vous cela ?',logic:'直接说明有多个原因 → 提前报出 2–3 个主要原因',skeleton:'Plusieurs raisons peuvent expliquer ce phénomène, notamment A, B et C.',chunks:['plusieurs raisons peuvent expliquer…','peut être motivé par…','notamment…','plusieurs facteurs entrent en jeu'],samples:[['旅行与移民',27],['职业与职场',24],['环境与城市',9]]},
    {title:'个人 / 偏好 / 具体回答型',count:7,recognize:'votre pays / votre matière préférée / quel travail / lequel préférez-vous',logic:'直接回答自己的选择 → 给出 2–3 个理由，不必硬套“社会争议”',skeleton:'À titre personnel, je préfère / je choisirais …, principalement parce que A et B.',chunks:['à titre personnel…','je préfère…','mon choix se porte sur…','principalement parce que…'],samples:[['旅行与移民',25],['职业与职场',25],['教育与儿童',2]]},
    {title:'列举 / 多因素型',count:5,recognize:'trois principales choses / quels impacts / quels risques / quelles formes',logic:'直接报数量或维度 → A / B / C',skeleton:'À mes yeux, il faut surtout prendre en compte trois éléments : A, B et C.',chunks:['trois éléments principaux','plusieurs facteurs doivent être pris en compte','on peut distinguer…','notamment A, B et C'],samples:[['旅行与移民',17],['科技与网络',15],['社会与公共事务',1]]},
    {title:'方法 / 解决方案型',count:3,recognize:'Comment… ? / De quelle manière… ?',logic:'提出目标 → 概括几种可行做法 → 正文逐项展开',skeleton:'À mes yeux, plusieurs démarches peuvent faciliter / permettre de…',chunks:['plusieurs démarches peuvent faciliter…','il existe plusieurs moyens de…','une première solution consiste à…','une autre possibilité serait de…'],samples:[['旅行与移民',12],['职业与职场',13],['媒体与文化',9]]}
  ];
  const CLOSING=[
    {title:'直接总结立场型',count:9,logic:'一句重申最终判断，适合答案本身已经非常明确的题。',skeleton:'Pour conclure, il me semble que …',chunks:['Pour conclure, il me semble que…','En définitive…','Dans l’ensemble…']},
    {title:'重申立场 + 让步 / 边界型',count:84,logic:'重申主要立场 → 用 Toutefois / Cependant 限制绝对化 → 保留 nuance。',skeleton:'Pour conclure, il me semble que X. Toutefois, …',chunks:['Toutefois…','Cependant…','ne suffit pas à lui seul','il serait exagéré d’affirmer que…']},
    {title:'平衡 / 双边收束型',count:70,logic:'A 与 B 都保留 → 找平衡 → 常接 tout en / entre… et…',skeleton:'L’essentiel est de trouver un équilibre entre A et B.',chunks:['trouver un équilibre entre… et…','tout en…','à la fois… et…','sans pour autant…']},
    {title:'因人而异 / 条件取决型',count:6,logic:'拒绝唯一答案 → 说明选择取决于个人情况、需求、目标或资源。',skeleton:'Il n’existe pas une seule solution idéale. Le choix dépend de la situation, des besoins et des priorités de chacun.',chunks:['le choix dépend de…','en fonction de…','selon les besoins de chacun','il n’existe pas une seule solution idéale']}
  ];
  const TRIGGERS=[
    ['il faudrait que',112],['il serait souhaitable que',5],['il est souhaitable que',5],['il faut que',4]
  ];
  const VIRTUAL={
    '旅行与移民':{count:22,subjects:['les nouveaux arrivants','les autorités','chacun','les personnes vivant à l’étranger'],actions:['participent davantage à la vie locale','s’impliquent davantage dans la vie locale','fassent l’effort de se familiariser avec…','mettent en place des politiques adaptées','proposent davantage de programmes…','développent un réseau social plus diversifié'],examples:[
      'il faudrait que les nouveaux arrivants participent davantage à la vie locale afin de développer un véritable sentiment d’appartenance à la société d’accueil.',
      'il faudrait que les autorités mettent en place des politiques d’intégration adaptées et anticipent les besoins en matière d’infrastructures.',
      'il faudrait que les nouveaux arrivants fassent l’effort de se familiariser avec la langue, les codes culturels et le fonctionnement de la société d’accueil.'
    ]},
    '职业与职场':{count:23,subjects:['nous','les entreprises','les étudiants','chacun'],actions:['tenions compte de…','reconnaissions davantage…','apprenions à établir des limites…','respections les choix de chacun','trouvent un équilibre…','établissent des règles claires…'],examples:[
      'il faudrait que nous tenions également compte de la rémunération et de la sécurité financière afin de trouver un équilibre entre l’épanouissement professionnel et les besoins de la vie quotidienne.',
      'il faudrait que les entreprises établissent des règles claires afin de trouver un équilibre entre le bien-être des employés et leur productivité.',
      'il faudrait que chacun trouve un équilibre entre sa vie professionnelle et sa vie personnelle.'
    ]},
    '教育与儿童':{count:22,subjects:['les établissements scolaires','les parents et les enseignants','les élèves','les recruteurs','les jeunes'],actions:['trouvent un équilibre…','encadrent et guident…','apprennent à utiliser…','mettent en place des règles claires','tiennent compte de…','choisissent leur parcours…'],examples:[
      'il faudrait que les établissements scolaires trouvent un équilibre entre les différentes matières afin de permettre aux enfants de développer des compétences variées.',
      'il faudrait que les parents et les enseignants les encadrent et les guident afin qu’ils puissent profiter pleinement des ressources éducatives disponibles en ligne.',
      'il faudrait que les élèves apprennent à utiliser Internet de manière raisonnable et responsable, tout en développant leur esprit critique et leur autodiscipline.'
    ]},
    '媒体与文化':{count:9,subjects:['chacun','les médias','les pouvoirs publics','les célébrités'],actions:['prenne l’habitude de vérifier…','développe son esprit critique','vérifie la fiabilité…','sélectionnent les images…','mettent en place des financements…','prennent le temps de se former…'],examples:[
      'il faudrait que chacun développe son esprit critique et prenne l’habitude de vérifier les sources afin de profiter pleinement des avantages d’Internet sans être induit en erreur.',
      'il faudrait que les médias sélectionnent les images avec davantage de discernement afin de trouver un équilibre entre le droit à l’information et la protection du public.',
      'il faudrait que les pouvoirs publics mettent en place des financements adaptés afin de démocratiser l’accès à la culture.'
    ]},
    '科技与网络':{count:5,subjects:['chacun','les internautes','les investissements dans ce domaine'],actions:['apprenne à utiliser Internet de manière responsable','apprenne à utiliser ces outils avec discernement','apprennent à utiliser ces plateformes avec discernement','restent raisonnables','fasse un usage raisonnable de…'],examples:[
      'il faudrait que chacun apprenne à utiliser Internet de manière responsable afin de profiter de ses avantages tout en limitant ses effets négatifs.',
      'il faudrait que chacun apprenne à utiliser ces outils avec discernement afin de profiter de leur efficacité sans y consacrer inutilement trop de temps.',
      'il faudrait que les internautes apprennent à utiliser ces plateformes avec discernement afin de profiter de leurs avantages tout en évitant certains risques.'
    ]},
    '饮食与健康':{count:13,subjects:['chacun','les autorités','les patients'],actions:['sache adapter son alimentation…','sache respecter les choix…','sache trouver un équilibre…','trouvent un équilibre…','sachent choisir…','n’ait recours aux médicaments que…'],examples:[
      'il faudrait que chacun sache adapter son alimentation à ses besoins et éviter les excès afin de préserver sa santé sur le long terme.',
      'il faudrait que chacun sache trouver un équilibre entre une alimentation adaptée, de bonnes habitudes de vie et suffisamment d’exercice.',
      'il faudrait que les autorités trouvent un équilibre entre la protection de la santé publique, l’égalité d’accès aux soins et le financement des autres services essentiels.'
    ]},
    '环境与城市':{count:10,subjects:['les villes','les autorités','les citoyens et les pouvoirs publics','les consommateurs'],actions:['continuent à développer…','améliorent le réseau…','mettent en place des mesures…','investissent dans…','soient davantage sensibilisés…','sachent trouver un équilibre…'],examples:[
      'il faudrait que les villes continuent à développer des solutions de transport accessibles afin que davantage de personnes puissent se déplacer facilement sans dépendre de leur voiture.',
      'il est souhaitable que les consommateurs soient davantage sensibilisés à l’impact environnemental de leurs choix alimentaires.',
      'il faudrait que les autorités continuent à investir dans la recherche et les infrastructures afin de rendre progressivement les énergies renouvelables plus accessibles et plus efficaces.'
    ]},
    '社会与公共事务':{count:13,subjects:['les autorités','les pouvoirs publics','les gouvernements et les organisations internationales','les citoyens','les différentes générations'],actions:['renforcent leur coopération','soutiennent davantage les associations','mettent en place des dispositifs…','garantissent…','encouragent la participation…','sachent mieux communiquer…'],examples:[
      'il faudrait que les gouvernements et les organisations internationales renforcent leur coopération afin que l’aide puisse parvenir rapidement aux populations qui en ont le plus besoin.',
      'il faudrait que les pouvoirs publics soutiennent davantage les associations et encouragent la participation citoyenne.',
      'il faudrait que les autorités garantissent une utilisation transparente des images afin de protéger à la fois la sécurité publique et la vie privée des citoyens.'
    ]},
    '家庭与人际':{count:9,subjects:['chacun','les jeunes adultes','les parents'],actions:['sache maintenir des liens sociaux…','sache entretenir…','sache accepter les différences…','puisse choisir librement…','sache respecter le choix des autres','sachent encourager chacun de leurs enfants…'],examples:[
      'il faudrait que chacun sache maintenir des liens sociaux réguliers tout en développant progressivement son autonomie.',
      'il faudrait que chacun sache accepter les différences de l’autre, faire des compromis et maintenir une communication sincère.',
      'il faudrait que les parents sachent encourager chacun de leurs enfants selon ses propres qualités afin de favoriser une relation fraternelle plus équilibrée et plus harmonieuse.'
    ]}
  };
  const state={mode:'opening'};
  const $=id=>document.getElementById(id);
  const q=(topic,n)=>{const x=CORPUS.find(p=>p.topic===topic&&p.questionNumber===n);return x?.question||'';};
  function tag(text){const s=document.createElement('span');s.className='framework-tag';s.textContent=text;return s;}
  function sampleList(samples){
    const d=document.createElement('div');d.className='framework-samples';
    for(const [topic,n] of samples){const p=document.createElement('p');p.append(tag(topic+' · 第 '+n+' 题'),document.createTextNode(' '+q(topic,n)) );d.append(p);}
    return d;
  }
  function renderOpening(root){
    root.innerHTML='<div class="framework-intro"><h2>开头框架地图</h2><p class="muted">148 页 · 169 个开头已全部抽取并按功能去重。目标不是背 169 段，而是做到：看到题目 → 10 秒判断题型 → 调用母框架 → 填入立场。</p></div>';
    const grid=document.createElement('div');grid.className='framework-grid';
    for(const x of OPENING){const c=document.createElement('article');c.className='framework-card';c.innerHTML='<div class="framework-card-head"><h3>'+x.title+'</h3><strong>'+x.count+' 题</strong></div><p><b>识别：</b>'+x.recognize+'</p><p><b>中文逻辑：</b>'+x.logic+'</p><div class="framework-chain">'+x.skeleton+'</div><div class="framework-tags"></div><details><summary>看代表原题</summary></details>';x.chunks.forEach(t=>c.querySelector('.framework-tags').append(tag(t)));c.querySelector('details').append(sampleList(x.samples));grid.append(c);}root.append(grid);
  }
  function renderClosing(root){
    root.innerHTML='<div class="framework-intro"><h2>结尾框架地图</h2><p class="muted">169 个结尾全部抽取后，主体收束逻辑可以压成 4 类。建议把“虚拟式建议句”看成横跨 4 类结尾的最后一层，而不是单独的第 5 类。</p></div>';
    const grid=document.createElement('div');grid.className='framework-grid';
    for(const x of CLOSING){const c=document.createElement('article');c.className='framework-card';c.innerHTML='<div class="framework-card-head"><h3>'+x.title+'</h3><strong>'+x.count+' 篇</strong></div><p><b>逻辑：</b>'+x.logic+'</p><div class="framework-chain">'+x.skeleton+'</div><div class="framework-tags"></div>';x.chunks.forEach(t=>c.querySelector('.framework-tags').append(tag(t)));grid.append(c);}root.append(grid);
    const note=document.createElement('div');note.className='framework-callout';note.innerHTML='<b>高频收尾组合：</b> Pour conclure → 重申立场 → Toutefois / équilibre / dépend de… → <b>Parallèlement + 虚拟式建议</b>';root.append(note);
  }
  function renderVirtual(root){
    const current=$('topic')?.value||'';
    root.innerHTML='<div class="framework-intro"><h2>结尾虚拟式主题库</h2><p class="muted">169 个结尾中，共抽到 126 个明确的虚拟式建议结尾。最常用外壳是 <b>il faudrait que</b>：112 次。这里重点练“主题主语 + 虚拟式动作 + afin de / tout en”。</p></div>';
    const stats=document.createElement('div');stats.className='framework-trigger-row';TRIGGERS.forEach(([t,n])=>{const x=document.createElement('div');x.className='framework-stat';x.innerHTML='<strong>'+n+'</strong><small>'+t+'</small>';stats.append(x)});root.append(stats);
    const topics=current&&VIRTUAL[current]?[current]:Object.keys(VIRTUAL);
    const grid=document.createElement('div');grid.className='framework-grid';
    for(const topic of topics){const x=VIRTUAL[topic],c=document.createElement('article');c.className='framework-card virtual-card';c.innerHTML='<div class="framework-card-head"><h3>'+topic+'</h3><strong>'+x.count+' 个</strong></div><p><b>高频主语</b></p><div class="framework-tags subjects"></div><p><b>高频虚拟式动作</b></p><div class="framework-tags actions"></div><details><summary>看原稿中的完整结尾语块</summary><div class="virtual-examples"></div></details>';x.subjects.forEach(t=>c.querySelector('.subjects').append(tag(t)));x.actions.forEach(t=>c.querySelector('.actions').append(tag(t)));for(const ex of x.examples){const p=document.createElement('p');p.className='virtual-example';p.textContent=ex;c.querySelector('.virtual-examples').append(p);}grid.append(c);}root.append(grid);
  }
  function render(){
    const root=$('frameworkView');if(!root)return;
    root.replaceChildren();
    const nav=document.createElement('div');nav.className='framework-mode-tabs';
    [['opening','开头框架地图'],['closing','结尾框架地图'],['virtual','结尾虚拟式主题库']].forEach(([m,label])=>{const b=document.createElement('button');b.textContent=label;b.classList.toggle('active',state.mode===m);b.onclick=()=>{state.mode=m;render();};nav.append(b);});
    root.append(nav);
    const stage=document.createElement('div');stage.id='frameworkStage';root.append(stage);
    if(state.mode==='opening')renderOpening(stage);else if(state.mode==='closing')renderClosing(stage);else renderVirtual(stage);
  }
  window.CORPUS_OPENING_CLOSING={render,getMeta:()=>({openings:169,closings:169,openingTypes:7,closingTypes:4,subjunctive:126})};
})();
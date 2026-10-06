'use strict';
(() => {
  const GROUPS = [
    {title:'1. 语言与沟通', items:[
      ['01','语言障碍影响日常自主生活'],
      ['02','语言能力促进社交与社会融入'],
      ['03','真实语言环境提高语言能力'],
      ['04','语言能力与职业融入']
    ]},
    {title:'2. 文化适应与身份', items:[
      ['05','了解当地文化促进适应'],
      ['06','跨文化接触拓宽视野'],
      ['07','亲身体验比远程了解更深入'],
      ['08','长期海外生活可能淡化原有文化'],
      ['09','母语与传统维持文化身份'],
      ['10','同胞圈与当地社会之间保持平衡']
    ]},
    {title:'3. 社交、孤独与归属感', items:[
      ['11','远离亲友容易产生孤独，但陪伴能提供支持'],
      ['12','主动参加活动建立社交网络与归属感']
    ]},
    {title:'4. 就业与职业', items:[
      ['13','了解当地就业市场和职场规范'],
      ['14','培训、人脉与就业支持提高就业竞争力'],
      ['15','海外经历提升职业竞争力，但不是万能']
    ]},
    {title:'5. 移民政策与融入责任', items:[
      ['16','移民既补充劳动力，也增加公共资源压力'],
      ['17','融入是个人与接收社会的共同责任']
    ]},
    {title:'6. 家庭、教育与个人成长', items:[
      ['18','孩子和学校可以成为全家融入的桥梁'],
      ['19','移民中的教育机会、儿童语言与社交'],
      ['20','年龄与生活经验也能帮助适应'],
      ['21','独自解决问题培养自主性与责任感'],
      ['22','独自旅行带来个人自由']
    ]},
    {title:'7. 旅行成本与交通', items:[
      ['23','旅行受金钱与时间限制，但可通过规划降低门槛'],
      ['24','交通方式是速度、价格与旅途体验之间的取舍'],
      ['25','跨境流动更自由能增加机会，但仍需要安全管控']
    ]},
    {title:'8. 旅游经济、环境与文化传播', items:[
      ['26','旅游业有经济收益，也有环境和住房代价'],
      ['27','亲身旅行、城市与美食体验可以理解并传播文化'],
      ['28','媒体、艺术与国际交流也能传播文化']
    ]}
  ];

  const QUICK = [
    ['语言与沟通','障碍 / 融入 / 练语言 / 职场'],
    ['文化适应与身份','适应 / 开放 / 亲身体验 / 母语 / 平衡'],
    ['社交与归属','孤独 / 活动 / 归属感'],
    ['就业与职业','市场 / 培训 / 海外经历'],
    ['政策与责任','劳动力 / 公共压力 / 共同努力'],
    ['家庭与成长','孩子 / 教育 / 自主 / 自由'],
    ['旅行条件','金钱 / 时间 / 交通 / 边境'],
    ['旅游传播','经济 / 环境 / 城市 / 美食 / 媒体']
  ];

  const SAMPLE = {
    number: '06',
    title: '跨文化接触拓宽视野',
    badge: '⭐ 超高复用',
    coreFr: 'nouvelles cultures → échanges → remettre en question ses préjugés → éviter les stéréotypes → élargir sa vision du monde',
    coreZh: '接触新文化 → 交流 → 反思偏见 → 避免刻板印象 → 拓宽视野',
    quick: '新文化 → 交流 → 反思偏见 → 少刻板印象 → 视野更开阔',
    scenes: [
      {
        title: '海外生活版',
        fr: 'autres modes de vie → autres façons de penser → remettre en question ses repères → ouverture d’esprit',
        zh: '其他生活方式 → 不同思维方式 → 反思原有观念 → 思想更开放',
        words: [
          ['favoriser l’ouverture d’esprit','促进思想开放'],
          ['être confronté à de nouvelles cultures','接触新的文化'],
          ['découvrir d’autres modes de vie','了解其他生活方式'],
          ['découvrir différentes façons de penser','了解不同思维方式'],
          ['remettre en question ses propres repères','反思自己原有的观念'],
          ['élargir sa vision du monde','拓宽世界观'],
          ['sortir de sa zone de confort','走出舒适区'],
          ['contribuer à son épanouissement personnel','有助于个人成长']
        ],
        sourceIds: ['1-15-2','1-16-3']
      },
      {
        title: '旅行版',
        fr: 'idées préconçues → réalité sur place → mieux comprendre les différences → remettre en question ses préjugés → éviter les stéréotypes',
        zh: '先入之见 → 亲眼看到现实 → 理解差异 → 反思偏见 → 减少刻板印象',
        words: [
          ['avoir des idées préconçues','有先入之见'],
          ['être confronté à de nouvelles cultures','接触新的文化'],
          ['faire connaissance avec des personnes issues de milieux différents','认识不同背景的人'],
          ['mieux comprendre les différences culturelles','更好理解文化差异'],
          ['remettre en question ses préjugés','反思自己的偏见'],
          ['se rendre compte sur place que la réalité est plus complexe','到当地后发现现实更复杂'],
          ['éviter certains stéréotypes','避免某些刻板印象'],
          ['élargir sa vision du monde','拓宽世界观']
        ],
        sourceIds: ['1-22-2']
      },
      {
        title: '多元文化社会版',
        fr: 'diversité culturelle → traditions / langues / modes de vie → échanges entre communautés → ouverture d’esprit',
        zh: '文化多样性 → 不同传统、语言和生活方式 → 社群交流 → 思想开放',
        words: [
          ['contribuer à la diversité culturelle','促进文化多样性'],
          ['apporter ses traditions, sa langue et son mode de vie','带来自己的传统、语言和生活方式'],
          ['découvrir d’autres cultures','了解其他文化'],
          ['favoriser une plus grande ouverture d’esprit','促进更加开放的心态'],
          ['participer à des festivals et à des événements culturels','参加节庆和文化活动'],
          ['favoriser les échanges entre des personnes issues de milieux différents','促进不同背景人群之间的交流']
        ],
        sourceIds: ['1-09-1']
      }
    ]
  };

  const $ = id => document.getElementById(id);
  let currentView='overview';

  function chip(fr, zh) {
    const el=document.createElement('div');
    el.className='argument-word';
    const f=document.createElement('strong'); f.lang='fr'; f.textContent=fr;
    const z=document.createElement('small'); z.textContent=zh;
    el.append(f,z); return el;
  }
  function sourceButton(id, sceneIndex) {
    const b=document.createElement('button');
    b.className='source-jump';
    b.textContent=id+' · 去学习原论段';
    b.onclick=()=>{sessionStorage.setItem('tcf-eo-t3-return-argument-map','1');sessionStorage.setItem('tcf-eo-t3-argument-return-state',JSON.stringify({mode:'scene',sceneIndex}));window.CORPUS_OPEN_PARAGRAPH?.(id);};
    return b;
  }

  function renderOverview(stage){
    currentView='overview';
    stage.replaceChildren();
    const intro=document.createElement('section');
    intro.className='argument-overview-intro';
    intro.innerHTML='<p class="eyebrow">旅行与移民 · 总思维导图</p><h2>96 个原始论段 → 28 个核心母论点</h2><p class="note">先看全局，再点击母论点进入逻辑链。#06 已接入完整详情，其余节点先作为总图结构展示。</p>';
    stage.append(intro);

    const grid=document.createElement('div');
    grid.className='argument-group-grid';
    GROUPS.forEach(group=>{
      const section=document.createElement('section');
      section.className='argument-group-card';
      const h=document.createElement('h3'); h.textContent=group.title; section.append(h);
      const items=document.createElement('div'); items.className='argument-node-list';
      group.items.forEach(([id,title])=>{
        const b=document.createElement('button');
        b.className='argument-node';
        b.innerHTML='<span class="node-num">#'+id+'</span><span class="node-title">'+title+'</span>';
        if(id==='06'){b.classList.add('ready'); b.title='已接入完整详情'; b.onclick=()=>renderDetail(stage);}
        else {b.onclick=()=>{document.getElementById('argumentToast').textContent='#'+id+' 已进入总图；完整逻辑链详情会在下一阶段批量接入。';};}
        items.append(b);
      });
      section.append(items); grid.append(section);
    });
    stage.append(grid);
    const toast=document.createElement('p'); toast.id='argumentToast'; toast.className='note'; stage.append(toast);
  }

  function renderList(stage){
    currentView='list';
    stage.replaceChildren();
    const list=document.createElement('div'); list.className='mother-list';
    GROUPS.forEach(group=>{
      const h=document.createElement('h3'); h.textContent=group.title; list.append(h);
      group.items.forEach(([id,title])=>{
        const row=document.createElement('button'); row.className='mother-list-row';
        row.innerHTML='<span>#'+id+'</span><strong>'+title+'</strong><em>'+(id==='06'?'查看完整详情 ›':'已纳入总图')+'</em>';
        if(id==='06')row.onclick=()=>renderDetail(stage);
        list.append(row);
      });
    });
    stage.append(list);
  }

  function renderQuick(stage){
    currentView='quick';
    stage.replaceChildren();
    const wrap=document.createElement('div'); wrap.className='quick-overview-grid';
    QUICK.forEach(([title,keywords])=>{
      const card=document.createElement('section'); card.className='quick-overview-card';
      card.innerHTML='<h3>'+title+'</h3><p>'+keywords+'</p>'; wrap.append(card);
    });
    stage.append(wrap);
  }

  function renderDetail(stage){
    currentView='detail';
    stage.replaceChildren();
    const back=document.createElement('button'); back.className='back-to-map'; back.textContent='← 返回 28 个母论点总图'; back.onclick=()=>renderOverview(stage); stage.append(back);

    const head=document.createElement('div'); head.className='argument-head';
    head.innerHTML='<div><p class="eyebrow">旅行与移民 · 母论点详情</p><h2>#'+SAMPLE.number+' '+SAMPLE.title+' <span class="argument-badge">'+SAMPLE.badge+'</span></h2></div>';
    stage.append(head);

    const core=document.createElement('section'); core.className='argument-core';
    core.innerHTML='<p class="argument-label">核心法语逻辑链</p><div class="logic-fr" lang="fr">'+SAMPLE.coreFr+'</div><div class="logic-zh">'+SAMPLE.coreZh+'</div>';
    stage.append(core);

    const branches=document.createElement('div'); branches.className='scene-list';
    SAMPLE.scenes.forEach((s,i)=>{
      const card=document.createElement('button'); card.className='scene-chain';
      card.innerHTML='<strong>'+s.title+'</strong><span class="logic-fr compact" lang="fr">'+s.fr+'</span><span class="logic-zh">'+s.zh+'</span><em>点击展开主题词组 ›</em>';
      card.onclick=()=>renderScene(stage,i); branches.append(card);
    });
    stage.append(branches);
  }

  function renderScene(stage,i){
    const s=SAMPLE.scenes[i]; currentView='scene'; stage.replaceChildren();
    const back=document.createElement('button'); back.className='back-to-map'; back.textContent='← 返回 #06 核心逻辑链'; back.onclick=()=>renderDetail(stage); stage.append(back);
    const top=document.createElement('section'); top.className='argument-core';
    top.innerHTML='<p class="argument-label">'+s.title+'</p><div class="logic-fr" lang="fr">'+s.fr+'</div><div class="logic-zh">'+s.zh+'</div>'; stage.append(top);
    const title=document.createElement('h3'); title.textContent='主题词汇 / 词组'; stage.append(title);
    const words=document.createElement('div'); words.className='argument-words'; s.words.forEach(x=>words.append(chip(x[0],x[1]))); stage.append(words);
    const srcTitle=document.createElement('h3'); srcTitle.textContent='对应原论段'; stage.append(srcTitle);
    const src=document.createElement('div'); src.className='source-jumps'; s.sourceIds.forEach(id=>src.append(sourceButton(id,i))); stage.append(src);
  }

  function render(){
    const root=$('argumentMapView'); if(!root) return;
    root.replaceChildren();

    const toolbar=document.createElement('div'); toolbar.className='argument-modes';
    [['overview','🧠 总思维导图'],['list','🔗 母论点列表'],['quick','⚡ 极简总览']].forEach(([k,label],i)=>{
      const b=document.createElement('button'); b.dataset.mode=k; b.textContent=label; if(i===0)b.classList.add('active'); toolbar.append(b);
    });
    root.append(toolbar);

    const stage=document.createElement('div'); stage.id='argumentStage'; root.append(stage);

    toolbar.onclick=e=>{
      const b=e.target.closest('button[data-mode]'); if(!b)return;
      toolbar.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
      b.dataset.mode==='overview'?renderOverview(stage):b.dataset.mode==='list'?renderList(stage):renderQuick(stage);
    };

    const savedReturn=sessionStorage.getItem('tcf-eo-t3-argument-return-state');
    if(savedReturn){
      try{
        const r=JSON.parse(savedReturn); sessionStorage.removeItem('tcf-eo-t3-argument-return-state');
        if(r.mode==='scene'&&Number.isInteger(r.sceneIndex)&&SAMPLE.scenes[r.sceneIndex]){
          toolbar.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
          renderScene(stage,r.sceneIndex); return;
        }
      }catch{sessionStorage.removeItem('tcf-eo-t3-argument-return-state');}
    }
    renderOverview(stage);
  }

  window.CORPUS_ARGUMENT_MAP={render};
})();

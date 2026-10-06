'use strict';
(() => {
  const SAMPLE = {
    number: '06',
    title: '跨文化接触拓宽视野',
    badge: '⭐ 超高复用',
    coreFr: 'nouvelles cultures → échanges → remettre en question ses préjugés → éviter les stéréotypes → élargir sa vision du monde',
    coreZh: '接触新文化 → 交流 → 反思偏见 → 避免刻板印象 → 拓宽视野',
    quick: '新文化 → 交流 → 反思偏见 → 少刻板印象 → 视野更开阔',
    sources: ['1-09-1','1-15-2','1-16-3','1-22-2'],
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
  function render() {
    const root=$('argumentMapView'); if(!root) return;
    root.replaceChildren();

    const head=document.createElement('div'); head.className='argument-head';
    head.innerHTML='<div><p class="eyebrow">旅行与移民 · 论点地图交互样板</p><h2>#'+SAMPLE.number+' '+SAMPLE.title+' <span class="argument-badge">'+SAMPLE.badge+'</span></h2><p class="note">先用一个母论点验证交互；确认后再把全部 28 个节点接入。</p></div>';
    root.append(head);

    const modes=document.createElement('div'); modes.className='argument-modes';
    [['map','🧠 思维导图'],['chain','🔗 法语逻辑链'],['quick','⚡ 极简速记']].forEach(([k,label],i)=>{
      const b=document.createElement('button'); b.dataset.mode=k; b.textContent=label; if(i===0)b.classList.add('active'); modes.append(b);
    });
    root.append(modes);

    const stage=document.createElement('div'); stage.id='argumentStage'; root.append(stage);

    function renderMap(){
      stage.replaceChildren();
      const map=document.createElement('div'); map.className='argument-map-sample';
      const center=document.createElement('button'); center.className='mother-node active';
      center.innerHTML='<strong>#06 '+SAMPLE.title+'</strong><small>'+SAMPLE.badge+' · 点击场景链继续展开</small>';
      map.append(center);
      const branches=document.createElement('div'); branches.className='scene-grid';
      SAMPLE.scenes.forEach((s,i)=>{
        const card=document.createElement('button'); card.className='scene-node';
        card.innerHTML='<span>场景 '+(i+1)+'</span><strong>'+s.title+'</strong><small lang="fr">'+s.fr+'</small>';
        card.onclick=()=>renderScene(i);
        branches.append(card);
      });
      map.append(branches); stage.append(map);
    }

    function renderChain(){
      stage.replaceChildren();
      const core=document.createElement('section'); core.className='argument-core';
      core.innerHTML='<p class="argument-label">核心法语逻辑链</p><div class="logic-fr" lang="fr">'+SAMPLE.coreFr+'</div><div class="logic-zh">'+SAMPLE.coreZh+'</div>';
      stage.append(core);
      const branches=document.createElement('div'); branches.className='scene-list';
      SAMPLE.scenes.forEach((s,i)=>{
        const card=document.createElement('button'); card.className='scene-chain';
        card.innerHTML='<strong>'+s.title+'</strong><span class="logic-fr compact" lang="fr">'+s.fr+'</span><span class="logic-zh">'+s.zh+'</span><em>点击展开主题词组 ›</em>';
        card.onclick=()=>renderScene(i); branches.append(card);
      });
      stage.append(branches);
    }

    function renderQuick(){
      stage.replaceChildren();
      const q=document.createElement('section'); q.className='quick-card';
      q.innerHTML='<p class="argument-label">考前极简速记</p><div class="quick-memory">'+SAMPLE.quick+'</div><p class="logic-fr" lang="fr">'+SAMPLE.coreFr+'</p><p class="logic-zh">'+SAMPLE.coreZh+'</p>';
      stage.append(q);
    }

    function renderScene(i){
      const s=SAMPLE.scenes[i]; stage.replaceChildren();
      const back=document.createElement('button'); back.className='back-to-map'; back.textContent='← 返回核心逻辑链'; back.onclick=renderChain; stage.append(back);
      const top=document.createElement('section'); top.className='argument-core';
      top.innerHTML='<p class="argument-label">'+s.title+'</p><div class="logic-fr" lang="fr">'+s.fr+'</div><div class="logic-zh">'+s.zh+'</div>';
      stage.append(top);
      const title=document.createElement('h3'); title.textContent='主题词汇 / 词组'; stage.append(title);
      const words=document.createElement('div'); words.className='argument-words';
      s.words.forEach(x=>words.append(chip(x[0],x[1]))); stage.append(words);
      const srcTitle=document.createElement('h3'); srcTitle.textContent='对应原论段'; stage.append(srcTitle);
      const src=document.createElement('div'); src.className='source-jumps'; s.sourceIds.forEach(id=>src.append(sourceButton(id,i))); stage.append(src);
    }

    modes.onclick=e=>{
      const b=e.target.closest('button[data-mode]'); if(!b)return;
      modes.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
      b.dataset.mode==='map'?renderMap():b.dataset.mode==='chain'?renderChain():renderQuick();
    };
    const savedReturn=sessionStorage.getItem('tcf-eo-t3-argument-return-state');
    if(savedReturn){try{const r=JSON.parse(savedReturn);sessionStorage.removeItem('tcf-eo-t3-argument-return-state');if(r.mode==='scene'&&Number.isInteger(r.sceneIndex)&&SAMPLE.scenes[r.sceneIndex]){modes.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.mode==='chain'));renderScene(r.sceneIndex);return;}}catch{sessionStorage.removeItem('tcf-eo-t3-argument-return-state');}}
    renderMap();
  }

  window.CORPUS_ARGUMENT_MAP={render};
})();

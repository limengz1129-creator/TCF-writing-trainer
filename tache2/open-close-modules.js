(()=>{
'use strict';
const DATA={
  opening:{
    title:'开头模块',
    subtitle:'旅行与住宿 · TCF Canada 口语 Tâche 2 通用开场',
    items:[
      {tag:'朋友分享旅行经历',fr:"Salut ! J’ai entendu dire que tu revenais de voyage. Ça m’intéresse beaucoup. Est-ce que je peux te poser quelques questions ?",zh:'适合朋友刚旅行回来、刚参加旅行、刚体验某个景点或住宿。'},
      {tag:'想做类似旅行',fr:"Ton voyage m’intéresse beaucoup parce que j’aimerais peut-être faire quelque chose de similaire. Est-ce que je peux te poser quelques questions ?",zh:'适合你听完朋友经历后，也想做类似安排的题目。'},
      {tag:'旅行社 / 酒店 / 机构咨询',fr:"Bonjour, je voudrais avoir quelques renseignements avant d’organiser mon séjour. Est-ce que je peux vous poser quelques questions ?",zh:'适合旅行社、酒店、民宿、景区或其他旅游服务机构。'},
      {tag:'最通用保险版',fr:"Bonjour ! Je suis très intéressé(e) par cette possibilité et j’aimerais avoir quelques informations supplémentaires. Est-ce que je peux vous poser quelques questions ?",zh:'题目场景不容易快速判断时，可以用这一版。'}
    ]
  },
  closing:{
    title:'结尾模块',
    subtitle:'旅行与住宿 · TCF Canada 口语 Tâche 2 通用收尾',
    items:[
      {tag:'朋友场景',fr:"Merci beaucoup pour toutes ces informations. Ça me donne vraiment envie d’y aller !",zh:'适合朋友介绍旅行经历、目的地、住宿或活动。'},
      {tag:'想做类似安排',fr:"Merci beaucoup, tes conseils vont vraiment m’aider à organiser mon séjour.",zh:'适合向朋友取经后，表达这些建议对自己有帮助。'},
      {tag:'正式咨询场景',fr:"Merci beaucoup pour toutes ces informations. Elles vont beaucoup m’aider à préparer mon voyage.",zh:'适合旅行社、酒店、机构等 vous 场景。'},
      {tag:'最通用结尾',fr:"D’accord, merci beaucoup. C’est très clair et ça va beaucoup m’aider.",zh:'任何旅行与住宿咨询题都可以安全使用。'}
    ]
  }
};
const $=(s,r=document)=>r.querySelector(s);
function speak(text){
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.92;speechSynthesis.speak(u);
}
function show(kind){
  const d=DATA[kind];if(!d)return;
  $('#t2OCModalTitle').textContent=d.title;
  $('#t2OCModalSub').textContent=d.subtitle;
  const wrap=$('#t2OCItems');wrap.replaceChildren();
  d.items.forEach((item,i)=>{
    const card=document.createElement('article');card.className='t2-oc-card';
    const top=document.createElement('div');top.className='t2-oc-card-top';
    const tag=document.createElement('span');tag.className='t2-oc-tag';tag.textContent=(i+1)+'. '+item.tag;
    const actions=document.createElement('div');actions.className='t2-oc-actions';
    const audio=document.createElement('button');audio.type='button';audio.className='btn ghost';audio.textContent='🔊 发音';audio.onclick=()=>speak(item.fr);
    const copy=document.createElement('button');copy.type='button';copy.className='btn ghost';copy.textContent='复制';copy.onclick=async()=>{try{await navigator.clipboard.writeText(item.fr);copy.textContent='已复制';setTimeout(()=>copy.textContent='复制',1000);}catch{}};
    actions.append(audio,copy);top.append(tag,actions);
    const fr=document.createElement('p');fr.className='t2-oc-fr';fr.lang='fr';fr.textContent=item.fr;
    const zh=document.createElement('p');zh.className='t2-oc-zh';zh.textContent=item.zh;
    card.append(top,fr,zh);wrap.append(card);
  });
  $('#t2OCBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function close(){const b=$('#t2OCBackdrop');if(b)b.classList.remove('open');document.body.style.overflow='';if('speechSynthesis' in window)speechSynthesis.cancel();}
function build(){
  const sidebar=$('.sidebar');if(!sidebar)return;
  const box=document.createElement('section');box.className='t2-oc-entry';
  box.innerHTML='<strong>口语完整结构</strong><p>除了提问，也练习考试开头和结尾。</p><div class="t2-oc-entry-actions"><button type="button" class="btn secondary" data-oc="opening">开头模块</button><button type="button" class="btn secondary" data-oc="closing">结尾模块</button></div>';
  const controls=$('.t2-study-controls');
  if(controls)controls.after(box);else sidebar.prepend(box);
  box.querySelectorAll('[data-oc]').forEach(b=>b.onclick=()=>show(b.dataset.oc));

  const backdrop=document.createElement('div');backdrop.id='t2OCBackdrop';backdrop.className='t2-oc-backdrop';
  backdrop.innerHTML='<section class="t2-oc-modal" role="dialog" aria-modal="true" aria-labelledby="t2OCModalTitle"><header class="t2-oc-head"><div><div class="eyebrow">TCF Canada · Expression orale · Tâche 2</div><h2 id="t2OCModalTitle"></h2><p id="t2OCModalSub"></p></div><button id="t2OCClose" type="button" class="btn ghost">✕ 关闭</button></header><div id="t2OCItems" class="t2-oc-items"></div><div class="t2-oc-note"><strong>使用原则：</strong>开头和结尾保持简短自然，不要占用提问时间。真正得分重点仍然是中间的互动提问。</div></section>';
  document.body.append(backdrop);
  $('#t2OCClose').onclick=close;backdrop.onclick=e=>{if(e.target===backdrop)close();};
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('open'))close();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
window.TCF_T2_OPEN_CLOSE={show};
})();
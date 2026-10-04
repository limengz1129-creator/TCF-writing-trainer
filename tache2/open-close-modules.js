(()=>{
'use strict';
const DATA={
  '旅行与住宿':{
    opening:{
      title:'开头模块',
      items:[
        {tag:'朋友分享旅行经历',fr:"Salut ! J’ai entendu dire que tu revenais de voyage. Ça m’intéresse beaucoup. Est-ce que je peux te poser quelques questions ?",zh:'适合朋友刚旅行回来、刚参加旅行、刚体验某个景点或住宿。'},
        {tag:'想做类似旅行',fr:"Ton voyage m’intéresse beaucoup parce que j’aimerais peut-être faire quelque chose de similaire. Est-ce que je peux te poser quelques questions ?",zh:'适合你听完朋友经历后，也想做类似安排的题目。'},
        {tag:'旅行社 / 酒店 / 机构咨询',fr:"Bonjour, je voudrais avoir quelques renseignements avant d’organiser mon séjour. Est-ce que je peux vous poser quelques questions ?",zh:'适合旅行社、酒店、民宿、景区或其他旅游服务机构。'},
        {tag:'最通用保险版',fr:"Bonjour ! Je suis très intéressé(e) par cette possibilité et j’aimerais avoir quelques informations supplémentaires. Est-ce que je peux vous poser quelques questions ?",zh:'题目场景不容易快速判断时，可以用这一版。'}
      ]
    },
    closing:{
      title:'结尾模块',
      items:[
        {tag:'朋友场景',fr:"Merci beaucoup pour toutes ces informations. Ça me donne vraiment envie d’y aller !",zh:'适合朋友介绍旅行经历、目的地、住宿或活动。'},
        {tag:'想做类似安排',fr:"Merci beaucoup, tes conseils vont vraiment m’aider à organiser mon séjour.",zh:'适合向朋友取经后，表达这些建议对自己有帮助。'},
        {tag:'正式咨询场景',fr:"Merci beaucoup pour toutes ces informations. Elles vont beaucoup m’aider à préparer mon voyage.",zh:'适合旅行社、酒店、机构等 vous 场景。'},
        {tag:'最通用结尾',fr:"D’accord, merci beaucoup. C’est très clair et ça va beaucoup m’aider.",zh:'任何旅行与住宿咨询题都可以安全使用。'}
      ]
    }
  }
};

const UNIVERSAL_REACTIONS={
  title:'回答后的高频反应句库',
  subtitle:'全题目通用 · TCF Canada 口语 Tâche 2 互动衔接',
  items:[
    {tag:'中性确认',fr:'D’accord, je vois.',zh:'好的，我明白了。最稳、最通用。'},
    {tag:'中性确认',fr:'Ah, d’accord.',zh:'啊，好的。适合自然接话。'},
    {tag:'中性确认',fr:'Très bien, je comprends.',zh:'好的，我明白。比单独说 Très bien 更完整。'},
    {tag:'积极评价',fr:'C’est super.',zh:'太好了。适合明显正面的信息。'},
    {tag:'积极评价',fr:'C’est intéressant.',zh:'挺有意思的。适合信息型回答。'},
    {tag:'积极评价',fr:'Ça a l’air bien.',zh:'听起来不错。适合活动、地点、服务等。'},
    {tag:'积极评价',fr:'C’est une bonne idée.',zh:'这是个好主意。适合对方给出建议时。'},
    {tag:'方便 / 实用',fr:'C’est pratique.',zh:'这很方便。适合交通、预订、设施、流程。'},
    {tag:'方便 / 实用',fr:'Ça me semble très pratique.',zh:'听起来很实用、很方便。语气更完整。'},
    {tag:'方便 / 实用',fr:'C’est exactement ce qu’il me faut.',zh:'这正是我需要的。适合条件很符合你的需求时。'},
    {tag:'安心 / 放心',fr:'C’est rassurant.',zh:'这让人放心。适合安全、保障、条件类回答。'},
    {tag:'安心 / 放心',fr:'Ça me rassure.',zh:'这让我放心了。比 C’est rassurant 更有个人反应。'},
    {tag:'理解更清楚',fr:'Je comprends mieux maintenant.',zh:'我现在更明白了。适合对方解释流程或原因后。'},
    {tag:'理解更清楚',fr:'C’est plus clair maintenant.',zh:'现在更清楚了。适合信息解释类回答。'},
    {tag:'理解更清楚',fr:'D’accord, ça répond à ma question.',zh:'好的，这回答了我的问题。适合对方解释得比较完整时。'},
    {tag:'自然过渡',fr:'D’accord. Et concernant…',zh:'好的。那么关于…… 适合直接切换到下一个维度。'},
    {tag:'自然过渡',fr:'Très bien. J’aimerais aussi savoir…',zh:'很好。我还想知道…… 适合继续追问。'},
    {tag:'自然过渡',fr:'Je vois. Et pour ce qui est de…',zh:'我明白了。至于…… 适合自然换话题。'},
    {tag:'自然过渡',fr:'Parfait. Et qu’en est-il de… ?',zh:'很好。那么……方面呢？适合换到新的信息点。'},
    {tag:'轻微惊讶',fr:'Ah bon ? Je ne savais pas.',zh:'真的吗？我之前不知道。只在确实有点意外时使用。'}
  ]
};
const $=(s,r=document)=>r.querySelector(s);
const EDIT_KEY='tcf-tache2-open-close-edits-v1';
function readEdits(){try{const v=JSON.parse(localStorage.getItem(EDIT_KEY)||'{}');return v&&typeof v==='object'?v:{};}catch{return{};}}
function writeEdits(v){localStorage.setItem(EDIT_KEY,JSON.stringify(v));}
function getThemeItems(theme,kind){
  const edits=readEdits(),saved=edits?.[theme]?.[kind];
  if(Array.isArray(saved))return saved;
  const base=DATA[theme]?.[kind]?.items;
  return Array.isArray(base)?base.map(x=>({...x})):[];
}
function saveThemeItems(theme,kind,items){
  const edits=readEdits();
  edits[theme]=edits[theme]||{};
  edits[theme][kind]=items;
  writeEdits(edits);
}
function itemId(item,i){return item.id||('base-'+i);}

function currentTheme(){
  const v=$('#themeFilter')?.value||'';
  return v || window.TCF_T2_TRAINER?.current()?.theme || '';
}
function speak(text){
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.92;speechSynthesis.speak(u);
}
function emptyState(wrap,theme,kind){
  const box=document.createElement('div');box.className='t2-oc-empty';
  const h=document.createElement('h3');h.textContent=theme?('「'+theme+'」暂未添加'+(kind==='opening'?'开头':'结尾')+'语料'):'请先选择一个大主题';
  const p=document.createElement('p');p.textContent=theme?'当前不会显示其他大主题的内容。以后我们整理到这个主题时，再单独补进去。':'开头和结尾按大主题分别管理，不会跨主题混用。';
  box.append(h,p);wrap.append(box);
}
function show(kind){
  const theme=currentTheme(),isReaction=kind==='reaction';
  $('#t2OCModalTitle').textContent=isReaction?UNIVERSAL_REACTIONS.title:(kind==='opening'?'开头模块':'结尾模块');
  $('#t2OCModalSub').textContent=isReaction?UNIVERSAL_REACTIONS.subtitle:((theme||'未选择大主题')+' · TCF Canada 口语 Tâche 2 '+(kind==='opening'?'通用开场':'通用收尾'));
  const wrap=$('#t2OCItems');wrap.replaceChildren();

  if(isReaction){
    renderCards(wrap,UNIVERSAL_REACTIONS.items,{editable:false});
  }else{
    if(!theme){emptyState(wrap,theme,kind);}
    else{
      const items=getThemeItems(theme,kind);
      const tools=document.createElement('div');tools.className='t2-oc-manage';
      const add=document.createElement('button');add.type='button';add.className='btn primary';add.textContent='＋ 新增'+(kind==='opening'?'开头':'结尾');
      add.onclick=()=>openEditor({theme,kind,index:-1});
      tools.append(add);wrap.append(tools);
      if(items.length)renderCards(wrap,items,{editable:true,theme,kind});
      else emptyState(wrap,theme,kind);
    }
  }
  $('#t2OCBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function renderCards(wrap,items,opt){
  items.forEach((item,i)=>{
    const card=document.createElement('article');card.className='t2-oc-card';
    const top=document.createElement('div');top.className='t2-oc-card-top';
    const tag=document.createElement('span');tag.className='t2-oc-tag';tag.textContent=(i+1)+'. '+item.tag;
    const actions=document.createElement('div');actions.className='t2-oc-actions';
    const audio=document.createElement('button');audio.type='button';audio.className='btn ghost';audio.textContent='🔊 发音';audio.onclick=()=>speak(item.fr);
    const copy=document.createElement('button');copy.type='button';copy.className='btn ghost';copy.textContent='复制';copy.onclick=async()=>{try{await navigator.clipboard.writeText(item.fr);copy.textContent='已复制';setTimeout(()=>copy.textContent='复制',1000);}catch{}};
    actions.append(audio,copy);
    if(opt.editable){
      const edit=document.createElement('button');edit.type='button';edit.className='t2-oc-pencil';edit.textContent='✎';edit.title='编辑这条';edit.setAttribute('aria-label','编辑 '+item.tag);edit.onclick=()=>openEditor({theme:opt.theme,kind:opt.kind,index:i});
      const del=document.createElement('button');del.type='button';del.className='t2-oc-delete';del.textContent='删除';del.onclick=()=>deleteItem(opt.theme,opt.kind,i);
      actions.append(edit,del);
    }
    top.append(tag,actions);
    const fr=document.createElement('p');fr.className='t2-oc-fr';fr.lang='fr';fr.textContent=item.fr;
    const zh=document.createElement('p');zh.className='t2-oc-zh';zh.textContent=item.zh;
    card.append(top,fr,zh);wrap.append(card);
  });
}
function openEditor({theme,kind,index}){
  const items=getThemeItems(theme,kind),existing=index>=0?items[index]:{tag:'',fr:'',zh:''};
  const form=document.createElement('form');form.className='t2-oc-edit-form';
  form.innerHTML='<h3>'+(index>=0?'编辑':'新增')+(kind==='opening'?'开头':'结尾')+'</h3>';
  const fields=[['场景标签','tag',existing.tag||''],['法语句子','fr',existing.fr||''],['中文说明','zh',existing.zh||'']];
  const inputs={};
  for(const [labelText,key,val] of fields){
    const label=document.createElement('label');label.textContent=labelText;
    const input=key==='tag'?document.createElement('input'):document.createElement('textarea');
    input.value=val;input.required=true;input.className='t2-oc-edit-input';input.lang=key==='fr'?'fr':(key==='zh'?'zh-CN':'');
    inputs[key]=input;label.append(input);form.append(label);
  }
  const actions=document.createElement('div');actions.className='t2-oc-edit-actions';
  const save=document.createElement('button');save.type='submit';save.className='btn primary';save.textContent='保存';
  const cancel=document.createElement('button');cancel.type='button';cancel.className='btn ghost';cancel.textContent='取消';
  actions.append(save,cancel);form.append(actions);
  const wrap=$('#t2OCItems');wrap.prepend(form);inputs.tag.focus();
  cancel.onclick=()=>form.remove();
  form.onsubmit=e=>{e.preventDefault();const next={tag:inputs.tag.value.trim(),fr:inputs.fr.value.trim(),zh:inputs.zh.value.trim(),id:existing.id||('u-'+Date.now())};if(!next.tag||!next.fr||!next.zh)return;if(index>=0)items[index]=next;else items.push(next);saveThemeItems(theme,kind,items);show(kind);};
}
function deleteItem(theme,kind,index){
  const items=getThemeItems(theme,kind),item=items[index];if(!item)return;
  if(!confirm('删除这条'+(kind==='opening'?'开头':'结尾')+'吗？'))return;
  items.splice(index,1);saveThemeItems(theme,kind,items);show(kind);
}
function close(){const b=$('#t2OCBackdrop');if(b)b.classList.remove('open');document.body.style.overflow='';if('speechSynthesis' in window)speechSynthesis.cancel();}
function updateEntry(){
  const theme=currentTheme(),has=!!DATA[theme];
  const status=$('#t2OCThemeStatus');
  if(status)status.textContent=theme?(has?'当前：'+theme+'（已整理）':'当前：'+theme+'（暂未整理）'):'请先选择大主题';
}
function build(){
  const sidebar=$('.sidebar');if(!sidebar)return;
  const box=document.createElement('section');box.className='t2-oc-entry';
  box.innerHTML='<strong>口语完整结构</strong><p>开头和结尾按当前大主题显示；反应句库为全部题目通用。</p><p id="t2OCThemeStatus" class="t2-oc-theme-status"></p><div class="t2-oc-entry-actions"><button type="button" class="btn secondary" data-oc="opening">开头模块</button><button type="button" class="btn secondary" data-oc="closing">结尾模块</button><button type="button" class="btn secondary t2-oc-reaction-btn" data-oc="reaction">回答后反应句库</button></div>';
  const controls=$('.t2-study-controls');
  if(controls)controls.after(box);else sidebar.prepend(box);
  box.querySelectorAll('[data-oc]').forEach(b=>b.onclick=()=>show(b.dataset.oc));
  $('#themeFilter')?.addEventListener('change',updateEntry);
  updateEntry();

  const backdrop=document.createElement('div');backdrop.id='t2OCBackdrop';backdrop.className='t2-oc-backdrop';
  backdrop.innerHTML='<section class="t2-oc-modal" role="dialog" aria-modal="true" aria-labelledby="t2OCModalTitle"><header class="t2-oc-head"><div><div class="eyebrow">TCF Canada · Expression orale · Tâche 2</div><h2 id="t2OCModalTitle"></h2><p id="t2OCModalSub"></p></div><button id="t2OCClose" type="button" class="btn ghost">✕ 关闭</button></header><div id="t2OCItems" class="t2-oc-items"></div><div class="t2-oc-note"><strong>使用原则：</strong>反应句只需短短一句，用来体现真实互动；不要每次都用同一句，也不要为了“高级”而说得太长。</div></section>';
  document.body.append(backdrop);
  $('#t2OCClose').onclick=close;backdrop.onclick=e=>{if(e.target===backdrop)close();};
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('open'))close();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
window.TCF_T2_OPEN_CLOSE={show};
})();
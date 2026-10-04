(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const UNIVERSAL=[
 {cat:'时间',trigger:'对方提到时间 / 时长',fr:'Et combien de temps cela prend-il ?',zh:'那大概要花多长时间？'},
 {cat:'时间',trigger:'对方给出一个时间',fr:'Et à quelle heure vaut-il mieux y aller ?',zh:'那最好几点去？'},
 {cat:'时间',trigger:'对方提到开放 / 安排',fr:'Et est-ce que les horaires sont différents le week-end ?',zh:'那周末的时间安排会不一样吗？'},
 {cat:'时间',trigger:'对方提到频率',fr:'Et à quelle fréquence cela a-t-il lieu ?',zh:'那多久一次？'},
 {cat:'价格',trigger:'对方提到价格',fr:'Et qu’est-ce qui est inclus dans ce prix ?',zh:'那这个价格里包含什么？'},
 {cat:'价格',trigger:'对方提到价格',fr:'Et y a-t-il des frais supplémentaires à prévoir ?',zh:'那还有其他需要额外支付的费用吗？'},
 {cat:'价格',trigger:'价格偏高 / 有预算限制',fr:'Et est-ce qu’il y a des réductions ou des offres spéciales ?',zh:'那有折扣或者优惠吗？'},
 {cat:'价格',trigger:'对方给出一个总价',fr:'Et ce tarif est-il par personne ?',zh:'那这个价格是按每个人算吗？'},
 {cat:'地点',trigger:'对方提到地点',fr:'Et où cela se trouve-t-il exactement ?',zh:'那具体在哪里？'},
 {cat:'地点',trigger:'对方提到地点',fr:'Et est-ce que c’est loin d’ici ?',zh:'那离这里远吗？'},
 {cat:'地点',trigger:'对方提到地点 / 设施',fr:'Et y a-t-il des commerces ou des services à proximité ?',zh:'那附近有商店或服务设施吗？'},
 {cat:'交通',trigger:'对方提到地点 / 出行',fr:'Et comment peut-on s’y rendre ?',zh:'那怎么去那里？'},
 {cat:'交通',trigger:'对方提到公共交通',fr:'Et est-ce que c’est facilement accessible en transport en commun ?',zh:'那坐公共交通方便到吗？'},
 {cat:'交通',trigger:'对方推荐某种交通方式',fr:'Et combien de temps dure le trajet ?',zh:'那路程大概多久？'},
 {cat:'交通',trigger:'需要换乘 / 带孩子 / 行李',fr:'Et est-ce que ce trajet est pratique ?',zh:'那这段行程方便吗？'},
 {cat:'条件',trigger:'对方提到参加 / 使用',fr:'Et y a-t-il des conditions particulières à respecter ?',zh:'那有没有需要满足的特别条件？'},
 {cat:'条件',trigger:'活动 / 课程 / 服务',fr:'Et faut-il avoir de l’expérience ou un niveau particulier ?',zh:'那需要经验或者特定水平吗？'},
 {cat:'条件',trigger:'对方提到材料 / 手续',fr:'Et quels documents faut-il préparer ?',zh:'那需要准备哪些材料？'},
 {cat:'预约',trigger:'活动 / 服务 / 餐厅 / 住宿',fr:'Et faut-il réserver à l’avance ?',zh:'那需要提前预约吗？'},
 {cat:'预约',trigger:'需要报名 / 预订',fr:'Et comment peut-on réserver ou s’inscrire ?',zh:'那要怎么预约或报名？'},
 {cat:'预约',trigger:'对方提到线上办理',fr:'Et est-ce qu’on peut le faire en ligne ?',zh:'那可以在线办理吗？'},
 {cat:'适合性',trigger:'你带孩子 / 家庭',fr:'Et est-ce que c’est adapté aux enfants ?',zh:'那适合孩子吗？'},
 {cat:'适合性',trigger:'你是初学者 / 第一次尝试',fr:'Et est-ce que c’est adapté aux débutants ?',zh:'那适合初学者吗？'},
 {cat:'适合性',trigger:'对方推荐某项选择',fr:'Et à quel type de public cela convient-il le mieux ?',zh:'那它最适合哪一类人？'},
 {cat:'内容',trigger:'对方介绍套餐 / 服务 / 活动',fr:'Et qu’est-ce qui est compris exactement ?',zh:'那具体都包括什么？'},
 {cat:'内容',trigger:'对方提到设备 / 材料',fr:'Et est-ce que le matériel est fourni ?',zh:'那设备/材料会提供吗？'},
 {cat:'体验',trigger:'对方讲自己的经历',fr:'Et qu’est-ce que tu as le plus apprécié ?',zh:'那你最喜欢什么？'},
 {cat:'体验',trigger:'对方讲自己的经历',fr:'Et est-ce qu’il y a quelque chose que tu as moins aimé ?',zh:'那有没有什么你不太喜欢的？'},
 {cat:'原因 / 建议',trigger:'对方给出推荐',fr:'Et pourquoi me conseilles-tu cette option ?',zh:'那你为什么推荐这个选择？'},
 {cat:'原因 / 建议',trigger:'对方给出一种选择',fr:'Et y a-t-il une autre option que tu me conseillerais ?',zh:'那还有别的选择你会推荐吗？'}
];
const PATTERNS=[
 ['价格',/(prix|tarif|coût|budget|frais|réduction|charges|salaire)/i],
 ['时间',/(combien de temps|horaire|heure|jours|fréquence|durée|quand|délai)/i],
 ['地点 / 距离',/(où |quartier|proximité|loin|emplacement|adresse|zone)/i],
 ['交通',/(transport|déplacer|trajet|voiture|parking|rendre|navette|train|bus|métro)/i],
 ['预约 / 手续',/(réserv|inscri|documents|dossier|étapes|formalités|billet|caution|garant)/i],
 ['条件 / 规则',/(condition|règle|niveau|expérience|sécurité|consigne|obligatoire|autorisé)/i],
 ['适合性',/(adapté|famille|enfant|débutant|public|convient)/i],
 ['内容 / 设施',/(inclus|compris|équipement|matériel|service|wifi|petit-déjeuner)/i],
 ['体验 / 评价',/(appréci|préfér|conseil|recommand|ambiance|difficile|avantage|inconvénient|plu|moins)/i]
];
function currentTheme(){
 const v=$('#themeFilter')?.value||'';
 return v||window.TCF_T2_TRAINER?.current()?.theme||'';
}
function themeFollowups(theme){
 const all=window.TCF_T2_TRAINER?.all||[];
 const seen=new Set(),out=[];
 for(const q of all){
   if(q.theme!==theme)continue;
   let cat='';
   for(const [name,re] of PATTERNS){if(re.test(q.fr+' '+q.zh)){cat=name;break;}}
   if(!cat)continue;
   const key=q.fr.toLowerCase().replace(/\s+/g,' ').trim();
   if(seen.has(key))continue;seen.add(key);
   out.push({cat,trigger:'考官回答涉及「'+cat+'」时',fr:q.fr,zh:q.zh,sub:q.subcategory||''});
 }
 const priority={'体验 / 评价':1,'预约 / 手续':2,'条件 / 规则':3,'适合性':4,'时间':5,'价格':6,'交通':7,'内容 / 设施':8,'地点 / 距离':9};
 out.sort((a,b)=>(priority[a.cat]||99)-(priority[b.cat]||99));
 const chosen=[],counts={};
 for(const x of out){
   counts[x.cat]=counts[x.cat]||0;
   if(counts[x.cat]>=3)continue;
   chosen.push(x);counts[x.cat]++;
   if(chosen.length>=24)break;
 }
 return chosen;
}
function speak(text){
 if(!('speechSynthesis' in window))return;
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.92;speechSynthesis.speak(u);
}
function copyBtn(text){
 const b=document.createElement('button');b.type='button';b.className='btn ghost';b.textContent='复制';
 b.onclick=async()=>{try{await navigator.clipboard.writeText(text);b.textContent='已复制';setTimeout(()=>b.textContent='复制',900);}catch{}};
 return b;
}
function card(item,i){
 const el=document.createElement('article');el.className='t2-fu-card';
 const top=document.createElement('div');top.className='t2-fu-top';
 const left=document.createElement('div');left.className='t2-fu-labels';
 const num=document.createElement('span');num.className='t2-fu-cat';num.textContent=(i+1)+'. '+item.cat;
 const trig=document.createElement('span');trig.className='t2-fu-trigger';trig.textContent='触发：'+item.trigger;
 left.append(num,trig);
 const actions=document.createElement('div');actions.className='t2-fu-actions';
 const audio=document.createElement('button');audio.type='button';audio.className='btn ghost';audio.textContent='🔊 发音';audio.onclick=()=>speak(item.fr);
 actions.append(audio,copyBtn(item.fr));top.append(left,actions);
 const fr=document.createElement('p');fr.className='t2-fu-fr';fr.lang='fr';fr.textContent=item.fr;
 const zh=document.createElement('p');zh.className='t2-fu-zh';zh.textContent=item.zh;
 el.append(top,fr,zh);
 if(item.sub){const sub=document.createElement('small');sub.className='t2-fu-sub';sub.textContent='来自语料库：'+item.sub;el.append(sub);}
 return el;
}
function render(mode){
 const theme=currentTheme(),wrap=$('#t2FUItems');wrap.replaceChildren();
 $('#t2FUTabUniversal').classList.toggle('active',mode==='universal');
 $('#t2FUTabTheme').classList.toggle('active',mode==='theme');
 if(mode==='universal'){
   $('#t2FUSubtitle').textContent='全题目通用 · 30 个核心追问模板';
   UNIVERSAL.forEach((x,i)=>wrap.append(card(x,i)));
 }else{
   $('#t2FUSubtitle').textContent=(theme||'未选择大主题')+' · 从你现有 Tâche 2 语料库筛选';
   if(!theme){
     wrap.innerHTML='<div class="t2-fu-empty">请先选择一个大主题。</div>';return;
   }
   const rows=themeFollowups(theme);
   if(!rows.length){wrap.innerHTML='<div class="t2-fu-empty">当前主题暂未筛选到合适的专属追问。</div>';return;}
   rows.forEach((x,i)=>wrap.append(card(x,i)));
 }
}
function open(){
 $('#t2FUBackdrop').classList.add('open');document.body.style.overflow='hidden';render('universal');
}
function close(){
 $('#t2FUBackdrop').classList.remove('open');document.body.style.overflow='';if('speechSynthesis' in window)speechSynthesis.cancel();
}
function build(){
 const actions=$('.t2-oc-entry-actions');
 if(!actions)return;
 const btn=document.createElement('button');btn.type='button';btn.className='btn secondary t2-fu-entry';btn.textContent='追问模块';btn.onclick=open;actions.append(btn);
 const back=document.createElement('div');back.id='t2FUBackdrop';back.className='t2-fu-backdrop';
 back.innerHTML='<section class="t2-fu-modal" role="dialog" aria-modal="true"><header class="t2-fu-head"><div><div class="eyebrow">TCF Canada · Expression orale · Tâche 2</div><h2>追问模块</h2><p id="t2FUSubtitle"></p></div><button id="t2FUClose" class="btn ghost" type="button">✕ 关闭</button></header><div class="t2-fu-guide"><strong>练习逻辑：</strong>主问题 → 听答案 → 抓关键词 → 选一个追问。能继续就再追一句，追不下去再换下一个维度。</div><div class="t2-fu-tabs"><button id="t2FUTabUniversal" type="button">通用追问</button><button id="t2FUTabTheme" type="button">当前大主题专属追问</button></div><div id="t2FUItems" class="t2-fu-items"></div></section>';
 document.body.append(back);
 $('#t2FUClose').onclick=close;$('#t2FUTabUniversal').onclick=()=>render('universal');$('#t2FUTabTheme').onclick=()=>render('theme');
 back.onclick=e=>{if(e.target===back)close();};
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&back.classList.contains('open'))close();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
window.TCF_T2_FOLLOWUP={open,render};
})();
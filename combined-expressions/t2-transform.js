'use strict';
(()=>{
 const M=13,D=T2_TRANSFORM_DATA;
 const E=id=>document.getElementById(id);
 const el=(tag,text='',cls='')=>{const x=document.createElement(tag);x.textContent=text;x.className=cls;return x;};
 const btn=(text,fn,cls='')=>{const b=el('button',text,cls);b.type='button';b.onclick=fn;return b;};
 state.t2Transform=state.t2Transform||{view:'home',category:'',search:'',moduleId:'',trainMode:'convert',timeline:'present',randomSeed:0};
 state.t2TransformProgress=state.t2TransformProgress||{};
 const S=()=>state.t2Transform;
 const P=id=>state.t2TransformProgress[id]||(state.t2TransformProgress[id]={status:'new',favorite:false,notes:'',attempts:0,mastered:0,review:0});
 const save=()=>persist();
 const mod=id=>D.modules.find(x=>x.id===id);
 const controls=el('section','','hidden');controls.id='t2xControls';
 controls.innerHTML='<h2>🔄 T2 提问结构转换</h2><label>大类<select id="t2xCategory"><option value="">全部大类</option></select></label><label>搜索模块 / 关键词<input id="t2xSearch" type="search" placeholder="价格、频率、Y a-t-il、过去"></label><label>学习范围<select id="t2xScope"><option value="">全部</option><option value="new">未学习</option><option value="review">待复习</option><option value="mastered">已掌握</option><option value="favorite">收藏</option></select></label><p id="t2xCount" class="t2x-note"></p><button id="t2xReset" type="button">清除筛选</button>';
 E('practiceFilters').before(controls);
 D.categories.forEach(c=>E('t2xCategory').add(new Option(c,c)));
 const view=el('section','','hidden');view.id='t2xView';E('practice').before(view);

 // T2 transformation uses pre-generated Piper fr_FR-siwis-medium MP3, never browser TTS.
 let piperManifestPromise=null,activeAudio=null,playSerial=0;
 function stopAudio(){playSerial++;if(activeAudio){activeAudio.pause();activeAudio.removeAttribute('src');activeAudio.load();activeAudio=null;}}
 function getPiperManifest(){
   if(!piperManifestPromise)piperManifestPromise=fetch('t2-transform-audio/manifest.json?v=base45-209',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Piper 音频索引尚未发布');return r.json();}).catch(err=>{piperManifestPromise=null;throw err;});
   return piperManifestPromise;
 }
 function audio(text){
   const wrap=el('span','','t2x-actions'),status=el('span','','t2x-note');
   wrap.append(btn('🔊 Piper 法语',async()=>{
     stopAudio();const request=playSerial;status.textContent='正在加载 Piper 法语音频…';
     try{
       const manifest=await getPiperManifest();if(request!==playSerial)return;
       let filename=manifest.entries?.[text],audioDir='t2-transform-audio/';
       if(!filename && t2OverviewPiperSet.has(text)){
         const rr=await fetch('t2-overview-audio/manifest.json',{cache:'no-store'});
         if(!rr.ok)throw Error('三维速览 Piper 音频尚未发布');
         const mm=await rr.json();filename=mm.entries?.[text];audioDir='t2-overview-audio/';
       }
       if(!filename)throw Error('当前法语句子缺少 Piper 音频');
       const player=new Audio(new URL(audioDir+filename,document.baseURI).href);
       activeAudio=player;player.preload='auto';
       player.onended=()=>{if(activeAudio===player)status.textContent='朗读完成';};
       player.onerror=()=>{if(activeAudio===player)status.textContent='Piper 音频加载失败';};
       await player.play();if(request===playSerial)status.textContent='Piper · siwis 正在朗读';
     }catch(err){if(request===playSerial)status.textContent=err?.message||'音频播放失败';}
   }),status);return wrap;
 }
 function visibleModules(){
   const q=(S().search||'').toLowerCase(),cat=S().category||'',scope=E('t2xScope')?.value||'';
   return D.modules.filter(m=>{
     if(cat&&m.cat!==cat)return false;
     if(q&&!JSON.stringify(m).toLowerCase().includes(q))return false;
     if(scope){const p=P(m.id);if(scope==='favorite'){if(!p.favorite)return false;}else if(p.status!==scope)return false;}
     return true;
   });
 }
 function sync(){E('t2xCategory').value=S().category||'';E('t2xSearch').value=S().search||'';}
 function nav(){
   const n=el('nav','','t2x-actions');
   [['home','首页'],['overview','📊 12题三维速览'],['twelve','🎯 真题12问训练'],['modules','🧭 45个转换模块'],['train','🎯 结构转换训练'],['timeline','⏱ 时间线训练'],['random','🎲 综合随机训练']].forEach(x=>n.append(btn(x[1],()=>{if(x[0]==='twelve'){window.location.href='t2-12-trainer.html';return;}S().view=x[0];S().moduleId='';save();render();},S().view===x[0]?'primary':'')));
   return n;
 }
 function metrics(){
   const mastered=D.modules.filter(m=>P(m.id).status==='mastered').length,review=D.modules.filter(m=>P(m.id).status==='review').length,fav=D.modules.filter(m=>P(m.id).favorite).length;
   const box=el('div','','t2x-metrics');
   [[D.moduleCount,'核心模块'],[D.categories.length,'大系统'],[mastered,'已掌握'],[review,'待复习'],[fav,'收藏'],['3','时间线']].forEach(x=>{const d=el('div');d.append(el('strong',String(x[0])),el('span',x[1]));box.append(d);});
   return box;
 }
 function home(){
   view.append(el('h2','T2 提问结构转换训练'),el('p','目标不是背完句子，而是把“我想问什么”转换成 2–3 个自然出口，并能按过去 / 现在 / 将来切换。','t2x-note'),metrics());
   const g=el('div','','t2x-home');
   [
    ['overview','📊 12题三维速览\n疑问词 × 结构 × 时态参考分布'],
    ['twelve','🎯 真题12问训练\n直接读取7–10月真实Sujet，中文提示逐题作答'],
    ['modules','🧭 先学转换地图\n45 个核心功能，按 8 大系统归类'],
    ['train','🎯 普通问法 → 多样化\n学等义转换、自然化、信息深化'],
    ['timeline','⏱ 过去 / 现在 / 将来\n同一功能切换时间线，不机械变位'],
    ['random','🎲 综合随机\n随机功能 + 结构 + 时间线，接近真考']
   ].forEach(x=>g.append(btn(x[1],()=>{if(x[0]==='twelve'){window.location.href='t2-12-trainer.html';return;}S().view=x[0];save();render();})));
   view.append(g);
   const note=el('div','','t2x-card');note.append(el('h3','先记住这三种“转换性质”'));
   [['🟢 等义转换','信息点不变，只换结构。例：Est-ce qu’il y a… → Y a-t-il…'],
    ['🔵 同功能自然化','信息基本不变，但换成更贴场景的动词。例：être disponible → proposer / organiser / fournir。'],
    ['🟣 信息深化','从“有没有”升级成“有哪些 / 什么条件 / 为什么”。信息更深，但不再严格等义。']
   ].forEach(x=>note.append(el('p',x[0]+'：'+x[1])));
   view.append(note);
 }

 const T2_OVERVIEW_PIPER_TEXTS=["Quand commence cette activité ?","Cette activité est-elle adaptée aux débutants ?","Pourriez-vous me dire quand elle commencera ?","Est-ce que le matériel est fourni ?","Vous proposez des réductions ?","Quels cours proposez-vous ?","Pourriez-vous me dire quand la formation commencera ?","Combien coûte cette formation ?","Où cette formation aura-t-elle lieu ?","Comment est-ce que je peux m’inscrire ?","Laquelle me recommanderiez-vous ?","À qui s’adresse cette formation ?","Pourquoi conseillez-vous cette formation ?","Qu’est-ce qui sera prévu pour les débutants ?","Faut-il avoir un niveau minimum ?","Combien de temps cette formation durera-t-elle ?","Vous demandez quelles pièces justificatives ?"];
 const t2OverviewPiperSet=new Set(T2_OVERVIEW_PIPER_TEXTS);
 function overview(){
   const frame=el('section','','t2x-overview');
   frame.append(el('h2','📊 12题三维分布速览'),el('p','训练参考模板：疑问词 × 提问结构 × 时态。12题不是官方规定题数；先服从Sujet与考官回答，不为凑配额制造重复问题。','t2x-note'));
   const makeTable=(heads,rows)=>{
     const wrap=el('div','','t2x-table-wrap'),t=el('table','','t2x-table'),thead=el('thead'),tr=el('tr');
     heads.forEach(h=>tr.append(el('th',h)));thead.append(tr);t.append(thead);
     const body=el('tbody');rows.forEach(row=>{const r=el('tr');row.forEach(cell=>{const td=el('td',String(cell));if(t2OverviewPiperSet.has(String(cell)))td.append(audio(String(cell)));r.append(td);});body.append(r);});t.append(body);wrap.append(t);return wrap;
   };
   const sec=(name,description)=>{const c=el('section','','t2x-card');c.append(el('h3',name));if(description)c.append(el('p',description,'t2x-note'));frame.append(c);return c;};
   const one=sec('维度一｜疑问词 / 提问功能（12题）','允许适度重复；以下为功能类别，其中 Y a-t-il、Faut-il、Est-ce que 并非疑问代词。');
   one.append(makeTable(['疑问词类型','建议题数','典型结构'],[
    ['Quel / Quelle / Quels / Quelles',2,'Quelles activités… ?'],
    ['Combien / Combien de / Combien de temps',2,'Combien coûte… ?'],
    ['Quand / À quelle heure / À quelle date',1,'Quand aura lieu… ?'],
    ['Où / Dans quel quartier',1,'Où se trouve… ?'],
    ['Comment',1,'Comment se déroule… ?'],
    ['Lequel / Laquelle',1,'Lequel me conseilleriez-vous ?'],
    ['Qui / À qui / Avec qui',1,'À qui s’adresse… ?'],
    ['Pourquoi / Pour quelle raison',1,'Pourquoi avez-vous choisi… ?'],
    ["Qu’est-ce que / Qu’est-ce qui / En quoi",1,'En quoi consiste… ?'],
    ['Y a-t-il / Faut-il / Est-ce que',1,'Y a-t-il des conditions… ?'],
    ['合计',12,'按实际Sujet调整']
   ]));
   const two=sec('维度二｜疑问结构（12题）','参考比例：简单倒装4、复合倒装2、间接疑问2、est-ce que 3、语调疑问1。');
   const dist=[['简单倒装',4,'Quand commence cette activité ?'],['复合倒装',2,'Cette activité est-elle adaptée aux débutants ?'],['间接疑问句',2,'Pourriez-vous me dire quand elle commencera ?'],['est-ce que',3,'Est-ce que le matériel est fourni ?'],['语调疑问句',1,'Vous proposez des réductions ?']];
   const bar=el('div','','t2x-overview-bar');const cols=['#5277bb','#268e86','#8865af','#bc8844','#929aa8'];dist.forEach((d,i)=>{const part=el('span');part.style.width=(d[1]/12*100)+'%';part.style.background=cols[i];part.title=d[0]+'：'+d[1]+'题';bar.append(part);});two.append(bar,makeTable(['结构','题数','示例'],dist));
   two.append(el('p','简单倒装：变位动词与代词主语倒装，或动词置于名词主语之前；复合倒装：名词主语在前，动词后再用 il/elle/ils/elles 复指。','t2x-note'));
   const three=sec('维度三｜时态（按Sujet切换）','每个场景给出12题参考分布；间接问句可能同时含礼貌条件式与从句的时态，不能机械地把每道题只归为一种时态。');
   const profiles=[
    ['未来活动','报名课程、即将举行的活动',[5,3,1,1,0,2]],
    ['过去经历','旅行回顾、已参加的活动',[2,0,0,6,3,1]],
    ['当前服务','住房、购买和现有服务',[8,1,0,0,0,3]]
   ];
   const tense=['现在时','简单将来时','最近将来时','复合过去时','未完成过去时','条件式现在时'];
   const select=el('select');select.setAttribute('aria-label','选择Sujet时间场景');profiles.forEach((p,i)=>select.add(new Option(p[0],String(i))));
   const out=el('div');const refresh=()=>{const p=profiles[Number(select.value)||0];out.replaceChildren(el('p',p[1],'t2x-note'),makeTable(['时态','参考题数'],tense.map((n,i)=>[n,p[2][i]])));};select.onchange=refresh;three.append(select,out);refresh();
   const four=sec('三维合并｜12题实战样例','Sujet：你想报名即将举行的法语培训，向负责人询问信息。这是展示三维交叉的样例，不严格对应上方任一固定配额；“Qu’est-ce qui”本身是疑问主语结构。');
   four.append(makeTable(['#','疑问词 / 功能','疑问结构','主要时态','法语示例'],[
    [1,'Quels / 种类','简单倒装','现在时','Quels cours proposez-vous ?'],
    [2,'Quand / 时间','间接疑问','将来时','Pourriez-vous me dire quand la formation commencera ?'],
    [3,'Combien / 价格','简单倒装','现在时','Combien coûte cette formation ?'],
    [4,'Où / 地点','复合倒装','将来时','Où cette formation aura-t-elle lieu ?'],
    [5,'Comment / 报名','est-ce que','现在时',"Comment est-ce que je peux m’inscrire ?"],
    [6,'Laquelle / 选择','简单倒装','条件式','Laquelle me recommanderiez-vous ?'],
    [7,'À qui / 对象','简单倒装','现在时',"À qui s’adresse cette formation ?"],
    [8,'Pourquoi / 原因','简单倒装','现在时','Pourquoi conseillez-vous cette formation ?'],
    [9,"Qu’est-ce qui / 内容",'疑问词作主语','将来时',"Qu’est-ce qui sera prévu pour les débutants ?"],
    [10,'Faut-il / 要求','简单倒装','现在时','Faut-il avoir un niveau minimum ?'],
    [11,'Combien de temps / 时长','复合倒装','将来时','Combien de temps cette formation durera-t-elle ?'],
    [12,'Quelles / 准备','语调疑问','现在时','Vous demandez quelles pièces justificatives ?']
   ]));
   four.append(el('p','考试原则：内容不重复、提问顺畅优先；不需要在12问内强制凑齐每种疑问词、结构和时态。','t2x-note'));
   view.append(frame);
 }

 function tile(m){
   const p=P(m.id),b=btn(m.title+'\n'+m.intent,()=>{S().moduleId=m.id;S().view='detail';save();render();},'t2x-module-tile');
   const tag=el('span',(p.favorite?'★ ':'')+({new:'未学习',review:'待复习',mastered:'已掌握'}[p.status]||p.status),'t2x-note');b.append(document.createElement('br'),tag);return b;
 }
 function modulesView(){
   const rows=visibleModules();E('t2xCount').textContent=rows.length+' / '+D.moduleCount+' 个模块';
   for(const cat of D.categories){const ms=rows.filter(m=>m.cat===cat);if(!ms.length)continue;const sec=el('section','','t2x-cat');sec.append(el('h3',cat));const g=el('div','','t2x-grid');ms.forEach(m=>g.append(tile(m)));sec.append(g);view.append(sec);}
 }
 function timelineBox(m){
   const box=el('div','','t2x-card');box.append(el('h3','⏱ 时间线切换'));
   if(!m.timeline){box.append(el('p','这个功能通常不需要机械做过去 / 现在 / 将来三套。考试时先判断信息功能，再按场景选择时态。','t2x-note'));return box;}
   const g=el('div','','t2x-timeline');
   [['过去',m.timeline.past],['现在',m.timeline.present],['将来',m.timeline.future]].forEach((x,i)=>{const d=el('div');d.append(el('strong',x[0]),el('p',x[1]));if(m.zh?.timeline?.[i])d.append(el('p','中文：'+m.zh.timeline[i],'t2x-note'));d.append(audio(x[1]));g.append(d);});box.append(g);return box;
 }
 function practiceExtensionsBox(m){
   const ext=m.practiceExtensions;if(!ext)return null;
   const container=el('section','','t2x-card');
   container.append(el('h3','情境化时间线 · 三结构分别练'));
   container.append(el('p','先看对象是地点还是活动，再选相应时态；不机械套用一个过去时。','t2x-note'));
   ext.scenarios.forEach(scene=>{
     const details=document.createElement('details');details.open=true;
     details.append(el('summary',scene.title),el('p',scene.note,'t2x-note'));
     scene.rows.forEach((row,rowIndex)=>{
       const section=el('div','','t2x-form');section.append(el('strong',row.label));
       row.forms.forEach((pair,pairIndex)=>{
         const line=el('div','','t2x-example');
         line.append(el('span',pair[0]+'：','t2x-note'),el('p',pair[1]));const z=m.zh?.scenarios?.[ext.scenarios.indexOf(scene)]?.rows?.[rowIndex]?.[pairIndex];if(z)line.append(el('p','中文：'+z,'t2x-note'));line.append(audio(pair[1]));
         section.append(line);
       });details.append(section);
     });container.append(details);
   });
   const advanced=el('section','','t2x-card');advanced.append(el('h3','高级转换 · 条件式 / 虚拟式 / 间接疑问'));
   advanced.append(el('p','按真实提问目的选用；这里是附加句型，不覆盖原转换树。','t2x-note'));
   ext.advanced.forEach((item,advancedIndex)=>{
     const d=el('div','','t2x-form');d.append(el('strong',item.title),el('p',item.fr));if(m.zh?.advanced?.[advancedIndex])d.append(el('p','中文：'+m.zh.advanced[advancedIndex],'t2x-note'));d.append(el('p',item.note,'t2x-note'),audio(item.fr));advanced.append(d);
   });
   return [container,advanced];
 }
 function personVariantsBox(m){
   const variants=m.personVariants||[];if(!variants.length)return null;
   const box=el('section','','t2x-card');box.append(el('h3','Vous / Tu · 人称切换'),el('p','按考官设定的关系选称呼；仅显示需要第二人称变位的问句。','t2x-note'));
   const controls=el('div','','t2x-actions'),listing=el('div');
   let person=S().personMode==='tu'?'tu':'vous';
   const formal=btn('Vous · 正式',()=>{person='vous';S().personMode=person;save();draw();}),informal=btn('Tu · 熟人',()=>{person='tu';S().personMode=person;save();draw();});
   controls.append(formal,informal);box.append(controls,listing);
   function draw(){
     formal.classList.toggle('primary',person==='vous');informal.classList.toggle('primary',person==='tu');
     listing.replaceChildren();
     variants.forEach(item=>{
       const card=el('div','','t2x-form'),fr=item[person],zh=item[person==='vous'?'zhVous':'zhTu'];
       card.append(el('strong',fr),el('p','中文：'+zh,'t2x-note'),audio(fr));listing.append(card);
     });
   }
   draw();return box;
 }
 function detail(){
   const m=mod(S().moduleId);if(!m){S().view='modules';modulesView();return;}const p=P(m.id);
   const top=el('div','','t2x-actions');top.append(btn('← 返回模块地图',()=>{S().view='modules';S().moduleId='';render();}),btn(p.favorite?'★ 已收藏':'☆ 收藏',()=>{p.favorite=!p.favorite;save();render();}),btn('✅ 我已掌握',()=>{p.status='mastered';p.mastered++;save();render();}),btn('❌ 需要复习',()=>{p.status='review';p.review++;save();render();}));view.append(top);
   const c=el('article','','t2x-card');c.append(el('p',m.cat,'t2x-note'),el('h2',m.title),el('p',m.intent,'t2x-intent'));
   const base=el('div','','t2x-base');base.append(el('strong','最普通的脑内问法'),el('p',m.base));if(m.zh?.base)base.append(el('p','中文：'+m.zh.base,'t2x-note'));if(m.baseExample){base.append(el('p','例句：'+m.baseExample));if(m.zh?.baseExample)base.append(el('p','中文：'+m.zh.baseExample,'t2x-note'));base.append(audio(m.baseExample));}c.append(base);
   const rule=el('div','','t2x-rule');rule.append(el('strong','转换规则'),el('p',m.rule));c.append(rule);
   c.append(el('h3','转换树'));
   m.forms.forEach((f,i)=>{const d=el('div','','t2x-form');d.append(el('span',f[0],'t2x-kind'),el('strong',f[1]));if(m.zh?.forms?.[i]?.pattern)d.append(el('p','结构中文：'+m.zh.forms[i].pattern,'t2x-note'));d.append(el('p',f[2]));if(m.zh?.forms?.[i]?.example)d.append(el('p','例句中文：'+m.zh.forms[i].example,'t2x-note'));d.append(audio(f[2]));c.append(d);});
   const src=el('div','','t2x-source');src.append(el('strong','你的真实口语案例 · '+m.real.recordId),el('p','原稿：'+m.real.original,'raw'),el('p','优化：'+m.real.better,'better'));c.append(src);
   view.append(c,timelineBox(m));
   const extensions=practiceExtensionsBox(m);if(extensions)view.append(...extensions);
   const personBox=personVariantsBox(m);if(personBox)view.append(personBox);
   const notes=el('div','','t2x-card');notes.append(el('h3','📝 我的理解 / 记忆钩子'));const ta=el('textarea');ta.style.width='100%';ta.style.minHeight='80px';ta.value=p.notes||'';ta.oninput=()=>{p.notes=ta.value;save();};notes.append(ta);view.append(notes);
   const practice=el('div','','t2x-actions');practice.append(btn('用这个模块做转换训练',()=>{S().view='train';S().moduleId=m.id;save();render();},'primary'),btn('用这个模块练时间线',()=>{S().view='timeline';S().moduleId=m.id;save();render();}));view.append(practice);
 }
 function pickModule(requireTimeline=false){
   let rows=visibleModules();if(S().moduleId)rows=rows.filter(x=>x.id===S().moduleId);if(requireTimeline)rows=rows.filter(x=>x.timeline);
   if(!rows.length)rows=D.modules.filter(x=>!requireTimeline||x.timeline);
   const idx=(S().randomSeed||0)%rows.length;return rows[idx];
 }
 function nextRandom(){S().randomSeed=(S().randomSeed||0)+1;save();render();}
 function selfMark(m,ok){const p=P(m.id);p.attempts++;if(ok){p.mastered++;p.status='mastered';}else{p.review++;p.status='review';}save();nextRandom();}
 function training(kind){
   const requireTimeline=kind==='timeline',m=pickModule(requireTimeline);if(!m)return;
   const wrap=el('div','','t2x-train'),answer=el('div','','t2x-answer hidden');
   wrap.append(el('p',m.cat+' · '+m.title,'t2x-note'));
   if(kind==='convert'){
     wrap.append(el('h2','把普通问法转换成至少 2 种结构'),el('p',m.base,'t2x-intent'),el('p','要求：尽量写一个 🟢/🔵 转换，再写一个 🟣 深化。','t2x-note'));
   }else if(kind==='timeline'){
     const keys=['past','present','future'],target=keys[(S().randomSeed||0)%3],zh={past:'过去',present:'现在',future:'将来'}[target];
     wrap.append(el('h2','把问题切换到「'+zh+'」时间线'),el('p',m.timeline.present,'t2x-intent'),el('p','不要只改动词词尾；如果语义不自然，可以换结构。','t2x-note'));
     answer.dataset.target=target;
   }else if(kind==='random'){
     const modes=['convert','intent','timeline'],available=m.timeline?modes:['convert','intent'],sub=available[(S().randomSeed||0)%available.length];answer.dataset.sub=sub;
     if(sub==='intent'){wrap.append(el('h2','只看中文意图，现场生成 2–3 个法语问法'),el('p',m.intent,'t2x-intent'));}
     else if(sub==='timeline'){const keys=['past','present','future'],target=keys[(S().randomSeed||0)%3],zh={past:'过去',present:'现在',future:'将来'}[target];answer.dataset.target=target;wrap.append(el('h2','综合题：'+m.title+' · '+zh+'时间线'),el('p',m.intent,'t2x-intent'));}
     else wrap.append(el('h2','综合题：普通问法 → 多样化'),el('p',m.base,'t2x-intent'));
   }else{
     wrap.append(el('h2','根据中文意图生成法语问题'),el('p',m.intent,'t2x-intent'));
   }
   const ta=el('textarea');ta.placeholder='先口头生成，再按需要写下来。不要追求唯一答案。';wrap.append(ta);
   const reveal=btn('显示转换思路',()=>{answer.classList.remove('hidden');reveal.disabled=true;});
   wrap.append(reveal);
   const sub=answer.dataset.sub||kind,target=answer.dataset.target;
   if((kind==='timeline'||sub==='timeline')&&m.timeline){const t=target||'past';answer.append(el('strong','参考时间线'),el('p',m.timeline[t]));const index={past:0,present:1,future:2}[t];if(m.zh?.timeline?.[index])answer.append(el('p','中文：'+m.zh.timeline[index],'t2x-note'));answer.append(audio(m.timeline[t]));}
   else{answer.append(el('strong','参考转换树'));m.forms.forEach((f,i)=>{answer.append(el('p',f[0]+' '+f[2]));if(m.zh?.forms?.[i])answer.append(el('p','中文：'+m.zh.forms[i].example,'t2x-note'));});}
   answer.append(el('p','规则：'+m.rule,'t2x-note'),el('p','你的真实案例：'+m.real.original+' → '+m.real.better,'t2x-note'));
   wrap.append(answer);
   const bar=el('div','','t2x-actions');bar.append(btn('✅ 我能自己生成',()=>selfMark(m,true)),btn('❌ 还需要再练',()=>selfMark(m,false)),btn('换一题',nextRandom));wrap.append(bar);view.append(wrap);
 }
 function render(){
   if(mode!==M)return;stopAudio();view.replaceChildren();sync();view.append(nav());E('t2xCount').textContent=visibleModules().length+' / '+D.moduleCount+' 个模块';
   if(S().view==='home')home();else if(S().view==='overview')overview();else if(S().view==='modules')modulesView();else if(S().view==='detail')detail();else if(S().view==='train')training('convert');else if(S().view==='timeline')training('timeline');else if(S().view==='random')training('random');else home();
 }
 E('t2xCategory').onchange=()=>{S().category=E('t2xCategory').value;save();render();};
 E('t2xSearch').oninput=()=>{S().search=E('t2xSearch').value;save();render();};
 E('t2xScope').onchange=()=>render();
 E('t2xReset').onclick=()=>{S().category='';S().search='';E('t2xScope').value='';sync();save();render();};

 function activate(){
   const active=mode===M;controls.classList.toggle('hidden',!active);view.classList.toggle('hidden',!active);
   if(active){['practiceFilters','practiceStats','practice','errorsView','vocabularyView','batchControls','batchView','studyView','studyReviewView','t2InversionControls','t2InversionView','speechFlowControls','speechFlowView','c1Controls','c1View','oralControls','oralView','t2eControls','t2eView'].forEach(id=>E(id)?.classList.add('hidden'));render();}
 }
 const oldSet=setModule;
 setModule=function(m,fresh=false){stopAudio();if(m===M){if(mode!==M){oldSet(M,fresh);current=null;order=null;}document.querySelectorAll('[data-module]').forEach(b=>{const a=b.dataset.module===String(M);b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});activate();save();}else{oldSet(m,fresh);activate();}};
 const oldDraft=saveDraft;saveDraft=function(){if(mode!==M)oldDraft();};
 window.T2_TRANSFORM={data:D,render,progress:P};
 activate();
})();
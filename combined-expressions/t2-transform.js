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

 function audio(text){
   const wrap=el('span','','t2x-actions'),status=el('span','','t2x-note');
   wrap.append(btn('🔊 法语',()=>{const s=window.speechSynthesis;if(!s){status.textContent='浏览器不支持朗读';return;}const vs=s.getVoices().filter(v=>/^fr[-_]/i.test(v.lang));if(!vs.length){status.textContent='请先启用法语语音';return;}s.cancel();const q=new SpeechSynthesisUtterance(text);q.voice=vs.find(v=>/^fr-CA$/i.test(v.lang))||vs.find(v=>/^fr-FR$/i.test(v.lang))||vs[0];q.lang=q.voice.lang;s.speak(q);status.textContent='正在朗读';q.onend=()=>status.textContent='朗读完成';}),status);return wrap;
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
   [['home','首页'],['modules','🧭 45个转换模块'],['train','🎯 结构转换训练'],['timeline','⏱ 时间线训练'],['random','🎲 综合随机训练']].forEach(x=>n.append(btn(x[1],()=>{S().view=x[0];S().moduleId='';save();render();},S().view===x[0]?'primary':'')));
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
    ['modules','🧭 先学转换地图\n45 个核心功能，按 8 大系统归类'],
    ['train','🎯 普通问法 → 多样化\n学等义转换、自然化、信息深化'],
    ['timeline','⏱ 过去 / 现在 / 将来\n同一功能切换时间线，不机械变位'],
    ['random','🎲 综合随机\n随机功能 + 结构 + 时间线，接近真考']
   ].forEach(x=>g.append(btn(x[1],()=>{S().view=x[0];save();render();})));
   view.append(g);
   const note=el('div','','t2x-card');note.append(el('h3','先记住这三种“转换性质”'));
   [['🟢 等义转换','信息点不变，只换结构。例：Est-ce qu’il y a… → Y a-t-il…'],
    ['🔵 同功能自然化','信息基本不变，但换成更贴场景的动词。例：être disponible → proposer / organiser / fournir。'],
    ['🟣 信息深化','从“有没有”升级成“有哪些 / 什么条件 / 为什么”。信息更深，但不再严格等义。']
   ].forEach(x=>note.append(el('p',x[0]+'：'+x[1])));
   view.append(note);
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
   [['过去',m.timeline.past],['现在',m.timeline.present],['将来',m.timeline.future]].forEach(x=>{const d=el('div');d.append(el('strong',x[0]),el('p',x[1]),audio(x[1]));g.append(d);});box.append(g);return box;
 }
 function detail(){
   const m=mod(S().moduleId);if(!m){S().view='modules';modulesView();return;}const p=P(m.id);
   const top=el('div','','t2x-actions');top.append(btn('← 返回模块地图',()=>{S().view='modules';S().moduleId='';render();}),btn(p.favorite?'★ 已收藏':'☆ 收藏',()=>{p.favorite=!p.favorite;save();render();}),btn('✅ 我已掌握',()=>{p.status='mastered';p.mastered++;save();render();}),btn('❌ 需要复习',()=>{p.status='review';p.review++;save();render();}));view.append(top);
   const c=el('article','','t2x-card');c.append(el('p',m.cat,'t2x-note'),el('h2',m.title),el('p',m.intent,'t2x-intent'));
   const base=el('div','','t2x-base');base.append(el('strong','最普通的脑内问法'),el('p',m.base));c.append(base);
   const rule=el('div','','t2x-rule');rule.append(el('strong','转换规则'),el('p',m.rule));c.append(rule);
   c.append(el('h3','转换树'));
   m.forms.forEach(f=>{const d=el('div','','t2x-form');d.append(el('span',f[0],'t2x-kind'),el('strong',f[1]),el('p',f[2]),audio(f[2]));c.append(d);});
   const src=el('div','','t2x-source');src.append(el('strong','你的真实口语案例 · '+m.real.recordId),el('p','原稿：'+m.real.original,'raw'),el('p','优化：'+m.real.better,'better'));c.append(src);
   view.append(c,timelineBox(m));
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
   if((kind==='timeline'||sub==='timeline')&&m.timeline){const t=target||'past';answer.append(el('strong','参考时间线'),el('p',m.timeline[t]),audio(m.timeline[t]));}
   else{answer.append(el('strong','参考转换树'));m.forms.forEach(f=>answer.append(el('p',f[0]+' '+f[2])));}
   answer.append(el('p','规则：'+m.rule,'t2x-note'),el('p','你的真实案例：'+m.real.original+' → '+m.real.better,'t2x-note'));
   wrap.append(answer);
   const bar=el('div','','t2x-actions');bar.append(btn('✅ 我能自己生成',()=>selfMark(m,true)),btn('❌ 还需要再练',()=>selfMark(m,false)),btn('换一题',nextRandom));wrap.append(bar);view.append(wrap);
 }
 function render(){
   if(mode!==M)return;view.replaceChildren();sync();view.append(nav());E('t2xCount').textContent=visibleModules().length+' / '+D.moduleCount+' 个模块';
   if(S().view==='home')home();else if(S().view==='modules')modulesView();else if(S().view==='detail')detail();else if(S().view==='train')training('convert');else if(S().view==='timeline')training('timeline');else if(S().view==='random')training('random');else home();
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
 setModule=function(m,fresh=false){window.speechSynthesis?.cancel();if(m===M){if(mode!==M){oldSet(M,fresh);current=null;order=null;}document.querySelectorAll('[data-module]').forEach(b=>{const a=b.dataset.module===String(M);b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});activate();save();}else{oldSet(m,fresh);activate();}};
 const oldDraft=saveDraft;saveDraft=function(){if(mode!==M)oldDraft();};
 window.T2_TRANSFORM={data:D,render,progress:P};
 activate();
})();
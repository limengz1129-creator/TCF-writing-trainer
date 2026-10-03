'use strict';
(()=>{
 const MODULE=9, data=C1_GRAMMAR_DATA, entries=data.entries, byId=new Map(entries.map(e=>[e.id,e]));
 const n=s=>String(s||'').normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?;,：。！？]/g,'').replace(/\s+/g,' ').trim();
 const el=(tag,cls='',text='')=>{const x=document.createElement(tag);x.className=cls;x.textContent=text;return x;};
 const button=(text,fn,cls='')=>{const x=el('button',cls,text);x.type='button';x.onclick=fn;return x;};
 const fresh={category:null,subcategory:'',view:'overview',priority:'',search:'',status:'',size:10,offset:0,type:'',question:0,timer:5,mixed:false};
 state.c1Grammar={...fresh,...state.c1Grammar};const ui=()=>state.c1Grammar;
 const record=id=>{const r=rec(id);return r.c1||(r.c1={masteryStatus:'new',favorite:false,userNote:'',userEditedContent:null,hesitations:0,streak:0,wrongCount:0,lastWrong:0});};
 const effective=e=>{const r=record(e.id);return {...e,...r.userEditedContent,id:e.id};};
 const text=e=>effective(e).french;
 const save=()=>persist();
 let timer=null,editing=null,queue=[],question=null,revealed=false,typed='',result='',selected=null;
 const controls=el('section','hidden');controls.id='c1Controls';
 controls.innerHTML='<strong>C1 语法专项训练</strong><label for="c1Category">专项</label><select id="c1Category"><option value="">全部专项 / 混合</option></select><label for="c1Subcategory">专项内分类</label><select id="c1Subcategory"><option value="">全部分类</option></select><label for="c1Priority">原资料优先级</label><select id="c1Priority"><option value="">全部</option><option value="3">核心必会 ★★★</option><option value="2">C1 重点 ★★</option><option value="1">补充 ★</option></select><p class="note">未明确采用三星分级的内容只在“全部”中显示，保留原始优先级。</p><label for="c1Status">练习范围</label><select id="c1Status"><option value="">全部词条</option><option value="new">未学习</option><option value="mastered">已掌握</option><option value="weak">稍弱</option><option value="unknown">不会</option><option value="favorite">收藏</option><option value="note">有笔记</option></select><label for="c1Search">搜索中文 / 法语 / 标签</label><input id="c1Search" type="search" placeholder="例如 bien que、措施、prendre"><label for="c1Size">每批学习词条</label><select id="c1Size"><option value="5">5 条</option><option value="10">10 条</option><option value="20">20 条</option></select><p id="c1ListCount" class="note"></p><div id="c1List" class="list"></div>';
 $('practiceFilters').before(controls);
 data.categories.forEach((name,i)=>$('c1Category').add(new Option(name,String(i))));
 const view=el('section','hidden');view.id='c1View';view.setAttribute('aria-label','C1 语法专项训练');$('practice').before(view);
 const dialog=el('dialog','c1-dialog');dialog.id='c1EditDialog';
 dialog.innerHTML='<form id="c1EditForm"><h2>✏️ 编辑词条</h2><label for="c1EditChinese">中文</label><textarea id="c1EditChinese" required></textarea><label for="c1EditFrench">法语</label><textarea id="c1EditFrench" lang="fr" required></textarea><label for="c1EditExamples">例句（每行一个，与译文逐行对应）</label><textarea id="c1EditExamples" lang="fr"></textarea><label for="c1EditTranslations">例句中文翻译（每行一个）</label><textarea id="c1EditTranslations"></textarea><label for="c1EditRule">使用规则 / 说明</label><textarea id="c1EditRule"></textarea><label for="c1EditFunction">功能</label><textarea id="c1EditFunction"></textarea><label for="c1EditErrors">常见错误</label><textarea id="c1EditErrors"></textarea><label for="c1EditNotes">使用提醒</label><textarea id="c1EditNotes"></textarea><label for="c1EditTags">标签（逗号分隔）</label><input id="c1EditTags"><p class="note">修改在各专项与模式共用。例句修改后，相关练习会依据新例句重新生成。</p><div class="c1-actions"><button class="primary" type="submit">保存</button><button type="button" id="c1EditCancel">取消</button></div></form>';document.body.append(dialog);
 const synth=window.speechSynthesis;let speechToken=0;
 function stopSpeech(){speechToken++;synth?.cancel();}
 function audioControls(getText){const row=el('div','c1-actions c1-audio'),status=el('span','note');status.setAttribute('role','status');
  function speak(rate){stopSpeech();window.TCF_AUDIO?.stop();const token=speechToken;
   if(!synth||!window.SpeechSynthesisUtterance){status.textContent='当前浏览器不支持朗读，请用 Chrome 或 Edge。';return;}
   const voices=synth.getVoices().filter(v=>/^fr(?:[-_]|$)/i.test(v.lang));
   if(!voices.length){status.textContent='尚未找到法语语音，请在系统语音设置中添加法语语音后重试。';return;}
   const raw=getText(),spoken=String(raw||'').replace(/→/g,', ').replace(/\+/g,', ').replace(/…|\.{3}|_{2,}/g,', ').replace(/\//g,', ').trim();
   if(!spoken){status.textContent='此项没有可朗读的法语。';return;}
   const u=new SpeechSynthesisUtterance(spoken);u.voice=voices.find(v=>v.lang.toLowerCase()==='fr-fr')||voices[0];u.lang=u.voice.lang;u.rate=rate;
   u.onstart=()=>{if(token===speechToken)status.textContent=rate<1?'正在慢速朗读……':'正在朗读……';};u.onend=()=>{if(token===speechToken)status.textContent='朗读完成';};u.onerror=event=>{if(token===speechToken)status.textContent='朗读未完成：'+event.error+'，请重试。';};
   status.textContent='正在准备法语朗读……';synth.speak(u);
  }
  row.append(button('🔊 法语朗读',()=>speak(1)),button('🐢 慢速',()=>speak(.75)),button('停止',()=>{stopSpeech();status.textContent='已停止';}),status);return row;
 }
 window.addEventListener('pagehide',stopSpeech);
 function stopTimer(){if(timer)clearInterval(timer);timer=null;}
 function edit(e){editing=e;const v=effective(e);$('c1EditChinese').value=v.chinese;$('c1EditFrench').value=v.french;$('c1EditExamples').value=v.examples.map(x=>x.french).join('\n');$('c1EditTranslations').value=v.examples.map(x=>x.chinese).join('\n');for(const [key,id]of [['rule','c1EditRule'],['function','c1EditFunction'],['commonErrors','c1EditErrors'],['notes','c1EditNotes']])$(id).value=v[key].join('\n');$('c1EditTags').value=v.tags.join(', ');dialog.showModal();}
 $('c1EditCancel').onclick=()=>{editing=null;dialog.close();};dialog.addEventListener('cancel',()=>editing=null);
 const lines=id=>$(id).value.split('\n').map(s=>s.trim());
 $('c1EditForm').onsubmit=event=>{event.preventDefault();if(!editing)return;const r=record(editing.id),fr=lines('c1EditExamples'),zh=lines('c1EditTranslations');r.userEditedContent={chinese:$('c1EditChinese').value.trim(),french:$('c1EditFrench').value.trim(),examples:fr.map((s,i)=>({french:s,chinese:zh[i]||'',sourceFile:'用户编辑'})).filter(x=>x.french),translations:zh.filter(Boolean),rule:lines('c1EditRule').filter(Boolean),function:lines('c1EditFunction').filter(Boolean),commonErrors:lines('c1EditErrors').filter(Boolean),notes:lines('c1EditNotes').filter(Boolean),tags:$('c1EditTags').value.split(/[,，]/).map(s=>s.trim()).filter(Boolean)};syncAdapter(editing);editing=null;dialog.close();save();rebuildQueue();render();renderList();};
 function syncAdapter(e){const x=DATA.find(x=>x.id===e.id),v=effective(e);if(x){x.fr=v.french;x.zh=v.chinese;if(x.members[0]){x.members[0].fr=v.french;x.members[0].zh=v.chinese;}}}
 function matches(e){const u=ui(),v=effective(e),r=record(e.id);return (u.category===null||e.memberships.some(m=>m.category===u.category&&(!u.subcategory||m.subcategory===u.subcategory)))&&(!u.priority||e.priority===Number(u.priority))&&(!u.status||(u.status==='favorite'?r.favorite:u.status==='note'?r.userNote.trim():r.masteryStatus===u.status))&&(!u.search||n([v.chinese,v.french,...v.tags,...v.rule].join(' ')).includes(n(u.search)));}
 function pool(){return entries.filter(matches);}
 function reviewSort(items){return [...items].sort((a,b)=>{
  const rank=e=>{const r=record(e.id);return r.masteryStatus==='unknown'?0:r.masteryStatus==='weak'?1:rec(e.id).error&&!rec(e.id).error.resolved?2:r.hesitations>=2?3:r.favorite?4:r.userNote.trim()?5:r.streak>=3?7:6;};
  const ra=record(a.id),rb=record(b.id);return rank(a)-rank(b)||rb.wrongCount-ra.wrongCount||rb.lastWrong-ra.lastWrong||ra.streak-rb.streak;
 });}
 function mark(e,status,source='learning'){const r=record(e.id);r.masteryStatus=status;
  if(status==='mastered'){r.hesitations=0;if(rec(e.id).error)rec(e.id).error.resolved=true;}
  if(source!=='learning'){const original=rec(e.id);original.attempts++;original.last=status==='mastered';original[status==='mastered'?'correct':'wrong']++;
   if(status==='mastered'){r.streak++;if(original.error)original.error.resolved=true;}else{r.streak=0;r.wrongCount++;r.lastWrong=Date.now();if(status==='weak')r.hesitations++;original.error={answer:typed||'自评：'+(status==='weak'?'有停顿':'不会'),count:(original.error?.count||0)+1,resolved:false,date:new Date().toISOString()};}}
  save();renderList();if(source==='learning')render();
 }
 function note(e){const r=record(e.id),d=el('details','c1-note'),s=el('summary','',r.userNote?'笔记 · 已保存':'笔记');const area=el('textarea');area.value=r.userNote;area.dataset.c1Note=e.id;area.setAttribute('aria-label','词条笔记');area.placeholder='记下容易漏掉的小词或自己的例句……';area.oninput=()=>{r.userNote=area.value;s.textContent=area.value?'笔记 · 已保存':'笔记';save();};d.append(s,area);return d;}
 function tools(e,assessment=false){const r=record(e.id),a=el('div','c1-actions');
  for(const [label,status]of (assessment?[['顺利','mastered'],['有停顿','weak'],['不会','unknown']]:[['掌握','mastered'],['稍弱','weak'],['不会','unknown']])){
   const b=button(label,()=>{mark(e,status,assessment?'practice':'learning');if(assessment){result='已记录：'+label;renderQuestion();}},r.masteryStatus===status?'primary':'');b.dataset.mastery=status;b.setAttribute('aria-pressed',String(r.masteryStatus===status));a.append(b);}
  a.append(button(r.favorite?'★ 已收藏':'☆ 收藏',()=>{r.favorite=!r.favorite;save();render();renderList();}),button('✏️ 编辑',()=>edit(e)));return a;
 }
 function sourceDetails(e){const d=el('details'),s=el('summary','c1-source-summary','来源与原始写法 · '+e.sourceFiles.length+' 个文件');d.append(s);
  d.addEventListener('toggle',()=>{if(!d.open||d.dataset.loaded)return;d.dataset.loaded='1';const v=el('div','c1-source-content');v.textContent=e.sourceRefs.map(r=>r.file+' · '+r.location).join('\n')+(e.variants.length?'\n原始变体：\n'+e.variants.join('\n'):'');d.append(v);});return d;
 }
 function card(e){const v=effective(e),wrap=el('article','c1-entry');wrap.dataset.c1Id=e.id;wrap.append(el('h3','',v.chinese),el('div','c1-french',v.french));const tags=el('div','c1-tags');if(e.priority)tags.append(el('span','c1-tag','★'.repeat(e.priority)));for(const t of v.tags)tags.append(el('span','c1-tag',t));wrap.append(tags,audioControls(()=>effective(e).french));
  const body=el('div','c1-body');for(const [label,values]of [['功能',v.function],['使用规则',v.rule],['常见错误',v.commonErrors],['使用提醒',v.notes],['原资料优先级',e.priorityLabels]])if(values.length)body.append(el('p','',label+'：\n'+values.join('\n')));
  for(const x of v.examples){const p=el('p');p.append(el('strong','','例句：'),el('div','c1-french',x.french),audioControls(()=>x.french),el('div','',x.chinese||'原文件未提供该例句的中文翻译'));if(x.translationVariants?.length)p.append(el('small','','其他原文译法：'+x.translationVariants.join(' / ')));body.append(p);}wrap.append(body,tools(e),note(e),sourceDetails(e));return wrap;
 }
 function groups(items){const map=new Map();for(const e of items){const ms=e.memberships.filter(m=>ui().category===null||m.category===ui().category);const sub=ms.find(m=>!ui().subcategory||m.subcategory===ui().subcategory)?.subcategory||e.subcategory;
  let key=e.kind==='verb'?sub:e.kind==='collocation'?'高频固定搭配 · '+sub:e.kind==='adjective'?sub:e.kind==='rule'?'规则提示':sub;
  if(ui().category===null)key=data.categories[e.category]+' · '+key;if(!map.has(key))map.set(key,[]);map.get(key).push(e);}return map;
 }
 function overview(items){for(const [name,rows]of groups(items)){view.append(el('h3','',name+' · '+rows.length));table(rows);}if(ui().category===6){const verbs=items.filter(e=>e.kind==='verb');view.append(el('h3','','高频动词 · '+verbs.length));table(verbs,'lemma');view.append(el('h3','','高频表达 · '+verbs.length));table(verbs,'expression');}}
 function table(rows,expression=false){const t=el('table','c1-table'),head=el('thead'),tr=el('tr');tr.append(el('th','','中文'),el('th','','法语'));for(const th of tr.children)th.scope='col';head.append(tr);const body=el('tbody');
  for(const e of rows){const v=effective(e),r=el('tr');r.dataset.c1Id=e.id;const zh=el('td','',v.chinese+(e.priority?' '+'★'.repeat(e.priority):'')),fr=el('td');let display=v.french;if(expression==='expression'&&v.examples[0])display=v.examples[0].french.split(',')[0];if(expression==='lemma')display=v.notes.find(t=>t.startsWith('原形：'))?.slice(3)||v.french;fr.append(el('span','',display),audioControls(()=>display));const d=el('details'),s=el('summary','',record(e.id).userNote?'笔记已保存 · 操作':'笔记 / 编辑 / 状态');d.append(s,tools(e),note(e));fr.append(d);r.append(zh,fr);body.append(r);}t.append(head,body);view.append(t);
 }
 const types={'zh-fr':'中文 → 法语结构','fr-zh':'结构 → 中文 / 用法',cloze:'填空 / 变位',select:'句型选择',transform:'句型转换',oral:'口语快速反应',correct:'纠错'};
 const conversionSpecs=[
  ['Bien que + subjonctif','Les réseaux sociaux sont pratiques.\nIls peuvent réduire les interactions en face à face.','使用 Bien que 合并。','Bien que les réseaux sociaux soient pratiques, ils peuvent réduire les interactions en face à face.'],
  ['Pour que + subjonctif','Les autorités offrent des cours de langue accessibles.\nLes immigrants peuvent mieux s’intégrer.','使用 Pour que 合并，突出目的。','Pour que les immigrants puissent mieux s’intégrer, les autorités offrent des cours de langue accessibles.'],
  ['Si + imparfait → conditionnel présent','Les transports publics ne sont pas assez efficaces.\nDavantage de personnes pourraient les utiliser.','假设公共交通更高效，用 Si + imparfait 表达。','Si les transports publics étaient plus efficaces, davantage de personnes pourraient les utiliser.'],
  ['ne…pas seulement','Les activités associatives permettent de créer des liens.\nElles permettent de mieux comprendre la culture locale.','使用 ne…pas seulement…, mais aussi… 合并。','Les activités associatives ne permettent pas seulement de créer des liens, mais aussi de mieux comprendre la culture locale.'],
  ['ne…que','Cette solution offre un avantage.','使用 ne…que 表达“只提供一个优点”。','Cette solution n’offre qu’un avantage.'],
  ['ne…ni…ni','Cette mesure ne réduit pas la pollution.\nElle ne réduit pas les inégalités.','使用 ne…ni…ni 合并。','Cette mesure ne réduit ni la pollution ni les inégalités.'],
  ['aucun / aucune…ne','Une technologie ne peut pas remplacer complètement les échanges en face à face.','用 Aucune technologie 表达“任何技术都无法……”。','Aucune technologie ne peut remplacer complètement les échanges en face à face.'],
  ['qui + verbe','Les personnes participent à des activités locales.\nCes personnes s’intègrent généralement plus facilement.','用 qui 合并。','Les personnes qui participent à des activités locales s’intègrent généralement plus facilement.'],
  ['dont + proposition','L’accès au logement est un problème.\nDe nombreux jeunes se préoccupent de ce problème.','用 dont 合并，保留 se préoccuper de 的关系。','L’accès au logement est un problème dont de nombreux jeunes se préoccupent.'],
  ['ce qui + verbe','Le télétravail permet de gagner du temps.\nCela améliore parfois la qualité de vie.','用 ce qui 合并。','Le télétravail permet de gagner du temps, ce qui améliore parfois la qualité de vie.'],
  ['C’est… qui…','Le gouvernement doit prendre des mesures adaptées.','用 C’est… qui… 强调主语。','C’est le gouvernement qui doit prendre des mesures adaptées.'],
  ['C’est… que…','Le gouvernement doit prendre des mesures adaptées.','用 Ce sont… que… 强调复数宾语。','Ce sont des mesures adaptées que le gouvernement doit prendre.'],
  ['en avoir besoin','Les nouveaux arrivants ont besoin d’un accompagnement adapté.','用 en 替换 d’un accompagnement adapté。','Les nouveaux arrivants en ont besoin.'],
  ['en profiter','Les nouveaux arrivants devraient profiter pleinement des formations linguistiques gratuites.','用 en 替换 des formations linguistiques gratuites。','Les nouveaux arrivants devraient en profiter pleinement.'],
  ['en tenir compte','Il faudrait tenir compte des limites du télétravail.','用 en 替换 des limites du télétravail。','Il faudrait en tenir compte.'],
  ['s’en servir','Les élèves doivent apprendre à se servir de l’intelligence artificielle de manière responsable.','用 en 替换 de l’intelligence artificielle。','Les élèves doivent apprendre à s’en servir de manière responsable.'],
  ['en utilisant','Les jeunes utilisent les réseaux sociaux de manière raisonnable.\nIls peuvent profiter de leurs avantages tout en limitant certains risques.','用 Gérondif 表达“通过合理使用……”。','En utilisant les réseaux sociaux de manière raisonnable, les jeunes peuvent profiter de leurs avantages tout en limitant certains risques.'],
  ['en prenant','Les autorités prennent des mesures adaptées.\nElles pourraient mieux protéger les personnes vulnérables.','用 Gérondif 合并，两部分主语保持一致。','En prenant des mesures adaptées, les autorités pourraient mieux protéger les personnes vulnérables.'],
  ['parce que + indicatif','Les loyers augmentent.\nSe loger devient difficile.','使用 parce que 表达原因。','Se loger devient difficile parce que les loyers augmentent.'],
  ['c’est pourquoi + indicatif','Les loyers augmentent.\nSe loger devient difficile.','使用 c’est pourquoi 表达结果。','Les loyers augmentent, c’est pourquoi se loger devient difficile.'],
  ['pour + infinitif','Les jeunes participent à des activités locales.\nIls veulent mieux comprendre la culture locale.','用 pour + infinitif 合并，保持同一主语。','Les jeunes participent à des activités locales pour mieux comprendre la culture locale.'],
  ['Certes…, mais…','Le télétravail est pratique.\nIl peut entraîner un certain isolement.','用 Certes…, mais… 做让步。','Certes, le télétravail est pratique, mais il peut entraîner un certain isolement.']
 ];
 const corrections=[['nouveau / nouvelle','un nouveau emploi','un nouvel emploi','阳性单数元音前使用 nouvel。'],['beau / belle','un beau avenir','un bel avenir','阳性单数元音前使用 bel。'],['vieux / vieille','un vieux ami','un vieil ami','阳性单数元音前使用 vieil。'],['nombreux / nombreuse','des nombreux avantages','de nombreux avantages','复数名词前置形容词前 des 通常变 de。'],['être conscient de','Je suis consciente les risques.','Je suis consciente des risques.','conscient de：保留 de，并与 les 缩合成 des。'],['rester motivé','Les étudiants restent motivant.','Les étudiants restent motivés.','学生有动力是 motivés；motivant 描述事物能激励人。']];
 const find=fr=>entries.find(e=>n(e.french)===n(fr)||e.variants.some(v=>n(v)===n(fr)));
 const conversions=new Map();conversionSpecs.forEach(([fr,stem,instruction,answer])=>{const e=find(fr);if(e){if(!conversions.has(e.id))conversions.set(e.id,[]);conversions.get(e.id).push({stem,instruction,answer,derived:true});}});
 const fixes=new Map();corrections.forEach(([fr,stem,answer,explanation])=>{const e=find(fr);if(e)fixes.set(e.id,{stem,answer,explanation});});
 function questionsFor(e){const v=effective(e),qs=[];if(e.kind!=='rule')qs.push({type:'zh-fr',entry:e.id},{type:'fr-zh',entry:e.id});
  // Examples are stored on canonical entries, so edits automatically change oral and cloze answers.
  v.examples.forEach((x,i)=>{if(x.chinese)qs.push({type:'oral',entry:e.id,index:i});});
  if(e.kind==='verb'){
   const forms=v.french.includes(' → ')?v.french.split(' → ')[1].split(' / '):[v.french.replace(/^en /,'')];
   for(let i=0;i<v.examples.length;i++){const fr=v.examples[i].french;const form=forms.find(f=>new RegExp('\\b'+f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(fr));if(form){qs.push({type:'cloze',entry:e.id,index:i,target:form,hint:v.french.split(' → ')[0].replace(/^en /,'')});break;}}
  }else if(e.kind==='structure'){
   const negative={'ne…pas':'pas','ne…plus':'plus','ne…jamais':'jamais','ne…rien':'rien','ne…personne':'personne','ne…que':"qu’",'ne…pas forcément':'pas forcément','ne…pas toujours':'pas toujours','ne…pas seulement':'pas seulement','Il n’y a aucun / aucune…':'aucune'};
   const target=negative[e.french]||v.french.split(' + ')[0].split(' / ')[0];
   if(target&&!target.includes('…')&&!target.includes('→')&&!target.includes('...')){
    const ix=v.examples.findIndex(x=>n(x.french).includes(n(target)));if(ix>=0)qs.push({type:'cloze',entry:e.id,index:ix,target,hint:v.chinese});}
   qs.push({type:'select',entry:e.id});
  }else if(e.kind==='adjective'||e.category===7&&e.kind==='collocation'){
   qs.push({type:'select',entry:e.id});
   const bases=e.kind==='adjective'?v.french.split(' / '):[v.french.split(/\s+/).filter(w=>!['de','à','avec','que'].includes(w)).at(-1)];
   const forms=bases.flatMap(x=>[x,x+'s',x.endsWith('e')?x:x+'e',x.endsWith('e')?x+'s':x+'es',x.endsWith('eux')?x.slice(0,-3)+'euse':x,x.endsWith('eux')?x.slice(0,-3)+'euses':x]);
   const ix=v.examples.findIndex(x=>forms.some(f=>new RegExp('\\b'+f+'\\b','i').test(x.french)));
   if(ix>=0){const form=forms.find(f=>new RegExp('\\b'+f+'\\b','i').test(v.examples[ix].french));qs.push({type:'cloze',entry:e.id,index:ix,target:form,hint:v.chinese});}
  }
  for(const q of conversions.get(e.id)||[]){
   const edited=record(e.id).userEditedContent;
   // Static derived exercises are valid until the underlying examples/structure change.
   // Then use an edited example as the reference and ask for a natural application.
   if(edited&&(edited.french!==e.french||JSON.stringify(edited.examples.map(x=>x.french))!==JSON.stringify(e.examples.map(x=>x.french)))){
    if(v.examples[0])qs.push({type:'transform',entry:e.id,edited:true,index:0});
   }else qs.push({...q,type:'transform',entry:e.id});
  }
  if(fixes.has(e.id))qs.push({...fixes.get(e.id),type:'correct',entry:e.id});
  return qs;
 }
 function dynamic(q){const e=byId.get(q.entry),v=effective(e);if(q.type==='zh-fr')return {stem:v.chinese,answer:v.french,instruction:'回忆法语结构，然后显示答案。'};if(q.type==='fr-zh')return {stem:v.french,answer:v.chinese+(v.function.length?'\n'+v.function.join('\n'):''),instruction:'说出中文含义或用法，再自评。'};if(q.type==='oral'){const x=v.examples[q.index];return {stem:x?.chinese||v.chinese,answer:x?.french||v.french,instruction:'口头作答；显示答案后自评，表达可自然变化。'};}
  if(q.type==='select')return {stem:v.chinese,answer:v.french,instruction:e.kind==='adjective'?'选择对应形容词，再查看常见位置规律。':'选择与中文意思对应的结构。'};
  if(q.type==='cloze'){const x=v.examples[q.index];const fr=x?.french||v.french;const escaped=q.target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return {stem:fr.replace(new RegExp(escaped,'i'),'______'),answer:q.target,instruction:'填写空缺：'+q.hint};}
  if(q.edited)return {stem:v.chinese,instruction:'使用当前编辑后的结构改写一句话：'+v.french,answer:v.examples[q.index]?.french||v.french};
  return q;
 }
 function offeredTypes(){return [...new Set(pool().flatMap(e=>questionsFor(e).map(q=>q.type)))];}
 function rebuildQueue(){stopTimer();let es=ui().view==='review'?reviewSort(pool()):pool();queue=es.flatMap(questionsFor).filter(q=>!ui().type||q.type===ui().type);
  if(ui().mixed){queue=queue.filter(q=>!['select','fr-zh','correct'].includes(q.type));for(let i=queue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]];}}
  ui().question=0;resetQuestion();
 }
 function resetQuestion(){stopTimer();question=queue[ui().question]||null;revealed=false;typed='';result='';selected=null;save();}
 function next(){if(!queue.length)return;ui().question=(ui().question+1)%queue.length;resetQuestion();renderQuestion();}
 function reveal(){stopTimer();revealed=true;renderQuestion();}
 function assess(ok){if(!question)return;const e=byId.get(question.entry);mark(e,ok?'mastered':'unknown','practice');result=ok?'✓ 本次正确':'需要再练，已提高复习优先级。';revealed=true;renderQuestion();}
 function startTimer(){stopTimer();const seconds=Number(ui().timer);if(!seconds){$('c1Timer').textContent='不限时 · 可以开始口头作答';return;}let left=seconds;$('c1Timer').textContent=left+' 秒';timer=setInterval(()=>{left--;const t=$('c1Timer');if(!t){stopTimer();return;}t.textContent=left>0?left+' 秒':'时间到 · 请自评';if(left<=0)stopTimer();},1000);}
 function renderQuestion(){stopSpeech();const old=$('c1Exercise');if(old)old.remove();const area=el('section');area.id='c1Exercise';view.querySelector('#c1QuestionControls')?.after(area);
  if(!question){area.append(el('p','c1-empty','当前筛选没有这种练习，请调整筛选或训练方式。'));return;}
  const e=byId.get(question.entry),v=effective(e),q=dynamic(question);current=DATA.find(x=>x.id===e.id);syncAdapter(e);
  area.dataset.c1Id=e.id;area.append(el('p','c1-instruction',(ui().question+1)+' / '+queue.length+' · '+types[question.type]),el('p','c1-instruction',q.instruction||'改写后显示参考答案；可以自评其他自然表达。'),el('div','c1-question',q.stem));
  if(question.type==='oral'){
   const row=el('div','c1-actions'),select=el('select');select.id='c1TimerChoice';select.setAttribute('aria-label','反应计时');for(const [val,label]of [[3,'3 秒'],[5,'5 秒'],[0,'不限时']])select.add(new Option(label,String(val)));select.value=String(ui().timer);select.onchange=()=>{ui().timer=Number(select.value);save();stopTimer();};const time=el('span','c1-timer','点击开始计时');time.id='c1Timer';row.append(select,button('开始计时',startTimer),time);area.append(row);
  }else if(question.type==='select'){
   const choices=el('div','c1-choices');const options=[e,...entries.filter(x=>x.id!==e.id&&x.kind===e.kind&&n(effective(x).chinese)!==n(v.chinese)&&n(text(x))!==n(v.french)).slice(0,3)];const rotate=ui().question%options.length;options.push(...options.splice(0,rotate));for(const x of options){const b=button(text(x),()=>{selected=x.id;assess(x.id===e.id);});if(revealed){if(x.id===e.id)b.className='correct';else if(x.id===selected)b.className='wrong';b.disabled=true;}choices.append(b);}area.append(choices);
  }else if(question.type!=='fr-zh'){
   const input=el('textarea');input.id='c1Answer';input.value=typed;input.lang='fr';input.placeholder='可选：输入你的答案……';input.setAttribute('aria-label','你的答案');input.oninput=()=>typed=input.value;area.append(input);
   if(['cloze','correct'].includes(question.type))area.append(button('检查答案',()=>{if(!typed.trim()){result='请先填写答案。';renderQuestion();return;}assess(n(typed)===n(q.answer));},'primary'));
  }
  if(!revealed)area.append(button('显示答案',reveal));else{const answer=el('div','c1-answer',q.answer);answer.id='c1Reference';area.append(answer,audioControls(()=>question.type==='fr-zh'?effective(e).french:q.answer));if(q.explanation)area.append(el('p','c1-result',q.explanation));if(question.derived)area.append(el('p','note','训练题依据源文件句型与例句改编；参考答案允许自然的同义表达。'));if(question.type==='select'&&v.rule.length)area.append(el('p','c1-result',v.rule.join('\n')));}
  if(result)area.append(el('p','c1-result',result));
  area.append(tools(e,true),note(e),el('p','c1-status','状态：'+({new:'未学习',mastered:'掌握',weak:'稍弱',unknown:'不会'}[record(e.id).masteryStatus])+' · 连续熟练 '+record(e.id).streak+' 次'),button('下一题',next));
  if(revealed){const details=el('details'),summary=el('summary','','查看该词条完整用法');details.append(summary);details.addEventListener('toggle',()=>{if(details.open&&!details.dataset.loaded){details.dataset.loaded='1';details.append(card(e));}});area.append(details);}
  // A mixed question deliberately omits category tags and source filenames until revealed.
  save();
 }
 function referenceSources(){const outer=el('details'),summary=el('summary','c1-source-summary','资料审计与原始补充说明（17 个文件 / 5 个 worksheet）');outer.append(summary);outer.addEventListener('toggle',()=>{if(!outer.open||outer.dataset.loaded)return;outer.dataset.loaded='1';const audit=el('p','note',data.audit.canonicalEntries+' 个唯一词条；'+data.audit.sourceOccurrences+' 条结构化来源记录，合并 '+data.audit.duplicatesMerged+' 条重复。各专项计数含交叉标签，不可直接相加。');outer.append(audit);const a=el('a','','下载完整去重与映射审计');a.href='c1-grammar-audit.json';a.download='c1-grammar-audit.json';outer.append(a);const report=el('a','','查看完整内容与验收报告');report.href='c1-grammar-report.md';report.style.display='block';outer.append(report);for(const source of data.sources.filter(s=>ui().category===null||s.categories.includes(ui().category))){const d=el('details'),s=el('summary','c1-source-summary',source.name);d.append(s);d.addEventListener('toggle',()=>{if(!d.open||d.dataset.loaded)return;d.dataset.loaded='1';const raw=el('div','c1-source-content');raw.textContent=[...source.paragraphs,...source.tables.flatMap((t,i)=>['表格 '+(i+1),...t.map(r=>r.join(' | '))]),...source.worksheets.flatMap(w=>['工作表：'+w.name,...w.rows.filter(r=>r.some(Boolean)).map(r=>r.join(' | '))])].join('\n');d.append(raw);});outer.append(d);}});view.append(outer);}
 function render(){if(mode!==MODULE)return;stopSpeech();stopTimer();view.replaceChildren();const u=ui(),items=pool();
  if(u.category===null&&!u.mixed){view.append(el('h2','','C1 语法专项训练'),el('p','note','综合速览 → 学习 → 练习 → 重点复习。相同词条在不同专项共用状态、笔记和修改。'));const grid=el('div','c1-grid');data.categories.forEach((name,i)=>{const count=entries.filter(e=>e.memberships.some(m=>m.category===i)).length;const b=button('',()=>enter(i));b.className='c1-category';b.dataset.c1Category=i;b.append(el('strong','',name),el('small','',count+' 个词条 · 综合速览 / 学习 / 练习 / 复习'));grid.append(b);});view.append(grid,button('C1 语法混合挑战',()=>{u.category=null;u.mixed=true;u.view='practice';u.type='';u.subcategory='';u.priority='';u.search='';u.status='';rebuildQueue();syncFilters();render();renderList();},'primary'));referenceSources();return;}
  const title=u.mixed?'C1 语法混合挑战':data.categories[u.category];view.append(button('← 全部专项',()=>{u.category=null;u.mixed=false;u.view='overview';u.subcategory='';u.priority='';u.status='';u.search='';stopTimer();syncFilters();render();renderList();save();}),el('h2','',title));
  const nav=el('div','c1-actions');for(const [key,label]of [['overview','① 综合速览'],['learn','② 学习模式'],['practice','③ 练习模式'],['review','④ 复习模式']]){const b=button(label,()=>{u.view=key;u.mixed=false;u.offset=0;if(u.category===null)u.category=0;u.type='';rebuildQueue();render();renderList();save();},u.view===key?'primary':'');b.dataset.c1View=key;nav.append(b);}if(!u.mixed)view.append(nav);
  const mastered=items.filter(e=>record(e.id).masteryStatus==='mastered').length;view.append(el('p','c1-meta',items.length+' 条内容 · 已掌握 '+mastered+' · 有笔记 '+items.filter(e=>record(e.id).userNote.trim()).length));
  if(!items.length){view.append(el('p','c1-empty','当前筛选没有词条。没有源文件星级的内容可在“全部”中查看。'));referenceSources();return;}
  if(u.view==='overview')overview(items);
  else if(u.view==='learn'){
   if(u.offset>=items.length)u.offset=0;const rows=items.slice(u.offset,u.offset+Number(u.size));rows.forEach(e=>view.append(card(e)));const row=el('div','c1-actions');row.append(button('上一批',()=>{u.offset=Math.max(0,u.offset-Number(u.size));render();save();}),button('下一批',()=>{u.offset=u.offset+Number(u.size)>=items.length?0:u.offset+Number(u.size);render();save();}),el('span','note',(u.offset+1)+'–'+(u.offset+rows.length)+' / '+items.length));view.append(row);
  }else{
   const bar=el('div','c1-actions');bar.id='c1QuestionControls';const select=el('select');select.id='c1PracticeType';select.setAttribute('aria-label','训练方式');select.add(new Option('全部适用训练',''));offeredTypes().forEach(t=>select.add(new Option(types[t],t)));select.value=u.type;select.onchange=()=>{u.type=select.value;rebuildQueue();render();save();};bar.append(select,button(u.mixed?'重新抽取':'重新开始',()=>{rebuildQueue();render();}));view.append(bar);
   if(u.view==='review')view.append(el('p','note','优先顺序：不会 → 稍弱 → 最近做错 → 多次犹豫 → 收藏 → 笔记。已连续熟练的词条排在后面。'));
   if(!question)rebuildQueue();renderQuestion();
  }
  referenceSources();save();
 }
 function syncFilters(){const u=ui();$('c1Category').value=u.category===null?'':String(u.category);$('c1Subcategory').replaceChildren(new Option('全部分类',''));const subs=[...new Set(entries.flatMap(e=>e.memberships.filter(m=>u.category===null||m.category===u.category).map(m=>m.subcategory)))];subs.forEach(s=>$('c1Subcategory').add(new Option(s,s)));$('c1Subcategory').value=u.subcategory;for(const [id,key]of [['c1Priority','priority'],['c1Search','search'],['c1Status','status'],['c1Size','size']])$(id).value=String(u[key]);}
 function renderList(){if(mode!==MODULE)return;const items=pool();$('c1ListCount').textContent=items.length+' 个唯一词条';$('c1List').replaceChildren();for(const e of items){const v=effective(e),b=button(v.chinese,()=>{const u=ui();if(u.category===null)u.category=e.category;u.mixed=false;u.view='learn';u.subcategory='';u.priority='';u.search='';u.status='';u.offset=Math.floor(pool().findIndex(x=>x.id===e.id)/Number(u.size))*Number(u.size);syncFilters();render();renderList();save();},'item');b.dataset.c1List=e.id;b.append(el('small','',v.french+' · '+({new:'未学习',mastered:'掌握',weak:'稍弱',unknown:'不会'}[record(e.id).masteryStatus])));$('c1List').append(b);}}
 function enter(category){Object.assign(ui(),{category,subcategory:'',view:'overview',offset:0,mixed:false,type:'',priority:'',search:'',status:''});syncFilters();rebuildQueue();render();renderList();save();}
 for(const [id,key]of [['c1Subcategory','subcategory'],['c1Priority','priority'],['c1Search','search'],['c1Status','status'],['c1Size','size']])$(id).addEventListener(id==='c1Search'?'input':'change',()=>{ui()[key]=$(id).value;ui().offset=0;rebuildQueue();render();renderList();save();});
 $('c1Category').onchange=()=>{if($('c1Category').value===''){ui().category=null;ui().mixed=false;ui().subcategory='';syncFilters();render();renderList();save();}else enter(Number($('c1Category').value));};
 function activate(){const active=mode===MODULE;controls.classList.toggle('hidden',!active);view.classList.toggle('hidden',!active);if(!active){stopTimer();return;}for(const id of ['practiceFilters','practiceStats','practice','errorsView','vocabularyView','batchControls','batchView','studyView','studyReviewView','t2InversionControls','t2InversionView','speechFlowControls','speechFlowView'])$(id)?.classList.add('hidden');syncFilters();entries.forEach(syncAdapter);rebuildQueue();render();renderList();}
 const oldSave=saveDraft;saveDraft=function(){if(mode!==MODULE)oldSave();};
 const oldSet=setModule;setModule=function(m,fresh=false){stopSpeech();stopTimer();if(m===MODULE){if(mode!==MODULE){saveDraft();rememberPractice();mode=MODULE;order=null;current=null;}document.querySelectorAll('[data-module]').forEach(b=>{const on=b.dataset.module===String(m);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});activate();save();}else{oldSet(m,fresh);activate();}};
 const oldShow=show;show=function(x){if(mode!==MODULE)return oldShow(x);if(x&&byId.has(x.id)){current=x;const e=byId.get(x.id);ui().category=e.category;ui().mixed=false;ui().view='practice';ui().subcategory='';ui().priority='';ui().status='';ui().search='';rebuildQueue();const at=queue.findIndex(q=>q.entry===x.id);ui().question=Math.max(0,at);resetQuestion();}if(mode===MODULE){syncFilters();render();renderList();}};
 window.COMBINED_UI.closeVocabulary=()=>setModule([0,1,2,3,4,5,6,7,8,9,'errors'].includes(state.vocabularyReturnView)?state.vocabularyReturnView:0);
 entries.forEach(e=>{e.practiceTypes=[...new Set(questionsFor(e).map(q=>q.type))];});
 window.C1_GRAMMAR={entries,record,effective,pool,reviewSort,questionsFor,dynamic,enter,render,edit,mark,questions:()=>queue,find,tools,activate};
 window.addEventListener('pagehide',stopTimer);activate();
})();

'use strict';
const questionModeBar=document.createElement('div');questionModeBar.id='questionModeBar';questionModeBar.className='hidden';
questionModeBar.innerHTML='<p class="note">练习卡片模式</p><div class="tabs" role="group" aria-label="练习卡片模式"><button type="button" data-question-mode="framework">框架默写</button><button type="button" data-question-mode="example">例句默写</button></div><input type="hidden" id="questionMode"><label for="questionExample" id="questionExampleLabel">本框架的例句</label><select id="questionExample"></select>';
$('prompt').before(questionModeBar);
$('questionMode').value=state.questionMode==='example'?'example':'framework';
function syncQuestionModeButtons(){questionModeBar.querySelectorAll('[data-question-mode]').forEach(b=>{const active=b.dataset.questionMode===$('questionMode').value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
syncQuestionModeButtons();
questionModeBar.querySelectorAll('[data-question-mode]').forEach(b=>b.onclick=()=>{if(b.dataset.questionMode===$('questionMode').value)return;$('questionMode').value=b.dataset.questionMode;$('questionMode').onchange();syncQuestionModeButtons();});
const qNorm=s=>s.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:+…\-]/g,' ').replace(/\s+/g,' ').trim();
function questionCores(x){
 if(x.kind==='example')return [x.fr];
 const special={5:['verbe-vous','verbe-tu','verbe + vous','verbe + tu'],6:['nom + verbe-il','nom + verbe-elle','nom + verbe-ils','nom + verbe-elles','nom + verbe-t-il','nom + verbe-t-elle'],14:['quel','quelle','quels','quelles'],15:['à quel','à quelle'],16:['dans quel','dans quelle'],17:['de quel','de quelle'],18:['pour quel','pour quelle'],19:['lequel','laquelle','lesquels','lesquelles'],50:['parmi + ensemble, lequel','parmi + ensemble, laquelle','parmi, lequel','parmi, laquelle'],55:['sujet + verbe','tu + verbe','vous + verbe']};
 return special[x.number]||[x.fr.split(' + ')[0]];
}
const qGrade=grade,qVariants=variants,qDifference=answerDifference;
variants=function(x){return x.module===4?questionCores(x):qVariants(x);};
grade=function(input,x){if(x.module!==4)return qGrade(input,x);const cores=questionCores(x);return {ok:cores.some(f=>qNorm(input)===qNorm(f)||qNorm(input)===qNorm(x.fr)),cores};};
answerDifference=function(input,x){if(x.module!==4)return qDifference(input,x);if(grade(input,x).ok)return null;return {...differenceAlignment(qNorm(input).slice(0,500),qNorm(questionCores(x)[0])),core:x.kind==='framework'};};
const qFiltered=filtered;
filtered=function(){if(mode!==4)return qFiltered();let rs=DATA.filter(x=>x.module===4&&x.kind===$('questionMode').value&&(!$('category').value||x.category===$('category').value)&&x.zh.toLowerCase().includes($('search').value.trim().toLowerCase()));const f=$('status').value;if(f)rs=rs.filter(x=>{const r=state.records[x.id];return f==='new'?!r?.attempts:f==='wrong'?r?.error&&!r.error.resolved:r?.last===true;});if(order)rs.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));return rs;};
const qSource=buildSource;
buildSource=function(){if(mode!==4)return qSource();$('sourceFilter').replaceChildren(new Option('口语 T2','3'));$('sourceNote').textContent='保留文档的 55 个编号框架，不去重。框架与例句的草稿和错题分别保存；补充例句会注明来源。';};
const qList=list;
list=function(){if(mode!==4)return qList();const groups=new Map();for(const x of filtered()){if(!groups.has(x.number))groups.set(x.number,[]);groups.get(x.number).push(x);}$('list').replaceChildren();$('listCount').textContent=groups.size+' 项框架 · '+filtered().length+($('questionMode').value==='example'?' 条例句':' 条框架');for(const [n,xs] of groups){const framework=QUESTION_ITEMS.find(x=>x.number===n&&x.kind==='framework'),b=document.createElement('button'),small=document.createElement('small');b.className='item'+(current?.number===n?' active':'');b.textContent=n+'. '+framework.zh;small.textContent=framework.category+(xs[0].kind==='example'?' · '+xs.length+' 条例句':'');b.append(small);b.onclick=()=>show(xs.find(x=>x.id===state.questionLastExamples?.[n])||xs[0]);$('list').append(b);}stats();};
const qShow=show;
show=function(x){qShow(x);syncQuestionModeButtons();questionModeBar.classList.toggle('hidden',mode!==4);if(x?.module!==4)return;
 $('moduleTitle').textContent='口语 T2 提问框架 · 第 '+x.number+' 项';$('rule').textContent=x.kind==='framework'?'默写法语框架核心，占位部分可省略。斜线列出的变体可写其中一种；保留重音、介词和疑问结构。':'根据中文默写完整例句；忽略大小写、标点和多余空格，重音、词语与变位须正确。';
 const exampleMode=x.kind==='example';$('questionExample').classList.toggle('hidden',!exampleMode);$('questionExampleLabel').classList.toggle('hidden',!exampleMode);
 const xs=filtered().filter(t=>t.number===x.number&&t.kind==='example');$('questionExample').replaceChildren(...xs.map((t,i)=>new Option('例句 '+(i+1)+' · '+t.members[0].source,t.id)));$('questionExample').value=x.id;
 if(exampleMode){state.questionLastExamples=state.questionLastExamples||{};state.questionLastExamples[x.number]=x.id;}persist();
};
$('questionMode').onchange=()=>{saveDraft();const n=current?.number;state.questionMode=$('questionMode').value;order=null;const rs=filtered();show(rs.find(x=>x.number===n&&x.id===state.questionLastExamples?.[n])||rs.find(x=>x.number===n)||rs[0]||null);persist();};
$('questionExample').onchange=()=>show(filtered().find(x=>x.id===$('questionExample').value)||null);
const qCheck=check;check=function(){qCheck();if(mode===4&&current&&$('answer').value.trim()&&rec().last===true){const first=$('feedback').firstChild;if(first?.nodeType===3)first.textContent=current.kind==='example'?'✓ 正确，完整例句已核对。':'✓ 正确，提问框架已核对。';}};
const qSet=setModule;
setModule=function(m,fresh=false){
 if(m===4&&fresh){const x=DATA.find(x=>x.id===state.current);if(x?.module===4)$('questionMode').value=x.kind;}
 qSet(m,fresh);questionModeBar.classList.toggle('hidden',m!==4);if(m===4){document.querySelector('label[for=search]').textContent='搜索中文';$('search').placeholder='搜索框架用途或例句中文';}
};
// Error-book links can reopen the appropriate card mode.
const qErrors=errors;errors=function(){qErrors();if(mode!=='errors')return;const items=errorItems();Array.from($('errorList').children).forEach((node,i)=>{const x=items[i];if(x?.module!==4)return;const button=node.querySelector('button');button.onclick=()=>{saveDraft();$('questionMode').value=x.kind;state.questionMode=x.kind;$('status').value='';$('search').value='';$('category').value='';setModule(4,true);show(x);$('answer').value='';rec().draft='';persist();$('answer').focus();};});};
window.COMBINED_UI.closeVocabulary=()=>setModule([0,1,2,3,4,'errors'].includes(state.vocabularyReturnView)?state.vocabularyReturnView:0);
window.QUESTION_TEST={cores:questionCores,items:QUESTION_ITEMS};
if(mode===4){buildSource();rebuildCategories();show(filtered().find(x=>x.id===restoreId)||filtered()[0]||null);}

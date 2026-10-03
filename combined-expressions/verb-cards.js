'use strict';
// Group only the attested conjugations; original expression modules keep their UI.
const originalShow=show,originalList=list,originalSaveDraft=saveDraft,originalCheck=check,originalMove=move,originalReveal=$('reveal').onclick,originalClear=$('clear').onclick;
// Keep previous progress when gender variants collapse into a single dictionary row.
state.conjugationAgreementHistory=state.conjugationAgreementHistory||{};
for(const [oldId,newId] of Object.entries(DICTIONARY_ROW_ALIASES)){
 if(oldId===newId||!state.records[oldId])continue;
 const old=state.records[oldId],target=state.records[newId];
 state.conjugationAgreementHistory[oldId]=old;
 if(!target)state.records[newId]=old;
 else{for(const k of ['attempts','correct','wrong'])target[k]=(target[k]||0)+(old[k]||0);if(!target.draft&&old.draft)target.draft=old.draft;if(old.error&&!old.error.resolved)target.error=old.error;}
 delete state.records[oldId];
}
if(DICTIONARY_ROW_ALIASES[state.current])state.current=DICTIONARY_ROW_ALIASES[state.current];
for(const p of Object.values(state.practicePositions||{}))if(DICTIONARY_ROW_ALIASES[p.id])p.id=DICTIONARY_ROW_ALIASES[p.id];
let verbCardLemma='',verbCardInputs=new Map();
const cards=document.createElement('section');cards.id='verbCards';cards.setAttribute('aria-label','按动词整合的变位练习');$('conjugationContext').after(cards);
const oldConjugationIds=new Set(Object.keys(CONJUGATION_PERSON_IDS));
state.conjugationLegacyHistory=state.conjugationLegacyHistory||{};
for(const id of oldConjugationIds){if(state.records[id]){state.conjugationLegacyHistory[id]=state.records[id];delete state.records[id];}}
for(const p of Object.values(state.practicePositions||{}))if(CONJUGATION_PERSON_IDS[p.id])p.id=CONJUGATION_PERSON_IDS[p.id][0];
function cardRows(lemma=verbCardLemma){return filtered().filter(x=>x.lemma===lemma);}
function cardLemmas(){return [...new Set(filtered().map(x=>x.lemma))];}
function selectCardRow(x){current=x;$('answer').value=rec(x.id).draft;persist();}
function cardInputLabel(x){return (x.person==='无主语人称变化'?(x.tense.includes('副动词')?'en':'分词'):x.person)+' _____（'+x.tense+'）';}
function cardUi(active){
 cards.classList.toggle('hidden',!active);$('answer').classList.toggle('hidden',active);document.querySelector('label[for="answer"]').classList.toggle('hidden',active);$('conjugationContext').classList.add('hidden');
 const keyboard=document.querySelector('[aria-label="法语特殊字符键盘"]');if(keyboard)keyboard.classList.toggle('hidden',active);
 $('check').textContent=active?'核对本动词已填写答案':'检查答案';$('clear').textContent=active?'清空本动词草稿':'清空草稿';
}
function rowCheck(x){const box=verbCardInputs.get(x.id);if(!box)return;selectCardRow(x);$('answer').value=box.input.value;if(!box.input.value.trim()){$('toast').textContent='请先填写这一行的变位。';return;}originalCheck();box.feedback.replaceChildren(...Array.from($('feedback').childNodes).map(n=>n.cloneNode(true)));box.feedback.className=$('feedback').className;$('feedback').classList.add('hidden');box.feedback.querySelectorAll('.note').forEach(n=>{if(n.textContent.startsWith('按原审核规则'))n.textContent='忽略大小写、标点和多余空格；重音和助动词须正确；本模块不考过去分词的阴阳性配合。';});}
function rowReference(x,node){const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');summary.textContent='原文例句与中文参考';const refs=x.members.filter(m=>selectedSource()===''||m.sourceIndex===Number(selectedSource()));text.textContent=refs.slice(0,3).map(m=>SOURCE_NAMES[m.sourceIndex]+' · '+m.source+'\n'+m.example+'\n'+m.zh).join('\n\n');details.append(summary,text);node.append(details);}
function renderVerbCard(x){
 if(!x){cards.replaceChildren();return;}
 verbCardLemma=x.lemma;cardUi(true);$('moduleTitle').textContent='动词变位 · '+x.lemma;$('prompt').textContent='按下面的主语与语气／时态，填写同一个动词在稿子中出现过的变位。';$('position').textContent='第 '+(cardLemmas().indexOf(x.lemma)+1)+' / '+cardLemmas().length+' 个动词 · 本卡 '+cardRows(x.lemma).length+' 个去重变位';$('rule').textContent='每行可写主语＋变位，也兼容旧版只写变位。复合时态填写助动词＋过去分词。按词典模式合并 il／elle／on、ils／elles；过去分词的阴阳性配合不单独出题，也不据此判错。';$('feedback').classList.add('hidden');$('reference').classList.add('hidden');cards.replaceChildren();verbCardInputs.clear();
 const keyboard=document.createElement('div');keyboard.className='verb-keyboard';const hint=document.createElement('span');hint.textContent='点击输入框后插入：';keyboard.append(hint);for(const letter of ['à','â','ç','é','è','ê','ë','î','ï','ô','œ','ù','û','ü','’']){const b=document.createElement('button');b.type='button';b.textContent=letter;b.onmousedown=e=>e.preventDefault();b.onclick=()=>{const target=verbCardInputs.get(current?.id)?.input;if(!target)return;const start=target.selectionStart,end=target.selectionEnd;target.setRangeText(letter,start,end,'end');target.dispatchEvent(new Event('input'));target.focus();};keyboard.append(b);}cards.append(keyboard);
 for(const row of cardRows(x.lemma)){
  const section=document.createElement('div');section.className='verb-form-row';section.dataset.formId=row.id;const label=document.createElement('label'),input=document.createElement('input'),tense=document.createElement('span'),actions=document.createElement('div'),feedback=document.createElement('div');
  input.id='form-'+row.id;input.type='text';input.autocomplete='off';input.spellcheck=false;input.lang='fr';input.value=rec(row.id).draft;input.setAttribute('aria-label',cardInputLabel(row));label.htmlFor=input.id;label.textContent=row.person==='无主语人称变化'?(row.tense.includes('副动词')?'en':'分词'):row.person;tense.className='verb-tense';tense.textContent=row.tense+' · 中文词义：'+conjugationMeaning(row);actions.className='verb-row-actions';feedback.className='feedback hidden';
  input.onfocus=()=>{selectCardRow(row);for(const b of verbCardInputs.values())b.section.classList.toggle('selected',b.input===input);};input.oninput=()=>{rec(row.id).draft=input.value;if(current?.id===row.id)$('answer').value=input.value;persist();};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();rowCheck(row);}};
  const checkButton=document.createElement('button');checkButton.textContent='核对';checkButton.onclick=()=>rowCheck(row);
  const reveal=document.createElement('button');reveal.textContent='看答案';reveal.onclick=()=>{selectCardRow(row);feedback.className='feedback';feedback.textContent='正确变位：'+conjugationForm(row)+'\n中文词义：'+conjugationMeaning(row);rowReference(row,feedback);};
  const speak=document.createElement('button');speak.textContent='朗读';speak.onclick=()=>{selectCardRow(row);const panel=$('frenchSpeechPanel');if(panel&&!panel.hidden)$('closeFrenchSpeech').click();$('openFrenchSpeech')?.click();};actions.append(checkButton,reveal,speak);section.append(label,input,tense,actions,feedback);cards.append(section);verbCardInputs.set(row.id,{input,section,feedback});
 }
 selectCardRow(x);list();persist();
}
saveDraft=function(){if(mode===3){for(const [id,b] of verbCardInputs)rec(id).draft=b.input.value;persist();}else originalSaveDraft();};
list=function(){if(mode!==3){originalList();return;}const groups=new Map();for(const x of filtered()){if(!groups.has(x.lemma))groups.set(x.lemma,[]);groups.get(x.lemma).push(x);}const lemmas=[...groups.keys()];$('list').replaceChildren();$('listCount').textContent=lemmas.length+' 个动词 · '+[...groups.values()].reduce((n,rs)=>n+rs.length,0)+' 个变位';for(const lemma of lemmas){const rows=groups.get(lemma),b=document.createElement('button'),s=document.createElement('small');b.className='item'+(lemma===verbCardLemma?' active':'');b.textContent=lemma;s.textContent=rows.length+' 个变位 · '+[...new Set(rows.flatMap(x=>x.origins))].map(s=>SOURCE_NAMES[s]).join(' / ');b.append(s);b.onclick=()=>show(rows[0]);$('list').append(b);}stats();};
show=function(x){if(x?.module===3){saveDraft();current=x;$('practice').classList.remove('hidden');$('toast').textContent='';renderVerbCard(x);return;}cardUi(false);originalShow(x);};
check=function(){if(mode!==3)return originalCheck();let n=0;for(const x of cardRows()){if(verbCardInputs.get(x.id)?.input.value.trim()){rowCheck(x);n++;}}$('toast').textContent=n?'已核对 '+n+' 个已填写的变位。':'请先填写至少一个变位。';};$('check').onclick=()=>check();
$('reveal').onclick=()=>{if(mode!==3)return originalReveal();for(const x of cardRows()){const b=verbCardInputs.get(x.id);b.feedback.className='feedback';b.feedback.textContent='正确变位：'+conjugationForm(x)+'\n中文词义：'+conjugationMeaning(x);rowReference(x,b.feedback);}};
$('clear').onclick=()=>{if(mode!==3)return originalClear();for(const [id,b] of verbCardInputs){b.input.value='';b.feedback.classList.add('hidden');rec(id).draft='';}$('answer').value='';persist();};
move=function(d){if(mode!==3)return originalMove(d);const ls=cardLemmas(),i=ls.indexOf(verbCardLemma)+d;if(i>=0&&i<ls.length)show(cardRows(ls[i])[0]);else $('toast').textContent='已到当前动词列表边界。';};$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);
$('random').onclick=()=>{const rs=filtered();if(!rs.length)return;if(mode===3){const ls=cardLemmas();show(cardRows(ls[Math.floor(Math.random()*ls.length)])[0]);}else show(rs[Math.floor(Math.random()*rs.length)]);};
const oldBuildSource=buildSource;buildSource=function(){oldBuildSource();if(mode===3)$('sourceNote').textContent='一个动词一张卡，只练五个稿子里出现过的人称与时态。同一组合跨句子、跨来源只练一次；阴阳性变体合并。';};
const originalFiltered=filtered;filtered=function(){return originalFiltered().filter(x=>mode!==3||(!$('verbPerson').value||$('verbPerson').value!=='il'&&$('verbPerson').value!=='ils'||($('verbPerson').value==='il'?['il','elle','on']:['ils','elles']).includes(x.person)));};
// Grouped person options must include all three/five actual pronouns.
$('verbGroup').value=String(state.verbGroup||'');
const oldBuildVerbFilters=buildVerbFilters;
buildVerbFilters=function(){
 if(mode!==3)return oldBuildVerbFilters();
 $('verbFilters').classList.remove('hidden');
 const previous=$('verbLemma').value,group=$('verbGroup').value;
 const lemmas=[...new Set(scoped().filter(x=>!group||VERB_GROUPS[x.lemma]===Number(group)).map(x=>x.lemma))].sort((a,b)=>a.localeCompare(b,'fr'));
 $('verbLemma').replaceChildren(new Option('全部动词',''),...lemmas.map(x=>new Option(x,x)));
 if(lemmas.includes(previous))$('verbLemma').value=previous;
};
$('verbGroup').onchange=()=>{saveDraft();state.verbGroup=$('verbGroup').value;order=null;buildVerbFilters();show(filtered()[0]||null);persist();};
const originalScoped=scoped;filtered=function(){if(mode!==3)return originalFiltered();let rs=originalScoped().filter(x=>(!$('verbGroup').value||VERB_GROUPS[x.lemma]===Number($('verbGroup').value))&&(!$('category').value||x.tense===$('category').value)&&(!$('verbLemma').value||x.lemma===$('verbLemma').value)&&x.zh.toLowerCase().includes($('search').value.trim().toLowerCase()));const p=$('verbPerson').value;if(p)rs=rs.filter(x=>p==='无主语'?x.person==='无主语人称变化':p==='il'?['il','elle','on'].includes(x.person):p==='ils'?['ils','elles'].includes(x.person):x.person===p);const f=$('status').value;if(f)rs=rs.filter(x=>{const r=state.records[x.id];return f==='new'?!r?.attempts:f==='wrong'?r?.error&&!r.error.resolved:r?.last===true;});if(order)rs.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));return rs;};
const oldSetModule=setModule;setModule=function(m,fresh=false){if(m===3&&fresh){$('verbGroup').value='';state.verbGroup='';$('verbLemma').value='';$('verbPerson').value='';}oldSetModule(m,fresh);cardUi(m===3);document.querySelector('label[for=search]').textContent=m===3?'搜索动词原形':'搜索中文';$('search').placeholder=m===3?'输入动词原形':'输入中文关键词';if(m!==3)cards.classList.add('hidden');};
$('search').placeholder='输入动词原形';
window.VERB_CARDS_TEST={cardRows,cardLemmas,rowCheck,inputs:()=>verbCardInputs,getLemma:()=>verbCardLemma};
if(mode===3){buildVerbFilters();buildSource();document.querySelector('label[for=search]').textContent='搜索动词原形';const id=DICTIONARY_ROW_ALIASES[restoreId]||CONJUGATION_PERSON_IDS[restoreId]?.[0]||current?.id;show(filtered().find(x=>x.id===id)||filtered()[0]||null);}else cards.classList.add('hidden');

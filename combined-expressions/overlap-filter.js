'use strict';
const OVERLAP_VALUES=['','absent','present'];
state.topicOverlap=OVERLAP_VALUES.includes(state.topicOverlap)?state.topicOverlap:'';
const phraseContains=x=>(TOPIC_PHRASE_OVERLAP[x.id]||[]).length>0;
const overlapFilteredBefore=filtered;
filtered=function(){const rows=overlapFilteredBefore();return mode===5&&state.topicOverlap?rows.filter(x=>phraseContains(x)===(state.topicOverlap==='present')):rows;};
function buildOverlap(){
 $('overlapFilters').classList.toggle('hidden',mode!==5);if(mode!==5)return;
 const level=typeof topicLevel==='function'?topicLevel():'';
 const rows=overlapFilteredBefore().filter(x=>!level||x.niveau===level),present=rows.filter(phraseContains).length,select=$('overlapFilter');
 select.replaceChildren(new Option('全部词汇 · '+rows.length+' 项',''),new Option('未出现在词组中 · '+(rows.length-present)+' 项','absent'),new Option('已出现在词组中 · '+present+' 项','present'));select.value=state.topicOverlap;
}
const overlapListBefore=list;
list=function(){buildOverlap();overlapListBefore();};
const overlapSetBefore=setModule;
setModule=function(m,fresh=false){overlapSetBefore(m,fresh);buildOverlap();};
$('overlapFilter').onchange=()=>{if(mode!==5)return;saveDraft();state.topicOverlap=OVERLAP_VALUES.includes($('overlapFilter').value)?$('overlapFilter').value:'';order=null;const rows=filtered();show(rows.find(x=>x.id===current?.id)||rows[0]||null);persist();};
const overlapRevealBefore=$('reveal').onclick;
$('reveal').onclick=()=>{overlapRevealBefore();if(current?.module!==5||$('reference').classList.contains('hidden'))return;const ids=TOPIC_PHRASE_OVERLAP[current.id]||[];const p=document.createElement('p');p.className='note';p.textContent=ids.length?'已出现在未覆盖词组中：'+ids.map(id=>TOPIC_ITEMS.find(x=>x.id===id)?.fr).filter(Boolean).join('；'):'未出现在现有未覆盖词组中。';$('reference').prepend(p);};
const overlapErrorsBefore=errors;
errors=function(){overlapErrorsBefore();if(mode!=='errors')return;const rows=errorItems();Array.from($('errorList').children).forEach((node,i)=>{const x=rows[i];if(x?.module!==5)return;const button=node.querySelector('button');if(!button)return;const before=button.onclick;button.onclick=()=>{state.topicOverlap='';before();buildOverlap();};});};
for(const id of ['errModule','errSource','showResolved'])$(id).onchange=()=>errors();
window.OVERLAP_TEST={contains:phraseContains,matches:TOPIC_PHRASE_OVERLAP};
buildOverlap();

'use strict';
const TOPIC_NIVEAUX=['A1','A2','B1','B2','C1','C2'];
state.topicLevels=state.topicLevels&&typeof state.topicLevels==='object'&&!Array.isArray(state.topicLevels)?state.topicLevels:{};
for(const m of [5,6])if(!TOPIC_NIVEAUX.includes(state.topicLevels[m]))state.topicLevels[m]='';
function topicLevel(){return [5,6].includes(mode)?state.topicLevels[mode]||'':'';}
const niveauFilteredBefore=filtered;
filtered=function(){const rows=niveauFilteredBefore();const level=topicLevel();return level?rows.filter(x=>x.niveau===level):rows;};
function buildNiveau(){
 const active=[5,6].includes(mode);$('niveauFilters').classList.toggle('hidden',!active);
 if(!active)return;
 const rows=niveauFilteredBefore(),select=$('niveauFilter'),desired=topicLevel();
 select.replaceChildren(new Option('全部等级 · '+rows.length+' 条',''));
 for(const level of TOPIC_NIVEAUX){const count=rows.filter(x=>x.niveau===level).length;select.add(new Option(level+' · '+count+' 条',level));}
 select.value=desired;
}
const niveauListBefore=list;
list=function(){buildNiveau();niveauListBefore();if(![5,6].includes(mode))return;const rows=filtered();Array.from($('list').children).forEach((b,i)=>{if(rows[i]){const small=b.querySelector('small');if(small)small.textContent='参考等级 '+rows[i].niveau+' · '+small.textContent;}});};
const niveauShowBefore=show;
show=function(x){niveauShowBefore(x);if(isTopicItem(x))$('position').textContent+=' · 参考等级 '+x.niveau;};
const niveauSetBefore=setModule;
setModule=function(m,fresh=false){niveauSetBefore(m,fresh);buildNiveau();};
$('niveauFilter').onchange=()=>{
 if(![5,6].includes(mode))return;
 // Save the outgoing draft before changing its practice scope.
 saveDraft();state.topicLevels[mode]=TOPIC_NIVEAUX.includes($('niveauFilter').value)?$('niveauFilter').value:'';order=null;
 const rows=filtered();show(rows.find(x=>x.id===current?.id)||rows[0]||null);persist();
};
const niveauRevealBefore=$('reveal').onclick;
$('reveal').onclick=()=>{niveauRevealBefore();if(isTopicItem(current)&&!$('reference').classList.contains('hidden')){const p=document.createElement('p');p.className='note';p.textContent='参考等级：'+current.niveau+(current.niveauBasis==='bontcf-lexicon'?' · BonTCF 词库分级':' · 按当前表达含义估算');$('reference').prepend(p);}};
// Error review can open an item outside the last selected level.
const niveauErrorsBefore=errors;
errors=function(){niveauErrorsBefore();if(mode!=='errors')return;const rows=errorItems();Array.from($('errorList').children).forEach((node,i)=>{const x=rows[i];if(!isTopicItem(x))return;const button=node.querySelector('button');if(!button)return;const before=button.onclick;button.onclick=()=>{state.topicLevels[x.module]='';before();buildNiveau();};});};
for(const id of ['errModule','errSource','showResolved'])$(id).onchange=()=>errors();
window.NIVEAU_TEST={levels:TOPIC_NIVEAUX,level:topicLevel,base:()=>niveauFilteredBefore()};
buildNiveau();
if([5,6].includes(mode)){const rows=filtered();show(rows.find(x=>x.id===restoreId)||rows[0]||null);}

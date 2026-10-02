'use strict';
const isTopicItem=x=>x?.module===5||x?.module===6;
const topicPersistBefore=persist;
persist=function(){if([5,6].includes(mode)&&current)rememberPractice();topicPersistBefore();};
const topicNorm=s=>s.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ').trim();
const topicVariantsBefore=variants,topicGradeBefore=grade,topicDifferenceBefore=answerDifference;
variants=function(x){return isTopicItem(x)?[...new Set([x.fr,...(x.acceptedFr||[])])]:topicVariantsBefore(x);};
grade=function(input,x){if(!isTopicItem(x))return topicGradeBefore(input,x);const cores=variants(x);return {ok:cores.some(fr=>topicNorm(input)===topicNorm(fr)),cores};};
answerDifference=function(input,x){if(!isTopicItem(x))return topicDifferenceBefore(input,x);if(grade(input,x).ok)return null;let best=null;for(const fr of variants(x)){const diff=differenceAlignment(topicNorm(input).slice(0,500),topicNorm(fr));if(!best||diff.distance<best.distance)best={...diff,core:false,truncated:input.length>500};}return best;};
const topicSourceBefore=buildSource;
buildSource=function(){topicSourceBefore();if(![5,6].includes(mode))return;const desired=state.source;$('sourceFilter').replaceChildren(new Option('全部已整理来源',''));SOURCE_NAMES.forEach((name,i)=>{const count=DATA.filter(x=>x.module===mode&&x.origins.includes(i)).length;if(count)$('sourceFilter').add(new Option(name+' · '+count+' 条',String(i)));});$('sourceFilter').value=[...$('sourceFilter').options].some(x=>x.value===desired)?desired:'';$('sourceNote').textContent='已加入写作 T1 / T2 / T3、口语 T2 / T3 的审核清单。分类按原稿主题与题目筛选。';};
function topicMeaning(x){const source=selectedSource();return source===''?x.zh:[...new Set(x.members.filter(m=>m.sourceIndex===Number(source)).map(m=>m.zh))].join('；')||x.zh;}
const topicListBefore=list;
list=function(){topicListBefore();if(![5,6].includes(mode))return;const rows=filtered();Array.from($('list').children).forEach((b,i)=>{if(rows[i]&&b.firstChild?.nodeType===3)b.firstChild.textContent=topicMeaning(rows[i]);});};
const topicShowBefore=show;
show=function(x){topicShowBefore(x);if(!isTopicItem(x))return;$('moduleTitle').textContent=names[x.module]+' · '+(selectedSource()===''?'全部已整理来源':SOURCE_NAMES[Number(selectedSource())]);$('prompt').textContent=topicMeaning(x);$('rule').textContent=x.module===5?'默写完整单词，接受清单词形及该词在原稿中出现的词形。忽略大小写、句末标点与多余空格，保留重音和连字符。':'默写完整词组；忽略大小写、句末标点与多余空格，保留重音、连字符、介词与所有实词。';};
const topicRevealBefore=$('reveal').onclick;
$('reveal').onclick=()=>{if(!isTopicItem(current))return topicRevealBefore();const opening=$('reference').classList.contains('hidden');$('reference').textContent='法语'+(current.module===5?'词汇':'词组')+'：'+current.fr+'\n中文意思：'+topicMeaning(current)+'\n可接受词形：'+variants(current).join(' / ')+'\n当前来源原稿出现 '+(selectedSource()===''?current.frequency:(current.sourceFrequencies?.[selectedSource()]||current.frequency))+' 次\n\n'+current.members.filter(m=>selectedSource()===''||m.sourceIndex===Number(selectedSource())).map(m=>m.source+' · '+m.category+'\n原文：'+m.example).join('\n\n────────\n\n');window.TCF_CONJUGATIONS?.render($('reference'),current.fr);window.TCF_NOUNS?.render($('reference'),current.fr);$('reference').classList.toggle('hidden',!opening);$('reveal').textContent=opening?'隐藏答案':'显示答案';};
const topicCheckBefore=check;
check=function(){topicCheckBefore();if(isTopicItem(current)&&$('answer').value.trim()&&rec().last===true){const first=$('feedback').firstChild;if(first?.nodeType===3)first.textContent=current.module===5?'✓ 正确，词汇拼写已核对。':'✓ 正确，完整词组已核对。';}};
$('check').onclick=()=>check();
const topicSetBefore=setModule;
setModule=function(m,fresh=false){const saved=state.practicePositions?.[m];topicSetBefore(m,fresh);if([5,6].includes(m)&&!saved&&!fresh){$('search').value='';$('status').value='';$('category').value='';order=null;show(filtered()[0]||null);}};
window.COMBINED_UI.closeVocabulary=()=>setModule([0,1,2,3,4,5,6,'errors'].includes(state.vocabularyReturnView)?state.vocabularyReturnView:0);
window.TOPIC_PRACTICE_TEST={items:TOPIC_ITEMS,grade:(s,x)=>grade(s,x),setModule:(...args)=>setModule(...args),show:x=>show(x),filtered:()=>filtered(),state:()=>state};
if([5,6].includes(mode)){buildSource();rebuildCategories();show(filtered().find(x=>x.id===restoreId)||filtered()[0]||null);}

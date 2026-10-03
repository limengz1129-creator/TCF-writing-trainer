// Consolidate audited usage cards; retain original members and progress aliases.
(function(){
const groups=[["2-109","2-13"],["2-27","2-33"],["2-61","2-140"],["2-72","2-71"],["2-74","2-146"],["2-80","2-117"],["2-304","2-86"],["2-92","2-157"],["2-132","2-192"],["2-303","2-156"],["2-322","2-174"],["2-260","2-214"],["2-310","2-245"],["2-88","2-215"],["2-289","2-223"],["2-177","2-133"]];
const names={"2-177":"adapter quelque chose à quelque chose","2-322":"rendre quelqu’un / quelque chose + adjectif"};
for(const [keep,...removed] of groups){
 const cards=[keep,...removed].map(id=>DATA.find(x=>x.id===id));
 if(cards.some(x=>!x))throw new Error('Missing audited usage card: '+keep);
 const target=cards[0];
 target.members=cards.flatMap(x=>x.members.map(m=>({...m,usage:[m.usage,'原搭配：'+m.fr].filter(Boolean).join('；')})));
 target.origins=[...new Set(cards.flatMap(x=>x.origins))];
 target.categories=[...new Set(cards.flatMap(x=>x.categories))];
 target.zh=[...new Set(cards.map(x=>x.zh))].join('；');
 target.fr=names[keep]||target.fr;
 for(const id of removed){USAGE_ID_ALIASES[id]=keep;DATA.splice(DATA.findIndex(x=>x.id===id),1);}
}
// Resolve aliases from earlier merges directly to the surviving cards.
for(const id of Object.keys(USAGE_ID_ALIASES)){
 let next=USAGE_ID_ALIASES[id];const seen=new Set([id]);
 while(USAGE_ID_ALIASES[next]&&!seen.has(next)){seen.add(next);next=USAGE_ID_ALIASES[next];}
 USAGE_ID_ALIASES[id]=next;
}
// Accept every preserved full notation as well as the existing matcher cores.
const originalGrade=grade;
grade=function(input,item){
 const result=originalGrade(input,item);
 if(item.module!==2||result.ok)return result;
 return {...result,ok:[item.fr,...item.members.map(m=>m.fr)].some(fr=>{
 const matcher=SOURCE_MATCHERS[item.members[0].sourceIndex];
 return matcher.norm(matcher.normalizeSlots(input))===matcher.norm(matcher.normalizeSlots(fr));
 })};
};
})();

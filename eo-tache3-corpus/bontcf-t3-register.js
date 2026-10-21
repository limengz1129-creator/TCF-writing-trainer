'use strict';
(function(){
const groups={'旅行与移民':'TRAVEL','职业与职场':'CAREER','教育与儿童':'EDUCATION','媒体与文化':'MEDIA','科技与网络':'TECH','饮食与健康':'HEALTH','环境与城市':'ENVIRONMENT','社会与公共事务':'SOCIAL','家庭与人际':'FAMILY'};
for(const [i,item] of (window.BONT_T3_SUPPLEMENTS||[]).entries()){
const arr=window['TCF_C1_'+groups[item.topic]];if(!Array.isArray(arr))continue;
const id='BONTCF-'+String(i+1).padStart(2,'0');if(arr.some(x=>x.id===id))continue;
arr.push({id,mother:String(item.mother).padStart(2,'0')+'｜BonTCF补充 · '+item.scene,scene:'新增情境｜'+item.scene,source:'BonTCF 2026年7–10月真题匹配新增',question:item.sourceQuestion,core:item.core+'\n'+item.zh,chain:item.logic.join(' → ')+'\n'+item.logicZh,vocab:item.words.map(w=>w[0]+'\n'+w[1]).join('\n'),text:item.paragraphs.map(pair=>pair[0]+'\n'+pair[1]).join('\n')});
}
})();

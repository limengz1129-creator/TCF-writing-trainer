// Practice dictionary conjugations; retain every original example unchanged.
const DICTIONARY_ROW_ALIASES={};
const dictionaryRows=new Map();
for(const x of PERSON_CONJUGATIONS){
 const originalId=x.id,originalFr=x.fr,parts=x.fr.split(' '),forms=DICTIONARY_PARTICIPLES[x.lemma];
 const last=parts.at(-1),isParticiple=forms&&['过去分词','复合过去时','愈过去时','条件式过去时','虚拟式过去时','先将来时','被动式'].some(t=>x.tense.includes(t))&&Object.values(forms).includes(last);
 if(isParticiple){
  let number=1;
  if(x.tense!=='过去分词'&&['nous','ils','elles'].includes(x.person)&&[forms[2],forms[4]].includes(last))number=2;
  parts[parts.length-1]=forms[number]||forms[1];
  x.fr=parts.join(' ');
  x.acceptedFr=[...new Set([x.fr,...Object.values(forms).map(f=>[...parts.slice(0,-1),f].join(' '))])];
 }
 x.person=({elle:'il',on:'il',elles:'ils'})[x.person]||x.person;
 delete x.agreement;
 x.zh='原形：'+x.lemma+'\n主语：'+x.person+'\n语气／时态：'+x.tense;
 const key=[x.lemma,x.person,x.tense,x.fr].join('|');
 const existing=dictionaryRows.get(key);
 if(existing){
  existing.members.push(...x.members);
  existing.origins=[...new Set([...existing.origins,...x.origins])];
  existing.acceptedFr=[...new Set([...existing.acceptedFr,...x.acceptedFr])];
  DICTIONARY_ROW_ALIASES[originalId]=existing.id;
 }else{dictionaryRows.set(key,x);DICTIONARY_ROW_ALIASES[originalId]=originalId;}
}
PERSON_CONJUGATIONS.splice(0,PERSON_CONJUGATIONS.length,...dictionaryRows.values());
for(let i=DATA.length-1;i>=0;i--)if(DATA[i].module===3)DATA.splice(i,1);
DATA.push(...PERSON_CONJUGATIONS);
for(const ids of Object.values(CONJUGATION_PERSON_IDS))for(let i=0;i<ids.length;i++)ids[i]=DICTIONARY_ROW_ALIASES[ids[i]]||ids[i];

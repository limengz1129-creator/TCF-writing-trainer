'use strict';
// Presentation layer: keep source forms, unique IDs and saved drafts unchanged.
function conjugationForm(x,form=x.fr){
 if(x.module!==3)return form;
 if(x.tense.includes('命令式'))return form+' !';
 if(x.person==='无主语人称变化')return x.tense.includes('副动词')&&!/^en\b/.test(form)?'en '+form:form;
 const person=x.person;
 let text=person==='je'&&/^[aàâäeéèêëiîïoôöuùûüyÿœæh]/i.test(form)&&!/^handicap/i.test(form)?"j’"+form:person+' '+form;
 if(x.tense.includes('虚拟式'))text=/^(il|ils|elle|elles|on)\b/.test(text)?'qu’'+text:'que '+text;
 return text;
}
function conjugationMeaning(x){return VERB_MEANINGS[x.lemma]||'';}
for(const x of PERSON_CONJUGATIONS){
 const forms=x.acceptedFr||[x.fr];
 x.acceptedFr=[...new Set([...forms,...forms.map(f=>conjugationForm(x,f)),...(!x.tense.includes('命令式')&&x.person!=='无主语人称变化'?forms.map(f=>conjugationForm({...x,tense:''},f)):[])])];
}

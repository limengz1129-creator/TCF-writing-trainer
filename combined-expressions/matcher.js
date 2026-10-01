const SOURCE_MATCHERS=[
(function(){
function norm(s){return s.normalize('NFC').toLowerCase().replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/[.,!?;:…()]/g,' ').replace(/\s+/g,' ').trim()}
// Normalize only placeholder alternatives; grammatical "ou" remains significant.
function normalizeSlots(s){
 const slot=String.raw`(?:\bquelque\s+chose\b|\bquelqu['’]un\b|\b(?:qqch|qch|qqn|qn|qcn)\b)`;
 return s.replace(new RegExp(slot+String.raw`(?:\s*(?:ou|\/)\s*`+slot+')*','gi'),'__slot__');
}
function stripSlots(s){return normalizeSlots(s).replace(/__slot__/g,' ').replace(/\b(?:infinitif|subjonctif|indicatif|nom|prénom|activité|verbe)\b/gi,' ').replace(/\+/g,' ').replace(/\s+/g,' ').trim()}
function variants(item){
 if(item.cores)return item.cores.map(norm);
 if(item.module===0)return [norm(item.fr)];
 let s=item.fr;
 const overrides={
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en participe présent'],
  'tout en + participe présent':['tout en participe présent'],
  'avant que + subjonctif (ne explétif possible)':['avant que'],
  'Le loyer ... est de ... par mois, charges comprises.':['le loyer est de par mois charges comprises'],
  'Situé(e) ... et bien desservi(e) par ..., ...':['situé et bien desservi par','située et bien desservie par'],
  'Situé(e) en plein centre-ville, ...':['situé en plein centre-ville','située en plein centre-ville'],
  'plutôt que de / à + infinitif (selon le verbe)':['plutôt que de','plutôt que à'],
  's’installer à / dans un lieu':['s’installer à','s’installer dans'],
  'se retrouver à un lieu / à une heure':['se retrouver à'],
  'être ravi de faire / d’avoir fait quelque chose':['être ravi de','être ravi d’avoir fait'],
  'remercier quelqu’un de faire / d’avoir fait quelque chose':['remercier de','remercier d’avoir fait'],
  's’inscrire sur un site':['s’inscrire sur'],
  's’inscrire dans une salle de sport':['s’inscrire dans'],
  's’intégrer à un milieu':['s’intégrer à'],
  'se détendre dans un lieu':['se détendre dans'],
  'être disponible dès que + futur simple':['être disponible dès que'],
  'Je t’invite à / au + activité.':['je t’invite à','je t’invite au'],
 };
 if(overrides[s])return overrides[s].map(norm);
 s=s.replace(/\([^)]*\)/g,'').replace(/de faire quelque chose/g,'de').replace(/à faire quelque chose/g,'à').replace(/pour faire quelque chose/g,'pour').replace(/faire quelque chose/g,'').replace(/un lieu|une heure/g,'');
 return [norm(stripSlots(s).replace(/\s*\/\s*/g,' ').replace(/\.{2,}/g,' '))];
}
function grade(input,item){
 const raw=norm(input);let cores=variants(item);
 if(item.module===0)return {ok:[item.fr,...(item.acceptedFr||[])].some(s=>norm(normalizeSlots(input))===norm(normalizeSlots(s))),cores};
 // Slot words may be omitted or abbreviated. Concrete content words are not guessed.
 let answer=norm(stripSlots(input.replace(/\([^)]*\)/g,'')));
 answer=answer.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
 const exact=norm(item.fr);
 // Full source notation is valid, including tense labels and all placeholders.
 let ok=norm(normalizeSlots(input))===norm(normalizeSlots(item.fr))||raw===exact||cores.includes(answer)||cores.includes(raw);
 return {ok,cores};
}


return {grade,variants};
})(),
(function(){
function norm(s){return s.normalize('NFC').toLowerCase().replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/[.,!?;:…()]/g,' ').replace(/\s+/g,' ').trim()}
// Normalize only placeholder alternatives; grammatical "ou" remains significant.
function normalizeSlots(s){
 const slot=String.raw`(?:\bquelque\s+chose\b|\bquelqu['’]un\b|\b(?:qqch|qch|qqn|qn|qcn)\b)`;
 return s.replace(new RegExp(slot+String.raw`(?:\s*(?:ou|\/)\s*`+slot+')*','gi'),'__slot__');
}
function stripSlots(s){return normalizeSlots(s).replace(/__slot__/g,' ').replace(/\b(?:infinitif|subjonctif|indicatif|nom|prénom|activité|verbe)\b/gi,' ').replace(/\+/g,' ').replace(/\s+/g,' ').trim()}
function variants(item){
 if(item.cores)return item.cores.map(norm);
 if(item.module===0)return [norm(item.fr)];
 let s=item.fr;
 const overrides={
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en participe présent'],
  'tout en + participe présent':['tout en participe présent'],
  'avant que + subjonctif (ne explétif possible)':['avant que'],
  'Le loyer ... est de ... par mois, charges comprises.':['le loyer est de par mois charges comprises'],
  'Situé(e) ... et bien desservi(e) par ..., ...':['situé et bien desservi par','située et bien desservie par'],
  'Situé(e) en plein centre-ville, ...':['situé en plein centre-ville','située en plein centre-ville'],
  'plutôt que de / à + infinitif (selon le verbe)':['plutôt que de','plutôt que à'],
  's’installer à / dans un lieu':['s’installer à','s’installer dans'],
  'se retrouver à un lieu / à une heure':['se retrouver à'],
  'être ravi de faire / d’avoir fait quelque chose':['être ravi de','être ravi d’avoir fait'],
  'remercier quelqu’un de faire / d’avoir fait quelque chose':['remercier de','remercier d’avoir fait'],
  's’inscrire sur un site':['s’inscrire sur'],
  's’inscrire dans une salle de sport':['s’inscrire dans'],
  's’intégrer à un milieu':['s’intégrer à'],
  'se détendre dans un lieu':['se détendre dans'],
  'être disponible dès que + futur simple':['être disponible dès que'],
  'Je t’invite à / au + activité.':['je t’invite à','je t’invite au'],
 };
 if(overrides[s])return overrides[s].map(norm);
 s=s.replace(/\([^)]*\)/g,'').replace(/de faire quelque chose/g,'de').replace(/à faire quelque chose/g,'à').replace(/pour faire quelque chose/g,'pour').replace(/faire quelque chose/g,'').replace(/un lieu|une heure/g,'');
 return [norm(stripSlots(s).replace(/\s*\/\s*/g,' ').replace(/\.{2,}/g,' '))];
}
function grade(input,item){
 const raw=norm(input);let cores=variants(item);
 if(item.module===0)return {ok:[item.fr,...(item.acceptedFr||[])].some(s=>norm(normalizeSlots(input))===norm(normalizeSlots(s))),cores};
 // Slot words may be omitted or abbreviated. Concrete content words are not guessed.
 let answer=norm(stripSlots(input.replace(/\([^)]*\)/g,'')));
 answer=answer.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
 const exact=norm(item.fr);
 // Full source notation is valid, including tense labels and all placeholders.
 let ok=norm(normalizeSlots(input))===norm(normalizeSlots(item.fr))||raw===exact||cores.includes(answer)||cores.includes(raw);
 return {ok,cores};
}


return {grade,variants};
})(),
(function(){
function norm(s){return s.normalize('NFC').toLowerCase().replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/[.,!?;:…()]/g,' ').replace(/\s+/g,' ').trim()}
// Normalize only placeholder alternatives; grammatical "ou" remains significant.
function normalizeSlots(s){
 const slot=String.raw`(?:\bquelque\s+chose\b|\bquelqu['’]un\b|\b(?:qqch|qch|qqn|qn|qcn)\b)`;
 return s.replace(new RegExp(slot+String.raw`(?:\s*(?:ou|\/)\s*`+slot+')*','gi'),'__slot__');
}
function stripSlots(s){return normalizeSlots(s).replace(/__slot__/g,' ').replace(/\b(?:infinitif|subjonctif|indicatif|nom|prénom|activité|verbe|adjectif|proposition|lieu)\b/gi,' ').replace(/\+/g,' ').replace(/\s+/g,' ').trim()}
function variants(item){
 if(item.cores)return item.cores.map(norm);
 if(item.module===0)return [norm(item.fr)];
 let s=item.fr;
 const overrides={
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en participe présent'],
  'tout en + participe présent':['tout en participe présent'],
  'avant que + subjonctif (ne explétif possible)':['avant que'],
  'Le loyer ... est de ... par mois, charges comprises.':['le loyer est de par mois charges comprises'],
  'Situé(e) ... et bien desservi(e) par ..., ...':['situé et bien desservi par','située et bien desservie par'],
  'Situé(e) en plein centre-ville, ...':['situé en plein centre-ville','située en plein centre-ville'],
  'plutôt que de / à + infinitif (selon le verbe)':['plutôt que de','plutôt que à'],
  's’installer à / dans un lieu':['s’installer à','s’installer dans'],
  'se retrouver à un lieu / à une heure':['se retrouver à'],
  'être ravi de faire / d’avoir fait quelque chose':['être ravi de','être ravi d’avoir fait'],
  'remercier quelqu’un de faire / d’avoir fait quelque chose':['remercier de','remercier d’avoir fait'],
  's’inscrire sur un site':['s’inscrire sur'],
  's’inscrire dans une salle de sport':['s’inscrire dans'],
  's’intégrer à un milieu':['s’intégrer à'],
  'se détendre dans un lieu':['se détendre dans'],
  'être disponible dès que + futur simple':['être disponible dès que'],
  'Je t’invite à / au + activité.':['je t’invite à','je t’invite au'],
 };
 if(overrides[s])return overrides[s].map(norm);
 s=s.replace(/\([^)]*\)/g,'').replace(/de faire quelque chose/g,'de').replace(/à faire quelque chose/g,'à').replace(/pour faire quelque chose/g,'pour').replace(/faire quelque chose/g,'').replace(/un lieu|une heure/g,'');
 return [norm(stripSlots(s).replace(/\s*\/\s*/g,' ').replace(/\.{2,}/g,' '))];
}
function grade(input,item){
 const raw=norm(input);let cores=variants(item);
 if(item.module===0)return {ok:[item.fr,...(item.acceptedFr||[])].some(s=>norm(normalizeSlots(input))===norm(normalizeSlots(s))),cores};
 // Slot words may be omitted or abbreviated. Concrete content words are not guessed.
 let answer=norm(stripSlots(input.replace(/\([^)]*\)/g,'')));
 answer=answer.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
 const exact=norm(item.fr);
 // Full source notation is valid, including tense labels and all placeholders.
 let ok=norm(normalizeSlots(input))===norm(normalizeSlots(item.fr))||raw===exact||cores.includes(answer)||cores.includes(raw);
 return {ok,cores};
}


return {grade,variants};
})(),
(function(){
function norm(s){return s.normalize('NFC').toLowerCase().replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/[.,!?;:…()]/g,' ').replace(/\s+/g,' ').trim()}
// Normalize only placeholder alternatives; grammatical "ou" remains significant.
function normalizeSlots(s){
 const slot=String.raw`(?:\bquelque\s+chose\b|\bquelqu['’]un\b|\b(?:qqch|qch|qqn|qn|qcn)\b)`;
 return s.replace(new RegExp(slot+String.raw`(?:\s*(?:ou|\/)\s*`+slot+')*','gi'),'__slot__');
}
function stripSlots(s){return normalizeSlots(s).replace(/__slot__/g,' ').replace(/\b(?:infinitif|subjonctif|indicatif|nom|prénom|activité|verbe|adjectif|proposition|lieu|question|complément|sujet|personne|critère|transport|poste)\b/gi,' ').replace(/\+/g,' ').replace(/\s+/g,' ').trim()}
function variants(item){
 if(item.cores)return item.cores.map(norm);
 if(item.module===0)return [norm(item.fr)];
 let s=item.fr;
 const overrides={
"Quels conseils + donner au conditionnel ?":["quels conseils"],"Quel / Quelle + nom + me conseillez-vous ?":["quel me conseillez-vous", "quelle me conseillez-vous"],"Vaut-il mieux + infinitif + ou + infinitif ?":["vaut-il mieux", "vaut-il mieux ou"],"Est-ce que + sujet + être adapté à + nom ?":["est-ce que être adapté à"],"Que se passe-t-il si + présent ?":["que se passe-t-il si"],"Que dois-je faire si + présent ?":["que dois-je faire si"],"Qui peut-on contacter si + présent ?":["qui peut-on contacter si"],"Est-ce que + phrase + si + présent ?":["est-ce que si"],"Comment + verbe au conditionnel + sujet ?":["comment"],"recommander + nom / de + infinitif":["recommander", "recommander de"],"se rendre à + lieu / s’y rendre":["se rendre à", "s’y rendre"],
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en participe présent'],
  'tout en + participe présent':['tout en participe présent'],
  'avant que + subjonctif (ne explétif possible)':['avant que'],
  'Le loyer ... est de ... par mois, charges comprises.':['le loyer est de par mois charges comprises'],
  'Situé(e) ... et bien desservi(e) par ..., ...':['situé et bien desservi par','située et bien desservie par'],
  'Situé(e) en plein centre-ville, ...':['situé en plein centre-ville','située en plein centre-ville'],
  'plutôt que de / à + infinitif (selon le verbe)':['plutôt que de','plutôt que à'],
  's’installer à / dans un lieu':['s’installer à','s’installer dans'],
  'se retrouver à un lieu / à une heure':['se retrouver à'],
  'être ravi de faire / d’avoir fait quelque chose':['être ravi de','être ravi d’avoir fait'],
  'remercier quelqu’un de faire / d’avoir fait quelque chose':['remercier de','remercier d’avoir fait'],
  's’inscrire sur un site':['s’inscrire sur'],
  's’inscrire dans une salle de sport':['s’inscrire dans'],
  's’intégrer à un milieu':['s’intégrer à'],
  'se détendre dans un lieu':['se détendre dans'],
  'être disponible dès que + futur simple':['être disponible dès que'],
  'Je t’invite à / au + activité.':['je t’invite à','je t’invite au'],
 };
 if(overrides[s])return overrides[s].map(norm);
 s=s.replace(/\([^)]*\)/g,'').replace(/de faire quelque chose/g,'de').replace(/à faire quelque chose/g,'à').replace(/pour faire quelque chose/g,'pour').replace(/faire quelque chose/g,'').replace(/un lieu|une heure/g,'');
 return [norm(stripSlots(s).replace(/\s*\/\s*/g,' ').replace(/\.{2,}/g,' '))];
}
function grade(input,item){
 const raw=norm(input);let cores=variants(item);
 if(item.module===0)return {ok:[item.fr,...(item.acceptedFr||[])].some(s=>norm(normalizeSlots(input))===norm(normalizeSlots(s))),cores};
 // Slot words may be omitted or abbreviated. Concrete content words are not guessed.
 let answer=norm(stripSlots(input.replace(/\([^)]*\)/g,'')));
 answer=answer.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
 const exact=norm(item.fr);
 // Full source notation is valid, including tense labels and all placeholders.
 let ok=norm(normalizeSlots(input))===norm(normalizeSlots(item.fr))||raw===exact||cores.includes(answer)||cores.includes(raw);
 return {ok,cores};
}


return {grade,variants};
})(),
(function(){
function norm(s){return s.normalize('NFC').toLowerCase().replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/[.,!?;:…()]/g,' ').replace(/\s+/g,' ').trim()}
// Normalize only placeholder alternatives; grammatical "ou" remains significant.
function normalizeSlots(s){
 const slot=String.raw`(?:\bquelque\s+chose\b|\bquelqu['’]un\b|\b(?:qqch|qch|qqn|qn|qcn)\b)`;
 return s.replace(new RegExp(slot+String.raw`(?:\s*(?:ou|\/)\s*`+slot+')*','gi'),'__slot__');
}
function stripSlots(s){return normalizeSlots(s).replace(/__slot__/g,' ').replace(/\b(?:infinitif|subjonctif|indicatif|nom|prénom|activité|verbe|adjectif|proposition|lieu)\b/gi,' ').replace(/\+/g,' ').replace(/\s+/g,' ').trim()}
function variants(item){
 if(item.cores)return item.cores.map(norm);
 if(item.module===0)return [norm(item.fr)];
 let s=item.fr;
 const overrides={
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en participe présent'],
  'tout en + participe présent':['tout en participe présent'],
  'avant que + subjonctif (ne explétif possible)':['avant que'],
  'Le loyer ... est de ... par mois, charges comprises.':['le loyer est de par mois charges comprises'],
  'Situé(e) ... et bien desservi(e) par ..., ...':['situé et bien desservi par','située et bien desservie par'],
  'Situé(e) en plein centre-ville, ...':['situé en plein centre-ville','située en plein centre-ville'],
  'plutôt que de / à + infinitif (selon le verbe)':['plutôt que de','plutôt que à'],
  's’installer à / dans un lieu':['s’installer à','s’installer dans'],
  'se retrouver à un lieu / à une heure':['se retrouver à'],
  'être ravi de faire / d’avoir fait quelque chose':['être ravi de','être ravi d’avoir fait'],
  'remercier quelqu’un de faire / d’avoir fait quelque chose':['remercier de','remercier d’avoir fait'],
  's’inscrire sur un site':['s’inscrire sur'],
  's’inscrire dans une salle de sport':['s’inscrire dans'],
  's’intégrer à un milieu':['s’intégrer à'],
  'se détendre dans un lieu':['se détendre dans'],
  'être disponible dès que + futur simple':['être disponible dès que'],
  'Je t’invite à / au + activité.':['je t’invite à','je t’invite au'],
 };
 if(overrides[s])return overrides[s].map(norm);
 s=s.replace(/\([^)]*\)/g,'').replace(/de faire quelque chose/g,'de').replace(/à faire quelque chose/g,'à').replace(/pour faire quelque chose/g,'pour').replace(/faire quelque chose/g,'').replace(/un lieu|une heure/g,'');
 return [norm(stripSlots(s).replace(/\s*\/\s*/g,' ').replace(/\.{2,}/g,' '))];
}
function grade(input,item){
 const raw=norm(input);let cores=variants(item);
 if(item.module===0)return {ok:[item.fr,...(item.acceptedFr||[])].some(s=>norm(normalizeSlots(input))===norm(normalizeSlots(s))),cores};
 // Slot words may be omitted or abbreviated. Concrete content words are not guessed.
 let answer=norm(stripSlots(input.replace(/\([^)]*\)/g,'')));
 answer=answer.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
 const exact=norm(item.fr);
 // Full source notation is valid, including tense labels and all placeholders.
 let ok=norm(normalizeSlots(input))===norm(normalizeSlots(item.fr))||raw===exact||cores.includes(answer)||cores.includes(raw);
 return {ok,cores};
}


return {grade,variants};
})()];
function variants(item){return [...new Set(item.members.flatMap(m=>SOURCE_MATCHERS[m.sourceIndex].variants(m)))];}
function grade(input,item){return {ok:item.members.some(m=>SOURCE_MATCHERS[m.sourceIndex].grade(input,m).ok),cores:variants(item)};}


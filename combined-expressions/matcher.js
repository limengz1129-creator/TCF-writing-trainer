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
  '… tout en + participe présent':['tout en','tout en participe présent'],
  'Après avoir + participe passé, …':['après avoir','après avoir participe passé'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si','si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si','si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en','en participe présent'],
  'tout en + participe présent':['tout en','tout en participe présent'],
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


return {grade,variants,norm,stripSlots,normalizeSlots};
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
  '… tout en + participe présent':['tout en','tout en participe présent'],
  'Après avoir + participe passé, …':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si','si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si','si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si','si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en','en participe présent'],
  'tout en + participe présent':['tout en','tout en participe présent'],
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


return {grade,variants,norm,stripSlots,normalizeSlots};
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
  '… tout en + participe présent':['tout en','tout en participe présent'],
  'Après avoir + participe passé, …':['après avoir','après avoir participe passé'],
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si','si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si','si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si','si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en','en participe présent'],
  'tout en + participe présent':['tout en','tout en participe présent'],
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


return {grade,variants,norm,stripSlots,normalizeSlots};
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
  '… tout en + participe présent':['tout en','tout en participe présent'],
  'Après avoir + participe passé, …':['après avoir','après avoir participe passé'],
"Quels conseils + donner au conditionnel ?":["quels conseils"],"Quel / Quelle + nom + me conseillez-vous ?":["quel me conseillez-vous", "quelle me conseillez-vous"],"Vaut-il mieux + infinitif + ou + infinitif ?":["vaut-il mieux", "vaut-il mieux ou"],"Est-ce que + sujet + être adapté à + nom ?":["est-ce que être adapté à"],"Que se passe-t-il si + présent ?":["que se passe-t-il si"],"Que dois-je faire si + présent ?":["que dois-je faire si"],"Qui peut-on contacter si + présent ?":["qui peut-on contacter si"],"Est-ce que + phrase + si + présent ?":["est-ce que si"],"Comment + verbe au conditionnel + sujet ?":["comment"],"recommander + nom / de + infinitif":["recommander", "recommander de"],"se rendre à + lieu / s’y rendre":["se rendre à", "s’y rendre"],
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si','si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si','si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si','si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en','en participe présent'],
  'tout en + participe présent':['tout en','tout en participe présent'],
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


return {grade,variants,norm,stripSlots,normalizeSlots};
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
  '… tout en + participe présent':['tout en','tout en participe présent'],
  'Après avoir + participe passé, …':['après avoir','après avoir participe passé'],
  'quel que soit / quelle que soit + nom':['quel que soit','quelle que soit'],
  'après avoir + participe passé':['après avoir','après avoir participe passé'],
  'Ayant + participe passé, ...':['ayant','ayant participe passé'],
  'Récemment, j’ai + participe passé ...':['récemment j’ai','récemment j’ai participe passé'],
  'Dès + jour / moment, ...':['dès'],
  'Après avoir + participe passé, ...':['après avoir','après avoir participe passé'],
  'À votre place, je + conditionnel.':['à votre place je','à votre place je conditionnel'],
  'Si + présent, conditionnel de politesse.':['si','si présent conditionnel de politesse'],
  'plutôt que de / à + infinitif, selon le verbe':['plutôt que de','plutôt que à'],
  'Je voudrais aussi savoir comment / si ...':['je voudrais aussi savoir comment','je voudrais aussi savoir si'],
  'prendre soin de quelqu’un / quelque chose':['prendre soin de'],
  'constater que / combien + indicatif':['constater que','constater combien'],
  'Dans le cadre de + nom, je recherche ...':['dans le cadre de je recherche'],
  'En tant que + nom, je souhaite ...':['en tant que je souhaite'],
  'Si + imparfait, conditionnel.':['si','si imparfait conditionnel'],
  'Si + présent, présent / futur / conditionnel de politesse.':['si','si présent présent','si présent futur','si présent conditionnel de politesse'],
  'En + participe présent, ...':['en','en participe présent'],
  'tout en + participe présent':['tout en','tout en participe présent'],
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


return {grade,variants,norm,stripSlots,normalizeSlots};
})()];
function variants(item){if(item.module===3)return [item.fr];return [...new Set(item.members.flatMap(m=>SOURCE_MATCHERS[m.sourceIndex].variants(m)))];}
function grade(input,item){if(item.module===3){const norm=s=>s.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ').trim();return {ok:(item.acceptedFr||[item.fr]).some(fr=>norm(input)===norm(fr)),cores:[item.fr]};}return {ok:item.members.some(m=>SOURCE_MATCHERS[m.sourceIndex].grade(input,m).ok),cores:variants(item)};}


function differenceAlignment(input,target){
 const a=Array.from(input),b=Array.from(target);
 const dp=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
 for(let i=0;i<=a.length;i++)dp[i][0]=i;
 for(let j=0;j<=b.length;j++)dp[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
 const wrong=new Set(),missing=new Set();let i=a.length,j=b.length;
 while(i||j){
  if(i&&j&&a[i-1]===b[j-1]&&dp[i][j]===dp[i-1][j-1]){i--;j--;}
  else if(i&&j&&dp[i][j]===dp[i-1][j-1]+1){wrong.add(--i);missing.add(--j);}
  else if(j&&dp[i][j]===dp[i][j-1]+1){missing.add(--j);}
  else{wrong.add(--i);}
 }
 function runs(chars,set){const out=[];for(let k=0;k<chars.length;k++){const marked=set.has(k);if(out.length&&out[out.length-1].marked===marked)out[out.length-1].text+=chars[k];else out.push({text:chars[k],marked});}return out;}
 return {distance:dp[a.length][b.length],input:input,target:target,inputRuns:runs(a,wrong),targetRuns:runs(b,missing)};
}
function answerDifference(input,item){
 if(grade(input,item).ok)return null;if(item.module===3){const norm=s=>s.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ').trim();return {...differenceAlignment(norm(input).slice(0,500),norm(item.fr)),core:false};}
 const candidates=[];
 for(const member of item.members){
  const matcher=SOURCE_MATCHERS[member.sourceIndex];
  const normalized=matcher.norm(input);
  if(item.module!==0){
   let core=matcher.norm(matcher.stripSlots(input.replace(/\([^)]*\)/g,'')));
   core=core.replace(/\b(?:de|à|pour) faire(?= |$)/g,m=>m.replace(/ faire$/,''));
   for(const target of matcher.variants(member))candidates.push({input:core,target,core:true});
  }
  const slotForm=s=>matcher.norm(matcher.normalizeSlots(s)).replace(/__slot__/g,'[占位词]');
  for(const target of [member.fr,...(member.acceptedFr||[])])candidates.push({input:slotForm(input),target:slotForm(target),core:false});
 }
 let best=null;
 for(const candidate of candidates){
  // Keep visual comparison bounded for accidentally pasted paragraphs.
  const bounded=candidate.input.slice(0,500);
  const diff=differenceAlignment(bounded,candidate.target);
  if(!best||diff.distance<best.distance)best={...diff,core:candidate.core,truncated:candidate.input.length>500};
 }
 return best;
}

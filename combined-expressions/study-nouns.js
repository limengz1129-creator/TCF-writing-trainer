'use strict';
(()=>{
 const extra={};
 for(const w of 'CDI cardio CV apprenant smartphone costume cabinet pharmacien remplaçant audioguide bassin carnet casque chargeur choc devis débouché dénivelé dépannage dépanneur gardien jardinage marié moniteur nourrissage paquet présentiel péage remerciement rétablissement snack terminal tiers traiteur trou locuteur mentorat influenceur polluant vlogueur MBA PIB bœuf linge non-fumeur partenariat vlog micro couple mannequin paramètre sinistre vacancier'.split(' '))extra[w.toLowerCase()]='m';
 for(const w of 'playlist signalétique praticité fonctionnalité batterie certification adoption puce auto-école cabine chaise colonie correspondance distribution déclaration escale facturation identification leçon ludothèque maraude nomination nuisance plomberie récupération unité épicerie époque évacuation télémédecine vidéoconférence employabilité avant-première fourniture serrure pop page'.split(' '))extra[w]='f';
 for(const w of ['sans-abri','automobiliste','autodidacte','peintre','psychothérapeute'])extra[w]='mf';
 Object.assign(extra,{mémoire:'f',radio:'f',solde:'m',manche:'f',plat:'m',amateur:'m'});
 const labels={m:'名词 · 阳性（m.）',f:'名词 · 阴性（f.）',mf:'名词 · 阴／阳性（随所指的人）'};
 const notes={mémoire:'这里指记忆、记忆力或内存。',manche:'这里指袖子。',radio:'这里指广播或电台。',solde:'这里指账户余额。',voisin:'作名词“邻居”时为阳性；阴性形式 voisine。',patient:'作名词“患者”时为阳性；阴性形式 patiente。',amateur:'作名词“爱好者”时为阳性；阴性形式 amatrice。'};
 function hint(x){
  const key=x.fr.normalize('NFC').toLocaleLowerCase('fr');
  // The learning list also contains adjectives. Only annotate its noun meanings.
  const meanings=x.zh.replace(/（[^）]*）/g,'').split('；');
  if(meanings.every(z=>z.trim().endsWith('的')))return null;
  const entries=(x.acceptedFr||[x.fr]).map(f=>window.TCF_NOUN_DATA?.[f.toLocaleLowerCase('fr')]).filter(Boolean);
  let gender=extra[key];
  if(!gender&&entries.length){const senses=entries.flatMap(e=>e[0]),same=senses.filter(s=>s[0].toLocaleLowerCase('fr')===key),genders=[...new Set((same.length?same:senses).map(s=>s[1]).filter(g=>g==='m'||g==='f'))];gender=genders.length===1?genders[0]:genders.length===2?'mf':null;}
  return labels[gender]?{gender,label:labels[gender],note:notes[key]||''}:null;
 }
 window.TCF_STUDY_NOUNS={hint};
})();

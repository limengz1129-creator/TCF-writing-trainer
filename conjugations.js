/* Reviewed conjugation forms for the TCF expression trainers. No network/API calls. */
(function(){'use strict';
const FORMS={"suis":{"lemma":"être","tense":"直陈式现在时","person":"je"},"es":{"lemma":"être","tense":"直陈式现在时","person":"tu"},"est":{"lemma":"être","tense":"直陈式现在时","person":"il/elle/on"},"sont":{"lemma":"être","tense":"直陈式现在时","person":"ils/elles"},"serais":{"lemma":"être","tense":"条件式现在时","person":"je/tu"},"serait":{"lemma":"être","tense":"条件式现在时","person":"il/elle/on"},"soit":{"lemma":"être","tense":"虚拟式现在时","person":"il/elle/on"},"soient":{"lemma":"être","tense":"虚拟式现在时","person":"ils/elles"},"ai":{"lemma":"avoir","tense":"直陈式现在时","person":"je"},"a":{"lemma":"avoir","tense":"直陈式现在时","person":"il/elle/on"},"ont":{"lemma":"avoir","tense":"直陈式现在时","person":"ils/elles"},"aurais":{"lemma":"avoir","tense":"条件式现在时","person":"je/tu"},"vas":{"lemma":"aller","tense":"直陈式现在时","person":"tu"},"allez":{"lemma":"aller","tense":"直陈式现在时","person":"vous"},"peux":{"lemma":"pouvoir","tense":"直陈式现在时","person":"je/tu"},"peut":{"lemma":"pouvoir","tense":"直陈式现在时","person":"il/elle/on"},"peuvent":{"lemma":"pouvoir","tense":"直陈式现在时","person":"ils/elles"},"pourrais":{"lemma":"pouvoir","tense":"条件式现在时","person":"je/tu"},"pourriez":{"lemma":"pouvoir","tense":"条件式现在时","person":"vous"},"pouvais":{"lemma":"pouvoir","tense":"直陈式未完成过去时","person":"je/tu"},"pouvait":{"lemma":"pouvoir","tense":"直陈式未完成过去时","person":"il/elle/on"},"puisse":{"lemma":"pouvoir","tense":"虚拟式现在时","person":"je/il/elle/on"},"dois":{"lemma":"devoir","tense":"直陈式现在时","person":"je/tu"},"doit":{"lemma":"devoir","tense":"直陈式现在时","person":"il/elle/on"},"doivent":{"lemma":"devoir","tense":"直陈式现在时","person":"ils/elles"},"devrait":{"lemma":"devoir","tense":"条件式现在时","person":"il/elle/on"},"devraient":{"lemma":"devoir","tense":"条件式现在时","person":"ils/elles"},"faut":{"lemma":"falloir","tense":"直陈式现在时","person":"il (无人称)"},"faudrait":{"lemma":"falloir","tense":"条件式现在时","person":"il (无人称)"},"faille":{"lemma":"falloir","tense":"虚拟式现在时","person":"il (无人称)"},"garantisse":{"lemma":"garantir","tense":"虚拟式现在时","person":"je/il/elle/on"},"voulais":{"lemma":"vouloir","tense":"直陈式未完成过去时","person":"je/tu"},"voudrais":{"lemma":"vouloir","tense":"条件式现在时","person":"je/tu"},"veuillez":{"lemma":"vouloir","tense":"命令式现在时","person":"vous"},"dirais":{"lemma":"dire","tense":"条件式现在时","person":"je/tu"},"dirait":{"lemma":"dire","tense":"条件式现在时","person":"il/elle/on"},"dis":{"lemma":"dire","tense":"命令式现在时","person":"tu"},"vaut":{"lemma":"valoir","tense":"直陈式现在时","person":"il/elle/on"},"valait":{"lemma":"valoir","tense":"直陈式未完成过去时","person":"il/elle/on"},"viens":{"lemma":"venir","tense":"直陈式现在时","person":"je/tu"},"fais":{"lemma":"faire","tense":"直陈式现在时","person":"je/tu"},"écris":{"lemma":"écrire","tense":"直陈式现在时","person":"je/tu"},"retiens":{"lemma":"retenir","tense":"直陈式现在时","person":"je/tu"},"plaît":{"lemma":"plaire","tense":"直陈式现在时","person":"il/elle/on"},"convient":{"lemma":"convenir","tense":"直陈式现在时","person":"il/elle/on"},"suffit":{"lemma":"suffire","tense":"直陈式现在时","person":"il/elle/on"},"dépend":{"lemma":"dépendre","tense":"直陈式现在时","person":"il/elle/on"},"entend":{"lemma":"entendre","tense":"直陈式现在时","person":"il/elle/on"},"permet":{"lemma":"permettre","tense":"直陈式现在时","person":"il/elle/on"},"espère":{"lemma":"espérer","tense":"直陈式现在时","person":"je/il/elle/on"},"contacte":{"lemma":"contacter","tense":"直陈式现在时","person":"je/il/elle/on"},"recherche":{"lemma":"rechercher","tense":"直陈式现在时","person":"je/il/elle/on"},"souhaite":{"lemma":"souhaiter","tense":"直陈式现在时","person":"je/il/elle/on"},"invite":{"lemma":"inviter","tense":"直陈式现在时","person":"je/il/elle/on"},"propose":{"lemma":"proposer","tense":"直陈式现在时","person":"je/il/elle/on"},"suggère":{"lemma":"suggérer","tense":"直陈式现在时","person":"je/il/elle/on"},"coûte":{"lemma":"coûter","tense":"直陈式现在时","person":"je/il/elle/on"},"conseille":{"lemma":"conseiller","tense":"直陈式现在时","person":"je/il/elle/on"},"recommande":{"lemma":"recommander","tense":"直陈式现在时","person":"je/il/elle/on"},"apprécie":{"lemma":"apprécier","tense":"直陈式现在时","person":"je/il/elle/on"},"motive":{"lemma":"motiver","tense":"直陈式现在时","person":"je/il/elle/on"},"remercie":{"lemma":"remercier","tense":"直陈式现在时","person":"je/il/elle/on"},"reste":{"lemma":"rester","tense":"直陈式现在时","person":"je/il/elle/on"},"présente":{"lemma":"présenter","tense":"直陈式现在时","person":"je/il/elle/on"},"regrette":{"lemma":"regretter","tense":"直陈式现在时","person":"je/il/elle/on"},"garde":{"lemma":"garder","tense":"直陈式现在时","person":"je/il/elle/on"},"montre":{"lemma":"montrer","tense":"直陈式现在时","person":"je/il/elle/on"},"demande":{"lemma":"demander","tense":"直陈式现在时","person":"je/il/elle/on"},"suscite":{"lemma":"susciter","tense":"直陈式现在时","person":"je/il/elle/on"},"semble":{"lemma":"sembler","tense":"直陈式现在时","person":"je/il/elle/on"},"risque":{"lemma":"risquer","tense":"直陈式现在时","person":"je/il/elle/on"},"signifie":{"lemma":"signifier","tense":"直陈式现在时","person":"je/il/elle/on"},"constitue":{"lemma":"constituer","tense":"直陈式现在时","person":"je/il/elle/on"},"passe":{"lemma":"se passer","tense":"直陈式现在时","person":"je/il/elle/on"},"adresse":{"lemma":"s’adresser","tense":"直陈式现在时","person":"je/il/elle/on"},"pense":{"lemma":"penser","tense":"直陈式现在时","person":"je/il/elle/on"},"considèrent":{"lemma":"considérer","tense":"直陈式现在时","person":"ils/elles"},"estiment":{"lemma":"estimer","tense":"直陈式现在时","person":"ils/elles"},"risquent":{"lemma":"risquer","tense":"直陈式现在时","person":"ils/elles"},"constituent":{"lemma":"constituer","tense":"直陈式现在时","person":"ils/elles"},"restent":{"lemma":"rester","tense":"直陈式现在时","person":"ils/elles"},"souhaitez":{"lemma":"souhaiter","tense":"直陈式现在时","person":"vous"},"commencerons":{"lemma":"commencer","tense":"直陈式简单将来时","person":"nous"},"terminerons":{"lemma":"terminer","tense":"直陈式简单将来时","person":"nous"},"proposerai":{"lemma":"proposer","tense":"直陈式简单将来时","person":"je"},"revaudrai":{"lemma":"revaloir","tense":"直陈式简单将来时","person":"je"},"aimerais":{"lemma":"aimer","tense":"条件式现在时","person":"je/tu"},"souhaiterais":{"lemma":"souhaiter","tense":"条件式现在时","person":"je/tu"},"améliorerait":{"lemma":"améliorer","tense":"条件式现在时","person":"il/elle/on"},"donneriez":{"lemma":"donner","tense":"条件式现在时","person":"vous"},"recommanderiez":{"lemma":"recommander","tense":"条件式现在时","person":"vous"},"décririez":{"lemma":"décrire","tense":"条件式现在时","person":"vous"},"correspondaient":{"lemma":"correspondre","tense":"直陈式未完成过去时","person":"ils/elles"},"retrouvons":{"lemma":"retrouver","tense":"命令式现在时","person":"nous"},"confirme":{"lemma":"confirmer","tense":"命令式现在时","person":"tu"},"hésite":{"lemma":"hésiter","tense":"命令式现在时","person":"tu"},"hésitez":{"lemma":"hésiter","tense":"命令式现在时","person":"vous"},"prenons":{"lemma":"prendre","tense":"命令式现在时","person":"nous"}};
const PARTICIPLES={"été":"être","apprécié":"apprécier","touché":"toucher","plu":"plaire","dépassé":"dépasser","appris":"apprendre","convaincu":"convaincre","montré":"montrer","rappelé":"rappeler","fait":"faire","captivé":"captiver","impressionné":"impressionner","séduit":"séduire"};
const COLORS={'直陈式现在时':'present','条件式现在时':'conditional','虚拟式现在时':'subjunctive','直陈式未完成过去时':'imperfect','直陈式简单将来时':'future','命令式现在时':'imperative','直陈式复合过去时':'compound','现在分词':'participle','副动词（现在时）':'participle'};
function analyze(fr){
 const tokens=[...fr.matchAll(/[\p{L}]+/gu)].map(m=>({word:m[0],lower:m[0].toLowerCase(),start:m.index,end:m.index+m[0].length}));
 const out=[];
 for(let i=0;i<tokens.length;i++){
  const t=tokens[i],entry=FORMS[t.lower];
  if(!entry){
   if(t.lower==='lisant'||t.lower==='ayant'||t.lower==='étant'){
    const before=fr.slice(0,t.start).toLowerCase();
    out.push({...t,lemma:{lisant:'lire',ayant:'avoir',étant:'être'}[t.lower],tense:/\ben\s*$/.test(before)?'副动词（现在时）':'现在分词',person:'无主语人称变化'});
   }
   continue;
  }
  const before=fr.slice(0,t.start).replace(/[’‘]/g,"'").toLowerCase();
  // 'a' is avoir; accented à is never treated as a verb. Ignore noun/adjective homographs.
  if(t.lower==='recherche' && /(?:\bune|\bla)\s*$/.test(before))continue;
  if(t.lower==='présente' && /\best\s*$/.test(before))continue;
  let a={...t,...entry};
  if(t.lower==='pense' && !/\bje\s*$/.test(before)){a.tense='命令式现在时';a.person='tu';}
  if(t.lower==='puisse' && /(?:qu['’]il|qu['’]elle|\bil|\belle)\s*$/.test(before))a.person='il/elle';
  const inv=fr.slice(t.end).match(/^-(?:t-)?(je|tu|il|elle|on|nous|vous|ils|elles)\b/i);
  const subj=before.match(/(?:\b(je|tu|il|elle|on|nous|vous|ils|elles|ce|cela)|\b(j|c)')(?:(?:\s+(?:ne|me|te|se|vous|nous|en|y))|(?:\s*[mnstdl]'(?:en|y)?))*\s*$/);
  let subject=inv?.[1]?.toLowerCase()||subj?.[1]||({j:'je',c:'il/elle/on'}[subj?.[2]]);
  if(!subject && /quelqu'un\s*$/.test(before))subject='il/elle';
  if(!subject && /(?:\bce qui|\bcette\b|\bmon\b|\bcela\b)/.test(before))subject='il/elle/on';
  if(subject==='cela'||subject==='ce')subject='il/elle/on';
  if(subject && a.person.includes('/'))a.person=subject;
  if(a.tense==='命令式现在时')subject=null;
  // A finite auxiliary + actual past participle is a compound tense, not two present-tense verbs.
  if((a.lemma==='avoir'||a.lemma==='être')&&a.tense==='直陈式现在时'){
   let j=i+1;while(tokens[j]&&['particulièrement','le','plus'].includes(tokens[j].lower))j++;
   const next=tokens[j];
   if(next&&PARTICIPLES[next.lower]&& !/[+…]|\.\.\./.test(fr.slice(t.end,next.start))){
    if(a.lemma==='avoir' || next.lower==='été'){
     a.end=next.end;a.word=fr.slice(a.start,a.end);a.lemma=PARTICIPLES[next.lower];a.tense='直陈式复合过去时';a.note='助动词 '+entry.lemma+' 的直陈式现在时 + 过去分词 '+next.word;
     i=j;
    }
   }else if(/^[\s+]*participe passé/.test(fr.slice(t.end))){
    a.note='这里是助动词的现在时；补上过去分词后，整体构成复合过去时。';
   }
  }
  out.push(a);
 }
 return out;
}
function render(container,fr){
 const rows=analyze(fr),box=document.createElement('section');box.className='conjugation-panel';
 const head=document.createElement('strong');head.textContent='正确表达 · 动词变位';box.append(head);
 const line=document.createElement('p');line.className='conjugation-expression';let pos=0;
 for(const row of rows){line.append(document.createTextNode(fr.slice(pos,row.start)));const mark=document.createElement('mark');mark.className='conj-'+(COLORS[row.tense]||'present');mark.textContent=fr.slice(row.start,row.end);mark.title=row.lemma+' · '+row.tense+' · '+row.person;line.append(mark);pos=row.end;}
 line.append(document.createTextNode(fr.slice(pos)));box.append(line);
 for(const row of rows){const p=document.createElement('p');p.className='conjugation-detail';const tag=document.createElement('span');tag.className='conj-tag conj-'+(COLORS[row.tense]||'present');tag.textContent=row.word;p.append(tag,document.createTextNode(' → '+row.lemma+'｜'+row.tense+'｜'+row.person+(row.person.includes('/')?'（此形式可对应多个人称，按上下文使用）':'')+(row.note?'。'+row.note:'')));box.append(p);}
 const note=document.createElement('p');note.className='note';note.textContent=rows.length?'颜色区分语式／时态；与上方红绿答案差异高亮分开显示。':/infinitif|subjonctif|indicatif|participe présent|participe passé|conditionnel|imparfait/.test(fr)?'这里没有实际变位的动词；infinitif、subjonctif 等是后续结构的语法提示，不是需要默写的动词。':'这个表达没有需要标注的有限动词变位（动词原形不标作变位）。';box.append(note);container.append(box);
}
const css=document.createElement('style');css.textContent=`.conjugation-panel{margin-top:16px;padding:16px;border:1px solid #dfe3ee;background:#fff;border-radius:12px;color:#24304b;white-space:normal}.conjugation-expression{font-size:20px;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere}.conjugation-expression mark,.conj-tag{padding:2px 5px;border-radius:5px;box-decoration-break:clone}.conjugation-detail{font-size:14px;line-height:1.8;overflow-wrap:anywhere}.conj-present{background:#dcecff;color:#17497a}.conj-conditional{background:#ece0ff;color:#613498}.conj-subjunctive{background:#ffe7c6;color:#88501a}.conj-imperfect{background:#fce0ed;color:#883154}.conj-future{background:#d5f1f4;color:#176170}.conj-imperative{background:#ffeadc;color:#8c421d}.conj-compound{background:#e3e7ff;color:#394a99}.conj-participle{background:#f0e9d8;color:#6b571e}`;document.head.append(css);
window.TCF_CONJUGATIONS={analyze,render,version:1};
})();

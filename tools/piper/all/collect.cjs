const fs=require('fs'),vm=require('vm');
const dir=__dirname+'/source/';
const read=p=>fs.readFileSync(dir+p.replaceAll('/','__'),'utf8');
const atoms=new Map(),targets=new Map(),pageCounts={};
function atom(text,page){if(!text?.trim())return; if(!atoms.has(text))atoms.set(text,{id:'a'+(atoms.size+1),text,pages:[]});let a=atoms.get(text);if(!a.pages.includes(page))a.pages.push(page);return a.id;}
function target(text,pieces,page){if(!text?.trim())return;const segments=[];let pos=0;for(const p of pieces){if(!p?.trim())continue;const offset=text.indexOf(p,pos);if(offset<0)throw Error('Source mismatch '+page);segments.push({id:atom(p,page),offset});pos=offset+p.length;}if(!targets.has(text))targets.set(text,{text,segments,pages:[]});const t=targets.get(text);if(!t.pages.includes(page))t.pages.push(page);pageCounts[page]=(pageCounts[page]||0)+1;}
function parseDataset(page){return JSON.parse(read(page+'/index.html').match(/<script id="dataset" type="application\/json">([\s\S]*?)<\/script>/)[1]);}
for(const page of ['tache1','tache2-ee']){
 const data=parseDataset(page);
 for(const d of data){for(const p of d.paragraphs)target(p,[p],page);target(d.answer,d.paragraphs,page);}
}
const w={};vm.runInNewContext(read('data.js')+read('translations.js'),{window:w});
const app=read('app.js'),start=app.indexOf('function splitSentences'),end=app.indexOf('function currentCards');
const ctx={window:w};vm.runInNewContext(app.slice(start,end)+';this.buildCards=buildCards;',ctx);
for(const t of w.TCF_TOPICS){for(const p of t.paragraphs)target(p.answer,[p.answer],'root');target(t.paragraphs.map(p=>p.answer).join('\n\n'),t.paragraphs.map(p=>p.answer),'root');for(const c of ctx.buildCards(t))target(c.fr,[c.fr],'root');}
const t2={};vm.runInNewContext(Array.from({length:6},(_,i)=>read('tache2/data'+(i+1)+'.js')).join('\n')+Array.from({length:12},(_,i)=>read('tache2/cfix'+(i+1)+'.js')).join('\n'),{window:t2});
for(const r of t2.TCF_T2_RAW)target(r[2],[r[2]],'tache2');
for(const r of t2.TCF_T2_C)target(r.fr,[r.fr],'tache2');
const ctx3={};vm.runInNewContext(read('eo-tache3-corpus/data.js')+Array.from({length:9},(_,i)=>read('eo-tache3-corpus/data-'+(i+1)+'.js')).join('\n')+';this.corpus=CORPUS;',ctx3);
for(const p of ctx3.corpus)target(p.fr,[p.fr],'eo-tache3-corpus');
for(const id of new Set(ctx3.corpus.map(p=>p.questionId))){const parts=ctx3.corpus.filter(p=>p.questionId===id).sort((a,b)=>a.part-b.part).map(p=>p.fr);target(parts.join('\n\n'),parts,'eo-tache3-corpus');}
for(const page of ['tache1-expressions','tache2-expressions','tache3-expressions','eo-tache2-expressions','eo-tache3-expressions']){
 const html=read(page+'/index.html');const start=html.indexOf('const DATA=');if(start<0)throw Error('DATA missing '+page);
 let depth=0,quoted=false,escaped=false,end=start+11;
 for(let i=start+11;i<html.length;i++){const c=html[i];if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;}else if(c==='"')quoted=true;else if(c==='[')depth++;else if(c===']'&&--depth===0){end=i+1;break;}}
 const entries=JSON.parse(html.slice(start+11,end));for(const e of entries)target(e.fr,[e.fr],page);
}
fs.writeFileSync(__dirname+'/catalog.json',JSON.stringify({atoms:[...atoms.values()],targets:[...targets.values()],pageCounts},null,2));
console.log(JSON.stringify({atoms:atoms.size,targets:targets.size,pageCounts}));

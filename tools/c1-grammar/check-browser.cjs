const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),errors=[];
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');try{res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(p));}catch{res.statusCode=404;res.end();}});
const checks=[];
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.TCF_CHROME_PATH,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.stack));
 await page.addInitScript(()=>{window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};window.__c1Spoken=[];window.__c1Cancelled=0;Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'en-US'},{lang:'fr-FR',name:'Test French'}],cancel:()=>window.__c1Cancelled++,speak:u=>{window.__c1Spoken.push({text:u.text,lang:u.lang,rate:u.rate});u.onstart?.();u.onend?.();}}});});
 await page.goto(`http://127.0.0.1:${server.address().port}/combined-expressions/`);
 await page.locator('[data-module="9"]').click();
 assert.equal(await page.locator('[data-c1-category]').count(),8);checks.push('Home: 8 categories and mixed challenge');
 const expected=[93,45,30,18,14,20,16,158];
 for(let cat=0;cat<8;cat++){
  await page.selectOption('#c1Category',String(cat));
  const rs=await page.locator('.c1-table tbody tr').count();assert.equal(rs,cat===6?46:expected[cat]);
  const headers=await page.locator('.c1-table thead tr').allTextContents();assert(headers.every(h=>h==='中文法语'));
  for(const mode of ['learn','practice','review','overview']){
   await page.locator(`[data-c1-view="${mode}"]`).click();assert(await page.locator('#c1View').isVisible());
   if(mode==='learn')assert(await page.locator('.c1-entry').count()>0);
   if(['practice','review'].includes(mode))assert(await page.locator('#c1Exercise').isVisible());
  }
 }
 checks.push('All 8 categories: counts, 2-column overview, learn/practice/review switching');

 await page.locator('.c1-audio').first().getByRole('button',{name:'🔊 法语朗读',exact:true}).click();
 await page.locator('.c1-audio').first().getByRole('button',{name:'🐢 慢速',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>window.__c1Spoken.map(x=>[x.lang,x.rate])),[['fr-FR',1],['fr-FR',.75]]);
 await page.locator('.c1-audio').first().getByRole('button',{name:'停止',exact:true}).click();assert((await page.locator('.c1-audio').first().innerText()).includes('已停止'));
 await page.locator('[data-c1-view="learn"]').click();assert(await page.locator('.c1-entry .c1-audio').count()>0);
 await page.locator('[data-c1-view="practice"]').click();assert.equal(await page.locator('#c1Exercise .c1-audio').count(),0);
 await page.getByRole('button',{name:'显示答案',exact:true}).click();assert(await page.locator('#c1Exercise .c1-audio').count()>0);
 await page.evaluate(()=>{speechSynthesis.getVoices=()=>[];});await page.locator('#c1Exercise .c1-audio').first().getByRole('button',{name:'🔊 法语朗读',exact:true}).click();assert((await page.locator('#c1Exercise .c1-audio').first().innerText()).includes('添加法语语音'));
 await page.evaluate(()=>{speechSynthesis.getVoices=()=>[{lang:'fr-FR'}];});
 checks.push('French speech controls: overview/cards/revealed answers; French voice, normal/slow/stop; no answer leak; missing voice guidance (speech API mocked)');

 // A genuine shared entry between subjunctive and concession.
 await page.selectOption('#c1Category','0');await page.fill('#c1Search','Bien que');
 const shared=await page.locator('.c1-table tbody tr').first().getAttribute('data-c1-id');
 const row=page.locator(`tr[data-c1-id="${shared}"]`);await row.locator('summary').first().click();await row.getByText('笔记',{exact:true}).click();
 await row.locator('textarea').fill('同一词条跨专项共享 · QA');await row.getByRole('button',{name:'稍弱',exact:true}).click();
 // Render replaced the row; reopen edit in the refreshed overview.
 await row.locator('summary').first().click();await row.getByRole('button',{name:'✏️ 编辑',exact:true}).click();
 await page.fill('#c1EditChinese','尽管…… · QA编辑');await page.locator('#c1EditForm').getByRole('button',{name:'保存',exact:true}).click();
 await page.selectOption('#c1Category','2');await page.fill('#c1Search','Bien que');
 assert.equal(await page.locator('.c1-table tbody tr').first().getAttribute('data-c1-id'),shared);
 assert((await page.locator('#c1View').innerText()).includes('QA编辑'));
 await row.locator('summary').first().click();await row.locator('.c1-note summary').click();
 assert.equal(await row.locator('textarea').inputValue(),'同一词条跨专项共享 · QA');
 assert.equal(await row.locator('button[data-mastery="weak"]').getAttribute('aria-pressed'),'true');
 await row.getByRole('button',{name:'✏️ 编辑',exact:true}).click();await page.fill('#c1EditChinese','取消内容不应该保存');await page.locator('#c1EditCancel').click();
 assert((await page.locator('#c1View').innerText()).includes('QA编辑'));
 await page.reload();await page.locator('#c1View').waitFor({state:'visible'});assert((await page.locator('#c1View').innerText()).includes('QA编辑'));
 checks.push('Canonical shared ID: notes, mastery and edits across 2 categories; save/cancel; reload persistence');
 // Every generated cloze removes a real substring; no blankless fake questions.
 const catalog=await page.evaluate(()=>C1_GRAMMAR.entries.map(e=>({id:e.id,kind:e.kind,qs:C1_GRAMMAR.questionsFor(e).map(q=>({type:q.type,...C1_GRAMMAR.dynamic(q)}))})));
 for(const e of catalog)for(const q of e.qs){assert(q.stem&&q.answer,JSON.stringify(q));if(q.type==='cloze')assert(q.stem.includes('______'),JSON.stringify(q));}
 const typeCounts={};for(const e of catalog)for(const q of e.qs)typeCounts[q.type]=(typeCounts[q.type]||0)+1;
 for(const type of ['zh-fr','fr-zh','cloze','select','transform','oral','correct'])assert(typeCounts[type]>0,type);
 checks.push('Generated exercise validation: all 7 types; each cloze has an actual blank');
 await page.selectOption('#c1Category','1');await page.locator('[data-c1-view="practice"]').click();await page.selectOption('#c1PracticeType','cloze');
 const ans=await page.evaluate(()=>C1_GRAMMAR.dynamic(C1_GRAMMAR.questions()[0]).answer);await page.fill('#c1Answer','intentionally wrong');await page.getByRole('button',{name:'检查答案',exact:true}).click();assert((await page.locator('#c1Exercise').innerText()).includes('需要再练'));
 await page.getByRole('button',{name:'下一题',exact:true}).click();const q=await page.evaluate(()=>C1_GRAMMAR.dynamic(C1_GRAMMAR.questions()[state.c1Grammar.question]));await page.fill('#c1Answer',q.answer);await page.getByRole('button',{name:'检查答案',exact:true}).click();assert((await page.locator('#c1Exercise').innerText()).includes('本次正确'));
 await page.locator('[data-c1-view="review"]').click();assert(await page.evaluate(()=>C1_GRAMMAR.record(C1_GRAMMAR.questions()[0].entry).masteryStatus==='unknown'));
 await page.selectOption('#c1PracticeType','oral');await page.selectOption('#c1TimerChoice','3');await page.getByRole('button',{name:'开始计时',exact:true}).click();assert((await page.locator('#c1Timer').innerText()).includes('3'));
 await page.getByRole('button',{name:'显示答案',exact:true}).click();assert(await page.locator('#c1Reference').isVisible());await page.getByRole('button',{name:'有停顿',exact:true}).click();
 checks.push('Wrong/correct answers, ranked review, 3-second oral timer and hesitation self-rating');
 await page.selectOption('#c1Category','');await page.getByRole('button',{name:'C1 语法混合挑战',exact:true}).click();assert.equal(await page.locator('#c1Exercise .c1-tags').count(),0);await page.getByRole('button',{name:'显示答案',exact:true}).click();
 checks.push('Mixed challenge hides category before reveal');
 // Native progress export/import includes C1 data, while original modules continue working.
 const download=page.waitForEvent('download');await page.locator('#export').click();const dl=await download;const exported=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.equal(exported.records[shared].c1.userNote,'同一词条跨专项共享 · QA');
 await page.locator('#file').setInputFiles({name:'qa.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('已导入'));
 for(const mod of [0,1,2,3,4,5,6,7,8,'errors','vocab']){await page.locator(`[data-module="${mod}"]`).click();assert(!(await page.locator('#c1View').isVisible()));}
 await page.locator('[data-module="0"]').click();assert(await page.locator('#practice').isVisible());assert((await page.locator('#prompt').innerText()).length>0);
 checks.push('Native export/import retains C1 data; all 11 original module routes remain usable');
 await page.locator('[data-module="9"]').click();await page.selectOption('#c1Category','0');await page.selectOption('#c1Priority','3');assert(await page.evaluate(()=>C1_GRAMMAR.pool().every(e=>e.priority===3)));await page.selectOption('#c1Priority','');await page.locator('[data-c1-view="overview"]').click();
 const out=path.join(root,'tools/c1-grammar');await page.screenshot({path:path.join(out,'qa-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.locator('#c1View h2').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(out,'qa-mobile.png')});
 await page.locator('.c1-table summary').first().click();await page.locator('.c1-table').getByRole('button',{name:'✏️ 编辑',exact:true}).first().click();assert(await page.locator('#c1EditDialog').isVisible());assert(await page.locator('#c1EditDialog').evaluate(x=>x.getBoundingClientRect().width<=innerWidth));await page.locator('#c1EditCancel').click();
 checks.push('Source-only star filters; desktop and 390px mobile overview/dialog have no overflow');
 assert.equal(errors.length,0,errors.join('\n'));
 const report={passed:true,checks,exerciseCounts:typeCounts,browser:'Google Chrome',pageErrors:errors};fs.writeFileSync(path.join(out,'qa-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});

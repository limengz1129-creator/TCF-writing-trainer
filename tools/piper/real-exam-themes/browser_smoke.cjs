const { chromium } = require('playwright');
const themes='housing social education consumption transport family sport health culture work'.split(' ');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const failures=[];
 for(const theme of themes){
  const page=await browser.newPage({acceptDownloads:false});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('https://limengz1129-creator.github.io/TCF-writing-trainer/tache2/real-exams/theme-study.html?theme='+theme,{waitUntil:'networkidle',timeout:60000});
   await page.locator('#questionRows .audio').first().waitFor({timeout:30000});
   const count=await page.locator('#questionRows .audio').count();
   if(count!==15)throw Error('expected 15 buttons, got '+count);
   await page.locator('#questionRows .audio').first().click();
   await page.waitForFunction(()=>{const s=document.querySelector('#speechStatus')?.textContent||'';return s.includes('正在朗读')||s.includes('朗读完成')||s.includes('失败')||s.includes('缺失')||s.includes('不一致')||s.includes('尚未生成')},{timeout:30000});
   const status=await page.locator('#speechStatus').textContent();
   if(!/正在朗读|朗读完成/.test(status))throw Error('audio button: '+status);
   if(errors.length)throw Error('page error: '+errors.join(' | '));
   console.log('PASS',theme,'buttons',count,'playback',status);
  }catch(e){failures.push(theme+': '+e.message);console.error('FAIL',theme,e.message)}
  await page.close();
 }
 await browser.close();
 if(failures.length){console.error(failures.join('\n'));process.exit(1)}
})().catch(e=>{console.error(e);process.exit(1)});

const {chromium}=require('@playwright/test');const fs=require('node:fs/promises');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'||m.text().includes('hydration'))errors.push(m.text());});
 await page.goto(process.env.MOTION_URL||'http://localhost:3001');await page.waitForSelector('[data-motion=full]');
 const id=await page.locator('.keynote-root').getAttribute('data-lenis-instance');
 for(const mode of ['full','reduced','full','paused','full']){
  if(mode==='reduced')await page.emulateMedia({reducedMotion:'reduce'});
  else if(mode==='paused')await page.locator('.motion-toggle').click();
  else{await page.emulateMedia({reducedMotion:'no-preference'});if(await page.locator('.motion-toggle').getAttribute('aria-pressed')==='true')await page.locator('.motion-toggle').click();}
  await page.waitForTimeout(450);await page.locator('#launches').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(850);
  const state=await page.evaluate(()=>({mode:document.querySelector('.keynote-root').dataset.motion,instance:document.querySelector('.keynote-root').dataset.lenisInstance,pins:document.querySelectorAll('.pin-spacer').length}));results.push(state);assert.equal(state.mode,mode);assert.equal(state.instance,id);assert.equal(state.pins,mode==='full'?2:0);
 }
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(600);await page.mouse.move(700,400);await page.mouse.wheel(0,500);const wheel=[];for(const wait of [20,100,300,800]){await page.waitForTimeout(wait);wheel.push(await page.evaluate(()=>scrollY));}assert(wheel[0]<wheel[3],'smooth wheel did not interpolate');
 const skipPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});await skipPage.goto(process.env.MOTION_URL||'http://localhost:3001',{waitUntil:'domcontentloaded'});await skipPage.waitForSelector('[data-intro-ready=true]',{state:'attached'});await skipPage.locator('.intro-skip').click({timeout:1500});await skipPage.waitForSelector('.intro',{state:'detached',timeout:500});await skipPage.close();
 assert.equal(errors.length,0);const name=process.env.MOTION_URL?'strict-mode':'lifecycle';await fs.writeFile(`reports/motion-check/${name}.json`,JSON.stringify({results,wheel,skipIntro:true,errors},null,2));console.log(name,'PASS',JSON.stringify({results,wheel,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});

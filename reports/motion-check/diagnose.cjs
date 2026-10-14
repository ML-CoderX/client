const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 for(const [width,height,reducedMotion] of [[1440,1000,'no-preference'],[1440,768,'no-preference'],[390,844,'no-preference'],[1440,1000,'reduce']]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://localhost:3001');
  const early=await page.evaluate(()=>({intro:!!document.querySelector('.intro'),reduced:matchMedia('(prefers-reduced-motion:reduce)').matches,desktopGate:matchMedia('(min-width:1024px) and (min-height:780px)').matches}));
  await page.waitForTimeout(1800);
  const state=()=>page.evaluate(()=>({static:document.documentElement.classList.contains('motion-static'),pins:document.querySelectorAll('.pin-spacer').length,lenis:document.documentElement.classList.contains('lenis'),hero:getComputedStyle(document.querySelector('.hero-portrait')).transform,phone:getComputedStyle(document.querySelector('.float-gold')).transform,rail:getComputedStyle(document.querySelector('.reel-track')).transform,intro:!!document.querySelector('.intro')}));
  const before=await state();await page.evaluate(()=>window.scrollTo({top:300,behavior:'instant'}));await page.waitForTimeout(1100);const after=await state();
  await page.screenshot({path:`reports/motion-check/before-${width}x${height}-${reducedMotion}.png`});
  results.push({width,height,reducedMotion,early,before,after,errors});await context.close();
 }
 await fs.writeFile('reports/motion-check/diagnosis.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();
})();

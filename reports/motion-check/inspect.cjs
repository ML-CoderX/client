const {chromium}=require('@playwright/test');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [390,768,1440]){const page=await browser.newPage({viewport:{width,height:width===390?844:768},reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto('http://localhost:3001');await page.waitForTimeout(2700);
await page.screenshot({path:`reports/motion-check/inspect-${width}-hero.png`});
for(const id of ['statement','content','launches','community','personality','contact']){await page.locator('#'+id).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(900);await page.screenshot({path:`reports/motion-check/inspect-${width}-${id}.png`});}
console.log(width,await page.evaluate(()=>({mode:document.querySelector('.keynote-root').dataset.motion,pins:document.querySelectorAll('.pin-spacer').length,overflow:document.documentElement.scrollWidth-innerWidth})),errors);await page.close();}await browser.close();})();

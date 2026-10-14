const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});await page.waitForTimeout(2200);
 console.log(JSON.stringify(await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&!e.closest('.reel-window,.stories,.marquee,.filter-row')}).map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})).slice(0,25)})),null,2));
 for(const id of ['content','launches','community','personality','contact']){await page.locator('#'+id).evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-20));await page.waitForTimeout(850);await page.screenshot({path:`verification/${id}-390.png`});}
 await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(1000);
 for(const id of ['content','launches','community','personality','contact']){await page.locator('#'+id).evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY));await page.waitForTimeout(1100);await page.screenshot({path:`verification/${id}-1440.png`});}
 await browser.close();
})();

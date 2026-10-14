const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:768,height:1000}});
 await page.goto('http://localhost:3001',{waitUntil:'networkidle'});await page.waitForTimeout(2200);
 console.log(JSON.stringify(await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&!e.closest('.reel-window,.stories,.marquee,.filter-row')}).map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})).slice(0,25)})),null,2));
 await page.screenshot({path:'verification/tablet-debug.png'}); await browser.close();
})();

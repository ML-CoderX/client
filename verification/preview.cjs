const { chromium } = require('playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  await page.waitForTimeout(1700);
  await page.screenshot({path:'verification/hero-1440.png'});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'verification/hero-390.png',fullPage:true});
  console.log(JSON.stringify({title:await page.title(),errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)},null,2));
  await browser.close();
})();

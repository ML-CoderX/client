import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import fs from 'node:fs/promises';
const chrome=await launch({chromeFlags:['--headless=new']});
try {
  const result=await lighthouse('http://localhost:3001',{port:chrome.port,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  await fs.writeFile('verification/lighthouse-mobile.json',result.report[0]);
  await fs.writeFile('verification/lighthouse-mobile.html',result.report[1]);
  console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,result.lhr.audits[k].displayValue])),failures:Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<.9&&a.details).map(a=>({id:a.id,title:a.title,score:a.score,display:a.displayValue}))},null,2));
}finally{await chrome.kill();}

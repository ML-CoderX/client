const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
const dir='reports/motion-check';
async function sweep(page,duration){return page.evaluate(duration=>new Promise(resolve=>{
 const frames=[];let start,previous;scrollTo({top:0,behavior:'instant'});
 const frame=t=>{if(start===undefined){start=t;previous=t;}else frames.push(t-previous);const delta=t-previous;previous=t;
  const progress=Math.min(1,(t-start)/duration);scrollTo({top:scrollY+delta*.5,behavior:'instant'});
  if(progress<1 && (scrollY<document.documentElement.scrollHeight-innerHeight-2 || t-start<5000))requestAnimationFrame(frame);else resolve(frames);
 };requestAnimationFrame(frame);
}),duration);}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const width of (process.argv.includes('--cpu-only')?[]:[1440,390])){
  const height=width===390?844:1000;
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',recordVideo:{dir:`${dir}/raw-video`,size:{width,height}}});const page=await context.newPage();
  await page.goto('http://localhost:3001');await page.waitForTimeout(3500);await sweep(page,26000);await page.waitForTimeout(1000);
  const video=page.video();await context.close();await video.saveAs(`${dir}/${width}-full-scroll.webm`);await video.delete();console.log('Recorded',width);
 }
 // No video or screenshots during the CPU test: recording itself adds overhead.
 const fps=[];for(const width of (process.argv.includes('--video-only')?[]:[1440,390])){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'no-preference'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await page.goto('http://localhost:3001');await page.waitForTimeout(4500);
  const frames=await sweep(page,26000),sorted=[...frames].sort((a,b)=>a-b),mean=frames.reduce((a,b)=>a+b,0)/frames.length;
  fps.push({width,cpuSlowdown:4,durationMs:frames.reduce((a,b)=>a+b,0),frames:frames.length,fps:1000/mean,medianMs:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],over33ms:frames.filter(t=>t>33.4).length,errors,intervals:frames});await context.close();
 }if(fps.length)await fs.writeFile(`${dir}/cpu-4x.json`,JSON.stringify(fps,null,2));console.log(JSON.stringify(fps.map(({intervals,...rest})=>rest),null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});

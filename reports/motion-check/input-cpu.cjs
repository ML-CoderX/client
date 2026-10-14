const {chromium}=require('@playwright/test');const fs=require('node:fs/promises');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];try{
for(const width of [1440,390]){
 const height=width===390?844:1000;const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390,deviceScaleFactor:1,reducedMotion:'no-preference'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await page.goto('http://localhost:3001');await page.waitForTimeout(3500);
 await page.evaluate(()=>{window.scrollFrames=[];window.sampleScroll=true;let previous;const frame=t=>{if(previous!==undefined)window.scrollFrames.push({dt:t-previous,y:scrollY});previous=t;if(window.sampleScroll)requestAnimationFrame(frame);};requestAnimationFrame(frame);});
 const positions=[];for(let i=0;i<25;i++){
  await cdp.send('Input.synthesizeScrollGesture',{x:width/2,y:height*.7,yDistance:-600,speed:600,gestureSourceType:width===390?'touch':'mouse',preventFling:true});
  const pos=await page.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));positions.push(pos);if(pos.y>=pos.max-5)break;
 }
 const raw=await page.evaluate(()=>{window.sampleScroll=false;return window.scrollFrames;});
 // Keep all frame intervals during the sweep, including its startup/section work.
 const intervals=raw.map(x=>x.dt),sorted=[...intervals].sort((a,b)=>a-b),duration=intervals.reduce((a,b)=>a+b,0);
 const result={width,input:width===390?'native touch gestures':'native mouse-wheel gestures',cpuSlowdown:4,durationMs:duration,frames:intervals.length,fps:1000*intervals.length/duration,medianMs:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],over33ms:intervals.filter(t=>t>33.4).length,positions,errors,raw};results.push(result);assert(positions.at(-1).y>1000,'gesture did not scroll');assert(positions.at(-1).y>=positions.at(-1).max-5,'did not reach footer');await context.close();console.log(JSON.stringify({...result,raw:undefined},null,2));
}await fs.writeFile('reports/motion-check/native-input-cpu-4x.json',JSON.stringify(results,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});

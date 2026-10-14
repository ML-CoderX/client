const {chromium}=require('@playwright/test');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const dir='reports/motion-check';
const settle=page=>page.waitForTimeout(750);
async function go(page,y){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.max(0,y));await settle(page);}
async function top(page,selector){return page.locator(selector).first().evaluate(el=>el.getBoundingClientRect().top+scrollY);}
async function state(page,selector){return page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return{transform:s.transform,opacity:s.opacity,x:b.x,y:b.y,width:b.width,height:b.height};});}
async function shot(page,name){await page.screenshot({path:`${dir}/${name}.png`});}
async function run(browser,width,reducedMotion){
 const height=width===390?844:1000,key=`${width}-${reducedMotion}`,checks={};
 const context=await browser.newContext({viewport:{width,height},reducedMotion});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{window.motionEntry=[];let last=0;const frame=t=>{if(t-last>45){last=t;const style=s=>{const e=document.querySelector(s);return e?{transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity,dash:getComputedStyle(e).strokeDashoffset}:null;};window.motionEntry.push({t,intro:style('.intro-strokes path'),headline:style('.headline-mask>span'),portrait:style('.hero-portrait img'),counter:document.querySelector('.follower-count')?.textContent});}if(t<4200)requestAnimationFrame(frame);};requestAnimationFrame(frame);});
 await page.goto('http://localhost:3001');await page.waitForTimeout(4300);
 const entry=await page.evaluate(()=>window.motionEntry);await fs.writeFile(`${dir}/${key}-entry.json`,JSON.stringify(entry,null,2));
 const unique=(field,prop)=>new Set(entry.map(x=>prop?x[field]?.[prop]:x[field]).filter(x=>x!=null)).size;
 checks.intro={strokeStates:unique('intro','dash'),unmounted:await page.locator('.intro').count()===0};
 checks.hero={headlineStates:unique('headline','transform'),portraitStates:unique('portrait','transform'),counterStates:unique('counter')};
 await shot(page,`${key}-hero`);
 
 const floatBefore=await state(page,'.float-gold>.device');await page.waitForTimeout(300);const floatAfter=await state(page,'.float-gold>.device');checks.hero.float={before:floatBefore,after:floatAfter};
 await page.mouse.move(100,220);await settle(page);const parallaxBefore=await state(page,'.float-gold');await page.mouse.move(width-30,220);await settle(page);const parallaxAfter=await state(page,'.float-gold');checks.hero.parallax={before:parallaxBefore,after:parallaxAfter};
 await page.waitForSelector('.keynote-root[data-lenis-instance]',{state:'attached'});const instance=await page.locator('.keynote-root').getAttribute('data-lenis-instance');
 checks.cursor=await state(page,'.cursor-orbit');
 await page.evaluate(()=>{window.ringFrames=[];const el=document.querySelector('.stories>a');new MutationObserver(()=>window.ringFrames.push(getComputedStyle(el).transform)).observe(el,{attributes:true,attributeFilter:['style']});});
 const wordTop=await top(page,'.statement h2');await go(page,wordTop-height*.93);const wordBefore=await state(page,'.statement h2 span');await shot(page,`${key}-statement-before`);await go(page,wordTop-height*.35);const wordAfter=await state(page,'.statement h2 span');checks.statement={before:wordBefore,after:wordAfter};await shot(page,`${key}-statement-after`);
 const ringTop=await top(page,'.stories');await go(page,ringTop-height*.97);const ringBefore=await state(page,'.stories>a');await go(page,ringTop-height*.6);const ringAfter=await state(page,'.stories>a');checks.rings={before:ringBefore,after:ringAfter,frames:await page.evaluate(()=>window.ringFrames)};await page.locator('.stories>a').first().hover();checks.rings.hover=await state(page,'.story-ring');await shot(page,`${key}-rings`);
 await go(page,(await top(page,'.showcase'))-height*.4);await settle(page);
 if(reducedMotion==='no-preference'){
  const track=page.locator('.reel-track');const travel=await track.evaluate(el=>{const v=el.parentElement,s=getComputedStyle(v);return el.scrollWidth-v.clientWidth+parseFloat(s.paddingLeft)+parseFloat(s.paddingRight);});
  const trigger=width>=1024?'.showcase':'.reel-window';const start=(await page.locator(trigger).evaluate(el=>el.parentElement.getBoundingClientRect().top+scrollY))-(width>=1024?0:height*.12);
  const frames=[];for(const p of [.02,.48,.96]){await go(page,start+travel*p);frames.push({progress:p,rail:await state(page,'.reel-track'),accent:await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent'))});await shot(page,`${key}-rail-${p}`);}
  checks.rail={travel,start,frames};
  await go(page,start+4);const card=page.locator('.reel-card').first();await card.hover({position:{x:25,y:40}});await page.waitForTimeout(300);checks.tilt=await state(page,'.reel-card');await page.mouse.move(3,3);
 }
 await go(page,(await top(page,'.launches'))-height*.5);await settle(page);
 if(reducedMotion==='no-preference'){
  const trigger=width>=1024?'.launches':'.launch-stage';const start=(await page.locator(trigger).evaluate(el=>el.parentElement.getBoundingClientRect().top+scrollY))-(width>=1024?0:height*.1);
  const frames=[];for(const p of [.03,.5,.96]){await go(page,start+850*p);frames.push({progress:p,orb:await state(page,'.launch-orb'),china:await state(page,'.scene-0'),apple:await state(page,'.scene-1')});await shot(page,`${key}-launch-${p}`);}checks.launches={start,frames};
 }
 const fanTop=await top(page,'.fan-grid');await go(page,fanTop-height*.97);const fanBefore=await state(page,'.fan-card');await shot(page,`${key}-fans-before`);await go(page,fanTop-height*.35);const fanAfter=await state(page,'.fan-card');await go(page,fanTop);checks.fans={before:fanBefore,after:fanAfter,parallax:await page.locator('.fan-artwork').evaluateAll(els=>els.map(el=>getComputedStyle(el).transform))};await shot(page,`${key}-fans-after`);
 await go(page,(await top(page,'.personality')));checks.reactions=[];
 for(let i=0;i<4;i++){const button=page.locator('.reaction-button').nth(i);await button.click();await page.waitForTimeout(45);const early=await state(page,'.face-wrap');await page.waitForTimeout(500);const late=await state(page,'.face-wrap');checks.reactions.push({button:await button.innerText(),word:await page.locator('.reaction-word').innerText(),early,late});}await shot(page,`${key}-reactions`);
 await go(page,(await top(page,'.marquee'))-height*.3);await page.mouse.move(3,3);const marqueeBefore=await state(page,'.marquee-track');await page.waitForTimeout(250);const marqueeAfter=await state(page,'.marquee-track');await page.locator('.marquee').hover();const hoverBefore=await state(page,'.marquee-track');await page.waitForTimeout(250);const hoverAfter=await state(page,'.marquee-track');checks.marquee={before:marqueeBefore,after:marqueeAfter,hoverBefore,hoverAfter};
 await go(page,(await top(page,'.contact')));await page.locator('#name').focus();await page.waitForTimeout(250);checks.form={focus:await state(page,'label[for=name]')};await page.locator('#name').fill('Motion Test');await page.locator('#brand').fill('Test Brand');await page.locator('#email').fill('motion@example.com');await page.locator('#message').fill('Testing the local draft success animation with a sample enquiry.');
 const submit=page.locator('.submit-button');await submit.hover({position:{x:25,y:12}});await page.waitForTimeout(200);checks.form.magnet=await state(page,'.submit-button');await submit.click();await page.waitForTimeout(60);checks.form.successBefore=await state(page,'.success-mark');await page.waitForTimeout(700);checks.form.successAfter=await state(page,'.success-mark');await shot(page,`${key}-form-success`);
 const footerTop=await top(page,'.footer');await go(page,footerTop-height*.95);const footerBefore=await state(page,'.footer-wordmark');await go(page,await page.evaluate(()=>document.documentElement.scrollHeight));const footerAfter=await state(page,'.footer-wordmark');checks.footer={before:footerBefore,after:footerAfter};await shot(page,`${key}-footer`);
 checks.global={mode:await page.locator('.keynote-root').getAttribute('data-motion'),pins:await page.locator('.pin-spacer').count(),progress:await state(page,'.scroll-progress span'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)};
 // Filter rerenders must retain the original engine and leave only one rail.
 await page.getByRole('button',{name:'Phones',exact:true}).click();await settle(page);await page.getByRole('button',{name:'All',exact:true}).click();await settle(page);checks.global.stableLenis=instance===await page.locator('.keynote-root').getAttribute('data-lenis-instance');
 checks.errors=errors;await fs.writeFile(`${dir}/${key}-measurements.json`,JSON.stringify(checks,null,2));
 assert.equal(errors.length,0,'console errors');assert.equal(checks.global.overflow,0);assert(Number(footerAfter.opacity)>.99,'footer never fully revealed after form height change');assert(checks.global.stableLenis,'engine recreated by filter');assert.notEqual(wordBefore.opacity,wordAfter.opacity,'statement does not reveal');
 if(reducedMotion==='no-preference'){
  assert(checks.intro.strokeStates>2,'stroke not drawing');assert(new Set(checks.rings.frames).size>2,'rings not popping');assert(checks.hero.headlineStates>2,'headline not moving');assert(checks.hero.counterStates>2,'counter not counting');assert.notEqual(floatBefore.transform,floatAfter.transform,'phones static');
  assert.notEqual(checks.rail.frames[0].rail.transform,checks.rail.frames[2].rail.transform,'rail static');assert.notEqual(checks.rail.frames[0].accent,checks.rail.frames[2].accent,'accent static');assert.notEqual(checks.launches.frames[0].apple.opacity,checks.launches.frames[2].apple.opacity,'launch transition static');
  assert.notEqual(fanBefore.transform,fanAfter.transform,'fans static');assert.notEqual(marqueeBefore.transform,marqueeAfter.transform,'marquee static');assert.equal(hoverBefore.transform,hoverAfter.transform,'marquee not pausing');assert.notEqual(footerBefore.transform,footerAfter.transform,'footer static');
 }else{assert.equal(checks.global.pins,0,'reduced motion pins');assert.equal(floatBefore.transform,floatAfter.transform,'reduced motion floating');}
 console.log(key,'PASS',JSON.stringify({pins:checks.global.pins,entry:checks.hero.headlineStates,errors:errors.length}));await context.close();return checks;
}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{for(const width of (process.argv.includes('--mobile-only')?[390]:[1440,390]))for(const mode of ['no-preference','reduce'])await run(browser,width,mode);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});

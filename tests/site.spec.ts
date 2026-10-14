import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { content as c } from "../data/content";

test("all responsive chapters fit, remain accessible and render without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {if(message.type() === "error") errors.push(message.text());});
  for(const width of [390,768,1440]) {
    await page.setViewportSize({width,height:width===390?844:1000});
    await page.goto("/");
    await page.waitForTimeout(2300);
    await expect(page).toHaveTitle(c.meta.title);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({path:`verification/final-${width}-hero.png`});
    for(const id of ["statement","content","launches","community","personality","collaborations","contact"]) {
      await page.locator(`#${id}`).evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY));
      await page.waitForTimeout(850);
      await page.screenshot({path:`verification/final-${width}-${id}.png`});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    }
    const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("filters, modal keyboard trap, Escape, focus return and all reactions", async ({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"}); await page.goto("/");
  for(const category of c.showcase.categories.slice(1)) {
    await page.getByRole("button",{name:category,exact:true}).click();
    await expect(page.locator(".reel-card")).toHaveCount(c.reels.filter(r=>r.category===category).length);
  }
  await page.getByRole("button",{name:"Phones",exact:true}).click();
  const card=page.locator(".reel-card").first();await card.focus();await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button",{name:c.ui.close,exact:true})).toBeFocused();
  await page.keyboard.press("Tab");await page.keyboard.press("Tab");
  expect(await page.evaluate(()=>!!document.activeElement?.closest("dialog"))).toBe(true);
  await page.keyboard.press("Escape");await expect(page.getByRole("dialog")).not.toBeVisible();await expect(card).toBeFocused();
  for(const reaction of c.personality.reactions){await page.getByRole("button",{name:reaction.label,exact:true}).click();await expect(page.locator(".reaction-word")).toHaveText(reaction.word);}
  const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();expect(axe.violations).toEqual([]);
});

test("enquiry validates, prepares a local download and never sends private data", async ({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
  const posts:string[]=[];page.on("request",req=>{if(req.method()==="POST")posts.push(req.url());});
  await page.getByRole("button",{name:c.contact.submit}).click();
  await expect(page.locator(".field-error")).toHaveCount(4);await expect(page.locator("#name")).toBeFocused();
  await page.getByLabel(c.contact.name,{exact:false}).fill("Test Person");
  await page.getByLabel(c.contact.brand,{exact:false}).fill("Test Brand");
  await page.getByLabel(c.contact.email,{exact:false}).fill("test@example.com");
  await page.getByLabel(c.contact.message,{exact:false}).fill("A demonstration enquiry about a new product launch.");
  await page.getByRole("button",{name:c.contact.submit}).click();await expect(page.locator(".form-success")).toBeFocused();
  const download=page.waitForEvent("download");await page.getByRole("link",{name:c.contact.download}).click();
  expect((await download).suggestedFilename()).toBe(c.contact.briefFile);expect(posts).toEqual([]);
  await page.getByRole("button",{name:c.contact.reset}).click();await expect(page.locator("#name")).toHaveValue("");
  const kit=await page.request.get(c.links.mediaKit);expect(kit.status()).toBe(200);expect(kit.headers()["content-disposition"]).toContain("attachment");expect(await kit.text()).toContain(c.kit.pending);
});

test("mobile menu, skip link, reduced-motion and metadata", async ({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
  await page.keyboard.press("Tab");await expect(page.getByRole("link",{name:c.ui.skip})).toBeFocused();
  await page.getByRole("button",{name:c.ui.menu}).click();await expect(page.locator(".nav")).toBeVisible();
  await page.locator(".nav a").last().click();await expect(page.locator(".nav")).not.toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",c.meta.description);
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content",/opengraph-image/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content","summary_large_image");
  const og=await page.request.get("/opengraph-image");expect(og.status()).toBe(200);expect(og.headers()["content-type"]).toContain("image/png");
  expect((await page.request.get(c.media.logo)).status()).toBe(200);
});

test("desktop pinned rail moves, changes accent and exposes cards to keyboard users", async({page})=>{
  await page.goto("/");await expect(page.locator(".keynote-root")).toHaveAttribute("data-motion","full");
  await page.locator("#launches").evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:"instant"}));await page.waitForTimeout(800);await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await page.locator("#content").evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY+650));await page.waitForTimeout(1000);
  const transform=await page.locator(".reel-track").evaluate(el=>getComputedStyle(el).transform);expect(transform).not.toBe("none");
  const last=page.locator(".reel-card").last();await page.keyboard.press("Tab");await last.focus();await page.waitForTimeout(1000);
  const box=await last.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(-1);expect(box!.x+box!.width).toBeLessThanOrEqual(1441);
  await page.getByRole("button",{name:c.ui.pause,exact:true}).click();await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

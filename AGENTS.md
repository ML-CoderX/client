# TASK: Build "CallMeShazzam" - an Apple-keynote-style personal brand website

You are a senior creative developer + art director. Build a complete, production-quality, highly animated website for Indian tech creator Shaz Mohamed (@callmeshazzam, YouTube @callmeshazzamtech). This is an internship deliverable judged on visual polish, motion quality, and how well it captures his personality. Generic or template-looking output is a failure. Keep working autonomously until every item in the Definition of Done is verified. Do not stop at a first draft.

## REFERENCE
Screenshot(s) of his Instagram profile are in /reference/. If you can view images, study them first. If you cannot, rely on the brand brief below, which was extracted from them.

## BRAND BRIEF (from his actual profile)
- Verified creator, ~1.9M followers, 1,277 posts. Bio: Reel creator, Tech Creator, Full Time YouTuber, TEDx Speaker, "Mail me for Paid Promotion".
- Signature look: curly hair + thick black-rim glasses. He also has a cartoon avatar of himself (peace sign). Use this silhouette as the logo mark.
- Content: close-up, high-energy, face-to-camera tech reviews and launch coverage. Bold text overlays on thumbnails. Devices featured: phones (vivo, Xiaomi, Huawei, Pixel, iPhone), tablets, watches, cars, gaming, collectibles.
- Event coverage: product launches (vivo launch event in China, Apple Event 2026), festival-sale picks (Amazon Great Indian Festival).
- Personality: expressive, funny, dramatic reactions, honest and relatable, warm with fans (meetups, hugs, fan art). Not corporate.
- Story highlights to mirror as UI: "vamos !!!", "AI Shazzam", "Fan Art", "Reels", "Phones", "Help !!!", "TikTok".
- Audiences: Indian Gen Z/millennial gadget buyers (fans) and brands seeking collaborations (secondary conversion goal).

## CONCEPT: "THE KEYNOTE, STARRING SHAZ"
The site is a product launch where the product is Shaz. Pinned, scroll-driven, cinematic sections like Apple product pages. The key twist: the page's accent color morphs to match the device in focus (gold for a vivo, orange for Xiaomi, deep blue for a Pixel, etc.) so the site feels alive and tied to his content.

## DESIGN SYSTEM
- Base: near-black (#09090B), off-white text, subtle grain and soft glows. Accent color is dynamic via a CSS variable updated per section.
- Typography: large, tight, confident display type (Inter Display / SF-style). One expressive font for short playful highlights that echo his thumbnail text overlays.
- Components: glass cards (backdrop blur, hairline borders), vertical 9:16 "reel" cards, circular story-highlight rings used as section navigation, magnetic buttons, custom cursor on desktop.
- Mobile-first. Most of his audience is on phones, so the mobile layout must be as polished as desktop.

## SECTIONS AND CHOREOGRAPHY
1. Preloader (under 2.5s, skippable): his glasses-and-curls silhouette draws itself, then a keynote-style "countdown" transitions to the hero.
2. Hero (pinned): massive headline in his voice, e.g. "Tech, but make it honest." (Propose 3 options, choose the strongest.) His photo/placeholder is revealed via a mask zoom on scroll. Floating device silhouettes with parallax. Animated follower counter (1.9M+).
3. Statement: scroll-scrubbed word-by-word reveal of his mission ("I test it so you don't regret it").
4. Story-highlight nav: row of circular rings (Phones, Reels, Fan Art, AI Shazzam, Help!!!) that scroll to or filter the content sections.
5. Content showcase: pinned horizontal scroll of 9:16 reel cards with 3D tilt on hover, bold overlay text, category chips (Phones, Laptops, Audio, Watches, Cars, Launch Events). Click opens a modal or links out to Instagram/YouTube.
6. Launch Events section: cinematic "Apple Event"-style pinned sequence about his on-location launch coverage (vivo China launch, Apple Event, etc.), with placeholder media.
7. Fan love: masonry wall of fan art and meetup moments (placeholders), with a playful hover.
8. Personality / "AI Shazzam" section: an interactive fun moment (e.g. a reaction-face switcher: shocked, impressed, disappointed, "vamos!") driven by scroll or click.
9. Brand collaborations: logo marquee + short case-study cards + metrics (use only verified numbers). Mark any logo not confirmed as a placeholder.
10. Work With Me: media-kit style services (reels, YouTube integrations, launch coverage), a polished enquiry form (name, brand, budget, message) with validation and success animation, plus a "Download media kit" button.
11. Footer: giant wordmark, Instagram + YouTube + TikTok links, email, a closing line with personality.

## MOTION
- Lenis smooth scroll + GSAP ScrollTrigger for pinned/scrubbed sequences; Framer Motion for micro-interactions.
- Vary the choreography per section. No repeated generic fade-ups.
- Animate transform/opacity only. Target 60fps on mid-range Android. Lazy-load heavy assets.
- Honor prefers-reduced-motion with static fallbacks.
- Optional wow moment: a lightweight Three.js/R3F rotating phone in the hero, only if performance stays good.

## STACK
Next.js (App Router) + TypeScript + Tailwind + GSAP + Lenis + Framer Motion. Vercel-ready. next/image and next/font. All copy, links, stats and media paths live in one file: /data/content.ts.

## CONTENT AND ASSET RULES
- Do not invent facts, partnerships, or numbers. Use only the brief above. Everything else is a clearly marked placeholder (TODO comment + listed in README).
- Do NOT scrape or hotlink his Instagram images, thumbnails, or brand logos. Use abstract device illustrations and neutral placeholders until real, permitted assets are supplied.
- No lorem ipsum visible anywhere.

## DEFINITION OF DONE (verify each, don't assume)
1. `npm run build` and `npm run lint` pass with zero errors.
2. Run the site and capture Playwright screenshots at 390px, 768px, 1440px. Review them, fix any layout, overflow, or overlap bugs.
3. Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 95+. Fix what falls short.
4. No console errors. Keyboard navigable with visible focus. WCAG AA contrast.
5. Title, meta, Open Graph/Twitter cards, favicon set.
6. README with setup, how to edit content.ts, deploy steps, and a full list of placeholders to replace.
7. Final self-review: critique against "would this look at home on an Apple launch page, and does it feel like Shaz?" Fix the 3 weakest things before finishing.

## PROCESS
First output a 10-line plan (concept, palette, fonts, hero choreography), then proceed without waiting for approval. Build section by section, checking each in the browser before moving on.

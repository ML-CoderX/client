# CallMeShazzam — The keynote, starring Shaz

A complete, responsive personal-brand concept for Shaz Mohamed. The design combines a near-black keynote stage with warm gold accents, original device illustrations, a curls-and-glasses avatar placeholder, and playful reaction moments.

## Run locally

Use Node.js 22.19 or newer (recommended: current Node 24 LTS) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The dependency lockfile is included. Fonts are bundled and self-hosted through `next/font/local`; builds do not depend on a Google Fonts request.

```sh
npm run lint
npm run build
npm start
```

The project uses Next.js App Router, TypeScript, Tailwind CSS 4, GSAP/ScrollTrigger, Lenis, and Framer Motion. Most art direction is in the global stylesheet so its responsive and motion rules can be reviewed together.

## Edit content

`data/content.ts` is the editorial source of truth for copy, navigation, social links, statistics, media references, reel concepts, service descriptions, form labels, metadata, and the downloadable kit text.

- Update `identity`, `hero`, and `statement` for the introduction.
- Edit `reels` and `showcase.categories` for the filterable gallery. `device` selects an original CSS illustration (`phone`, `audio`, `watch`, `laptop`, `car`, or `stage`).
- `launches.scenes` supplies the pinned two-scene sequence. On smaller screens the stage itself pins; reduced-motion mode shows both scenes in normal document flow.
- `community`, `personality`, and `collabs` control the supporting chapters.
- `links` holds Instagram, YouTube, TikTok, business email, and the media-kit route. Null TikTok/email values intentionally produce visible pending labels instead of invented destinations.
- `stats` records the rounded public Instagram count and the observation date. It is not a live feed. Reverify before publishing new claims.
- `media.portrait` and `media.logo` point to local original SVGs. Replace with approved local assets, update their alt text, and preserve image dimensions to avoid layout shifts.

Components live in `components/`. `useKeynoteMotion.ts` owns animation setup, breakpoint changes, teardown, and reduced-motion behavior. `Visuals.tsx` holds original vector/CSS artwork. `app/globals.css` holds the design system and responsive treatments.

## Interactions and accessibility

- Skippable SVG stroke drawing and countdown. The 0.93s sequence starts after hydration yields a frame; CSS also supplies a 2.05s exit fallback. Headline masks and the portrait reveal overlap the exit.
- GSAP/ScrollTrigger runs at every viewport size. Spacious desktops pin the hero and whole gallery/launch sections; phones, tablets and short windows pin the reel viewport and launch stage so content stays reachable.
- One Lenis instance is synced through its scroll event and the GSAP ticker. Filters rebuild only the rail. Touch remains native; wheel scrolling is smoothed. Scoped layout-effect contexts clean up on unmount, breakpoint changes, pause and preference changes. Below-fold choreography initializes near the viewport. On mobile the scroll engine loads on first interaction; CSS entrances, floating devices and the native RAF counter run immediately.
- The accent interpolates across reel colors. Spatial animation uses transform/opacity; SVG stroke drawing and the requested accent interpolation are deliberate exceptions.
- `prefers-reduced-motion` removes pinning, parallax, continuous floating, marquee travel, intro and cursor, while retaining short opacity transitions and gentle text reveals. The pause control stops ambient motion and restores normal document flow.
- Filters are real buttons with pressed states. The reel dialog traps focus, closes with Escape, and returns focus to its opener. Keyboard focus brings desktop reel cards into view.
- Visible focus rings, a skip link, labeled fields, validation messages, and an announced success panel support keyboard and assistive-technology use.
- The reaction lab changes an original illustration. It does not request camera access or send anything to an AI service.

## Enquiries and downloads

The form is deliberately in **preview mode** until a verified delivery destination is provided. It validates name, brand, email and message, then prepares a downloadable local text brief. It does not send an email, claim delivery, save personal data on the server, or put personal data in analytics/local storage.

`/media-kit` generates a downloadable, clearly marked **preview text kit** directly from `content.ts`. This is a working download, not an approved commercial PDF. Replace the route or `links.mediaKit` when the official kit is supplied.

Before public launch, wire enquiries to an approved server-side provider, add server-side validation and abuse protection, and change the preview/success wording to reflect the real delivery behavior. Keep credentials in server environment variables; never add them to `content.ts` or a `NEXT_PUBLIC_` variable.

## Full placeholder inventory

| Item | Current treatment | Required replacement |
| --- | --- | --- |
| Hero portrait | Original curls-and-glasses illustration, visibly labeled | Licensed, approved Shaz portrait |
| Logo | Original abstract silhouette, not a traced avatar | Approved brand mark if different |
| Reel covers and titles | Eight concept illustrations/titles, each labeled concept artwork | Approved thumbnails, accurate titles, direct post URLs |
| Reel links | Dialog links to the verified Instagram profile | Approved per-post destinations |
| Launch footage | Original abstract stage; visible media-pending label | Permitted vivo China and Apple event media; confirm exact events/dates |
| Fan art and meetup wall | Four labeled original illustration placeholders | Creator/fan permission, real art and meetup photographs, attribution |
| Reaction lab | Original illustrated expressions | Optional approved expressions/portraits |
| Collaboration marquee | Editorial collaboration-concept wordmarks; explicitly not a client list | Approved client logos and logo-use permission |
| Case studies | Three service concepts, not reported past campaigns | Approved campaign descriptions, deliverables and sourced results |
| Campaign metrics | No reach, engagement, conversion, or commercial claims | Verified campaign figures with sources |
| Public profile metrics | 1.9M+ followers and 1,277 posts from the reviewed profile, dated 14 Oct 2026 | Recheck before launch; no invented live updates |
| Business email | Null; displayed as to be confirmed | Verified business contact |
| TikTok URL | Null; displayed as to be confirmed | Verified destination |
| Enquiry delivery | Honest local draft/download flow | Approved production delivery provider and credentials |
| Budget options | Proposed intake ranges, not a published rate card | Owner-approved intake choices |
| Media kit | Clearly marked downloadable text preview | Approved commercial kit/PDF |
| Production origin | Localhost fallback | `NEXT_PUBLIC_SITE_URL` set to the actual deployed origin |
| Editorial voice | Proposed site copy, not attributed quotations | Owner's final copy approval |

No Instagram assets were scraped, downloaded, or hotlinked. The supplied screenshot is reference-only and is not served by the app. Brand/product mentions describe supplied or observed coverage topics; they do not assert sponsorship. No client partnerships, testimonials or performance figures have been invented.

## Deploy to Vercel

1. Push this directory to the intended Git repository, excluding `.next`, `node_modules`, local logs and private environment files.
2. Import the repository in Vercel and choose the Next.js preset. Set the root directory to this project.
3. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin. Rebuild after changing it so social-card URLs use that origin.
4. Use `npm run build`, the default Next.js output, and Node 24 (or a supported Node >=22.19).
5. Verify the homepage, social preview, `/icon.svg`, and `/media-kit` on the deployment. Replace the pending commercial/contact assets before representing the site as an official launch.

No deployment has been performed by this local build task.

## Verification

The production browser suite expects a server at port 3001:

```sh
npm run build
npm start -- --port 3001
npm run test:e2e
node verification/audit.mjs
```

Google Chrome must be installed for the included Playwright configuration and Lighthouse launcher. `TEST_BASE_URL` can override the test server. Lighthouse uses its default mobile simulation and throttling; run it without competing browser tests for representative measurements.

- `tests/site.spec.ts`: responsive layouts at 390, 768 and 1440px, console errors, WCAG AA automated audit, filters, modal keyboard handling, reaction states, form validation/download, no personal-data POST, mobile navigation, reduced motion, desktop pinning, metadata and assets.
- `verification/final-*.png`: production screenshots of the hero and each chapter at the required widths.
- `verification/lighthouse-mobile.html` and `.json`: actual mobile audit results.
- `verification/VERIFICATION.md`: final results and the three weaknesses addressed during self-review.

Automated scores do not replace testing with a screen reader or on physical Android hardware. This project uses small local illustrations, self-hosted fonts and reduced mobile animation work to control cost; physical-device frame rate is not claimed as measured.

## Reference and design decisions

See `reference/REFERENCE-NOTES.md` for the Instagram review and evidence/interpretation separation. The three hero options were “Tech, but make it honest.”, “Big tech. Bigger reactions.”, and “Your next upgrade. No regrets.” The first was selected for its clear viewer benefit and natural rhythm.

## Motion verification

`reports/motion-check/REPORT.md` contains the diagnosis, a 12-item evidence table, computed-style measurements, reduced-motion results and performance results. Reproduce with:

```sh
npx playwright install ffmpeg
node reports/motion-check/verify.cjs
node reports/motion-check/lifecycle.cjs
node reports/motion-check/record.cjs
node verification/audit.mjs
```

Run these sequentially, especially the 4× CPU and Lighthouse measurements. Playwright records desktop/mobile WebM files and saves raw transform/opacity values; screenshots alone are not treated as proof of motion.

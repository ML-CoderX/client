// All editorial copy, destinations, statistics and media references live here.
// TODO: Replace explicitly marked concept assets with licensed, approved material.
export const content = {
  meta: {
    title: "CallMeShazzam — Tech, but make it honest.",
    description: "Enter the world of Shaz Mohamed. Tech, big reactions, launch coverage and a community that keeps it real. Explore CallMeShazzam and start a collaboration.",
    // TODO: Set NEXT_PUBLIC_SITE_URL to the approved production domain.
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ogAlt: "CallMeShazzam. Tech, but make it honest. The keynote, starring Shaz.",
  },
  identity: { name: "Shaz Mohamed", handle: "callmeshazzam", wordmark: "callmeshazzam", role: "Tech creator. Full-time YouTuber. TEDx speaker.", initials: "SZ" },
  links: {
    instagram: "https://www.instagram.com/callmeshazzam/",
    youtube: "https://www.youtube.com/@callmeshazzamtech",
    // TODO: Supply a verified TikTok URL and business email. Never invent contact details.
    tiktok: null as string | null,
    email: null as string | null,
    mediaKit: "/media-kit",
  },
  media: { portrait: "/images/shaz-illustration.svg", portraitAlt: "Original concept illustration of a creator with curls and glasses; approved Shaz portrait to be supplied", logo: "/icon.svg", og: "/opengraph-image" },
  nav: [{ label: "The content", href: "#content" }, { label: "The human", href: "#community" }, { label: "Let’s talk", href: "#contact" }],
  ui: {
    navigation: "Main navigation", edition: "01 — 06", skip: "Skip to content", menu: "Toggle navigation", close: "Close", next: "Next", previous: "Previous",
    play: "Watch on Instagram", youtube: "Find me on YouTube", instagram: "Instagram", tiktok: "TikTok", email: "Email",
    pending: "Coming with the official launch", placeholder: "Concept artwork", arrow: "↗",
    load: "THE KEYNOTE, STARRING SHAZ", skipIntro: "Skip intro", countdown: ["03", "02", "01"],
    scroll: "SCROLL FOR THE GOOD STUFF", scrollHint: "Keep scrolling. It gets interesting.",
    all: "All", reelLabel: "Explore reel concept", filters: "Filter content by category", portraitLabel: "ILLUSTRATED PLACEHOLDER",
    pause: "Pause motion", resume: "Resume motion", modalNote: "Concept preview. Approved reel artwork and a direct post link will replace this illustration. Explore the real content on Instagram.",
  },
  hero: {
    eyebrow: "THE KEYNOTE, STARRING SHAZ",
    line1: "Tech, but", line2: "make it", punch: "honest.",
    alternatives: ["Tech, but make it honest.", "Big tech. Bigger reactions.", "Your next upgrade. No regrets."],
    description: "New gadgets. Big reactions. Zero boring bits. Welcome to my little corner of the internet.",
    primary: "Enter my world", secondary: "Work with me", sticker: "100% me.",
    caption: "CURLS. GLASSES. STRONG OPINIONS.", availability: "Good tech. Great conversations.",
  },
  stats: { followers: "1.9M+", followerValue: 1.9, label: "on Instagram", posts: "1,277", postsLabel: "posts & counting", source: "Instagram profile · observed 14 Oct 2026", note: "Rounded public follower count; not a live feed." },
  statement: { kicker: "A LITTLE LESS HYPE. A LOT MORE HUMAN.", words: "I test it so you don’t regret it.", text: "From the phone in your pocket to the next big thing. Let’s figure out what’s actually worth your attention.", scribble: "That’s the whole point." },
  stories: [
    { label: "Phones", icon: "phone", href: "#content", category: "Phones" },
    { label: "Reels", icon: "play", href: "#content", category: "All" },
    { label: "Fan Art", icon: "heart", href: "#community", category: null },
    { label: "AI Shazzam", icon: "spark", href: "#personality", category: null },
    { label: "Help !!!", icon: "help", href: "#contact", category: null },
    { label: "vamos !!!", icon: "bolt", href: "#launches", category: null },
  ],
  showcase: { kicker: "01 / THE CONTENT", title: "Small screens.", punch: "Big opinions.", description: "A little curiosity. A little chaos. A whole lot of tech.", hint: "PICK A WORLD. TAKE A LOOK.", count: "CURATED CONCEPTS", modalType: "FROM THE TECH UNIVERSE", categories: ["All", "Phones", "Laptops", "Audio", "Watches", "Cars", "Launch Events"] },
  // TODO: These are editorial concept titles, not claims about specific published reviews.
  reels: [
    { id: "gold", category: "Phones", title: "All that glitters.", subtitle: "Let’s talk about that camera.", tag: "CAMERA CHECK", color: "#d4b076", theme: "gold", device: "phone", label: "01", tilt: -13 },
    { id: "orange", category: "Phones", title: "Orange you curious?", subtitle: "Big color. Bigger questions.", tag: "FIRST IMPRESSIONS", color: "#f59250", theme: "orange", device: "phone", label: "02", tilt: 14 },
    { id: "blue", category: "Phones", title: "Smart. But how smart?", subtitle: "The AI conversation, minus the jargon.", tag: "AI, EXPLAINED", color: "#93b5ff", theme: "blue", device: "phone", label: "03", tilt: -9 },
    { id: "audio", category: "Audio", title: "Sounds like a plan.", subtitle: "Small buds. High expectations.", tag: "LISTEN UP", color: "#c4b4eb", theme: "violet", device: "audio", label: "04", tilt: 12 },
    { id: "laptop", category: "Laptops", title: "More than a spec sheet.", subtitle: "For work. For play. For real life.", tag: "DESK CHECK", color: "#b8c9cb", theme: "silver", device: "laptop", label: "05", tilt: -8 },
    { id: "watch", category: "Watches", title: "Time for a closer look.", subtitle: "A little wrist-side curiosity.", tag: "ON THE WRIST", color: "#bad496", theme: "green", device: "watch", label: "06", tilt: 14 },
    { id: "car", category: "Cars", title: "Tech takes the wheel.", subtitle: "The gadgets got a little bigger.", tag: "BEYOND THE PHONE", color: "#c8b9a8", theme: "sand", device: "car", label: "07", tilt: -5 },
    { id: "event", category: "Launch Events", title: "Had to be there.", subtitle: "Front-row curiosity, wherever it happens.", tag: "ON LOCATION", color: "#edbd73", theme: "gold", device: "stage", label: "08", tilt: 0 },
  ],
  launches: { kicker: "02 / OUT OF THE STUDIO", title: "New place.", punch: "Same curiosity.", text: "From a launch in China to the latest Apple conversation. Come for the tech. Stay for the reactions.", tag: "THE WORLD IS THE STUDIO", artwork: "CONCEPT STAGE / APPROVED EVENT MEDIA TO COME", scenes: [{ title: "China, let’s go.", label: "VIVO LAUNCH COVERAGE", detail: "A new device. A whole new perspective.", location: "CHINA", color: "#d4b076" }, { title: "One more reaction.", label: "APPLE EVENT COVERAGE", detail: "The announcements. The questions. The Shaz take.", location: "THE KEYNOTE", color: "#94afff" }], cta: "Catch the coverage" },
  community: { kicker: "03 / THE PEOPLE MAKE IT", title: "Internet people.", punch: "Real connection.", text: "The art, the meetups, the familiar faces. This little tech corner is a lot bigger because of you.", note: "Community wall · illustrated placeholders", items: [{ title: "Made with love.", type: "FAN ART", style: "art", caption: "YOUR ART GOES HERE" }, { title: "Screen to real life.", type: "MEETUP MOMENTS", style: "meet", caption: "GOOD PEOPLE. GOOD ENERGY." }, { title: "The curls are iconic.", type: "FAN ART", style: "sketch", caption: "A LITTLE CREATIVE CHAOS" }, { title: "vamos !!!", type: "THE COMMUNITY", style: "note", caption: "YOU MAKE THIS WHAT IT IS." }], cta: "Be part of the story" },
  personality: { kicker: "04 / AI SHAZZAM", title: "New tech just dropped.", punch: "Pick my reaction.", text: "Same glasses. Very different energy.", label: "THE REACTION LAB", note: "A playful illustrated concept — no AI generation or camera access.", reactions: [{ label: "Shocked", word: "WAIT. WHAT?!", color: "#a6baff", face: "shocked" }, { label: "Impressed", word: "Okay, I see you.", color: "#c7d798", face: "impressed" }, { label: "Disappointed", word: "But… why?", color: "#c5b4d9", face: "disappointed" }, { label: "vamos!", word: "VAMOS !!!", color: "#edbd73", face: "vamos" }] },
  collabs: { kicker: "05 / GOOD IDEAS, TOGETHER", title: "Your story.", punch: "The Shaz way.", text: "For brands with something worth talking about. Let’s make the tech feel human.", logoPlaceholder: "LOGO PLACEHOLDER", marquee: ["BRAND / 01", "brand two", "BRAND III", "Brand Four"], note: "Logo placeholders · collaboration concepts, not a client list", cases: [{ number: "01", title: "The first impression", service: "REELS", text: "A device, a hook, and a reaction that starts a conversation." }, { number: "02", title: "The deeper dive", service: "YOUTUBE INTEGRATIONS", text: "Give the details room to breathe. Make the useful stuff memorable." }, { number: "03", title: "The front-row take", service: "LAUNCH COVERAGE", text: "Bring the audience into the room, from the reveal to the first look." }], metricLabel: "A COMMUNITY, NOT JUST A NUMBER", metricsNote: "Public profile figures. Campaign results and approved case studies are pending." },
  contact: { kicker: "06 / LET’S MAKE SOMETHING", title: "Got a good idea?", punch: "I’m listening.", text: "Tell me what you’re building. Let’s give people something to talk about.", services: ["Reels", "YouTube integrations", "Launch coverage"], kit: "Download media kit", kitNote: "Preview kit · approved commercial details pending", name: "Your name", brand: "Brand / company", email: "Your email", budget: "Budget range", message: "What are you thinking?", namePlaceholder: "The human behind the idea", brandPlaceholder: "Who’s the idea for?", emailPlaceholder: "you@yourbrand.com", messagePlaceholder: "The product, the plan, the big idea…", budgets: ["Let’s discuss", "Under ₹50,000", "₹50,000–₹1,00,000", "₹1,00,000–₹3,00,000", "₹3,00,000+"], submit: "Prepare my enquiry", notice: "Preview mode: this form prepares a brief on your device. Nothing is sent or stored on a server.", successTitle: "Good idea. Great start.", successText: "Your enquiry is ready to download. It hasn’t been sent — the verified business contact will be added before launch.", download: "Download my enquiry", reset: "Start another enquiry", errors: { name: "Please add your name.", brand: "Please add a brand or company.", email: "Enter a valid email address.", message: "Tell us a little more (at least 20 characters)." }, briefFile: "shazzam-enquiry.txt", briefHeading: "CALLMESHAZZAM — ENQUIRY DRAFT (NOT SENT)" },
  footer: { line: "Stay curious. Stay a little dramatic.", closing: "Okay, one more reel?", credit: "An independent portfolio concept for Shaz Mohamed.", note: "Original illustrations. Real personality. Approved assets coming soon.", back: "Back to top", emailPending: "Business email · to be confirmed", tiktokPending: "TikTok · link to be confirmed", copyright: "© 2026 CallMeShazzam concept" },
  kit: { title: "CALLMESHAZZAM / MEDIA KIT PREVIEW", intro: "Independent portfolio concept. Not an approved commercial media kit.", source: "Profile reviewed 14 October 2026. Rounded follower figure, not a live count.", services: "SERVICES", pending: "TO BE CONFIRMED: business email, representation, rate card, audience demographics, campaign metrics, usage rights, approved clients and testimonials.", fileName: "CallMeShazzam-media-kit-preview.txt" },
};
export type Reel = (typeof content.reels)[number];

"use client";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { content } from "@/data/content";

/** One engine per mount. Filtering rebuilds only the rail, never Lenis or its ticker. */
export function useKeynoteMotion(scope: RefObject<HTMLDivElement | null>, category: string, paused: boolean) {
  const controls = useRef<{ filter: () => void; mode: () => void } | null>(null);
  const state = useRef({ category, paused });
  useLayoutEffect(() => { state.current.category = category; controls.current?.filter(); }, [category]);
  useLayoutEffect(() => { state.current.paused = paused; controls.current?.mode(); }, [paused]);
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    let disposed = false;
    let destroy: (() => void) | undefined;
    const init = async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      // Match the 60fps design budget instead of doing 144Hz work on fast monitors.
      gsap.ticker.fps(60);
      const select = gsap.utils.selector(root);
      const lenis = new Lenis({ duration: .9, anchors: true, smoothWheel: true, prevent: node => !!node.closest("dialog, [data-lenis-prevent]") });
      root.dataset.lenisInstance = String(performance.now());
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const desktop = matchMedia("(min-width: 1024px) and (min-height: 850px)");
      let context: gsap.Context | undefined;
      let railContext: gsap.Context | undefined;
      let observer: IntersectionObserver | undefined;
      let rebuildRail = () => {};
      let refreshTimer: ReturnType<typeof setTimeout>;
      const refresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => { if (!disposed) { lenis.resize(); ScrollTrigger.refresh(); } }, 90); };
      const listeners: (() => void)[] = [];
      // Form validation/success changes document height after initial pin measurements.
      // Observe only changing content, never pin spacers (which would refresh recursively).
      const contentResize = new ResizeObserver(refresh);
      select(".form-panel").forEach((el: HTMLElement) => contentResize.observe(el));
      const makeMode = () => {
        observer?.disconnect(); railContext?.revert(); context?.revert();
        listeners.splice(0).forEach(remove => remove());
        const gentle = reduced.matches, stopped = state.current.paused;
        root.dataset.motion = stopped ? "paused" : gentle ? "reduced" : "full";
        document.documentElement.classList.toggle("motion-static", gentle || stopped);
        // Native wheel/touch scrolling in the gentle and explicitly paused modes.
        lenis.options.smoothWheel = !gentle && !stopped;
        let primePins = () => {};
        context = gsap.context(() => {
          ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => gsap.set(select(".scroll-progress span"), { scaleX: self.progress }) });
          if (stopped) return;
          if (!gentle) gsap.timeline({ scrollTrigger: { id: "hero-scroll", trigger: select(".hero")[0], start: "top top", end: desktop.matches ? "+=400" : "bottom top", scrub: .6, pin: desktop.matches, anticipatePin: 1 } })
            .to(select(".hero-portrait"), { rotate: 0, scale: 1.04 }, 0).to(select(".float-gold"), { y: -65 }, 0).to(select(".float-blue"), { y: 55 }, 0).to(select(".hero-sticker"), { y: -20, rotate: 0 }, 0);
          gsap.fromTo(select(".statement h2 span"), { opacity: gentle ? .85 : .6, y: gentle ? 0 : 14 }, { opacity: 1, y: 0, stagger: .13, ease: "none", scrollTrigger: { trigger: select(".statement h2")[0], start: "top 88%", end: "bottom 45%", scrub: gentle ? true : .35 } });
          gsap.fromTo(select(".stories > a"), { opacity: gentle ? .85 : .65, scale: gentle ? 1 : .78, rotate: gentle ? 0 : -12, y: gentle ? 0 : 20 }, { opacity: 1, scale: 1, rotate: 0, y: 0, duration: gentle ? .18 : .7, stagger: gentle ? .025 : .075, ease: "back.out(1.8)", scrollTrigger: { trigger: select(".stories")[0], start: "top 92%" } });
          // Initialize below-fold choreography as its section approaches, preserving
          // content-visibility savings and avoiding initial layout of the entire page.
          const activate = (section: HTMLElement) => {
            section.style.contentVisibility = "visible";
            context?.add(() => {
              if (section.matches(".showcase")) {
                rebuildRail = () => {
                  railContext?.revert();
                  railContext = gsap.context(() => {
                    if (gentle || state.current.paused) return;
                    const track = select(".reel-track")[0] as HTMLElement, view = select(".reel-window")[0] as HTMLElement;
                    const progressBar = select(".scroll-progress")[0] as HTMLElement;
                    const reelProgress = select(".reel-progress")[0] as HTMLElement;
                    let activeColor = "";
                    view.scrollLeft = 0;
                    const travel = () => { const css = getComputedStyle(view); return Math.max(0, track.scrollWidth - view.clientWidth + parseFloat(css.paddingLeft) + parseFloat(css.paddingRight)); };
                    if (travel() <= 0) return;
                    gsap.to(track, { x: () => -travel(), ease: "none", scrollTrigger: { id: "reel-scroll", trigger: desktop.matches ? section : view, start: desktop.matches ? "top top" : "top 12%", end: () => `+=${travel()}`, pin: true, scrub: .45, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: self => {
                      gsap.set(select(".reel-progress span"), { scaleX: self.progress });
                      const reels = content.reels.filter(r => state.current.category === "All" || r.category === state.current.category);
                      const index = self.progress * Math.max(0, reels.length - 1), i = Math.floor(index);
                      // Inheriting a new root variable every frame restyles the entire
                      // document. Change the global palette at card boundaries, and
                      // interpolate only the two visible progress accents locally.
                      const color = gsap.utils.interpolate(reels[i]?.color || "#d4b076", reels[Math.min(i+1,reels.length-1)]?.color || "#d4b076", index-i);
                      const focusedColor = reels[Math.round(index)]?.color || "#d4b076";
                      if (focusedColor !== activeColor) { activeColor = focusedColor; document.documentElement.style.setProperty("--accent", focusedColor); }
                      progressBar.style.setProperty("--accent", color);
                      reelProgress.style.setProperty("--accent", color);
                    } } });
                  }, root);
                  refresh();
                };
                rebuildRail();
              } else if (section.matches(".launches") && !gentle) {
                gsap.timeline({ scrollTrigger: { id: "launch-scroll", trigger: desktop.matches ? section : select(".launch-stage")[0], start: desktop.matches ? "top top" : "top 10%", end: "+=850", pin: true, scrub: .6, anticipatePin: 1 } })
                  .to(select(".launch-orb"), { scale: 1.2, rotate: 50, xPercent: 18, y: -20, ease: "none" }, 0)
                  .to(select(".scene-0 .launch-location"), { xPercent: -12, opacity: .2 }, 0)
                  .to(select(".scene-0"), { opacity: 0, y: -35, duration: .35 }, .2)
                  .fromTo(select(".scene-1"), { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: .4 }, .55)
                  .to(select(".scene-dots span:first-child"), { opacity: .3, duration: .4 }, .55)
                  .to(select(".scene-dots span:last-child"), { opacity: 1, duration: .4 }, .55);
              } else if (section.matches(".community")) {
                const grid = section.querySelector(".fan-grid");
                gsap.fromTo(select(".fan-card"), { opacity: gentle ? .8 : .15, rotate: (i: number) => gentle ? 0 : (i%2 ? 6 : -6), y: (i: number) => gentle ? 0 : 38+i*8 }, { opacity: 1, rotate: 0, y: 0, stagger: gentle ? .02 : .1, ease: "power2.out", scrollTrigger: { trigger: grid, start: "top 96%", end: "top 45%", scrub: gentle ? true : .45 } });
                if (!gentle) gsap.to(select(".fan-artwork"), { y: (i: number) => -(i+1)*7, ease: "none", scrollTrigger: { trigger: grid, start: "top 64%", end: "bottom top", scrub: .6 } });
              } else if (section.matches(".footer")) {
                gsap.fromTo(select(".footer-wordmark"), { opacity: gentle ? .8 : .12, yPercent: gentle ? 0 : 75, rotate: gentle ? 0 : 2 }, { opacity: 1, yPercent: 0, rotate: 0, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 95%", end: "bottom bottom", scrub: gentle ? true : .5 } });
              } else gsap.fromTo(section.querySelectorAll(".section-heading, .reaction-panel, .contact-copy, .form-panel"), { opacity: gentle ? .8 : .5, x: gentle ? 0 : -18 }, { opacity: 1, x: 0, duration: gentle ? .18 : .7, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 92%" } });
              if (section.dataset.accent) {
                const palette = () => { document.documentElement.style.setProperty("--accent", section.dataset.accent!); (select(".scroll-progress")[0] as HTMLElement).style.removeProperty("--accent"); };
                ScrollTrigger.create({ trigger: section, start: "top 60%", onEnter: palette, onEnterBack: palette });
              }
            });
            refresh();
          };
          observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { observer?.unobserve(entry.target); activate(entry.target as HTMLElement); } }), { rootMargin: "100% 0px" });
          // Prepare both pins in the same layout pass, before scrolling reaches
          // them. Lazy creation mid-gesture otherwise causes a long reflow.
          primePins = () => select(".showcase,.launches").forEach((el: HTMLElement) => activate(el));
          select(".community,.personality,.collaborations,.contact,.footer").forEach((el: HTMLElement) => observer!.observe(el));
          if (!gentle && matchMedia("(pointer:fine)").matches) {
            const cursor = select(".cursor-orbit")[0];
            const x = gsap.quickTo(cursor, "x", { duration: .2 }), y = gsap.quickTo(cursor, "y", { duration: .2 });
            const goldX = gsap.quickTo(select(".float-gold")[0], "x", { duration: .8, ease: "power3.out" });
            const blueX = gsap.quickTo(select(".float-blue")[0], "x", { duration: 1, ease: "power3.out" });
            const move = (event: PointerEvent) => { x(event.clientX); y(event.clientY); cursor.style.opacity = "1"; if (scrollY < innerHeight) { const ratio = event.clientX / innerWidth - .5; goldX(ratio * 42); blueX(ratio * -30); } };
            const leave = () => { cursor.style.opacity = "0"; goldX(0); blueX(0); };
            window.addEventListener("pointermove", move); document.addEventListener("mouseleave", leave);
            listeners.push(() => { window.removeEventListener("pointermove", move); document.removeEventListener("mouseleave", leave); });
            const magnet = (event: PointerEvent) => { const el = (event.target as HTMLElement).closest<HTMLElement>(".magnetic"); if (!el) return; const b = el.getBoundingClientRect(); gsap.to(el, { x: (event.clientX-b.left-b.width/2)*.12, y: (event.clientY-b.top-b.height/2)*.18, duration: .25, overwrite: "auto" }); };
            const reset = (event: PointerEvent) => { const el = (event.target as HTMLElement).closest<HTMLElement>(".magnetic"); if (el && !el.contains(event.relatedTarget as Node)) gsap.to(el, { x: 0, y: 0, duration: .4, ease: "back.out(1.6)", overwrite: "auto" }); };
            root.addEventListener("pointermove", magnet); root.addEventListener("pointerout", reset);
            listeners.push(() => { root.removeEventListener("pointermove", magnet); root.removeEventListener("pointerout", reset); gsap.set(select(".magnetic"), { clearProps: "transform" }); });
          }
        }, root);
        primePins();
        refresh();
      };
      makeMode(); controls.current = { filter: () => rebuildRail(), mode: makeMode };
      reduced.addEventListener("change", makeMode); desktop.addEventListener("change", makeMode);
      document.fonts.ready.then(() => { if (!disposed) refresh(); });
      destroy = () => {
        controls.current = null; observer?.disconnect(); contentResize.disconnect(); clearTimeout(refreshTimer);
        reduced.removeEventListener("change", makeMode); desktop.removeEventListener("change", makeMode);
        listeners.forEach(remove => remove()); railContext?.revert(); context?.revert();
        lenis.off("scroll", ScrollTrigger.update); gsap.ticker.remove(tick); lenis.destroy();
        document.documentElement.classList.remove("motion-static"); document.documentElement.style.removeProperty("--accent");
        root.querySelectorAll<HTMLElement>("[style]").forEach(el => el.style.removeProperty("content-visibility"));
        select(".scroll-progress,.reel-progress").forEach((el: HTMLElement) => el.style.removeProperty("--accent"));
        delete root.dataset.motion; delete root.dataset.lenisInstance;
      };
    };
    // CSS entrances/ambient float and the lightweight counter run immediately.
    // On phones, load the scroll engine on first interaction so parsing/layout
    // cannot interrupt the intro. Every scroll sequence still runs on mobile.
    const events = ["wheel", "touchstart", "pointermove", "keydown", "scroll"] as const;
    let started = false;
    const removeIntent = () => events.forEach(event => window.removeEventListener(event, start));
    const start = () => { if (started) return; started = true; removeIntent(); void init(); };
    const timer = matchMedia("(min-width:1024px)").matches ? setTimeout(start, 1200) : undefined;
    if (!timer) events.forEach(event => window.addEventListener(event, start, { passive: true }));
    return () => { disposed = true; clearTimeout(timer); removeIntent(); destroy?.(); };
  }, [scope]);
}

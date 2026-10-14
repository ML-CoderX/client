"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { content as c } from "@/data/content";
import { Device, Icon, IntroMark } from "./Visuals";
import { Showcase, Launches, Community, Personality, Collaborations, Contact, Footer } from "./Sections";
import { useKeynoteMotion } from "./useKeynoteMotion";

export function Keynote() {
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(true);
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState("All");
  const [paused, setPaused] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  useKeynoteMotion(scope, category, paused);
  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".follower-count");
    if (!el) return;
    const gentle = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    el.textContent = "0.0M+";
    const timer = setTimeout(() => {
      const start = performance.now(), duration = gentle ? 180 : 1200;
      const count = (now: number) => {
        const progress = Math.min(1, (now-start)/duration);
        el.textContent = `${(c.stats.followerValue*(1-Math.pow(1-progress,3))).toFixed(1)}M+`;
        if (progress < 1) frame = requestAnimationFrame(count);
        else el.textContent = c.stats.followers;
      };
      frame = requestAnimationFrame(count);
    }, gentle ? 0 : 650);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); el.textContent = c.stats.followers; };
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setIntro(false), 0); return () => clearTimeout(id);
    }
    // Start the stroke clock after hydration has yielded a frame; otherwise a
    // busy first paint can consume the entire SVG animation before it is seen.
    const ready = requestAnimationFrame(() => scope.current?.setAttribute("data-intro-ready", "true"));
    const counter = setInterval(() => setCount(n => Math.min(n + 1, 2)), 260);
    const end = setTimeout(() => { setIntro(false); }, 950);
    return () => { cancelAnimationFrame(ready); clearInterval(counter); clearTimeout(end); };
  }, []);
  return <div ref={scope} className="keynote-root" data-intro={intro} data-paused={paused}>
    <a href="#main" className="skip-link">{c.ui.skip}</a>
    {intro && <div className="intro" aria-label={c.ui.load}><div className="intro-lockup"><IntroMark/><span>{c.ui.load}</span><b>{c.ui.countdown[count]}</b></div><button className="intro-skip" onClick={() => setIntro(false)}>{c.ui.skipIntro} <Icon name="arrow" size={16}/></button></div>}
    <header className="header"><a href="#" className="brand" aria-label={c.identity.wordmark}><Image src={c.media.logo} alt="" width={33} height={33}/><span>{c.identity.wordmark}<span className="brand-dot">.</span></span></a><nav aria-label={c.ui.navigation} className={menu ? "nav is-open" : "nav"}>{c.nav.map((item,i) => <a className={i === 2 ? "nav-cta" : ""} key={item.href} href={item.href} onClick={() => setMenu(false)}>{item.label}{i === 2 && <Icon name="arrow" size={14}/>}</a>)}</nav><button className="menu-toggle" aria-label={c.ui.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"}/></button></header>
    <main id="main">
      <section className="hero wrap" id="top" data-accent="#d4b076">
        <div className="hero-copy"><div className="eyebrow"><span className="status-dot"/>{c.hero.eyebrow}</div><h1 aria-label={`${c.hero.line1} ${c.hero.line2} ${c.hero.punch}`}><span className="headline-mask"><span>{c.hero.line1}</span></span><span className="headline-mask"><span>{c.hero.line2}</span></span><span className="headline-mask"><em>{c.hero.punch}</em></span></h1><p>{c.hero.description}</p><div className="hero-actions"><a className="button primary magnetic" href="#content">{c.hero.primary}<Icon name="arrow" size={18}/></a><a className="text-link" href="#contact">{c.hero.secondary}<Icon name="arrow" size={16}/></a></div><div className="hero-social"><div className="tiny-avatar"><Image src={c.media.portrait} width={42} height={42} alt=""/></div><div><strong className="follower-count">{c.stats.followers}</strong><span>{c.stats.label}</span></div><span className="social-divider"/><div className="social-copy">{c.identity.role}</div></div></div>
        <div className="hero-art"><div className="art-orbit"/><div className="hero-portrait"><Image src={c.media.portrait} alt={c.media.portraitAlt} width={600} height={680} priority fetchPriority="high" sizes="(max-width: 767px) 85vw, 44vw"/><div className="portrait-label"><span className="status-dot"/>{c.ui.portraitLabel}</div></div><div className="floating-device float-gold"><Device color="#d4b076"/></div><div className="floating-device float-blue"><Device color="#a5b4cf"/></div><div className="hero-sticker">{c.hero.sticker}<svg viewBox="0 0 120 25" aria-hidden="true"><path d="M3 15Q66 1 114 10M16 23 104 16" stroke="currentColor" fill="none" strokeWidth="3"/></svg></div><div className="portrait-caption"><span>✳</span>{c.hero.caption}<span>✳</span></div></div>
        <div className="hero-bottom"><span>{c.hero.availability}</span><a href="#statement">{c.ui.scroll}<Icon name="down" size={16}/></a><span className="edition">{c.ui.edition}</span></div>
      </section>
      <section id="statement" className="statement wrap"><div className="eyebrow">{c.statement.kicker}</div><h2>{c.statement.words.split(" ").map((w,i) => <span key={i}>{w} </span>)}</h2><div className="statement-foot"><span className="scribble">{c.statement.scribble}</span><p>{c.statement.text}</p></div></section>
      <div className="stories wrap">{c.stories.map(story => <a href={story.href} key={story.label} onClick={() => {if(story.category) setCategory(story.category);}}><span className="story-ring"><Icon name={story.icon} size={29}/></span><span>{story.label}</span></a>)}</div>
      <Showcase category={category} setCategory={setCategory}/>
      <Launches/>
      <Community/>
      <Personality/>
      <Collaborations/>
      <Contact/>
    </main>
    <Footer/>
    <button className="motion-toggle" aria-label={paused ? c.ui.resume : c.ui.pause} aria-pressed={paused} onClick={() => setPaused(!paused)}><Icon name={paused ? "play" : "pause"} size={13}/></button>
    <div className="scroll-progress" aria-hidden="true"><span/></div>
    <div className={paused ? "cursor-orbit hidden" : "cursor-orbit"} aria-hidden="true"/>
  </div>;
}

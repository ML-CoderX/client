"use client";
import Image from "next/image";
import { LazyMotion, domAnimation, m, AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import { content as c, type Reel } from "@/data/content";
import { Device, Face, Icon } from "./Visuals";

const style = (color: string) => ({ "--card-accent": color } as CSSProperties);

export function Showcase({ category, setCategory }: { category: string; setCategory: (value: string) => void }) {
  const [selected, setSelected] = useState<Reel | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const reels = c.reels.filter(reel => category === "All" || reel.category === category);
  useEffect(() => {
    if (selected) { modal.current?.showModal(); document.documentElement.classList.add("modal-open"); }
    return () => document.documentElement.classList.remove("modal-open");
  }, [selected]);
  const close = () => { modal.current?.close(); setSelected(null); trigger.current?.focus({ preventScroll: true }); };
  const tilt = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `perspective(900px) rotateX(${(0.5-(event.clientY-bounds.top)/bounds.height)*7}deg) rotateY(${((event.clientX-bounds.left)/bounds.width-0.5)*9}deg)`;
  };
  return <section className="showcase" id="content" data-accent="#d4b076">
    <div className="wrap"><div className="section-heading"><div><div className="eyebrow">{c.showcase.kicker}</div><h2>{c.showcase.title}<br/><span>{c.showcase.punch}</span></h2></div><p>{c.showcase.description}</p></div><div className="filter-row" role="group" aria-label={c.ui.filters}>{c.showcase.categories.map(cat => <button key={cat} className={category === cat ? "chip active" : "chip"} aria-pressed={category === cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div></div>
    <div className="reel-window"><div className="reel-track">{reels.map(reel => <button key={reel.id} className={`reel-card theme-${reel.theme}`} style={style(reel.color)} onMouseMove={tilt} onMouseLeave={e => {e.currentTarget.style.transform = "";}} onFocus={async e => {
      const card = e.currentTarget; if (!card.matches(":focus-visible") || document.documentElement.classList.contains("motion-static")) return;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger"); const st = ScrollTrigger.getById("reel-scroll");
      if (st && st.end > st.start) { const track = card.parentElement!; const view=track.parentElement!; const css=getComputedStyle(view); const travel = track.scrollWidth - view.clientWidth + parseFloat(css.paddingLeft) + parseFloat(css.paddingRight); if(travel > 0) window.scrollTo({ top: st.start + (st.end-st.start) * Math.min(1,card.offsetLeft/travel), behavior: "instant" }); }
    }} onClick={e => { trigger.current = e.currentTarget; setSelected(reel); }}>
      <div className="reel-top"><span>{reel.tag}</span><Icon name="play" size={19}/></div><div className="reel-art" style={{ "--tilt": `${reel.tilt}deg` } as CSSProperties}><div className="reel-halo"/><Device type={reel.device} color={reel.color}/><span className="reel-art-number" aria-hidden="true">{reel.label}</span></div><div className="reel-copy"><span className="reel-category">{reel.category}</span><h3>{reel.title}</h3><p>{reel.subtitle}</p></div><div className="reel-bottom"><span>{c.ui.placeholder}</span><span className="round-arrow"><Icon name="arrow" size={16}/></span></div>
    </button>)}</div></div>
    <div className="reel-foot wrap"><span>{c.showcase.hint}</span><div className="reel-progress"><span/></div><span>{String(reels.length).padStart(2,"0")} / {c.showcase.count}</span></div>
    <dialog ref={modal} className="reel-modal" onCancel={e => {e.preventDefault();close();}} onKeyDown={e => {if(e.key!=="Tab")return;const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'));const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}} onClick={e => { if(e.target === e.currentTarget) close(); }} aria-labelledby="reel-dialog-title" data-lenis-prevent>{selected && <div className="modal-inner" style={style(selected.color)}><button className="modal-close" onClick={close} aria-label={c.ui.close} autoFocus><Icon name="close"/></button><div className="modal-art"><Device type={selected.device} color={selected.color}/></div><div className="modal-copy"><div className="eyebrow">{c.showcase.modalType}</div><h2 id="reel-dialog-title">{selected.title}</h2><p>{c.ui.modalNote}</p><a href={c.links.instagram} target="_blank" rel="noreferrer" className="button primary">{c.ui.play}<Icon name="arrow" size={17}/></a></div></div>}</dialog>
  </section>;
}

export function Launches() {
  return <section className="launches" id="launches" data-accent="#d4b076"><div className="launch-inner wrap"><div className="section-heading"><div><div className="eyebrow">{c.launches.kicker}</div><h2>{c.launches.title}<br/><span>{c.launches.punch}</span></h2></div><p>{c.launches.text}</p></div><div className="launch-stage"><div className="launch-lines"/><div className="launch-orb"/><div className="launch-platform"/><div className="stage-top"><span><i className="status-dot"/>{c.launches.tag}</span><Icon name="spark" size={20}/></div>{c.launches.scenes.map((scene,i) => <div key={scene.title} className={`launch-scene scene-${i}`}><span className="launch-location" aria-hidden="true">{scene.location}</span><div className="scene-copy"><div className="eyebrow">{scene.label}</div><h3>{scene.title}</h3><p>{scene.detail}</p></div></div>)}<a className="stage-cta" href={c.links.youtube} target="_blank" rel="noreferrer">{c.launches.cta}<Icon name="arrow" size={17}/></a><span className="stage-placeholder">{c.launches.artwork}</span><div className="scene-dots" aria-hidden="true"><span/><span/></div></div></div></section>;
}

export function Community() {
  return <section className="community wrap" id="community" data-accent="#c1cb9d"><div className="section-heading"><div><div className="eyebrow">{c.community.kicker}</div><h2>{c.community.title}<br/><span>{c.community.punch}</span></h2></div><p>{c.community.text}</p></div><div className="fan-grid">{c.community.items.map((item,i) => <div key={item.title} className={`fan-card fan-${item.style}`}><div className="fan-artwork">{i === 0 ? <><span className="paper-tape"/><Face/><span className="fan-handwritten">{item.title}</span></> : i === 1 ? <><div className="meet-faces"><Face expression="impressed"/><Face expression="vamos"/></div><span className="meet-heart">♡</span></> : i === 2 ? <><Face expression="shocked"/><span className="doodle-star">✳</span></> : <><span className="note-star">✳</span><strong>{item.title}</strong><span className="note-line"/></>}</div><div className="fan-caption"><span>{item.type}</span><h3>{i === 3 ? item.caption : item.title}</h3><span className="fan-placeholder">{c.ui.placeholder}</span></div></div>)}</div><div className="community-foot"><p>{c.community.note}</p><a href={c.links.instagram} className="text-link" target="_blank" rel="noreferrer">{c.community.cta}<Icon name="arrow" size={16}/></a></div></section>;
}

export function Personality() {
  const [reaction, setReaction] = useState(3);
  const active = c.personality.reactions[reaction];
  return <MotionConfig reducedMotion="user"><LazyMotion features={domAnimation}><section className="personality wrap" id="personality" data-accent="#edbd73"><div className="reaction-panel" style={style(active.color)}><div className="reaction-copy"><div className="eyebrow">{c.personality.kicker}</div><h2>{c.personality.title}<br/><span>{c.personality.punch}</span></h2><p>{c.personality.text}</p><div className="reaction-controls" role="group" aria-label={c.personality.punch}>{c.personality.reactions.map((item,i) => <button key={item.label} aria-pressed={i === reaction} className={i === reaction ? "reaction-button active" : "reaction-button"} onClick={() => setReaction(i)}><span aria-hidden="true">{["!","✧","…","↗"][i]}</span>{item.label}</button>)}</div><span className="reaction-note">{c.personality.note}</span></div><div className="reaction-display"><span className="lab-label">{c.personality.label}<i/></span><div className="face-ring"/><AnimatePresence mode="wait" initial={false}><m.div key={reaction} className="face-wrap" initial={{ opacity: 0, rotate: -8, scale: .9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 8, scale: .9 }} transition={{ type: "spring", stiffness: 320, damping: 18, mass: .7, opacity: { duration: .16 } }}><Face expression={active.face}/></m.div></AnimatePresence><div className="reaction-word" aria-live="polite">{active.word}</div></div></div></section></LazyMotion></MotionConfig>;
}

export function Collaborations() {
  return <section className="collaborations" id="collaborations" data-accent="#d4b076"><div className="wrap"><div className="section-heading"><div><div className="eyebrow">{c.collabs.kicker}</div><h2>{c.collabs.title}<br/><span>{c.collabs.punch}</span></h2></div><p>{c.collabs.text}</p></div><div className="collab-note">{c.collabs.note}</div></div><div className="marquee" aria-hidden="true"><div className="marquee-track">{[...c.collabs.marquee,...c.collabs.marquee].map((text,i) => <span key={i} className={`logo-style-${i%4}`}><span className="placeholder-wordmark">{text}<small>{c.collabs.logoPlaceholder}</small></span><b>✳</b></span>)}</div></div><div className="wrap"><div className="case-grid">{c.collabs.cases.map(item => <article className="case-card" key={item.number}><div className="case-top"><span>{item.number}</span><Icon name="arrow" size={20}/></div><span className="eyebrow">{item.service}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><div className="metrics"><div><span className="eyebrow">{c.collabs.metricLabel}</span><p>{c.collabs.metricsNote}</p></div><div><strong>{c.stats.followers}</strong><span>{c.stats.label}</span></div><div><strong>{c.stats.posts}</strong><span>{c.stats.postsLabel}</span></div></div><p className="metric-source">{c.stats.source} · {c.stats.note}</p></div></section>;
}

type Fields = "name" | "brand" | "email" | "message";
export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<Fields,string>>>({});
  const [brief, setBrief] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const success = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(!brief) return; const url = URL.createObjectURL(new Blob([brief], {type:"text/plain;charset=utf-8"}));
    const timer = setTimeout(() => {setDownloadUrl(url); success.current?.focus();},0);
    return () => {clearTimeout(timer); URL.revokeObjectURL(url);};
  }, [brief]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const value = (key:string) => String(data.get(key) || "").trim();
    const next: Partial<Record<Fields,string>> = {};
    if(value("name").length<2) next.name=c.contact.errors.name;
    if(value("brand").length<2) next.brand=c.contact.errors.brand;
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) next.email=c.contact.errors.email;
    if(value("message").length<20) next.message=c.contact.errors.message;
    setErrors(next);
    if(Object.keys(next).length) { event.currentTarget.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    setBrief([c.contact.briefHeading,"",`${c.contact.name}: ${value("name")}`,`${c.contact.brand}: ${value("brand")}`,`${c.contact.email}: ${value("email")}`,`${c.contact.budget}: ${value("budget")}`,"",value("message")].join("\n"));
  };
  return <section className="contact wrap" id="contact" data-accent="#d4b076"><div className="contact-copy"><div className="eyebrow">{c.contact.kicker}</div><h2>{c.contact.title}<br/><span>{c.contact.punch}</span></h2><p>{c.contact.text}</p><div className="service-list">{c.contact.services.map((service,i) => <span key={service}><b>{String(i+1).padStart(2,"0")}</b>{service}<Icon name="check" size={17}/></span>)}</div><a className="button kit-button magnetic" href={c.links.mediaKit} download>{c.contact.kit}<Icon name="down" size={17}/></a><span className="kit-note">{c.contact.kitNote}</span></div><div className="form-panel">{brief ? <div className="form-success" ref={success} tabIndex={-1}><span className="success-mark"><Icon name="check" size={38}/></span><h3>{c.contact.successTitle}</h3><p>{c.contact.successText}</p><a className="button primary" href={downloadUrl || undefined} download={c.contact.briefFile}>{c.contact.download}<Icon name="down" size={17}/></a><button className="text-link" onClick={() => {setBrief("");setErrors({});}}>{c.contact.reset}</button></div> : <form onSubmit={submit} noValidate><div className="form-row">{(["name","brand"] as const).map(field => <div className="field" key={field}><label htmlFor={field}>{c.contact[field]}<span aria-hidden="true"> *</span></label><input id={field} name={field} required maxLength={120} autoComplete={field === "name" ? "name" : "organization"} placeholder={c.contact[`${field}Placeholder`]} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined}/>{errors[field] && <span className="field-error" id={`${field}-error`}>{errors[field]}</span>}</div>)}</div><div className="form-row"><div className="field"><label htmlFor="email">{c.contact.email}<span aria-hidden="true"> *</span></label><input id="email" name="email" type="email" required autoComplete="email" maxLength={254} placeholder={c.contact.emailPlaceholder} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}/>{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div><div className="field"><label htmlFor="budget">{c.contact.budget}</label><select id="budget" name="budget">{c.contact.budgets.map(budget => <option key={budget}>{budget}</option>)}</select></div></div><div className="field"><label htmlFor="message">{c.contact.message}<span aria-hidden="true"> *</span></label><textarea id="message" name="message" rows={4} required minLength={20} maxLength={5000} placeholder={c.contact.messagePlaceholder} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}/>{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div><button type="submit" className="button primary submit-button magnetic">{c.contact.submit}<Icon name="arrow" size={18}/></button><p className="form-notice">{c.contact.notice}</p></form>}</div></section>;
}

export function Footer() {
  return <footer className="footer wrap"><div className="footer-top"><div><p className="scribble">{c.footer.line}</p><span>{c.footer.closing}</span></div><a className="back-top" href="#top" aria-label={c.footer.back}><Icon name="down" size={20}/></a></div><div className="footer-wordmark" aria-hidden="true">{c.identity.wordmark}<span>.</span></div><div className="footer-links"><a href={c.links.instagram} target="_blank" rel="noreferrer">{c.ui.instagram}<Icon name="arrow" size={14}/></a><a href={c.links.youtube} target="_blank" rel="noreferrer">{c.ui.youtube}<Icon name="arrow" size={14}/></a>{c.links.tiktok ? <a href={c.links.tiktok}>{c.ui.tiktok}</a> : <span>{c.footer.tiktokPending}</span>}{c.links.email ? <a href={`mailto:${c.links.email}`}>{c.links.email}</a> : <span>{c.footer.emailPending}</span>}</div><div className="footer-bottom"><span>{c.footer.copyright}</span><p>{c.footer.credit}<br/>{c.footer.note}</p><Image src={c.media.logo} alt="" width={29} height={29}/></div></footer>;
}

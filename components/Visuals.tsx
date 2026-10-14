import type { CSSProperties } from "react";

export function IntroMark() {
  return <svg width="92" height="92" viewBox="0 0 64 64" aria-hidden="true"><g className="intro-strokes" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path pathLength="1" d="M12 29C5 21 13 15 19 17C17 6 29 7 32 13C38 4 48 12 46 17C57 14 61 26 52 31"/><rect pathLength="1" x="12" y="29" width="17" height="15" rx="5"/><rect pathLength="1" x="35" y="29" width="17" height="15" rx="5"/><path pathLength="1" d="M29 34H35M26 51Q33 58 42 49"/></g></svg>;
}

export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    phone: <><rect x="7" y="2" width="10" height="20" rx="3"/><path d="M10 5h4M11 19h2"/></>,
    play: <><rect x="3" y="3" width="18" height="18" rx="5"/><path d="m10 8 6 4-6 4zM4 7h16"/></>,
    heart: <path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 3 11 8 15 5-4 13-10 8-15Z"/>,
    spark: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/><path d="m20 2 1 2 2 1"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 6M12 17h.01"/></>,
    bolt: <path d="m14 2-9 12h6l-1 8 9-12h-6z"/>,
    arrow: <path d="M5 19 19 5M5 5h14v14"/>,
    down: <path d="M12 3v18m-6-6 6 6 6-6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    menu: <path d="M4 8h16M4 16h16"/>,
    pause: <path d="M8 5v14M16 5v14"/>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.spark}</svg>;
}

export function Device({ type = "phone", color = "#d4b076", className = "" }: { type?: string; color?: string; className?: string }) {
  return <div aria-hidden="true" className={`device device-${type} ${className}`} style={{ "--device": color } as CSSProperties}>
    {type === "phone" ? <><div className="camera-block"><i/><i/><i/><b/></div><div className="device-shine"/><span className="device-glyph">✳</span></> :
      type === "audio" ? <><i className="bud bud-left"/><i className="bud bud-right"/><div className="audio-case"><span/></div></> :
      type === "watch" ? <><div className="watch-strap"/><div className="watch-face"><i/><b/></div></> :
      type === "laptop" ? <><div className="laptop-screen"><div/></div><div className="laptop-base"/></> :
      type === "car" ? <><div className="car-roof"/><div className="car-body"><i/><i/></div><b className="wheel left"/><b className="wheel right"/></> : <><div className="stage-orb"/><div className="stage-floor"/></>}
  </div>;
}

export function Face({ expression = "vamos" }: { expression?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 260 260" className={`reaction-face face-${expression}`}><path d="M49 252q5-65 81-67 78 0 86 67" fill="#343d34"/><path d="M71 102q-9 83 58 103 73-9 62-106" fill="#d5ad82"/><path d="M63 130Q27 106 49 77 34 46 70 38 74 11 109 28 135 0 159 24 197 9 203 42 235 48 212 82 228 114 194 132l-6-46q-28 15-44-4-25 23-44-1-13 19-29 11Z" fill="#252723"/><g fill="none" stroke="#141818" strokeWidth="9"><rect x="67" y="103" width="53" height="43" rx="12"/><rect x="141" y="103" width="53" height="43" rx="12"/><path d="M120 115h21"/></g><g className="face-eyes" fill="#242420"><circle cx="96" cy="125" r="5"/><circle cx="165" cy="125" r="5"/></g><path className="face-brows" d="m76 95 33-4m41 0 32 4" stroke="#292b25" strokeWidth="6" fill="none" strokeLinecap="round"/>{expression === "shocked" ? <ellipse cx="131" cy="174" rx="13" ry="18" fill="#34302a"/> : expression === "disappointed" ? <path d="M109 179q22-13 44 0" fill="none" stroke="#34302a" strokeWidth="6" strokeLinecap="round"/> : <><path d="M103 162q27 13 54 0-2 31-27 31-24-2-27-31" fill="#34302a"/><path d="M109 167q22 6 42 0l-4 10h-33" fill="#f3ebd9"/></>}</svg>;
}

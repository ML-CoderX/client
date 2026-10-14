import { ImageResponse } from "next/og";
import { content as c } from "@/data/content";
export const alt = c.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#09090b", display: "flex", flexDirection: "column", padding: "70px", color: "#f4f1e9", justifyContent: "space-between" }}><div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#d4b076" }}>{c.hero.eyebrow}</div><div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 1, fontWeight: 700, letterSpacing: -6 }}><span>{c.hero.line1} {c.hero.line2}</span><span style={{ color: "#d4b076" }}>{c.hero.punch}</span></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><span>@{c.identity.handle}</span><span>{c.stats.followers} {c.stats.label}</span></div></div>, size);
}

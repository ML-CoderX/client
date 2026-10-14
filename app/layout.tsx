import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { content } from "@/data/content";
import "./globals.css";

const inter = localFont({ src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", variable: "--font-sans", display: "swap" });
const marker = localFont({ src: "../node_modules/@fontsource/permanent-marker/files/permanent-marker-latin-400-normal.woff2", variable: "--font-marker", display: "swap", preload: false });
export const metadata: Metadata = {
  metadataBase: new URL(content.meta.siteUrl), title: content.meta.title, description: content.meta.description,
  openGraph: { type: "website", locale: "en_IN", siteName: content.identity.wordmark, title: content.meta.title, description: content.meta.description, images: [{ url: content.media.og, width: 1200, height: 630, alt: content.meta.ogAlt }] },
  twitter: { card: "summary_large_image", title: content.meta.title, description: content.meta.description, images: [content.media.og] },
  icons: { icon: content.media.logo }, robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#09090b" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${marker.variable}`}><body>{children}</body></html>;
}

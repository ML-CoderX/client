import { content as c } from "@/data/content";
export function GET() {
  const text = [c.kit.title, c.kit.intro, "", c.identity.name, c.identity.role, `${c.stats.followers} ${c.stats.label}`, `${c.stats.posts} ${c.stats.postsLabel}`, c.kit.source, "", c.kit.services, ...c.contact.services, "", c.links.instagram, c.links.youtube, "", c.kit.pending].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="${c.kit.fileName}"`, "X-Content-Type-Options": "nosniff" } });
}

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "docs", "blog");
const OUT_PATH = path.join(ROOT, "docs", ".vitepress", "sidebar.blog.generated.mts");

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function parseFrontmatter(md) {
  if (!md.startsWith("---\n")) return null;
  const end = md.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const fm = md.slice(4, end);
  const out = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function parseTitle(md) {
  const m = md.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

function safeDate(s) {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? s : null;
}

function buildSidebarGroups(posts) {
  const byYear = new Map();
  for (const p of posts) {
    if (!byYear.has(p.year)) byYear.set(p.year, []);
    byYear.get(p.year).push(p);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b.localeCompare(a));
  const groups = [];
  for (const y of years) {
    const items = byYear
      .get(y)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => ({ text: p.title, link: p.link }));
    groups.push({ text: y, items });
  }
  return groups;
}

function js(obj, indent = 0) {
  const sp = " ".repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const inner = obj.map((v) => sp + "  " + js(v, indent + 2)).join(",\n");
    return `[
${inner}
${sp}]`;
  }
  if (obj && typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const inner = entries
      .map(([k, v]) => `${sp}  ${k}: ${js(v, indent + 2)}`)
      .join(",\n");
    return `{
${inner}
${sp}}`;
  }
  if (typeof obj === "string") return JSON.stringify(obj);
  if (typeof obj === "boolean" || typeof obj === "number") return String(obj);
  return "null";
}

function main() {
  const files = listMarkdown(BLOG_DIR);
  const posts = [];

  for (const file of files) {
    const md = readText(file);
    const fm = parseFrontmatter(md);
    if (!fm) continue;
    const date = safeDate(fm.date);
    if (!date) continue;
    const year = date.slice(0, 4);
    const title = fm.title || parseTitle(md) || path.basename(file, ".md");
    const stem = path.basename(file, ".md");
    posts.push({ date, year, title, link: `/blog/${stem}` });
  }

  const groups = buildSidebarGroups(posts);
  const content = `export const blogSidebarItems = ${js(groups, 0)} as const;\n`;
  fs.writeFileSync(OUT_PATH, content, "utf8");
  console.log(`Generated sidebar for ${posts.length} posts into ${path.relative(ROOT, OUT_PATH)}`);
}

main();

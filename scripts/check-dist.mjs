// Checks the built site in dist/: no em or en dashes, no broken internal links or anchors, no duplicate ids,
// one H1, a canonical, a title of 65 characters or less, a description of 50 to 160, valid JSON-LD, and no banned buzzwords.
// Run after `npm run build`: `npm run check`.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const BANNED = [/ontzorg/i, /naar een hoger niveau/i, /baanbrekend/i, /game.?changer/i, /\bgroei/i, /efficiënt/i, /efficient/i, /transformatie/i];
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p);
  }
})(dist);

const pageOf = (file) => '/' + relative(dist, file).replace(/index\.html$/, '');
const pages = new Map();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]);
  pages.set(pageOf(file), { file, html, ids: new Set(ids), idList: ids });
}

const errors = [];
const err = (page, msg) => errors.push(`${page}  ${msg}`);
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Pages that quote clichés as examples of what not to say. They are allowed to contain the words.
const QUOTES_CLICHES = new Set(['/blueprint/', '/teardowns/']);

for (const [page, { html, idList }] of pages) {
  // Redirect stubs (Astro redirects) have no content of their own.
  if (/http-equiv="refresh"/i.test(html)) continue;
  // Dashes and buzzwords, in the text and the meta tags (not in CSS or scripts other than JSON-LD).
  const text = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, '');
  const dash = text.match(/.{0,30}[–—].{0,30}/);
  if (dash) err(page, `dash: ...${dash[0]}...`);
  const visible = text.replace(/<[^>]+>/g, ' ');
  for (const re of QUOTES_CLICHES.has(page) ? [] : BANNED) {
    const m = visible.match(new RegExp(`.{0,30}${re.source}.{0,30}`, re.flags.replace('g', '')));
    if (m) err(page, `banned word ${re}: ...${m[0]}...`);
  }

  // Duplicate ids.
  const seen = new Set();
  for (const id of idList) {
    if (seen.has(id)) err(page, `duplicate id "${id}"`);
    seen.add(id);
  }

  // SEO basics.
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (!title) err(page, 'no title');
  if (title.length > 65) err(page, `title is ${title.length} characters: ${title}`);
  if (desc.length < 50 || desc.length > 160) err(page, `description is ${desc.length} characters`);
  if (!html.includes('rel="canonical"')) err(page, 'no canonical');
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(page, `${h1} H1 elements`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { err(page, 'invalid JSON-LD'); }
  }

  // Internal links and anchors.
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    if (href.startsWith('//')) continue;
    const [path, frag] = href.split('#');
    const target = path === '' ? page : path;
    const isFile = /\.[a-z0-9]+$/i.test(target) && existsSync(join(dist, target));
    const entry = pages.get(target.endsWith('/') ? target : target + '/');
    if (!isFile && !entry) { err(page, `broken link ${href}`); continue; }
    if (frag && entry && !entry.ids.has(frag)) err(page, `broken anchor ${href}`);
  }
}

const placeholders = [...pages.values()].reduce((n, p) => n + (p.html.match(/>\[[^\]<]+\]</g) ?? []).length, 0);
console.log(`${pages.size} pages checked, ${placeholders} visible placeholders.`);
if (errors.length) {
  console.error(`\n${errors.length} problems:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('No problems found.');

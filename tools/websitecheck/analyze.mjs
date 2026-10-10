// Website check, rules layer (version 0.1). Reads one page and measures what a script can measure reliably:
// the main text (no menu, footer or news), the headline, empty words, numbers with a subject, buttons and follow-up signals.
// The judgement checks (context, problem, change, result, "could a competitor say this") need a language model and come later.
// Usage: node tools/websitecheck/analyze.mjs <url | path-to-html-file>
import { readFileSync } from 'node:fs';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { parse } from 'node-html-parser';

const MAX_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;

// Only public http(s) addresses. Blocks private, loopback and link-local ranges (SSRF).
const isPrivate = (ip) =>
  /^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) || ip === '::1' || /^f[cd]/i.test(ip) || /^fe80/i.test(ip);
export async function assertPublicUrl(raw) {
  const u = new URL(raw);
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Only http and https are allowed');
  const addrs = isIP(u.hostname) ? [{ address: u.hostname }] : await lookup(u.hostname, { all: true });
  if (addrs.some((a) => isPrivate(a.address))) throw new Error('This address is not public');
  return u;
}
export async function fetchPage(raw) {
  const u = await assertPublicUrl(raw);
  const res = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'user-agent': 'WebsiteCheck/0.1 (+first read of one page)' } });
  await assertPublicUrl(res.url);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error('Page is too large');
  return { url: res.url, html: buf.toString('utf8') };
}

const EMPTY_WORDS = ['ontzorg', 'oplossingen', 'innovatief', 'innovatie', 'kwaliteit', 'professioneel', 'betrouwbaar', 'persoonlijk', 'flexibel', 'duurzaam', 'groei', 'efficiënt', 'efficiency', 'transformatie', 'toekomst', 'partner', 'passie', 'optimaal', 'zorgeloos', 'totaal', 'compleet'];
const SKIP_TAGS = 'script,style,noscript,svg,nav,header,footer,aside,form,iframe,template';
const SKIP_CLASS = /(^|[\s_-])(nav|menu|footer|cookie|consent|news|nieuws|vacan|blog|breadcrumb|social|search)([\s_-]|$)/i;
const PHONE_OR_MAIL = /^\s*(\+?[\d\s().-]{8,}|[^\s@]+@[^\s@]+)\s*$/;
const clean = (t) => t.replace(/\s+/g, ' ').trim();

export function analyze(html, url = '') {
  const root = parse(html, { blockTextElements: { script: false, style: false, noscript: false } });
  const title = clean(root.querySelector('title')?.text ?? '');
  const meta = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const allText = clean(root.structuredText ?? root.text);

  // Main text: drop menu, footer, forms, news and vacancies.
  const main = parse(html);
  main.querySelectorAll(SKIP_TAGS).forEach((n) => n.remove());
  // Remove menu, news and cookie blocks by class name, but never a block that holds most of the page
  // (some sites put a word like "menu" on the body or a wrapper).
  const total = main.text.length || 1;
  main.querySelectorAll('[class],[id]').forEach((n) => {
    if (SKIP_CLASS.test(`${n.getAttribute('class') ?? ''} ${n.getAttribute('id') ?? ''}`) && n.text.length < total * 0.35) n.remove();
  });
  const mainText = clean(main.text);
  const words = mainText.toLowerCase().match(/[\p{L}'-]+/gu) ?? [];

  // Headline: first H1 that is not a phone number or e-mail address, then the first H2, then the page title.
  const h1s = root.querySelectorAll('h1').map((n) => clean(n.text)).filter((t) => t.length >= 6 && !PHONE_OR_MAIL.test(t));
  const h2s = root.querySelectorAll('h2').map((n) => clean(n.text)).filter((t) => t.length >= 6);
  const heading = h1s[0] ? { text: h1s[0], source: 'h1' } : h2s[0] ? { text: h2s[0], source: 'h2' } : { text: title.split(/[|–-]/)[0].trim(), source: 'title' };

  // Language: Dutch or English by common words.
  const nl = words.filter((w) => ['de', 'het', 'een', 'en', 'voor', 'met', 'van', 'je', 'wij', 'ons', 'onze', 'uw'].includes(w)).length;
  const en = words.filter((w) => ['the', 'and', 'for', 'with', 'our', 'your', 'we', 'of', 'to'].includes(w)).length;
  const lang = nl >= en * 1.5 ? 'nl' : en > nl * 1.5 ? 'en' : 'unclear';

  // Empty words, counted in the main text only. A service called "service en onderhoud" or "partners" in a heading does not count.
  const hits = {};
  words.forEach((w, i) => {
    const stem = EMPTY_WORDS.find((s) => w.startsWith(s));
    if (!stem) return;
    if (stem === 'groei' && /^groei(en|t|de)$/.test(w)) return;
    if (stem === 'partner' && w.endsWith('s')) return;
    if (stem === 'toekomst' && w === 'toekomstige') return;
    hits[stem] = (hits[stem] ?? 0) + 1;
  });
  const hitCount = Object.values(hits).reduce((a, b) => a + b, 0);
  const per100 = words.length ? Math.round((hitCount / words.length) * 1000) / 10 : 0;

  // Numbers that carry a subject, not counters that sit at zero or slider steps.
  const numbers = [...mainText.matchAll(/\b(\d[\d.,]*)\s?(%|procent|jaar|jaren|klanten|vestigingen|medewerkers|projecten|installaties|machines|merken|producten)\b/gi)]
    .filter((m) => Number(m[1].replace(/[.,]/g, '')) >= 2)
    .map((m) => m[0]);

  // Buttons and links in the main text that ask for an action.
  const ACTION = /^(plan|vraag|neem|bel|boek|start|download|meld|offerte|gratis|vrijblijvend|bereken|reserveer|huur nu|aanvragen|contact opnemen)/i;
  const ctas = [...new Set(main.querySelectorAll('a,button').map((n) => clean(n.text)).filter((t) => t.length > 2 && t.length < 45 && ACTION.test(t)))];

  const signals = {
    actieknop: ctas.length > 0,
    reactietijd: /(reactie|antwoord|terugbel|reageren|contact)\w*.{0,40}binnen (\d+|een|één|twee) (uur|uren|werkdag\w*|minuten)|binnen (\d+|een|één|twee) (uur|uren|werkdag\w*) (een )?(antwoord|reactie|terug)/i.test(mainText),
    nieuwsbrief: /nieuwsbrief|schrijf je in|schrijf u in|abonneer/i.test(allText),
    prijs: /€\s?\d|vanaf \d|wat kost|tarieven?\b/i.test(mainText),
    telefoon: /(\+31|0\d{2,3})[\s()-]*\d[\d\s-]{6,}/.test(allText),
    voorWieNiet: /(niet (geschikt )?voor|past niet|voor wie (het )?niet|geen (opdrachten|klanten))/i.test(mainText),
  };

  // Rule scores (0 to 2) for the checks a script can do. The others stay empty until the language model has read the page.
  const scores = {
    5: words.length < 150 ? null : per100 >= 3 ? 0 : per100 >= 1 ? 1 : 2,
    8: signals.actieknop && (signals.reactietijd || signals.prijs) ? 2 : signals.actieknop || signals.telefoon ? 1 : 0,
    10: signals.actieknop && (signals.reactietijd || signals.nieuwsbrief) ? 2 : signals.actieknop ? 1 : 0,
  };

  const notes = [];
  if (words.length < 150) notes.push('Te weinig tekst gelezen om te scoren (minder dan 150 woorden).');
  if (lang !== 'nl') notes.push(`Taal: ${lang}. De rubric is voor Nederlands en Engels getest.`);
  if (heading.source !== 'h1') notes.push(`Geen bruikbare H1 gevonden, de kop komt uit de ${heading.source}.`);
  notes.push('Alleen de homepage gelezen. Bewijs staat vaak op een aparte pagina.');
  return { url, title, meta, lang, words: words.length, heading, empty: { per100, hits }, numbers, ctas, signals, scores, notes };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2];
  if (!arg) throw new Error('Usage: node tools/websitecheck/analyze.mjs <url | file.html>');
  const { url, html } = /^https?:/.test(arg) ? await fetchPage(arg) : { url: arg, html: readFileSync(arg, 'utf8') };
  console.log(JSON.stringify(analyze(html, url), null, 2));
}

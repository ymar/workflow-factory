// Runs the rules on a folder of saved pages and prints one line per page. Used to check the fixes from phase 0.
import { readdirSync, readFileSync } from 'node:fs';
import { analyze } from './analyze.mjs';
const dir = process.argv[2];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  const r = analyze(readFileSync(`${dir}/${f}`, 'utf8'), f);
  console.log(`${f.padEnd(26)} ${String(r.words).padStart(5)}w ${r.lang} | kop[${r.heading.source}]: ${r.heading.text.slice(0, 48).padEnd(48)} | leeg/100: ${String(r.empty.per100).padStart(4)} | cijfers: ${r.numbers.length} | cta: ${r.ctas.length} | rt:${+r.signals.reactietijd} nb:${+r.signals.nieuwsbrief} | scores ${JSON.stringify(r.scores)}`);
}

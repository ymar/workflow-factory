// Helpers for the workflow library: labels, readable timing, and the build check.
import type { CollectionEntry } from 'astro:content';

export const objectIds = ['aanvraag', 'klant', 'contact', 'offerte', 'project', 'installatie', 'contract', 'keuring', 'storing', 'bestelling', 'mjop', 'afzender'] as const;
export const objectLabel: Record<string, string> = {
  aanvraag: 'Aanvraag', klant: 'Klant', contact: 'Contactpersoon', offerte: 'Offerte', project: 'Project', installatie: 'Installatie',
  contract: 'Contract', keuring: 'Keuring', storing: 'Storing', bestelling: 'Bestelling', mjop: 'MJOP', afzender: 'Afzender',
};

export const segmentIds = ['installatie-onderhoud', 'groothandel', 'zakelijke-dienstverlening'] as const;
export const segmentLabel: Record<string, string> = {
  'installatie-onderhoud': 'Installatie en onderhoud',
  groothandel: 'Groothandel',
  'zakelijke-dienstverlening': 'Zakelijke dienstverlening',
};
export const segmentHref: Record<string, string> = { 'installatie-onderhoud': '/installatie-onderhoud/' };

// A field reference looks like `object.field`, for example `contract.einddatum`.
const FIELD_REF = /\b([a-z]+\.[a-z_0-9]+)\b/g;
export const fieldRefsIn = (text?: string) => (text ? [...text.matchAll(FIELD_REF)].map((m) => m[1]) : []);
export const fieldAnchor = (id: string) => `veld-${id.replace(/[._]/g, '-')}`;
export const metricAnchor = (id: string) => `meting-${id.replace(/_/g, '-')}`;

type Workflow = CollectionEntry<'workflows'>;
type Labels = Map<string, string>;

export function workflowFieldRefs(j: Workflow): string[] {
  const { enroll, steps, exit } = j.data;
  const texts = [enroll.at, enroll.on, ...enroll.if, ...enroll.not_if, ...exit, ...steps.flatMap((s) => [s.at, s.on, s.if, s.to, s.sets])];
  // The greeting and signature of every example email use the first name and the sender's details.
  const mail = steps.some((s) => s.email) ? ['contact.voornaam', 'afzender.naam', 'afzender.telefoon'] : [];
  return [...new Set([...texts.flatMap(fieldRefsIn), ...steps.flatMap((s) => emailTexts(s).flatMap(mergeFieldsIn)), ...mail])];
}

// Example emails. `{{object.field}}` is a CRM field, `[text]` is something the sender fills in,
// and `{u|je}` picks the form of address set in `library.form` (src/lib/site.ts).
type Step = Workflow['data']['steps'][number];
const MERGE = /\{\{\s*([a-z]+\.[a-z_0-9]+)\s*\}\}/g;
const FORM = /\{([^{}|]+)\|([^{}|]+)\}/g;
export const mergeFieldsIn = (text: string) => [...text.matchAll(MERGE)].map((m) => m[1]);
export const emailTexts = (s: Step) => (s.email ? [s.email.subject, s.email.preheader, s.email.body, s.email.cta?.label ?? ''] : []);
export const applyForm = (text: string, form: 'u' | 'je') => text.replace(FORM, (_, u, je) => (form === 'u' ? u : je));
// Text left over after removing every {u|je} choice, for the check that no "u" slipped through.
export const formFree = (text: string) => text.replace(FORM, '').replace(MERGE, '');

export const mailForm = {
  u: { greeting: 'Beste', closing: 'Met vriendelijke groet,' },
  je: { greeting: 'Hoi', closing: 'Groet,' },
};

export type MailToken = { kind: 'text' | 'field' | 'fill'; value: string };
export function mailTokens(text: string, form: 'u' | 'je'): MailToken[] {
  const parts = applyForm(text, form).split(/(\{\{\s*[a-z]+\.[a-z_0-9]+\s*\}\}|\[[^\]]+\])/);
  return parts.filter(Boolean).map((p) =>
    p.startsWith('{{') ? { kind: 'field', value: p.replace(/[{}\s]/g, '') } : p.startsWith('[') ? { kind: 'fill', value: p } : { kind: 'text', value: p },
  );
}
// Paragraphs are separated by a blank line; a block where every line starts with "- " is a list.
export function mailBlocks(body: string) {
  return body.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    return lines.every((l) => l.startsWith('- ')) ? { list: lines.map((l) => l.slice(2)) } : { lines };
  });
}

// What each field does in a workflow, for the data section: start, condition, stop, email.
export function fieldUsage(j: Workflow): Map<string, string[]> {
  const use = new Map<string, Set<string>>();
  const add = (texts: (string | undefined)[], role: string) => texts.flatMap(fieldRefsIn).forEach((id) => use.set(id, (use.get(id) ?? new Set()).add(role)));
  const { enroll, steps, exit } = j.data;
  add([enroll.at, enroll.on], 'Start');
  add(enroll.if, 'Voorwaarde om te starten');
  add(enroll.not_if, 'Houdt buiten de workflow');
  steps.forEach((s, i) => {
    add([s.at], 'Bepaalt het moment');
    add([s.on], `Start stap ${i + 1}`);
    add([s.if], `Voorwaarde stap ${i + 1}`);
    add([s.to], `Ontvanger stap ${i + 1}`);
    add([s.sets], `Gevuld in stap ${i + 1}`);
    emailTexts(s).flatMap(mergeFieldsIn).forEach((id) => use.set(id, (use.get(id) ?? new Set()).add(`In e-mail stap ${i + 1}`)));
  });
  add(exit, 'Stopt de workflow');
  return new Map([...use].map(([id, roles]) => [id, [...roles]]));
}

// Steps that start at the same moment run side by side in the flowchart.
export const momentOf = (s: Step) => s.at ?? (s.after !== undefined ? `after:${s.after}` : `on:${s.on}`);
export function flowRows(steps: Step[]): Step[][] {
  const rows: Step[][] = [];
  for (const s of steps) {
    const last = rows.at(-1);
    if (last && momentOf(last[0]) === momentOf(s) && !s.on) last.push(s);
    else rows.push([s]);
  }
  return rows;
}
// "s1" in a condition reads as "stap 1" on the site.
export const stepRefs = (text: string) => text.replace(/\b(?:stap\s+)?s(\d+)\b/g, 'stap $1');

// Replace field ids with their labels, for readable conditions on the site.
export const withLabels = (text: string, labels: Labels) => text.replace(FIELD_REF, (id) => labels.get(id) ?? id);

const UNITS: Record<string, [string, string]> = { d: ['dag', 'dagen'], w: ['week', 'weken'], m: ['maand', 'maanden'] };
const amount = (n: number, unit: string) => `${n} ${UNITS[unit][n === 1 ? 0 : 1]}`;

export function whenLabel(step: { at?: string; after?: string; on?: string }, labels: Labels): string {
  if (step.at) {
    const m = step.at.match(/^([a-z]+\.[a-z_0-9]+)\s*(?:([+-])\s*(\d+)([dwm]))?$/);
    if (!m) return step.at;
    const field = labels.get(m[1]) ?? m[1];
    if (!m[2]) return `Op ${field.toLowerCase()}`;
    return `${amount(Number(m[3]), m[4])} ${m[2] === '-' ? 'voor' : 'na'} ${field.toLowerCase()}`;
  }
  if (step.after) {
    if (step.after === 'direct') return 'Direct';
    const m = step.after.match(/^(\d+)([dwm])$/);
    return m ? `Na ${amount(Number(m[1]), m[2])}` : `Na ${step.after}`;
  }
  return `Zodra ${withLabels(step.on ?? '', labels).toLowerCase()}`;
}

// Library order: by loop phase, then by code.
const PHASE_ORDER = ['specificeren', 'kiezen', 'gebruiken', 'onderhouden', 'uitbreiden', 'vervangen'];
export const sortWorkflows = <T extends Workflow>(list: T[]) =>
  [...list].sort((a, b) => PHASE_ORDER.indexOf(a.data.phase) - PHASE_ORDER.indexOf(b.data.phase) || a.data.code.localeCompare(b.data.code));

// A condition as a Dutch clause after "als" or "zodra": "het contract nog niet verlengd is".
// Ja/nee fields use the `says` phrases from the dictionary; other conditions follow a few fixed patterns.
type FieldInfo = { label: string; type: string; example: string; says?: { ja: string; nee: string } };
const lc = (label: string) => (/^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1));
export function clause(cond: string, fields: Map<string, FieldInfo>): string {
  const m = cond.match(/^([a-z]+\.[a-z_0-9]+)\s*(=|>=|<=)\s*(.+)$/);
  if (m) {
    const f = fields.get(m[1]);
    const label = lc(f?.label ?? m[1]);
    const value = m[3].trim();
    if (m[2] === '=' && f?.says && (value === 'ja' || value === 'nee')) return f.says[value];
    if (m[2] === '>=') return `${label} minstens ${value} is`;
    if (m[2] === '<=') return `${label} hooguit ${value} is`;
    return `${label} op ${value} staat`;
  }
  const s = cond.match(/^([a-z]+\.[a-z_0-9]+)\s+is\s+(.+)$/);
  if (s) return `${lc(fields.get(s[1])?.label ?? s[1])} ${s[2]} is`;
  return stepRefs(cond.replace(/\b([a-z]+\.[a-z_0-9]+)\b/g, (id) => lc(fields.get(id)?.label ?? id)));
}
export const joinOr = (parts: string[]) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} of ${parts.at(-1)}`);
export const joinAnd = (parts: string[]) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} en ${parts.at(-1)}`);

// The timeline counts in days (or weeks, months) from one moment: the date field the workflow starts from,
// or the start itself. "Dag −75" is 75 days before that date.
const UNIT_WORD: Record<string, string> = { d: 'Dag', w: 'Week', m: 'Maand' };
const UNIT_PLURAL: Record<string, [string, string]> = { d: ['dag', 'dagen'], w: ['week', 'weken'], m: ['maand', 'maanden'] };
const AT = /^([a-z]+\.[a-z_0-9]+)\s*(?:([+-])\s*(\d+)([dwm]))?$/;
export function timeline(j: Workflow, fields: Map<string, FieldInfo>) {
  const { enroll, steps } = j.data;
  const start = enroll.at?.match(AT);
  const anchor = start?.[1];
  const unit = start?.[4] ?? steps.map((s) => s.at?.match(AT)).find((m) => anchor && m && m[1] === anchor && m[4])?.[4] ?? 'd';
  const signed = (sign: string | undefined, n: string | undefined) => (n ? `${sign === '-' ? '−' : ''}${n}` : '0');
  const dayOf = (s: Step): { main: string; sub?: string } => {
    if (s.on) return { main: 'Zodra' };
    if (s.at) {
      const m = s.at.match(AT);
      if (!m) return { main: 'Later' };
      if (m[1] === anchor) return { main: `${UNIT_WORD[m[4] ?? unit]} ${signed(m[2], m[3])}` };
      const label = lc(fields.get(m[1])?.label ?? m[1]);
      if (!m[3]) return { main: 'Op de dag', sub: label };
      return { main: `${m[3]} ${UNIT_PLURAL[m[4]][m[3] === '1' ? 0 : 1]}`, sub: `${m[2] === '-' ? 'voor' : 'na'} ${label}` };
    }
    if (s.after === 'direct') return { main: 'Dag 0' };
    const a = s.after?.match(/^(\d+)([dwm])$/);
    if (a) return { main: `${UNIT_WORD[a[2]]} ${a[1]}` };
    const w = s.after?.match(/^(\d+)\s*werkdag/);
    return w ? { main: `Werkdag ${w[1]}` } : { main: s.after ?? '' };
  };
  const startDay = anchor ? `${UNIT_WORD[start?.[4] ?? unit]} ${signed(start?.[2], start?.[3])}` : 'Dag 0';
  const trigger = j.data.trigger.replace(/\.$/, '');
  const zero = anchor
    ? `${UNIT_WORD[unit]} 0 = ${lc(fields.get(anchor)?.label ?? anchor)}`
    : `Dag 0 = ${trigger.charAt(0).toLowerCase()}${trigger.slice(1)}`;
  // A workflow that counts down to a date ends on that date, unless a step waits for something after it.
  const countsDown = Boolean(anchor && start?.[2] === '-' && !steps.some((s) => s.on));
  const end = countsDown ? { main: `${UNIT_WORD[unit]} 0`, sub: lc(fields.get(anchor!)?.label ?? '') } : { main: 'Einde' };
  return { dayOf, startDay, zero, end };
}

// Consecutive single steps with the same condition share one band in the timeline.
export function timelineGroups(steps: Step[]) {
  const groups: { cond?: string; rows: Step[][] }[] = [];
  for (const row of flowRows(steps)) {
    const cond = row.length === 1 ? row[0].if : undefined;
    const last = groups.at(-1);
    if (cond && last?.cond === cond) last.rows.push(row);
    else groups.push({ cond, rows: [row] });
  }
  // A band of one step is just a step with a condition.
  return groups.flatMap((g) => (g.cond && g.rows.length < 2 ? [{ cond: undefined, rows: g.rows }] : [g]));
}

export function formatExample(value: string, type: string) {
  if (type === 'datum' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T12:00:00Z`).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return value;
}

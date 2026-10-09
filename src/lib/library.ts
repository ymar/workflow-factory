// Helpers for the workflow library: labels, readable timing, and the build check.
import type { CollectionEntry } from 'astro:content';

export const objectIds = ['aanvraag', 'klant', 'offerte', 'project', 'installatie', 'contract', 'keuring', 'storing', 'bestelling', 'mjop'] as const;
export const objectLabel: Record<string, string> = {
  aanvraag: 'Aanvraag', klant: 'Klant', offerte: 'Offerte', project: 'Project', installatie: 'Installatie',
  contract: 'Contract', keuring: 'Keuring', storing: 'Storing', bestelling: 'Bestelling', mjop: 'MJOP',
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
  return [...new Set(texts.flatMap(fieldRefsIn))];
}

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

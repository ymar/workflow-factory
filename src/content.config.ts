import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { phaseIds } from './lib/loop';
import { objectIds, segmentIds } from './lib/library';

const price = z.object({
  label: z.string(),
  from: z.number(),
  to: z.number().optional(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    order: z.number(),
    summary: z.string(),
    duration: z.string(),
    priceStatus: z.enum(['proposal', 'confirmed']),
    prices: z.array(price),
    priceNote: z.string().optional(),
    requires: z.string().optional(),
    deliverables: z.array(z.object({ name: z.string(), format: z.string(), size: z.string() })),
    process: z.array(z.object({ when: z.string(), what: z.string(), clientTime: z.string() })),
    notIncluded: z.array(z.string()),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    page: z.enum(['home', 'blueprint', 'build', 'flow', 'segment', 'teardowns', 'over', 'contact', 'privacy']),
    order: z.number(),
  }),
});

const segments = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/segments' }),
  schema: z.object({
    name: z.string(),
    problems: z.array(z.string()),
    workflows: z.array(reference('workflows')),
    glossary: z.array(z.object({ term: z.string(), becomes: z.string(), field: reference('fields').optional(), workflow: reference('workflows').optional() })),
  }),
});

const teardowns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teardowns' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    company: z.string(),
    type: z.string(),
    scorecard: z
      .array(z.object({ criterion: z.string(), score: z.number().min(0).max(5) }))
      .length(5),
    before: z.string(),
    after: z.string(),
    lesson: z.string(),
    draft: z.boolean().default(false),
  }),
});

// Workflow library: four layers. Fields and metrics are defined once and referenced by id.
// Ids come from the file name, so `contract.einddatum.yaml` is field `contract.einddatum`.
const idFromFile = ({ entry }: { entry: string }) => entry.split('/').pop()!.replace(/\.(ya?ml|json)$/, '');

const fields = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/library/fields', generateId: idFromFile }),
  schema: z.object({
    label: z.string(),
    type: z.enum(['datum', 'datum en tijd', 'keuze', 'meerkeuze', 'ja/nee', 'getal', 'bedrag', 'tekst', 'gebruiker', 'contact']),
    object: z.enum(objectIds),
    required: z.boolean(),
    source: z.string(),
    example: z.coerce.string(),
    options: z.array(z.string()).optional(),
    check: z.string().optional(),
  }),
});

const metrics = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/library/metrics', generateId: idFromFile }),
  schema: z
    .object({
      label: z.string(),
      type: z.enum(['volume', 'conversie', 'doorlooptijd', 'omzet']),
      definition: z.string().optional(),
      numerator: z.string().optional(),
      denominator: z.string().optional(),
      period: z.string(),
      unit: z.string(),
    })
    .refine((m) => (m.type === 'conversie' ? m.numerator && m.denominator : m.definition), {
      message: 'A conversie metric needs numerator and denominator; other metrics need a definition.',
    }),
});

// An example email. In the text, {{object.field}} is a CRM field, [text] is filled in by the sender,
// and {u|je} is the form of address (set in src/lib/site.ts). Paragraphs are separated by a blank line.
const email = z.object({
  goal: z.string(),
  subject: z.string().max(80),
  preheader: z.string().max(120),
  body: z.string(),
  cta: z.object({ label: z.string(), leads_to: z.string() }).optional(),
});

const step = z
  .object({
    id: z.string(),
    // Short name for the flowchart.
    title: z.string().max(48),
    at: z.string().optional(),
    after: z.coerce.string().optional(),
    on: z.string().optional(),
    if: z.string().optional(),
    action: z.enum(['e-mail', 'taak', 'melding', 'systeem']),
    owner: z.string().optional(),
    to: z.string().optional(),
    sla: z.string().optional(),
    sets: z.string().optional(),
    brief: z.string(),
    // For a task or a notification: what to check, ask and record.
    checklist: z.array(z.string()).max(4).optional(),
    email: email.optional(),
  })
  .refine((s) => [s.at, s.after, s.on].filter(Boolean).length === 1, { message: 'A step needs exactly one of at, after or on.' })
  .refine((s) => !s.email || s.action === 'e-mail', { message: 'Only an e-mail step can have an email.' });

const workflows = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/library/workflows', generateId: idFromFile }),
  schema: z.object({
    code: z.string().regex(/^[A-Z]{3}-\d{2}$/),
    name: z.string(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    // concept: designed, not yet built for a client. getest: live at a client. bewezen: live with measured results.
    status: z.enum(['concept', 'getest', 'bewezen']),
    phase: z.enum(phaseIds),
    segments: z.array(z.enum(segmentIds)).min(1),
    needs_blueprint: z.boolean(),
    owner: z.string(),
    priority: z.number().int().min(1),
    summary: z.string(),
    // The outcome in four parts: who it is for, the problem, what changes, and the result.
    outcome: z.object({ context: z.string(), issue: z.string(), change: z.string(), result: z.string() }).optional(),
    updated: z.coerce.date().optional(),
    trigger: z.string(),
    goal: z.string(),
    enroll: z
      .object({
        object: z.enum(objectIds),
        at: z.string().optional(),
        on: z.string().optional(),
        if: z.array(z.string()).default([]),
        not_if: z.array(z.string()).default([]),
      })
      .refine((e) => Boolean(e.at) !== Boolean(e.on), { message: 'Enroll needs exactly one of at or on.' }),
    steps: z.array(step).min(1),
    exit: z.array(z.string()).min(1),
    handover: z.object({ won: z.string(), lost: z.string().optional() }),
    next: reference('workflows').optional(),
    fields: z.array(reference('fields')).min(1),
    metrics: z.array(reference('metrics')).min(1),
    // Search: the title gets " | Workflow Factory" appended, so keep it at 45 characters or less.
    seo: z.object({ title: z.string().max(45), description: z.string().min(80).max(160) }),
    why: z.string(),
    example: z.string().startsWith('Stel:').optional(),
    mistakes: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { services, faq, segments, teardowns, workflows, fields, metrics };

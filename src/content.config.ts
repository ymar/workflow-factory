import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    journeys: z.array(reference('journeys')),
    glossary: z.array(z.object({ term: z.string(), becomes: z.string(), journey: reference('journeys').optional() })),
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

// Journey library: each journey is a ready-made Flow with a trigger, steps, a handover rule and a dashboard.
const journeys = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/journeys' }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    side: z.enum(['eerste-order', 'tweede-order']),
    stage: z.string(),
    summary: z.string(),
    trigger: z.string(),
    goal: z.string(),
    steps: z.array(z.object({ when: z.string(), channel: z.enum(['E-mail', 'Taak', 'Systeem']), what: z.string() })),
    handover: z.string(),
    next: reference('journeys').optional(),
    metrics: z.object({ volume: z.string(), conversion: z.string(), leadTime: z.string() }),
    fits: z.array(z.string()),
    startsWithoutBlueprint: z.boolean().default(false),
  }),
});

export const collections = { services, faq, segments, teardowns, journeys };

# Workflow Factory

Website for Workflow Factory: an open library of marketing automation workflows for B2B, with consultancy behind it. Astro, static output, Tailwind v4, deployed on Cloudflare Pages from `main`.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

Cloudflare Pages settings: build command `npm run build`, output directory `dist`.

### Preview

`npm run deploy:preview` builds the site and uploads it to https://workflow-factory-preview.ymar.workers.dev (a Cloudflare Worker with static assets, config in `deploy/preview.wrangler.jsonc`). It needs `CLOUDFLARE_API_TOKEN` with Workers permissions. `public/_headers` keeps every `workers.dev` and `pages.dev` address out of search results, so only the real domain gets indexed.

The preview is deliberately not a Pages project: a Pages project made by direct upload can never be connected to GitHub later. Keep the name `workflow-factory` free for the production project that deploys from `main`.

## Where things live

| What | Where |
| --- | --- |
| Contact details, booking link, KvK, availability | `src/lib/site.ts` |
| Domain (canonical URLs, sitemap) | `SITE` in `astro.config.mjs`, and `public/robots.txt` |
| Products, prices, deliverables, process | `src/content/services/*.json` |
| FAQ per page | `src/content/faq/*.json` (field `page`) |
| Segment page | `src/content/segments/installatie-onderhoud.json` |
| Teardowns | `src/content/teardowns/*.md` |
| Workflow library (Flow) | `src/content/library/` (see below) |
| Topics: the menu and the topic pages at `/workflows/<topic>/` | `src/lib/topics.ts`. Each topic groups one or two phases of the loop |
| Redirects | `astro.config.mjs` and `public/_redirects` (the `/en/*` wildcard only works in `_redirects`) |
| Colour tokens (light theme; `.on-dark` flips them for dark blocks) | `src/styles/global.css` |
| Share image | `public/og.png`, a 1200x630 render of `public/og.svg`. Social networks do not show SVG, so render a new PNG when the SVG changes |

An empty value in `src/lib/site.ts` shows up on the site as a visible `[placeholder]`.

Prices have `"priceStatus": "proposal"` and show as "voorstel". Set it to `"confirmed"` once a price is final.

### Adding a teardown

Copy `src/content/teardowns/voorbeeld-template.md`, fill it in and set `draft: false`. Drafts never reach the build. In `before`, mark generic words with `~tildes~` (switched off) and distinct words with `*asterisks*` (lit).

### Workflow library

Four layers in `src/content/library/`:

| Layer | Where | What |
| --- | --- | --- |
| Phases | `src/lib/loop.ts` | The six loop phases, revenue type, where it leaks |
| Fields | `fields/<object>.<field>.yaml` | Data dictionary: every CRM field defined once (type, object, source, example, check) |
| Metrics | `metrics/<id>.yaml` | Every metric defined once. Conversions need a numerator and denominator |
| Workflows | `workflows/<phase>/<slug>.yaml` | Trigger, steps, exit, handover, and references to fields and metrics |

The file name is the id: `contract.einddatum.yaml` is field `contract.einddatum`, `workflows/onderhouden/contractverlenging.yaml` is `/workflows/contractverlenging/`.

**Adding a workflow:** copy `workflows/onderhouden/contractverlenging.yaml`; it is the reference and every key is explained in comments. Put the file in the folder of its phase. Every step has exactly one moment: `at` (relative to a date field, `contract.einddatum - 75d`, units `d`, `w`, `m`), `after` (relative to the start: `direct`, `2d`, `1 werkdag`) or `on` (when something happens). Conditions name fields as `object.field`.

**The build checks the library.** It fails when a workflow uses a field that is not in the dictionary, uses a field it does not list under `fields`, or sits in a folder that does not match its `phase`. Add the field to `fields/` first, then use it.

`status` is `concept`, `getest` or `bewezen`. Move a workflow up only when it runs at a client (getest) or has measured results (bewezen), and raise `version` when the steps change. The structure and the example emails are published under CC BY 4.0.

**Steps, timeline and emails.** The workflow page draws a timeline from the steps, counted in days (or weeks, months) from the date the workflow starts from: "Dag −75" is 75 days before it. Every step has a short `title`. Steps at the same moment sit side by side, and consecutive steps with the same `if` share one band ("Vanaf hier alleen als ..."). Conditions read as Dutch clauses: a ja/nee field gets `says: { ja, nee }` in the dictionary (for example `het contract nog niet verlengd is`), other conditions follow fixed patterns such as `status offerte op Verstuurd staat`. A task or notification can have a `checklist` (what to check, ask and record). An email step can have an `email` with `goal`, `subject`, `preheader`, `body` and an optional `cta`. On the site the emails show the dictionary's `example` values (a "Velden" switch shows the codes). In the email text, `{{object.field}}` is a CRM field (the build checks it is in the dictionary and in the workflow's `fields`), `[text]` is a spot the sender fills in, and `{u|je}` is the form of address. The greeting and signature are added automatically and use `contact.voornaam`, `afzender.naam` and `afzender.telefoon`, so a workflow with emails lists those fields too. The build fails on a "u" or "uw" outside a `{u|je}` choice, so switching the form of address never leaves one behind. Contractverlenging is the reference.

**Outcome.** `outcome` states the result in four parts: `context` (for whom), `issue` (the problem), `change` (what the workflow changes) and `result` (what it delivers, in numbers where possible). It shows at the top of the workflow page. `updated` is the date of the last real change.

**Provisional choices** in `library` in `src/lib/site.ts`: whether the example emails are public (`emailsPublic`), the form of address (`form`, `u` or `je`) and on whose name the emails go out (`sender`). They were set as placeholders and still need your confirmation.

To show a workflow on the segment page, add its id to `workflows` in the segment file. Glossary terms link to a field with `field` and to a workflow with `workflow`.

### Analytics

Cloudflare Web Analytics loads only when `PUBLIC_CF_ANALYTICS_TOKEN` is set as an environment variable in Cloudflare Pages. It sets no cookies, so the site needs no cookie banner.

## Still to supply

- Email address (`site.email`). Until then, there is no working contact link.
- Booking link (`site.bookingUrl`), Cal.com or Calendly
- KvK number (`site.kvk`)
- Availability (`site.availability`), for example "eerste sprint vanaf januari"
- Connect the domain in Cloudflare Pages
- Cloudflare Web Analytics token
- Prices: confirm or change the proposals in `src/content/services/`
- Proof on the homepage: three anonymised cases with numbers
- Number of teardowns in the hero credibility line (`[X]`)
- At least three teardowns
- Preview image of the positioning page (homepage, "Wat je van Blueprint krijgt")
- About page: career in 2 or 3 sentences, and a photo
- Privacy page: date, retention period, name of the booking tool, and a legal check
- Review the ten concept workflows (steps, timings, fields) before the library goes live
- Confirm the provisional email choices in `library` in `src/lib/site.ts`: emails public, `u` or `je`, sender
- Example emails, step checklists and outcome statements for the nine workflows other than Contractverlenging
- Decide whether the workflow data moves to its own public repo
- Register workflowfactory.nl (free when checked on 9 October 2026). `SITE` and `robots.txt` already use it.

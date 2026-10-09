# neon

Website for neon, a one-person B2B consultancy. Astro, static output, Tailwind v4, deployed on Cloudflare Pages from `main`.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

Cloudflare Pages settings: build command `npm run build`, output directory `dist`.

### Preview

`npm run deploy:preview` builds the site and uploads it to https://neon-preview.ymar.workers.dev (a Cloudflare Worker with static assets, config in `deploy/preview.wrangler.jsonc`). It needs `CLOUDFLARE_API_TOKEN` with Workers permissions. `public/_headers` keeps every `workers.dev` and `pages.dev` address out of search results, so only the real domain gets indexed.

The preview is deliberately not a Pages project: a Pages project made by direct upload can never be connected to GitHub later. Keep the name `neon` free for the production project that deploys from `main`.

## Where things live

| What | Where |
| --- | --- |
| Contact details, booking link, KvK, availability | `src/lib/site.ts` |
| Domain (canonical URLs, sitemap) | `SITE` in `astro.config.mjs`, and `public/robots.txt` |
| Products, prices, deliverables, process | `src/content/services/*.json` |
| FAQ per page | `src/content/faq/*.json` (field `page`) |
| Segment page | `src/content/segments/installatie-onderhoud.json` |
| Teardowns | `src/content/teardowns/*.md` |
| Journey library (Flow) | `src/content/library/` (see below) |
| Redirects | `astro.config.mjs` and `public/_redirects` (the `/en/*` wildcard only works in `_redirects`) |
| Brand tokens (dark theme: `night` base, `forest` for highlighted blocks) | `src/styles/global.css` |

An empty value in `src/lib/site.ts` shows up on the site as a visible `[placeholder]`.

Prices have `"priceStatus": "proposal"` and show as "voorstel". Set it to `"confirmed"` once a price is final.

### Adding a teardown

Copy `src/content/teardowns/voorbeeld-template.md`, fill it in and set `draft: false`. Drafts never reach the build. In `before`, mark generic words with `~tildes~` (switched off) and distinct words with `*asterisks*` (lit).

### Journey library

Four layers in `src/content/library/`:

| Layer | Where | What |
| --- | --- | --- |
| Phases | `src/lib/loop.ts` | The six loop phases, revenue type, where it leaks |
| Fields | `fields/<object>.<field>.yaml` | Data dictionary: every CRM field defined once (type, object, source, example, check) |
| Metrics | `metrics/<id>.yaml` | Every metric defined once. Conversions need a numerator and denominator |
| Journeys | `journeys/<phase>/<slug>.yaml` | Trigger, steps, exit, handover, and references to fields and metrics |

The file name is the id: `contract.einddatum.yaml` is field `contract.einddatum`, `journeys/onderhouden/contractverlenging.yaml` is `/journeys/contractverlenging/`.

**Adding a journey:** copy `journeys/onderhouden/contractverlenging.yaml`; it is the reference and every key is explained in comments. Put the file in the folder of its phase. Every step has exactly one moment: `at` (relative to a date field, `contract.einddatum - 75d`, units `d`, `w`, `m`), `after` (relative to the start: `direct`, `2d`, `1 werkdag`) or `on` (when something happens). Conditions name fields as `object.field`.

**The build checks the library.** It fails when a journey uses a field that is not in the dictionary, uses a field it does not list under `fields`, or sits in a folder that does not match its `phase`. Add the field to `fields/` first, then use it.

`status` is `concept`, `getest` or `bewezen`. Move a journey up only when it runs at a client (getest) or has measured results (bewezen), and raise `version` when the steps change. The structure is published under CC BY 4.0; the email copy is not part of the library, each email step only has a `brief`.

To show a journey on the segment page, add its id to `journeys` in the segment file. Glossary terms link to a field with `field` and to a journey with `journey`.

### Analytics

Cloudflare Web Analytics loads only when `PUBLIC_CF_ANALYTICS_TOKEN` is set as an environment variable in Cloudflare Pages. It sets no cookies, so the site needs no cookie banner.

## Still to supply

- Email address (`site.email`). Until then, there is no working contact link.
- Booking link (`site.bookingUrl`), Cal.com or Calendly
- KvK number (`site.kvk`)
- Availability (`site.availability`), for example "eerste sprint vanaf januari"
- Domain: update `SITE` and `robots.txt`, then connect the domain in Cloudflare Pages
- Cloudflare Web Analytics token
- Prices: confirm or change the proposals in `src/content/services/`
- Proof on the homepage: three anonymised cases with numbers
- Number of teardowns in the hero credibility line (`[X]`)
- At least three teardowns
- Preview image of the positioning page (homepage, "Wat je van Blueprint krijgt")
- About page: career in 2 or 3 sentences, and a photo
- Privacy page: date, retention period, name of the booking tool, and a legal check
- Review the ten concept journeys (steps, timings, fields) before the library goes live
- Decide whether the journey data moves to its own public repo
- Domain: the name is now neon, but `SITE` still says neeeon.nl. Update it once the domain is known.

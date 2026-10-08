# neon

Website for neon, a one-person B2B consultancy. Astro, static output, Tailwind v4, deployed on Cloudflare Pages from `main`.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

Cloudflare Pages settings: build command `npm run build`, output directory `dist`.

## Where things live

| What | Where |
| --- | --- |
| Contact details, booking link, KvK, availability | `src/lib/site.ts` |
| Domain (canonical URLs, sitemap) | `SITE` in `astro.config.mjs`, and `public/robots.txt` |
| Products, prices, deliverables, process | `src/content/services/*.json` |
| FAQ per page | `src/content/faq/*.json` (field `page`) |
| Segment page | `src/content/segments/installatie-onderhoud.json` |
| Teardowns | `src/content/teardowns/*.md` |
| Redirects | `astro.config.mjs` and `public/_redirects` (the `/en/*` wildcard only works in `_redirects`) |
| Brand tokens | `src/styles/global.css` |

An empty value in `src/lib/site.ts` shows up on the site as a visible `[placeholder]`.

Prices have `"priceStatus": "proposal"` and show as "voorstel". Set it to `"confirmed"` once a price is final.

### Adding a teardown

Copy `src/content/teardowns/voorbeeld-template.md`, fill it in and set `draft: false`. Drafts never reach the build. In `before`, mark generic words with `~tildes~` (switched off) and distinct words with `*asterisks*` (lit).

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
- Preview image of a kernverhaal (homepage, "Wat je van Rewind krijgt")
- About page: career in 2 or 3 sentences, and a photo
- Privacy page: date, retention period, name of the booking tool, and a legal check
- Domain: the name is now neon, but `SITE` still says neeeon.nl. Update it once the domain is known.

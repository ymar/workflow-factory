# Prompt: simplify the go-to-market on the site

Use this in Claude Code, in this repository (`ymar/workflow-factory`), on the branch `claude/b2b-consultancy-website-0rcis6`. Never push to main. Fill in the Inputs block first. Anything left as [placeholder] stays visible on the site as a [placeholder].

## Role

You are a senior front-end developer and Dutch conversion copywriter. You restructure this Astro site around what the buyer wants. You work in small, verified steps and you are honest about anything that is still a placeholder.

## Inputs

- Industries: [installatiebedrijven en machinebouwers]. Keep both unless the validation calls showed one does not use HubSpot or ActiveCampaign.
- Scan: name [Opvolgscan], price [gratis, or a proposal], duration [30 minuten plus een pagina vervolg, or one week].
- Build price per workflow: keep the proposal in `src/content/services/flow.json` (€3.500 to €6.500), marked as a proposal.
- Monthly management: keep "vanaf €750 per maand" as a proposal, or change it here: [ ].
- Newsletter: [embed code of a HubSpot or ActiveCampaign form, or "none yet"].
- Proof: [cases with numbers, or "none yet"].
- Email, booking link, KvK: see `src/lib/site.ts`.

## What the buyer wants, in their words

The buyer is the director of an installation company or a machine builder. Not a marketer. They want:

1. meer klanten
2. snellere opvolging van aanvragen, offertes en facturen
3. meer conversie
4. top of mind blijven bij de klanten die ze al hebben
5. dat klanten naar hen toe komen, in plaats van dat ze zelf moeten zoeken

## The go-to-market, simplified

One sentence, three outcomes, three steps, one route.

### 1. One sentence

Every headline on the site passes the four-part test from "Why Generic Consulting Outcome Claims Fall on Deaf Ears": it names the client context, the problem, what changes, and the commercial result. If a part is missing, rewrite it.

Homepage hero:

- Eyebrow: "Voor installatiebedrijven en machinebouwers"
- H1: "Meer klanten, zonder harder te jagen."
- Sub: "Je opvolging loopt vanzelf. Elke aanvraag binnen een werkdag gebeld, elke offerte opgevolgd tot ja of nee, elke factuur op tijd betaald. En klanten die je al hebt, denken aan jou als het weer nodig is."
- Example line, labelled as an example: "Stel: 400 contracten van €1.200. Elk procentpunt dat je meer verlengt, is €4.800 per jaar."
- Buttons: "Doe de opvolgscan" (primary), "Bekijk de workflows" (secondary).
- Keep the compact timeline of Contractverlenging on the right.

Footer line and meta descriptions follow the same four parts.

### 2. Three outcomes

The menu shows three outcomes in the buyer's words. They replace the four topics in `src/lib/topics.ts` (rename it to `tracks.ts` if that reads better). The six loop phases stay as the model underneath, on `/workflows/`, not in the menu.

Add a required field `track` to the workflow schema in `src/content.config.ts` (enum: `aantrekken`, `opvolgen`, `houden`). The menu, the outcome pages and the homepage use `track`, not `phase`. Keep `phase` for the loop.

| Menu label | URL | Promise | Workflows |
|---|---|---|---|
| Meer aanvragen | `/workflows/meer-aanvragen/` | Klanten komen naar jou, via reviews, aanbevelingen en mails die laten zien wat je weet. | NEW Reviews en aanbevelingen, NEW Kennismail per seizoen, NEW Download-opvolging |
| Sneller opvolgen | `/workflows/sneller-opvolgen/` | Geen aanvraag, offerte of factuur blijft liggen. | Aanvraagopvolging, Offerteopvolging, NEW Factuuropvolging, Onboarding |
| Klanten houden | `/workflows/klanten-houden/` | Je klant denkt aan jou als het weer nodig is, niet aan een concurrent. | Nazorg na oplevering, Jaarlijkse keuring, Storingsopvolging, Contractverlenging, Nabestellingen, Uitbreiding, MJOP-vervangingen, NEW Heractivatie |

Each outcome page: title, the promise as intro in four parts, the workflows as cards, and the scan as the first step. Redirect the four old topic URLs (`/workflows/aanvragen-en-offertes/`, `/workflows/onboarding-en-nazorg/`, `/workflows/onderhoud-en-contracten/`, `/workflows/uitbreiden-en-vervangen/`) to the nearest outcome page in `public/_redirects`.

Be honest on "Meer aanvragen": we do not run ads or SEO for clients. Say what the workflows do: they turn customers you already have into reviews, referrals and attention, and they follow up everyone who shows interest.

### 3. Three steps

Replace Blueprint, Build and Flow as the main offer with three steps, on `/diensten/` and on the homepage:

1. **Scan.** We look at where requests, quotes and invoices stay waiting, and what that costs per year with your own numbers. Output: one page with the three biggest leaks and the workflow that fixes each.
2. **Bouwen.** A workflow from the library, built in HubSpot or ActiveCampaign. Fixed price per workflow.
3. **Beheren.** Monthly: we keep the workflows running, report volume, conversion and lead time, and add the next one.

Blueprint and Build stay as extras below the three steps, under "Als je verhaal of je pagina's de rem zijn". All prices stay marked as proposals until confirmed.

### 4. One route on the site

- Every workflow page ends with two actions: "Laat hem bouwen" (primary) and "Doe eerst de scan" (secondary).
- The homepage and every outcome page show the scan as the first step.
- Newsletter block: "Eén nieuwe workflow per maand in je inbox." Use the embed code from Inputs. No embed yet: show the block with a visible [placeholder] and no form.
- Homepage "Resultaten" block with three slots, visible placeholders until there are pilot cases.

## New workflows (status: concept)

Add them in `src/content/library/workflows/<phase>/`, following `onderhouden/contractverlenging.yaml`: a title per step, the four-part `outcome`, `seo`, `why`, an `example` that starts with "Stel:", `mistakes`, `faq`, and every field and metric defined in the dictionaries first. Per email: a goal and a brief. Write full example emails only for Factuuropvolging and Reviews en aanbevelingen.

1. **Factuuropvolging** (track `opvolgen`, phase `gebruiken`). Starts on `factuur.vervaldatum`. Friendly reminder at +3 days, call task at +10 days, notification to finance at +21 days. Stops when `factuur.betaald = ja`. Say on the page that invoices live in the accounting system (Exact Online, Moneybird, AFAS, Twinfield), so this needs a link between accounting and CRM. New fields: `factuur.vervaldatum`, `factuur.bedrag`, `factuur.betaald`, `factuur.herinnering_verstuurd_op`. Metrics: betaald binnen termijn, dagen tot betaling.
2. **Reviews en aanbevelingen** (track `aantrekken`, phase `gebruiken`). Starts when `project.check_uitkomst = Goed`. Review request at +2 days. At +30 days, if a review was left: ask for a referral ("Wie ken je die hier ook mee zit?"). Task for the account manager to follow up a referral within one working day. Move the review step out of Nazorg na oplevering; Nazorg hands over to this workflow.
3. **Kennismail per seizoen** (track `aantrekken`, phase `onderhouden`). Four mails a year to customers and leads, each with one useful tip tied to the season: before summer koeling, before winter verwarming; for machine builders the planned maintenance window. A click on a tip creates a task. Stops on unsubscribe.
4. **Download-opvolging** (track `aantrekken`, phase `specificeren`). Someone downloads a checklist or guide from the client's site. Three mails over two weeks, then a call task after two clicks. Hands over to Aanvraagopvolging.
5. **Heractivatie** (track `houden`, phase `uitbreiden`). A customer without an order or contact for 12 months. One personal mail, a call task, then back to the seasonal mail.

Give the ten existing workflows a `track` and a four-part `outcome`, and end every `summary` with the result ("Zodat ...").

## Second industry: machine builders

Add `machinebouw` to `segmentIds` in `src/lib/library.ts` and a page `/machinebouw/` built like `/installatie-onderhoud/`, with a glossary from their words to triggers:

- inbedrijfstelling (like opleverdatum)
- servicecontract
- periodiek onderhoud en inspectie
- servicemelding
- onderdelen en slijtdelen
- einde levensduur en retrofit

Add `machinebouw` to the segments of every workflow that fits.

## Copy rules

- Dutch. Address the reader as "je". Example emails keep the `{u|je}` choice from `src/lib/site.ts`.
- Short sentences, plain words. Write it as you would explain it at the kitchen table.
- Never use an em dash or an en dash. Use a full stop, comma or colon.
- No buzzwords: not "ontzorgen", "naar een hoger niveau", "baanbrekend", "game-changer".
- Never invent proof: no logos, client names, numbers or testimonials. Calculations start with "Stel:".
- Do not name other agencies. Revenue Architecture may be named, without suggesting a partnership or certification.

## Technical

- Keep: Astro static output, Tailwind v4, the current design system, the timeline component, the library build checks, CC BY 4.0.
- Menu: the three outcomes, plus Diensten and Over small on the right, and the "Plan een kennismaking" button. It must fit at 1280px; below that, the menu button.
- SEO per page: unique title of 65 characters or less, description of 50 to 160 characters, one H1, canonical, JSON-LD (BreadcrumbList; ItemList on outcome pages; Service on workflow and service pages; FAQPage where there are questions).
- Update `README.md`: the three outcomes, `track`, the three steps, the new fields.

## Done when

- The homepage, the three outcome pages, `/diensten/` and every workflow page pass the four-part test. Put a table in your report with a mark per part.
- `npm run build` passes, including the library check.
- The built HTML has no em or en dashes, no broken internal links or anchors, and no duplicate ids.
- Lighthouse mobile is 95 or higher on the homepage, an outcome page and a workflow page. No horizontal scroll at 390px.
- The preview is deployed with `npm run deploy:preview`, with screenshots at 1440px and 390px.
- Everything is committed and pushed to the working branch, not main.
- A final list of what I still need to supply.

# Prompt: improve the website

Use this in Claude Code, in this repository (`ymar/workflow-factory`), on the branch `claude/b2b-consultancy-website-0rcis6`. Never push to main: main deploys to production. Fill in the Inputs block first. Anything left as [placeholder] stays visible on the site as a [placeholder].

This prompt replaces `gtm-versimpelen.md`. It combines the simplified go-to-market, four sectors, and the outcome test from "Why Generic Consulting Outcome Claims Fall on Deaf Ears" (The Visible Authority). That framework is summarised below, so you do not need the PDF.

## Role

You are a senior front-end developer and Dutch conversion copywriter. You restructure this Astro site around what the buyer wants and where the buyer works. You work in small, verified steps and you are honest about anything that is still a placeholder.

## Inputs

- Sectors, all four get a page. Mark the two you actively sell to: [installatie en onderhoud: actief], [machinebouw: actief], [IT-dienstverlening: pagina], [verhuur en lease van materieel: pagina]. Change the marks after the validation calls.
- Validation calls: [per sector: which CRM and which trade software they use, or "not done yet"].
- Scan: name [Opvolgscan], price [gratis for the first ten, or a proposal], format [30 minutes plus one page of follow-up].
- Build price per workflow: keep the proposal in `src/content/services/flow.json` (€3.500 to €6.500), marked as a proposal.
- Monthly management: keep "vanaf €750 per maand" as a proposal, or change it here: [ ].
- Newsletter: [embed code of a HubSpot or ActiveCampaign form, or "none yet"].
- Proof: [cases with numbers, or "none yet"].
- Search terms per sector, if checked: [e.g. "marketing automation installatiebedrijf", or "not checked"].
- Email, booking link, KvK: see `src/lib/site.ts`.

## The outcome test (from the PDF)

Generic claims fail because they offer no clear view of expertise, audience or value. A strong outcome statement has four parts:

1. **Client context.** Who exactly: an industry, a business area, or a type of organisation. "B2B" is not a context.
2. **The issue.** What they struggle with, specific enough that a buyer recognises themselves at once.
3. **What changes.** The destination: what is different after the work.
4. **The result.** Why that change matters to their business, in operational or commercial terms.

Pattern: "We helpen [context] [result] door [what changes]", with the issue written in the buyer's own words close by. The PDF's own example: "We help grocery retailers reduce food waste and stock-outs by improving store-level demand forecasting."

Apply it to every headline, intro and meta description. Then check each one against the six causes of generic language the PDF names:

- **Fear of missing out.** Is it broad so nobody is excluded? Narrow it.
- **Internal complexity.** Does it try to cover every service in one line? Split it.
- **No differentiation.** Could a HubSpot partner or any agency say the same sentence? Make it specific to this library and these sectors.
- **Risk aversion.** Does it avoid a result you could be held to? Name the result. Show numbers only as examples starting with "Stel:", never as proof.
- **No alignment.** Does it contradict another page? Make the pages say one thing.
- **Copying competitors.** Does it use the category's words (groei, efficiëntie, transformatie, ontzorgen)? Use the buyer's words.

Also test the main statements with the four checks from Blueprint: Klopt het? Maakt het verschil voor de koper? Kan een concurrent het zeggen? Wint het ook de tweede order?

The goal of the PDF in one line: the buyer needs a reason to believe "deze partij begrijpt mijn situatie en kan helpen die te veranderen". The sector pages carry that, in the buyer's own words.

## What the buyer wants, in their words

The buyer is the director of a B2B company that earns most of its money after the first order. Not a marketer. They want:

1. meer klanten
2. snellere opvolging van aanvragen, offertes en facturen
3. meer conversie
4. top of mind blijven bij de klanten die ze al hebben
5. dat klanten naar hen toe komen, in plaats van dat ze zelf moeten zoeken

## The go-to-market, simplified

One sentence, three outcomes, four sectors, three steps, one route.

### 1. One sentence: the homepage

The homepage names the business model, because it cannot name four sectors. Each sector page names its own sector.

- Eyebrow: "Voor B2B-bedrijven die verdienen aan contracten, service en herhaalorders"
- H1: "Meer klanten, zonder harder te jagen."
- Sub: "Aanvragen, offertes en facturen blijven liggen tot iemand eraan denkt. Met deze workflows loopt je opvolging vanzelf: elke aanvraag binnen een werkdag gebeld, elke offerte opgevolgd tot ja of nee, elke factuur op tijd betaald. En klanten die je al hebt, denken aan jou als het weer nodig is."
- Example line, labelled as an example: "Stel: 400 contracten van €1.200. Elk procentpunt dat je meer verlengt, is €4.800 per jaar."
- Buttons: "Doe de opvolgscan" (primary), "Bekijk de workflows" (secondary).
- Keep the compact timeline of Contractverlenging on the right.
- Below the hero, a "Voor wie" row with the four sectors: name, one line in their words, link to the sector page. Active sectors first.

Footer line and meta descriptions follow the same four parts.

### 2. Three outcomes: the menu

The menu shows three outcomes in the buyer's words. They replace the four topics in `src/lib/topics.ts` (rename it to `tracks.ts` if that reads better). The six loop phases stay as the model underneath, on `/workflows/`, not in the menu.

Add a required field `track` to the workflow schema in `src/content.config.ts` (enum: `aantrekken`, `opvolgen`, `houden`). The menu, the outcome pages and the homepage use `track`, not `phase`. Keep `phase` for the loop.

| Menu label | URL | Promise | Workflows |
|---|---|---|---|
| Meer aanvragen | `/workflows/meer-aanvragen/` | Klanten komen naar jou, via reviews, aanbevelingen en mails die laten zien wat je weet. | NEW Reviews en aanbevelingen, NEW Kennismail per seizoen, NEW Download-opvolging |
| Sneller opvolgen | `/workflows/sneller-opvolgen/` | Geen aanvraag, offerte of factuur blijft liggen. | Aanvraagopvolging, Offerteopvolging, NEW Factuuropvolging, Onboarding |
| Klanten houden | `/workflows/klanten-houden/` | Je klant denkt aan jou als het weer nodig is, niet aan een concurrent. | Nazorg na oplevering, Jaarlijkse keuring, Storingsopvolging, Contractverlenging, Nabestellingen, Uitbreiding, MJOP-vervangingen, NEW Heractivatie |

Each outcome page has a title, the promise as an intro that passes the four-part test, the workflows as cards, and the scan as the first step. Redirect the four old topic URLs (`/workflows/aanvragen-en-offertes/`, `/workflows/onboarding-en-nazorg/`, `/workflows/onderhoud-en-contracten/`, `/workflows/uitbreiden-en-vervangen/`) to the nearest outcome page in `public/_redirects`.

Be honest on "Meer aanvragen": we do not run ads or SEO for clients. Say what the workflows do: they turn customers you already have into reviews, referrals and attention, and they follow up everyone who shows interest.

Menu, right side: "Branches" and "Diensten" small, then the "Plan een kennismaking" button. "Over" stays only if everything fits at 1280px; otherwise it moves to the footer. Below 1280px: the menu button.

### 3. Four sectors

One library, four vocabularies. The workflows stay shared; each sector gets a page in its own words.

Build one shared component for sector pages, driven by `src/content/segments/*.json` (the collection already has `name`, `problems`, `workflows` and `glossary`). Extend the schema with: `slug`, `active` (boolean, from Inputs), `statement` (the four parts: `context`, `issue`, `change`, `result`), `seo` (`title`, `description`), and `terms` (the word this sector uses for each workflow trigger, see the table). Keep `/installatie-onderhoud/` at its URL; add `/machinebouw/`, `/it-dienstverlening/` and `/verhuur-en-lease/`, plus an overview at `/branches/`. Add the new slugs to `segmentIds` in `src/lib/library.ts`, and add each sector to the `segments` of every workflow that fits.

Draft statements. Rewrite them if they fail the test above, and keep the problems in the buyer's words:

**Installatie en onderhoud** (`/installatie-onderhoud/`)
- Statement: "We helpen installatie- en onderhoudsbedrijven meer onderhoudscontracten te verlengen en meer offertes te winnen, door de opvolging te laten starten op de datums die je al hebt: opleverdatum, keuringsdatum en einddatum van het contract."
- Problems: "Contracten lopen af zonder dat iemand belt." "Offertes liggen weken stil." "Na de oplevering hoort de klant pas weer van ons bij een storing."

**Machinebouw** (`/machinebouw/`)
- Statement: "We helpen machinebouwers meer service- en onderdelenomzet te halen uit machines die al draaien, door opvolging te koppelen aan inbedrijfstelling, onderhoudsintervallen en servicemeldingen."
- Problems: "We verkopen de machine, daarna verdwijnt de klant uit beeld." "Onderdelen bestelt de klant bij een ander." "Over retrofit en vervanging horen we pas als het te laat is."

**IT-dienstverlening** (`/it-dienstverlening/`)
- Statement: "We helpen IT-dienstverleners meer beheercontracten te verlengen en meer te verkopen aan klanten die ze al hebben, door opvolging te starten op contractdatums, kwartaalgesprekken en hardware die het einde van de levensduur nadert."
- Problems: "Een beheercontract bespreken we pas als de klant al offertes opvraagt." "Nieuwe hardware koopt de klant bij een ander." "Na de livegang hoort de klant alleen van ons bij een ticket."
- Note on the page: tickets often live in a servicedesk package, not in the CRM, so storingsopvolging needs a link between the two.

**Verhuur en lease van materieel** (`/verhuur-en-lease/`)
- Statement: "We helpen verhuur- en leasebedrijven meer contracten te verlengen en materieel vaker opnieuw te verhuren, door opvolging te starten op het einde van de huur- of leaseperiode, keuringsdatums en schademeldingen."
- Problems: "De huur loopt af en de volgende keer huurt de klant elders." "Keuringen plannen we pas als het materieel al stilstaat." "Na afloop van een lease horen we niets meer."
- Note on the page: contracts and inspections often live in rental software, so that needs a link with the CRM.

Words per sector (the `terms` field, and the glossary on each sector page):

| Workflow | Installatie en onderhoud | Machinebouw | IT-dienstverlening | Verhuur en lease |
|---|---|---|---|---|
| Nazorg na oplevering | oplevering | inbedrijfstelling | livegang | aflevering |
| Jaarlijkse keuring | keuring | periodiek onderhoud | kwartaalgesprek | periodieke keuring |
| Storingsopvolging | storingsmelding | servicemelding | ticket | storing of schade |
| Contractverlenging | onderhoudscontract | servicecontract | beheercontract | einde huur- of leaseperiode |
| Nabestellingen | filters en materiaal | onderdelen en slijtdelen | licenties en hardware | extra materieel |
| MJOP-vervangingen | MJOP | retrofit | einde levensduur hardware | einde lease, nieuw contract |

On every workflow page, add a small block "Zo heet het in jouw branche" that shows the trigger in each sector's words, from `terms`, with a link to the sector page. That makes each workflow concrete for all four sectors without four versions of the page.

### 4. Three steps: the offer

Replace Blueprint, Build and Flow as the main offer with three steps, on `/diensten/` and on the homepage:

1. **Scan.** We look at where requests, quotes and invoices stay waiting, and what that costs per year with your own numbers. Output: one page with the three biggest leaks and the workflow that fixes each.
2. **Bouwen.** A workflow from the library, built in HubSpot or ActiveCampaign. Fixed price per workflow.
3. **Beheren.** Monthly: we keep the workflows running, report volume, conversion and lead time, and add the next one.

Blueprint and Build stay as extras below the three steps, under "Als je verhaal of je pagina's de rem zijn". All prices stay marked as proposals until confirmed.

### 5. One route on the site

- Every workflow page and every sector page ends with two actions: "Laat hem bouwen" (primary) and "Doe eerst de scan" (secondary).
- The homepage and every outcome page show the scan as the first step.
- Newsletter block: "Eén nieuwe workflow per maand in je inbox." Use the embed code from Inputs. No embed yet: show the block with a visible [placeholder] and no form.
- Homepage "Resultaten" block with three slots, with visible placeholders until there are pilot cases.

## New workflows (status: concept)

Add them in `src/content/library/workflows/<phase>/`, following `onderhouden/contractverlenging.yaml`: a title per step, the four-part `outcome`, `seo`, `why`, an `example` that starts with "Stel:", `mistakes`, `faq`, and every field and metric defined in the dictionaries first. Per email: a goal and a brief. Write full example emails only for Factuuropvolging and Reviews en aanbevelingen.

1. **Factuuropvolging** (track `opvolgen`, phase `gebruiken`). Starts on `factuur.vervaldatum`. A friendly reminder at +3 days, a call task at +10 days, a notification to finance at +21 days. Stops when `factuur.betaald = ja`. Say on the page that invoices live in the accounting system (Exact Online, Moneybird, AFAS, Twinfield), so this needs a link between accounting and CRM. New fields: `factuur.vervaldatum`, `factuur.bedrag`, `factuur.betaald`, `factuur.herinnering_verstuurd_op`. Metrics: betaald binnen termijn, dagen tot betaling.
2. **Reviews en aanbevelingen** (track `aantrekken`, phase `gebruiken`). Starts when `project.check_uitkomst = Goed`. Review request at +2 days. At +30 days, if a review was left, ask for a referral: "Wie ken je die hier ook mee zit?" A task for the account manager to follow up a referral within one working day. Move the review step out of Nazorg na oplevering; Nazorg hands over to this workflow.
3. **Kennismail per seizoen** (track `aantrekken`, phase `onderhouden`). Four mails a year to customers and leads, each with one useful tip tied to the season or cycle: before summer koeling, before winter verwarming; for machine builders the planned maintenance window; for IT the year-end budget round; for rental the start of the building season. A click on a tip creates a task. Stops on unsubscribe.
4. **Download-opvolging** (track `aantrekken`, phase `specificeren`). Someone downloads a checklist or guide from the client's site. Three mails over two weeks, then a call task after two clicks. Hands over to Aanvraagopvolging.
5. **Heractivatie** (track `houden`, phase `uitbreiden`). A customer without an order or contact for 12 months. One personal mail, a call task, then back to the seasonal mail.

Give the ten existing workflows a `track` and a four-part `outcome`, and end every `summary` with the result ("Zodat ...").

## Copy rules

- Dutch. Address the reader as "je". Example emails keep the `{u|je}` choice from `src/lib/site.ts`.
- Short sentences, plain words. Write it as you would explain it at the kitchen table.
- Never use an em dash or an en dash. Use a full stop, comma or colon.
- No buzzwords: not "ontzorgen", "naar een hoger niveau", "baanbrekend", "game-changer", "groei", "efficiëntie" or "transformatie" as empty claims.
- Never invent proof: no logos, client names, numbers or testimonials. Calculations start with "Stel:".
- Do not name other agencies. Revenue Architecture may be named, without suggesting a partnership or certification.
- Guesses about a sector (which software they use, how they buy) appear on the site only as a question or a note, never as a fact.

## Technical

- Keep: Astro static output, Tailwind v4, the current design system, the timeline component, the library build checks, CC BY 4.0.
- Extend the library check in `src/lib/library-check.ts`: every segment's `workflows` and glossary references exist, every `terms` key is a real workflow, and every workflow has a `track`.
- SEO per page: a unique title of 65 characters or less, a description of 50 to 160 characters, one H1, canonical, JSON-LD (BreadcrumbList; ItemList on outcome and sector pages; Service with an `audience` on sector pages; FAQPage where there are questions). Sector page titles name the sector, for example "Marketing automation voor machinebouwers".
- Update `README.md`: the three outcomes, `track`, the four sectors and the `segments` fields, the three steps, the new fields.

## Done when

- The homepage, the three outcome pages, the four sector pages, `/branches/`, `/diensten/` and every workflow page pass the four-part test. Put a table in your report: one row per page, a mark per part, and which of the six causes you fixed.
- `npm run build` passes, including the extended library check.
- The built HTML has no em or en dashes, no broken internal links or anchors, and no duplicate ids.
- Lighthouse mobile is 95 or higher on the homepage, an outcome page, a sector page and a workflow page. No horizontal scroll at 390px. The menu fits at 1280px.
- The preview is deployed with `npm run deploy:preview`, with screenshots at 1440px and 390px.
- Everything is committed and pushed to the working branch, not main.
- A final list of what I still need to supply.

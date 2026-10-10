// The library's three outcomes: what the menu shows. Each one is what the buyer wants, in their words.
// The six phases of the loop (src/lib/loop.ts) stay underneath as the model, on /workflows/.
export const trackIds = ['aantrekken', 'opvolgen', 'houden'] as const;
export type TrackId = (typeof trackIds)[number];

export interface Track {
  id: TrackId;
  // URL part: /workflows/<slug>/
  slug: string;
  name: string;
  promise: string;
  // The outcome in four parts, same as a workflow and a sector.
  statement: { context: string; issue: string; change: string; result: string };
  intro: string;
  // Said on the page so nobody expects more than the workflows do.
  honest?: string;
  seo: { title: string; description: string };
}

export const tracks: Track[] = [
  {
    id: 'aantrekken',
    slug: 'meer-aanvragen',
    name: 'Meer aanvragen',
    promise: 'Klanten komen naar jou, via reviews, aanbevelingen en mails die laten zien wat je weet.',
    statement: {
      context: 'B2B-bedrijven die verdienen aan contracten, service en herhaalorders',
      issue: 'Tevreden klanten vertellen het zelden door, en wie een checklist downloadt hoort daarna niets meer.',
      change: 'Op het juiste moment vragen om een review en een aanbeveling, elk seizoen een nuttige mail sturen en iedereen opvolgen die interesse toont.',
      result: 'Meer aanvragen van mensen die je al kennen of die al naar je keken.',
    },
    intro:
      'Tevreden klanten vertellen het zelden door. En wie een checklist downloadt, hoort daarna niets meer. Deze workflows vragen op het juiste moment om een review en een aanbeveling, sturen elk seizoen een mail met een nuttige tip en volgen iedereen op die interesse toont. Zodat er meer aanvragen binnenkomen van mensen die je al kennen.',
    honest: 'We draaien geen advertenties of zoekmachineoptimalisatie voor klanten. Deze workflows maken van klanten en contacten die je al hebt reviews, aanbevelingen en aandacht.',
    seo: {
      title: 'Meer aanvragen: reviews en aanbevelingen',
      description: 'Workflows die van klanten die je al hebt reviews, aanbevelingen en aanvragen maken. Met voorbeeldmails, stappen en CRM-velden voor HubSpot en ActiveCampaign.',
    },
  },
  {
    id: 'opvolgen',
    slug: 'sneller-opvolgen',
    name: 'Sneller opvolgen',
    promise: 'Geen aanvraag, offerte of factuur blijft liggen.',
    statement: {
      context: 'B2B-bedrijven die verdienen aan contracten, service en herhaalorders',
      issue: 'Aanvragen, offertes en facturen blijven liggen tot iemand eraan denkt.',
      change: 'Elke aanvraag binnen een werkdag bellen, elke offerte opvolgen tot ja of nee en elke factuur op tijd herinneren.',
      result: 'Sneller omzet binnen, en minder werk dat naar wie eerder belt.',
    },
    intro:
      'Aanvragen, offertes en facturen blijven liggen tot iemand eraan denkt. Deze workflows bellen elke aanvraag binnen een werkdag, volgen elke offerte op tot ja of nee en sturen elke factuur op tijd een herinnering. Zodat je sneller omzet binnen hebt en minder werk verliest aan wie eerder belt.',
    seo: {
      title: 'Opvolgen: aanvragen, offertes en facturen',
      description: 'Workflows die elke aanvraag binnen een werkdag laten bellen, offertes opvolgen tot ja of nee en facturen op tijd herinneren. Voor HubSpot en ActiveCampaign.',
    },
  },
  {
    id: 'houden',
    slug: 'klanten-houden',
    name: 'Klanten houden',
    promise: 'Je klant denkt aan jou als het weer nodig is, niet aan een concurrent.',
    statement: {
      context: 'B2B-bedrijven die verdienen aan contracten, service en herhaalorders',
      issue: 'Contracten lopen af, keuringen worden vergeten en nabestellingen gaan naar een ander.',
      change: 'Opvolging laten starten op datums die je al hebt: oplevering, keuring, einddatum van het contract en laatste bestelling.',
      result: 'Klanten die verlengen, nabestellen en uitbreiden bij jou.',
    },
    intro:
      'Contracten lopen af, keuringen worden vergeten en nabestellingen gaan naar een ander. Deze workflows starten op de datums die je al hebt: oplevering, keuring, einddatum van het contract en laatste bestelling. Zodat je klanten bij jou verlengen, nabestellen en uitbreiden.',
    seo: {
      title: 'Klanten houden: verlengen en terugkomen',
      description: 'Workflows voor contractverlenging, keuringen, nazorg en nabestellingen. Zodat klanten bij jou blijven. Met stappen, voorbeeldmails en CRM-velden.',
    },
  },
];

export const trackOf = (id: string) => tracks.find((t) => t.id === id)!;
export const trackHref = (t: Track) => `/workflows/${t.slug}/`;

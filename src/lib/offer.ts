// The offer in three steps. Prices are proposals until the owner confirms them.
// The price of a workflow lives in src/content/services/flow.json.
export const scan = {
  name: 'Opvolgscan',
  slug: '/opvolgscan/',
  // A proposal: free for the first ten companies, then to be priced.
  price: 'Gratis voor de eerste tien bedrijven',
  priceStatus: 'proposal' as const,
  format: '30 minuten gesprek en een pagina met de opvolging',
  minutes: 30,
};

export const monthly = { label: 'Beheer per maand', from: 750, priceStatus: 'proposal' as const };

export const steps = [
  {
    id: 'scan',
    n: '1',
    name: 'Scan',
    href: scan.slug,
    summary: 'We kijken waar aanvragen, offertes en facturen blijven liggen, en wat dat per jaar kost met je eigen cijfers.',
    output: 'Eén pagina met de drie grootste lekken en de workflow die elk lek dicht.',
  },
  {
    id: 'bouwen',
    n: '2',
    name: 'Bouwen',
    href: '/flow/',
    summary: 'Een workflow uit de bibliotheek, gebouwd in HubSpot of ActiveCampaign.',
    output: 'Een vaste prijs per workflow.',
  },
  {
    id: 'beheren',
    n: '3',
    name: 'Beheren',
    href: '/diensten/#beheren',
    summary: 'Elke maand houden we de workflows draaiende, melden we volume, conversie en doorlooptijd, en voegen we de volgende toe.',
    output: 'Een vast bedrag per maand.',
  },
] as const;

// Who this is not for. A strong claim lets the wrong buyer rule themselves out.
export const notFor = [
  'Je hebt geen CRM, of de datums (einde van het contract, oplevering, keuring) staan er niet in. Dan start geen enkele workflow.',
  'Je verdient vooral aan eenmalige verkoop, zonder contracten of herhaalorders.',
  'Je verkoopt vooral aan consumenten.',
  'Je werkt in Salesforce. We bouwen alleen in HubSpot en ActiveCampaign.',
  'Je wilt meer leads via advertenties of zoekmachineoptimalisatie. Dat doen we niet.',
];

// Who it is for. A placeholder shows where a threshold still has to be decided.
export const isFor = [
  { text: 'Je bent een installatie- of onderhoudsbedrijf met onderhoudscontracten die elk jaar verlengd moeten worden.' },
  { before: 'Je hebt minstens', placeholder: 'minimaal aantal contracten', after: 'contracten met een einddatum in je systeem.' },
  { text: 'Je werkt in HubSpot of ActiveCampaign, of je wilt daarheen.' },
  { text: 'Je wilt dat de opvolging loopt zonder dat je er elke week aan hoeft te denken.' },
] as { text?: string; before?: string; placeholder?: string; after?: string }[];

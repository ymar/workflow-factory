// How the library maps onto each platform. This is a build proposal, not a promise about a specific account:
// packages and features differ per account and change over time.
export const platforms = {
  hubspot: {
    name: 'HubSpot',
    seoTitle: 'HubSpot workflow voorbeelden voor B2B',
    description: 'HubSpot workflows voor B2B-opvolging, van aanvraag tot factuur en contractverlenging. Met per workflow het object, de trigger, de stappen en de CRM-velden.',
    headline: 'HubSpot workflows voor B2B.',
    accent: 'Voorbeelden, klaar om te bouwen.',
    intro: 'Elke workflow uit de bibliotheek, vertaald naar HubSpot: op welk object hij draait, hoe hij start en welke bouwstenen je gebruikt.',
    caveat: 'Workflows vragen in HubSpot meestal een Professional-pakket, custom objects een Enterprise-pakket. Controleer wat jouw pakket kan: HubSpot past dit regelmatig aan.',
    objects: {
      aanvraag: 'Contact', klant: 'Bedrijf', contact: 'Contact', afzender: 'Eigenaar van het record (gebruiker)', offerte: 'Deal', project: 'Deal in een projectpijplijn, of een custom object',
      installatie: 'Custom object', contract: 'Custom object, of een deal in een contractpijplijn', keuring: 'Custom object',
      storing: 'Ticket', bestelling: 'Deal, of gegevens uit een koppeling met je ERP', mjop: 'Custom object', factuur: 'Custom object, of gegevens uit een koppeling met je boekhouding',
    } as Record<string, string>,
    blocks: [
      ['Start op een datum (at)', 'Een workflow die start op basis van een datumveld, bijvoorbeeld 90 dagen voor de einddatum.'],
      ['Start bij een wijziging (on)', 'Een inschrijftrigger op een eigenschap, bijvoorbeeld zodra de dealfase Gewonnen wordt.'],
      ['Wachten (after)', 'Een vertraging, of een vertraging tot een datum.'],
      ['Alleen als (if)', 'Een if/then-tak op een eigenschap.'],
      ['E-mail', 'Een marketing-e-mail of een sales-e-mail vanuit de eigenaar.'],
      ['Taak', 'Een taak voor de eigenaar van het record, met een vervaldatum.'],
      ['Melding', 'Een interne melding of interne e-mail.'],
      ['Legt vast (sets)', 'Een eigenschap instellen.'],
    ],
    faq: [
      { q: 'Heb ik HubSpot Professional nodig?', a: 'Voor de meeste workflows wel. Met Starter kun je een deel nabouwen, maar niet alle stappen en takken. Controleer wat jouw pakket kan.' },
      { q: 'Wat als ik geen custom objects heb?', a: 'Dan zet je de belangrijkste datum op een object dat je wel hebt, bijvoorbeeld de einddatum van een contract als eigenschap op het bedrijf of op een deal. Minder netjes, maar het werkt.' },
    ],
  },
  activecampaign: {
    name: 'ActiveCampaign',
    seoTitle: 'ActiveCampaign automations voor B2B',
    description: 'ActiveCampaign automations voor B2B-opvolging, van aanvraag tot factuur en contractverlenging. Met per automation het object, de trigger en de CRM-velden.',
    headline: 'ActiveCampaign automations voor B2B.',
    accent: 'Voorbeelden, klaar om te bouwen.',
    intro: 'Elke workflow uit de bibliotheek, vertaald naar ActiveCampaign: waar de gegevens staan, hoe de automation start en welke stappen je gebruikt.',
    caveat: 'Custom objects en sommige triggers zitten niet in elk ActiveCampaign-pakket. Controleer wat jouw pakket kan.',
    objects: {
      aanvraag: 'Contact', klant: 'Account', contact: 'Contact', afzender: 'Eigenaar van de deal of het contact (gebruiker)', offerte: 'Deal', project: 'Deal in een projectpijplijn',
      installatie: 'Custom object', contract: 'Custom object, of een deal in een contractpijplijn', keuring: 'Custom object',
      storing: 'Deal in een servicepijplijn', bestelling: 'Bestelgegevens uit een koppeling met je webshop of ERP', mjop: 'Custom object', factuur: 'Deal, of gegevens uit een koppeling met je boekhouding',
    } as Record<string, string>,
    blocks: [
      ['Start op een datum (at)', 'Een automation met een datumtrigger op een datumveld.'],
      ['Start bij een wijziging (on)', 'Een automation die start bij een veldwijziging of een nieuwe dealfase.'],
      ['Wachten (after)', 'Een wachtstap, voor een vaste tijd of tot aan een voorwaarde.'],
      ['Alleen als (if)', 'Een als/anders-stap.'],
      ['E-mail', 'Een e-mail aan het contact.'],
      ['Taak', 'Een taak op de deal, voor de eigenaar.'],
      ['Melding', 'Een notificatie-e-mail aan een collega.'],
      ['Legt vast (sets)', 'Een veld bijwerken.'],
    ],
    faq: [
      { q: 'Kan ActiveCampaign met datums van buiten werken?', a: 'Ja, als de datum in een veld staat. Komt hij uit je planning of ERP, dan heb je een koppeling nodig die dat veld vult.' },
      { q: 'Waar zet ik installaties en contracten?', a: 'In een custom object als je pakket dat heeft. Anders als deal in een eigen pijplijn, met de datums als velden op de deal.' },
    ],
  },
} as const;

export type PlatformId = keyof typeof platforms;

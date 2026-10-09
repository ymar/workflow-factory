// Journey status: how far a journey has been tested in practice. Shown on every card and journey page.
export const statusLabel = {
  concept: { label: 'Concept', text: 'Ontworpen, nog niet bij een klant gebouwd.', style: 'border-paper/30 text-paper/80' },
  getest: { label: 'Getest', text: 'Gebouwd en live bij een klant.', style: 'border-sage text-sage' },
  bewezen: { label: 'Bewezen', text: 'Live, met gemeten resultaat.', style: 'border-mint text-mint' },
} as const;

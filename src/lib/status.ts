// Workflow status: how far a workflow has been tested in practice. Shown on every card and workflow page.
export const statusLabel = {
  concept: { label: 'Concept', text: 'Ontworpen, nog niet bij een klant gebouwd.', style: 'border-fg/30 text-fg/80' },
  getest: { label: 'Getest', text: 'Gebouwd en live bij een klant.', style: 'border-muted text-muted' },
  bewezen: { label: 'Bewezen', text: 'Live, met gemeten resultaat.', style: 'border-accent text-accent' },
} as const;

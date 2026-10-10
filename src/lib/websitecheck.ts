// The ten checks of the Website check, in the rubric of docs/websitecheck-rubric.md (version 0.1).
export const checks = [
  { n: 1, name: 'Klantcontext', ask: 'Zegt je kop voor welke branche of welk bedrijfstype je werkt?', how: 'Taalmodel' },
  { n: 2, name: 'Probleem', ask: 'Herkent de bezoeker zijn probleem, in zijn eigen woorden?', how: 'Taalmodel' },
  { n: 3, name: 'Wat verandert', ask: 'Staat er wat er anders is nadat je hebt geholpen?', how: 'Taalmodel' },
  { n: 4, name: 'Resultaat', ask: 'Is het resultaat zakelijk en concreet?', how: 'Taalmodel' },
  { n: 5, name: 'Generieke taal', ask: 'Hoeveel holle woorden staan er per 100 woorden?', how: 'Geteld' },
  { n: 6, name: 'Kan een concurrent dit zeggen?', ask: 'Is je zin specifiek voor jou?', how: 'Taalmodel, als schatting' },
  { n: 7, name: 'Bewijs', ask: 'Zijn er cijfers, cases of citaten met een naam?', how: 'Geteld en taalmodel' },
  { n: 8, name: 'Pad', ask: 'Staat er wat de volgende stap is, en wat daarna gebeurt?', how: 'Geteld' },
  { n: 9, name: 'Uitsluiten', ask: 'Staat er voor wie het niet is?', how: 'Taalmodel' },
  { n: 10, name: 'Opvolgsignalen', ask: 'Is er een actieknop, een reactietijd of een manier om in beeld te blijven?', how: 'Geteld' },
] as const;

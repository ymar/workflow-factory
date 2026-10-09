// The loop: six phases, seen from the customer, each with its own kind of revenue.
// Taken over from the earlier site version (LoopDiagram). Leak lines are adapted to installation and maintenance.
export const phases = [
  { id: 'specificeren', name: 'Specificeren', revenue: 'nog geen omzet', leak: 'Je zit pas aan tafel als de vraag al vastligt, vaak dankzij een ander.' },
  { id: 'kiezen', name: 'Kiezen', revenue: 'eenmalig', leak: 'Je verhaal klinkt als dat van je concurrent, dus beslist de prijs.' },
  { id: 'gebruiken', name: 'Gebruiken', revenue: 'herhaalomzet', leak: 'Na de oplevering hoort de klant niets meer, tot er iets kapot is.' },
  { id: 'onderhouden', name: 'Onderhouden', revenue: 'contractomzet', leak: 'Contracten en keuringen verlopen zonder dat iemand het merkt.' },
  { id: 'uitbreiden', name: 'Uitbreiden', revenue: 'uitbreiding', leak: 'Niemand weet wat er bij welke klant staat, dus uitbreidingen gaan naar wie er toevallig is.' },
  { id: 'vervangen', name: 'Vervangen', revenue: 'gewonnen of verloren', leak: 'Na tien tot twintig jaar is de relatie afgekoeld en begint de offerteronde opnieuw.' },
] as const;

export type PhaseId = (typeof phases)[number]['id'];
export const phaseIds = phases.map((p) => p.id) as [PhaseId, ...PhaseId[]];
export const phaseById = (id: string) => phases.find((p) => p.id === id)!;

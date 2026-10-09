// The library's topics: what the menu shows. Each topic groups one or two phases of the loop (src/lib/loop.ts).
import type { PhaseId } from './loop';

export interface Topic {
  id: string;
  name: string;
  phases: PhaseId[];
  intro: string;
  seo: { title: string; description: string };
}

export const topics: Topic[] = [
  {
    id: 'aanvragen-en-offertes',
    name: 'Aanvragen en offertes',
    phases: ['specificeren', 'kiezen'],
    intro: 'Van de eerste aanvraag tot een ja of nee op de offerte. Hier lekt nieuwe omzet weg: een aanvraag die een dag blijft liggen, een offerte die niemand opvolgt.',
    seo: {
      title: 'Workflows voor aanvragen en offertes',
      description: 'Marketing automation workflows voor B2B-aanvragen en offertes: bellen binnen een werkdag, vaste opvolging tot ja of nee, met voorbeeldmails en CRM-velden.',
    },
  },
  {
    id: 'onboarding-en-nazorg',
    name: 'Onboarding en nazorg',
    phases: ['gebruiken'],
    intro: 'De eerste maanden na de opdracht. Hier bepaal je of een klant terugkomt: een goede start, nazorg na de oplevering en nabestellingen op het moment dat de klant iets nodig heeft.',
    seo: {
      title: 'Workflows voor onboarding en nazorg',
      description: 'Workflows voor B2B-onboarding, nazorg na oplevering en nabestellingen. Met trigger, stappen, voorbeeldmails en de CRM-velden die je nodig hebt.',
    },
  },
  {
    id: 'onderhoud-en-contracten',
    name: 'Onderhoud en contracten',
    phases: ['onderhouden'],
    intro: 'Keuringen, storingen en contracten die elk jaar terugkomen. Dit is omzet die je al had, en die verdwijnt als niemand op tijd belt.',
    seo: {
      title: 'Workflows voor onderhoud en contracten',
      description: 'Workflows voor contractverlenging, jaarlijkse keuringen en storingsopvolging. Met tijdlijn, voorbeeldmails en de CRM-velden voor HubSpot en ActiveCampaign.',
    },
  },
  {
    id: 'uitbreiden-en-vervangen',
    name: 'Uitbreiden en vervangen',
    phases: ['uitbreiden', 'vervangen'],
    intro: 'Een tweede dienst bij een klant die je al hebt, en vervangingen die je ziet aankomen. Wie hier op tijd is, hoeft niet te concurreren met wie er toevallig is.',
    seo: {
      title: 'Workflows voor uitbreiden en vervangen',
      description: 'Workflows voor uitbreiding bij bestaande klanten en geplande vervangingen uit het MJOP. Met trigger, stappen, voorbeeldmails en CRM-velden.',
    },
  },
];

export const topicOf = (phase: string) => topics.find((t) => (t.phases as string[]).includes(phase))!;
export const topicHref = (t: Topic) => `/workflows/${t.id}/`;

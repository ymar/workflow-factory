# Plan: een automatisch websiterapport als lead magnet

**Besluiten (10 oktober 2026):** optie B (met opvolgdeel), brede doelgroep, naam "Website check". Het platform voor e-mail en opvolging (HubSpot of ActiveCampaign) en de juridische toets zijn nog open. Fase 0 is gedaan: zie `websitecheck-fase0.md`. De rubric staat in `websitecheck-rubric.md`.

Doel: een bezoeker vult de URL van zijn website en zijn e-mailadres in, en krijgt automatisch een rapport met tips over hoe helder zijn site is. Dit plan beschrijft wat het rapport meet, hoe je het bouwt, wat het kost aan risico en wat ik van jou nodig heb. Er is nog niets gebouwd.

## Eerst een eerlijke vraag: past dit bij je aanbod?

Een rapport over de helderheid van een site trekt mensen met een onduidelijk verhaal aan. Jouw aanbod nu is opvolging voor installatie- en onderhoudsbedrijven. Dat is een ander probleem. Als het rapport alleen "je tekst is vaag" zegt, verzamel je leads voor Blueprint (positionering), niet voor de scan.

Daarom twee opties:

- **A. Rapport als ingang voor Blueprint.** Past bij het onderdeel "extra" van je aanbod, maar niet bij je wedge. Je trekt leads die je niet actief verkoopt.
- **B. Rapport met een opvolgdeel (mijn voorstel).** Het rapport meet helderheid én signalen van opvolging op de site: is er een duidelijke volgende stap, een reactietijd, een bevestiging na het formulier, een nieuwsbrief, bewijs van tevreden klanten. Het laatste deel koppelt naar de opvolgscan. Zo past de lead bij je wedge.

Mijn advies is B. Zonder dat deel krijg je veel downloads en weinig gesprekken.

## Wat het rapport meet

Tien controles, elk 0, 1 of 2 punten. De eerste zes komen uit de uitkomsttest en de zes oorzaken van generieke taal, de laatste vier uit Probleem, bewijs, pad en uit opvolging.

| # | Controle | Hoe je het meet |
|---|---|---|
| 1 | Klantcontext: noemt de kop een branche of bedrijfstype, geen "B2B-bedrijven"? | Taalmodel op kop en intro, met een lijst van te brede woorden |
| 2 | Probleem in de woorden van de koper | Taalmodel |
| 3 | Wat verandert er? | Taalmodel |
| 4 | Resultaat in zakelijke termen, zonder lege woorden | Regels (lijst met holle woorden: groei, efficiëntie, transformatie, ontzorgen) plus taalmodel |
| 5 | Generieke taal: hoeveel holle woorden per 100 woorden? | Regels, telbaar en controleerbaar |
| 6 | Kan een concurrent dit zeggen? | Taalmodel, als schatting, niet als feit |
| 7 | Bewijs: cijfers, cases, citaten, en zijn ze herkenbaar toegeschreven? | Regels (cijfers, "case", citaten) plus taalmodel |
| 8 | Pad: staat er wat er na de aanvraag gebeurt, wat het kost of duurt? | Regels op knoppen, formulierteksten en stappen |
| 9 | Uitsluiten: staat er voor wie het niet is? | Taalmodel |
| 10 | Opvolgsignalen: reactietijd, boekingslink, nieuwsbrief, review | Regels |

Score per controle, een totaal op 20, de drie belangrijkste verbeteringen en per verbetering een concreet voorbeeld.

## Wat de bezoeker krijgt

- Een webpagina met een onraadbare link (en per e-mail), later ook een pdf.
- **"Dit zegt je homepage in vijf seconden":** één zin, uit hun eigen tekst, naast de vraag: is dit wat je wilt zeggen?
- De score per controle, met de letterlijke zin uit hun site als bewijs.
- Een voorstel voor een nieuwe kop in de vier delen (context, probleem, verandering, resultaat), met de lege plekken zichtbaar als die uit hun tekst niet te halen zijn. Altijd gelabeld als voorstel.
- Een korte slotsectie: "Wat gebeurt er na je aanvraag?" met de link naar de opvolgscan.

Het rapport belooft niets over conversie. Het is een geautomatiseerde eerste lezing, geen audit. Dat staat erin.

## Hoe je het bouwt

De site is statisch (Astro op Cloudflare Workers). Dat past, want een Worker kan de rest doen.

1. **Formulier** op een pagina `/websitecheck/`: URL, e-mailadres, toestemming. Met Cloudflare Turnstile tegen misbruik.
2. **Worker** haalt de pagina op. Beveiliging is hier het belangrijkste: alleen http en https, geen interne adressen (bescherming tegen SSRF), maximale grootte en tijd, respecteer robots.txt, één pagina per aanvraag.
3. **Analyse** in twee lagen. Eerst regels (tellen, patronen, lijsten): snel, gratis en controleerbaar. Dan een taalmodel via de Claude API met een vaste rubric en een JSON-schema als antwoord. Het model mag alleen citeren uit de tekst die het kreeg en moet de zin noemen waarop het een oordeel baseert.
4. **Opslag** van het resultaat in R2 of KV, met een vervaldatum (bijvoorbeeld 30 dagen).
5. **Rapportpagina** en e-mail. Het rapport komt per e-mail, zodat het e-mailadres bevestigd is (dubbele opt-in).
6. **Opvolging** loopt via HubSpot of ActiveCampaign: het adres komt in jouw eigen workflow Download-opvolging. Dat is ook je eerste echte test van die workflow.
7. **Metingen:** aanvragen, verzonden rapporten, geopend, klik naar de scan, gesprekken. Die staan al in de bibliotheek (`downloads_per_maand`, `download_naar_gesprek`).

Faseren:

- **Fase 0, zonder code (een dag):** draai 10 echte sites met de rubric handmatig door een taalmodel. Doel: is het rapport bruikbaar, wat vinden de ontvangers, welke controles zijn onbetrouwbaar? Dit bepaalt of fase 1 de moeite waard is.
- **Fase 1 (circa een week):** formulier, Worker, regels en taalmodel, webrapport, e-mail, koppeling met je CRM.
- **Fase 2:** pdf, een eigen overzicht met de resultaten, en de twee beste controles verfijnen.

## Risico's en wat je moet beslissen

- **Privacy (AVG).** Je verwerkt een e-mailadres en de inhoud van een website. Je hebt een grondslag nodig (toestemming), een bijgewerkte privacypagina en een overzicht van verwerkers (Cloudflare, Anthropic, je e-mailplatform). Laat dit juridisch toetsen vóór de lancering. Op de privacypagina staat nu al een placeholder voor een juridische check.
- **Kwaliteit.** Een taalmodel kan een zin verkeerd lezen of een oordeel verzinnen. Daarom: citeren verplicht, regels waar het kan, en een duidelijk label "automatische eerste lezing".
- **Misbruik.** Mensen kunnen sites van anderen laten analyseren of de Worker belasten. Turnstile, limieten per IP en per e-mailadres, en geen interne adressen.
- **Kosten.** Elk rapport kost een aanroep van het taalmodel. Het bedrag per rapport is mijn schatting en hangt af van het model en de paginalengte. Meet het in fase 0, en zet een daglimiet.
- **Beperkingen.** Pagina's die alleen met JavaScript renderen, pagina's achter een login en andere talen dan Nederlands en Engels. Fase 1 zegt dat eerlijk in het rapport. Voor JavaScript-sites kun je Cloudflare Browser Rendering gebruiken, tegen extra kosten.

## Wat ik van jou nodig heb

1. Kies A (Blueprint-ingang) of B (met opvolgdeel). Mijn advies: B.
2. Voor wie is het rapport: installatie- en onderhoudsbedrijven, of breder? Dat bepaalt de rubric en de voorbeeldzinnen.
3. Naam voor het rapport. Niet "scan", want die is al van de opvolgscan. Voorstel: "Websitecheck".
4. Welk platform voor e-mail en opvolging: HubSpot of ActiveCampaign.
5. Akkoord voor een dag fase 0 met 10 echte sites. Wie levert de sites? Je mag ook sites uit je netwerk (met toestemming) of mijn zoekopdracht gebruiken.
6. Wie doet de juridische toets?

## Volgorde

Fase 0 eerst. Als het rapport bij 10 sites bruikbare, correcte tips geeft, bouw ik fase 1. Zo niet, dan weet je dat voordat je een week bouwt.

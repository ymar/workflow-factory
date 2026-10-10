# Website check, fase 0: de proef op 10 homepages

Gedaan op 10 oktober 2026. Ik haalde tien publieke Nederlandse bedrijfshomepages op (verhuur van materieel, IT-dienstverlening, installatietechniek, machinebouw en machineonderdelen), las ze met de rubric (`websitecheck-rubric.md`) en keek welke controles een script betrouwbaar kan doen. De sites zijn bewust anoniem gehouden: het gaat om de methode, niet om de bedrijven.

**Beperkingen.** Eén lezing door één beoordelaar (ik). Tien homepages is geen representatieve steekproef. Of een taalmodel bij herhaling dezelfde score geeft, is nog niet getest.

## Scores

| Site | Branche | Totaal /20 | Opvallend |
|---|---|---|---|
| 1 | IT | 15 | Doelgroep (mkb) in de titel, concrete problemen als koppen, prijsvraag en "Plan een gesprek" |
| 2 | Verhuur | 9 | Koppen noemen een concreet probleem (stroomnet op de bouwplaats), maar het resultaat blijft vaag |
| 3 | IT | 8 | Concreet probleem in de tekst (datalek), kop is generiek ("veilig en efficiënt") |
| 4 | Machinebouw | 6 | Heldere niche (boomkwekerij), maar kop is "Welkom bij" |
| 5 | Machinebouw | 6 | Veel bewijs (projecten, kennisartikelen), kop is "Exceeding standards." |
| 6 | Installatietechniek | 5 | Genoemde referenties, kop is "Toekomstbestendige oplossingen" |
| 7 | Machineonderdelen | 5 | Eén zin kop, weinig tekst (299 woorden) |
| 8 | Verhuur | 4 | Alleen een zoekmenu en een slogan als kop |
| 9 | Verhuur (Engels) | 4 | Engelstalig, kop niet te vinden door het script |
| 10 | IT | 4 | "IT-oplossingen voor iedere organisatie" als kop |

De spreiding (4 tot 15) en de volgorde kloppen met mijn leesindruk: de site met het meest concrete verhaal scoort het hoogst. Dat is een eerste teken dat de rubric onderscheidt.

## Wat de proef liet zien over de sites

- 7 van de 10 koppen zijn een slogan of begroeting ("Welkom bij ...", "Exceeding standards.", "Samen maken we er werk van!"). Geen enkele noemt context, probleem en resultaat samen.
- 0 van de 10 noemt voor wie het niet is.
- 0 van de 10 belooft een reactietijd na een aanvraag. Eén site noemt "binnen 24 uur leverbaar", dat is een levertijd, geen reactietijd.
- 0 van de 10 heeft een nieuwsbrief of een andere manier om in beeld te blijven op de homepage.
- Maar 1 van de 10 heeft een actieve knop met een concrete volgende stap en een prijsvraag. De meeste hebben alleen een telefoonnummer en een menu.

Dit onderbouwt optie B: het opvolgdeel (controle 8 en 10) vindt echte gaten, ook bij sites die op helderheid redelijk scoren.

## Wat een script betrouwbaar kan, en wat niet

| Controle | Betrouwbaar met regels? | Wat misging |
|---|---|---|
| Kop vinden | Nee, 2 van 10 fout | Een telefoonnummer als H1, en een lege of dubbele H1 |
| Holle woorden tellen | Deels | Valse treffers: "service" als dienstnaam, "partner" in het menu, "groeien" in een personeelsbericht. Telt alleen goed op de hoofdtekst |
| Cijfers als bewijs | Nee | Animatieteller die op 0 staat, schuifregelaar met 0%, 5%, 10% |
| Actieknop zoeken | Deels | Menu-items en echte knoppen lopen door elkaar |
| Reactietijd zoeken | Nee | Levertijd werd aangezien voor reactietijd |
| Taal herkennen | Nodig | Eén site Engels, een andere half Engels |
| Dunne pagina's | Nodig | Pagina's met 300 woorden geven te weinig om op te scoren |

Controles 1 tot 4, 6 en 9 (de kern van de uitkomsttest) kan alleen een taalmodel beoordelen. Dat heb ik hier zelf gedaan, één keer. Of dat bij herhaling en bij een ander model dezelfde uitkomst geeft, moet de volgende stap uitwijzen.

## Conclusie voor fase 1

1. **De rubric werkt** en geeft een bruikbare spreiding. De opvolgcontroles leveren het meeste nieuws.
2. **Eerst de hoofdtekst isoleren** (geen menu, footer, nieuws, vacatures), anders zijn de regels onbetrouwbaar. Dit is het belangrijkste technische werk.
3. **Kop zoeken met meer dan het H1-element:** de grootste tekst boven de vouw, de titel en de meta description erbij.
4. **Cijfers alleen tellen als er een eenheid en een onderwerp bij staat**, en tellers die op 0 staan negeren.
5. **De taalmodel-controles drie keer laten draaien** per site en alleen scoren als twee van de drie gelijk zijn. Anders staat er "onzeker".
6. **Een melding in plaats van een score** bij te weinig tekst of een vreemde taal.
7. **Rapport per pagina:** alleen de homepage is niet genoeg voor bewijs (veel sites zetten referenties op een aparte pagina). Dat staat in het rapport, en een tweede pagina (referenties of over ons) kan later worden toegevoegd.

## Wat nog open is

- De proef met het taalmodel in code (herhaalbaarheid, kosten per rapport). Dit vraagt een API-sleutel van jou of mij op een veilige plek.
- Een test met 10 sites uit jouw eigen doelgroep (installatie en onderhoud), want deze tien zijn een brede mix.
- Je akkoord op de privacy-kant voordat er echte bezoekersdata door gaat.

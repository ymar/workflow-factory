# Prompt: de site in de stijl van FletchPMM

Gebruik dit in Claude Code, in deze repository (`ymar/workflow-factory`), op de branch `claude/b2b-consultancy-website-0rcis6`. Nooit pushen naar main: main deployt naar productie. Wat nog [placeholder] is, blijft zichtbaar als [placeholder].

Dit bouwt voort op `website-verbeteren.md`. De structuur, de teksten en de uitkomsttest blijven. Alleen de verpakking verandert: de homepage wordt één aanbod-pagina, en alle pagina's krijgen het visuele systeem van fletchpmm.com.

## Analyse van fletchpmm.com (gemeten op 10 oktober 2026)

**Wat het is.** Eén aanbod, op de homepage verkocht: de "Homepage Positioning Sprint" van twee weken, in drie prijsklassen. Alles op de pagina dient die ene knop: "Reserve your sprint".

**Volgorde van de homepage.**
1. Navigatie: logo (lime vierkantje plus woordmerk), zeven kleine links, één knop met dikke zwarte rand.
2. Hero: H1 "Let's fix your confusing positioning." Twee regels uitleg. Knop 1 lime met schaarste in kleine letters ("Booking in November"), knop 2 wit.
3. Logostrook: twee rijen klantlogo's, een deel linkt naar een case.
4. Eén grote aanbodkaart in drie kolommen: de sprint, wat je krijgt (drie punten), prijzen per bedrijfsgrootte.
5. Rij van vier korte quotes, met vetgedrukt cijfer, ronde foto, naam en functie.
6. Zelftest: "Do you have a positioning problem?" met vijf aanvinkbare zinnen. Vink je er één aan, dan verschijnt "No problem!" met een emoji.
7. "Our solution": drie genummerde opleveringen, links en rechts afwisselend met een beeld.
8. Proces: pre-work, week 1, week 2, per dag een stap met de duur van het gesprek.
9. FAQ als accordeon, met knop "Book a call".
10. Quote-muur: "More ❤️ from past customers".
11. Footer: links, "Chicago | Austin", LinkedIn van de twee oprichters.

**Visueel systeem (uit de gerenderde pagina).**
- Lettertype: systeemfont (Inter-achtig), gewicht 700 voor koppen, 500 voor knoppen, 400 voor lopende tekst. Letterafstand −0,32px overal.
- Maten: H1 64px met regelhoogte 0,95. H2 40 tot 48px. Lopende tekst 16 tot 18px. Knoppen 14 tot 20px.
- Kleur: achtergrond `#fafafa`, tekst zwart (`#000`, lopende tekst `#333`). Eén accent: lime `#d1f26e`. Pastelreeks voor tiers en labels: blauw `#8bd6f7`, oranje `#f0ad7b`, paars `#c099cc`, geel `#fcf7b8`, roze `#ec7783`.
- Neo-brutalistisch: 4px zwarte rand op knoppen en op de aanbodkaart, hoeken van 8px (de kaart iets ronder), een harde schaduw (geen blur) onder en rechts van de kaart. Geen verlopen.
- Handschrift: een label in Permanent Marker, in pastelblauw, boven de koppen ("Our solution").
- Prijsklassen zijn gestapelde blokken met een gekleurde linkerrand en een groot bedrag.
- Emoji's in koppen en kleine teksten (👇, ❤️, 😊).
- Toon: kort, direct, een beetje speels. Schaarste en proof staan vooraan.

**Wat ik niet kon meten:** animaties, de exacte schaduwwaarde en de hover-staten. De afbeeldingen bij de opleveringen laden lui en waren niet te zien. Check die in DevTools als je ze precies wilt nabouwen.

**Wat we niet overnemen.** Geen tekst, geen logo's, geen quotes, geen foto's en geen beelden van Fletch. We nemen het visuele systeem en de opbouw over, niet de inhoud.

## Mijn oordeel

De opbouw van Fletch werkt omdat er één aanbod is. Wij hebben 15 workflows, vier branches en drie stappen. Als je alles even groot op de homepage zet, krijg je een catalogus. Daarom: de homepage verkoopt één ding (de opvolgscan, met de drie stappen als aanbodkaart), en de bibliotheek en de branches krijgen dezelfde stijl, maar rustiger.

Twee risico's. Eén: Fletch heeft 500+ logo's en echte quotes. Wij hebben nog geen cases. Een logostrook of quote-muur met placeholders ziet er leeg uit en schaadt het vertrouwen. Gebruik in plaats daarvan de branchestrook en de zelftest, en houd de resultaatblokken als zichtbare placeholder tot er pilots zijn. Twee: pastelblauw handschrift op bijna wit haalt geen goed contrast. Gebruik een donkerder blauw voor tekst, zodat Lighthouse toegankelijkheid boven de 95 blijft.

## Role

Je bent een senior front-end developer en Nederlandse conversiecopywriter. Je bouwt een visueel systeem om, in kleine, geverifieerde stappen, zonder de inhoud te verliezen die er al staat.

## Inputs

- Lime accent: [#d1f26e] of eigen kleur: [ ].
- Handschriftlettertype voor labels: [Permanent Marker, zelf gehost] of [geen].
- Schaarste in de hero: [bijvoorbeeld "Er is ruimte voor 3 pilots"] of [geen]. Verzin geen schaarste die er niet is.
- Zelftest: de vijf zinnen staan hieronder. Pas aan als je er andere wilt.
- Cases en quotes: [geen] blijft een zichtbare placeholder.

## Het plan, in volgorde

Werk in deze volgorde. Commit na elke stap en draai `npm run build && npm run check`.

1. **Tokens en basis.** Vervang in `src/styles/global.css` het palet door het systeem hierboven: `--color-bg #fafafa`, `--color-fg #000`, `--color-accent` lime, de pastelreeks als tokens, `--color-ink` voor tekst. Zet de letterafstand op −0,32px, H1 op 64px met regelhoogte 0,95, H2 op 40 tot 48px. Houd `.on-dark` werkend: de footer en dark blokken blijven donker, met lime als accent.
2. **Componenten.** Pas `Button`, `Section`, `PageHero`, `Faq`, `WorkflowCard`, `OutcomeDl`, `Header` en `Footer` aan: 4px zwarte rand, 8px hoek, harde schaduw op kaarten, lime primaire knop met zwarte tekst, witte secundaire knop met zwarte rand. Voeg een `Marker`-component toe voor het handschriftlabel boven koppen (donker genoeg voor contrast).
3. **Header en logo.** Lime vierkantje plus woordmerk. Zes kleine links en één knop met dikke rand. Het menu blijft de drie uitkomsten, met Branches, Diensten en Over klein rechts.
4. **Homepage als aanbodpagina.** Bouw de secties in deze volgorde:
   1. Hero met de H1, uitleg en voorbeeldregel uit `website-verbeteren.md`. Primaire knop lime: "Doe de opvolgscan". Secundair: "Bekijk de workflows". De schaarste-regel alleen als je die hebt opgegeven.
   2. Branchestrook in plaats van de logostrook: vier vakken met naam en een zin in hun woorden.
   3. **Aanbodkaart** met 4px rand en harde schaduw, drie kolommen: links de scan (titel, uitleg, link), midden "Wat je krijgt" (drie punten: de scan-pagina, de workflow, het beheer), rechts de prijsstappen met gekleurde linkerrand: Scan ("Gratis voor de eerste tien bedrijven"), Bouwen (€3.500 tot €6.500 per workflow), Beheren (vanaf €750 per maand). Alles blijft gemarkeerd als voorstel.
   4. Resultatenrij met drie slots: elk een zichtbare placeholder.
   5. **Zelftest** "Blijft jouw opvolging liggen?" met vijf aanvinkbare zinnen (zie hieronder). Een vinkje laat een korte regel zien met de workflow die erbij past en een link. Zonder JavaScript moet de lijst bruikbaar blijven (alle antwoorden zichtbaar).
   6. De drie uitkomsten als genummerde opleveringen, links en rechts afwisselend. Gebruik in plaats van een beeld de bestaande `TimelineMini` of een kaart met de workflowlijst. Verzin geen schermafbeeldingen.
   7. Proces: de scan, het bouwen (3 weken) en het beheren, per stap wat jij doet en wat jouw tijd is (uit `flow.json`).
   8. FAQ met knop "Plan een kennismaking".
   9. Nieuwsbriefblok.
   10. Afsluitende CTA op donker, met lime knop.
5. **Pagina's.** Pas de uitkomstpagina's, branchepagina's, `/diensten/`, `/opvolgscan/`, `/flow/` en de workflowpagina's aan op het nieuwe systeem. Geen nieuwe inhoud, wel dezelfde koppen. Workflowpagina's blijven rustig: de flowchart en de velden zijn het werk, de stijl hoort er niet tegenin te werken.
6. **Controle.** Lighthouse mobiel 95 of hoger op de homepage, een uitkomstpagina, een branchepagina en een workflowpagina. Contrast AA op alle tekst, ook het lime-vlak en het handschriftlabel. Geen horizontaal scrollen op 390px. Het menu past op 1280px.
7. **Preview.** `npm run deploy:preview`, met screenshots op 1440 en 390px, naast de oude versie.

## De zelftest

Vijf zinnen, in de woorden van de koper. Elke zin hoort bij één workflow:

- "Aanvragen blijven een dag of langer liggen voordat iemand belt." → Aanvraagopvolging
- "Offertes gaan de deur uit en daarna horen we niets meer." → Offerteopvolging
- "Facturen worden pas betaald als iemand erachteraan gaat." → Factuuropvolging
- "Contracten lopen af zonder dat iemand belt." → Contractverlenging
- "Klanten die tevreden zijn, vertellen het niet door." → Reviews en aanbevelingen

Als er niets is aangevinkt, staat er niets. Zodra er iets is aangevinkt, komt er een lime vlak met "Begin hier:" en de naam van de workflow. Geen "No problem!" na het voorbeeld van Fletch: dat zou hier niet kloppen.

## Copy

- De regels uit `website-verbeteren.md` blijven: Nederlands, "je", korte zinnen, geen gedachtestreepjes, geen holle woorden, geen verzonnen bewijs, cijfers alleen als "Stel:".
- De toon mag iets speelser: korte, directe zinnen, één emoji per sectie op zijn hoogst, nooit in de H1.
- Elke kop blijft de vier delen van de uitkomsttest halen. Stijl mag de boodschap niet vervangen.

## Technisch

- Houd Astro (statisch), Tailwind v4, de tijdlijncomponent, de bibliotheekcheck en CC BY 4.0.
- Zelf hosten: voeg het handschriftlettertype toe via `@fontsource` en preload alleen wat boven de vouw staat. Houd de CSS-grootte en de Lighthouse-score in de gaten.
- Animaties: alleen hover op knoppen en kaarten (kleine verschuiving van de schaduw), en `prefers-reduced-motion` respecteren.
- De zelftest werkt met een paar regels script of met `<details>`/CSS. Geen framework erbij.
- Werk `README.md` bij: de tokens, de nieuwe componenten en waar de zelftest-zinnen staan (`src/content/` of `src/lib/`).

## Klaar als

- De homepage volgt de volgorde hierboven en verkoopt één aanbod.
- Alle pagina's gebruiken hetzelfde visuele systeem: zwarte rand, lime accent, harde schaduw, Inter 700.
- `npm run build` en `npm run check` slagen. Lighthouse mobiel is 95 of hoger op vier pagina's. Contrast AA.
- Er staat niets van Fletch op de site: geen tekst, geen logo's, geen quotes, geen beelden.
- Gepusht naar de werkbranch, niet naar main, met een preview-deploy en screenshots.
- Een lijst van wat ik nog moet aanleveren: cases en quotes, de schaarste-regel, de nieuwsbrief-embed.

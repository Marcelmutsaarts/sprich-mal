# Sprich mal!

Een spreekoefening Duits voor 3 havo (ongeveer niveau A2), gemaakt door AI voor Docenten.

De leerling loopt door een Duitse winkelstraat en kiest een van vier situaties:

| Plek | Verkoper | Thema | Klein probleem |
|---|---|---|---|
| Bäckerei am Markt (Münster) | Frau Becker | broodjes kopen, prijs vragen, betalen | het volkorenbrood is op |
| Trendwerk (Aken) | Jonas | kleren kopen: maat, kleur, passen, prijs | de kleur is er niet in jouw maat |
| Café Krümel (Keulen) | Lena | bestellen, advies vragen, afrekenen | de Apfelstrudel is op |
| Hauptbahnhof (Düsseldorf) | Herr Schmidt | treinkaartje kopen, tijd en spoor vragen | de trein heeft vertraging |

## Zo werkt het

1. **Voorbereiden.** De leerling leest de situatie, vier opdrachten en een paar handige zinnen.
2. **Praten.** De leerling houdt de knop ingedrukt (of de spatiebalk) en praat Duits. Een taalmodel hoort de opname, speelt de verkoper in eenvoudig Duits en antwoordt met een Duitse stem. Opdrachten worden afgevinkt zodra ze gedaan zijn. Er zijn knoppen voor hulp (twee passende zinnen), een vertaling, nog eens horen en langzamer praten. Typen kan ook.
3. **Feedback.** In het Nederlands: wat goed ging, twee of drie verbeterde zinnen (om te beluisteren), handige woorden, een inschatting van woordenschat, grammatica en uitspraak, en één volgende stap. Met "Probeer het nog eens" neemt de leerling die stap mee als focus voor de volgende poging.

De voortgang (beste poging en focus) staat alleen in de browser van de leerling.

## Techniek

Statische HTML zonder build-stap, met twee Vercel-functies:

- `api/gesprek.js`: de verkoper en de feedback, via OpenRouter (standaard `google/gemini-3.8-flash`, reserve `google/gemini-2.5-flash`). Het model krijgt de opname als audio.
- `api/stem.js`: de stem, via OpenRouter tekst-naar-spraak (`microsoft/mai-voice-2.1-flash`, Duitse stemmen Mia, Grant, Harper en Klaus).

Bestanden: `index.html` (opmaak en schermen), `data.js` (wat de leerling ziet per winkel), `tekeningen.js` (gevels, verkopers en hun gezicht), `app.js` (de logica).

### Omgevingsvariabelen in Vercel

| Naam | Verplicht | Waarde |
|---|---|---|
| `OPENROUTER_API_KEY` | ja | je OpenRouter-sleutel |
| `GESPREK_MODEL` | nee | ander taalmodel |
| `STEM_MODEL` | nee | ander stemmodel |
| `STEM_BECKER`, `STEM_JONAS`, `STEM_LENA`, `STEM_SCHMIDT` | nee | andere stem per verkoper |

Zet je de sleutel er pas na de eerste deploy in, kies dan in Vercel bij Deployments de laatste deploy en klik op Redeploy.

## Privacy

De opname en de tekst gaan via OpenRouter naar het taalmodel; de stem wordt door Microsoft gemaakt. De app bewaart geen gesprekken op een server. Laat leerlingen geen namen of persoonlijke gegevens noemen, en check of stemopnames passen binnen de privacyafspraken van de school.

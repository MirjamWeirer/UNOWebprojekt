# Unser Uno Projekt

Das ist unser super tolles Uno Projekt.

# Anforderungen - Das Unosystem...
- [ ] muss den SpielerInnen die Möglichkeit bieten 4 Namen einzugeben
- [ ] muss gleiche SpielerInnen Namen verhindern
- [ ] muss alle Karten aller SpielerInnen darstellen
- [ ] muss nach einer SpielerInnen Aktion etwaige neue Karten darstellen bzw. alte Karten entfernen
- [ ] muss alle Namen aller SpielerInnen darstellen
- [ ] muss die Punkte aller SpielerInnen darstellen
- [ ] muss nach einer SpielerInnen Aktion etwaige Punkteveränderungen darstellen
- [ ] muss aktive/n SpielerIn visuell hervorheben
- [ ] muss die aufgedeckte Karte darstellen
- [ ] muss für die aktive Spielerin / den aktiven Spieler die Möglichkeit bieten eine Karte zu spielen
- [ ] muss das Spielen einer Karte animieren
- [ ] muss nach dem Spielen einer Karte die aufgedeckte Karte aktualisieren
- [ ] muss für die aktive Spielerin / den aktiven Spieler die Möglichkeit bieten eine Karte abzuheben
- [ ] muss das Abheben einer Karte animieren
- [ ] muss ungültige Aktionen animieren
- [ ] muss das Spiel beenden und SiegerIn visualisieren, wenn eine Person keine Karten mehr besitzt
- [ ] muss die Wahl einer Farbe erlauben, wenn eine Uno Sonderkarte gespielt wurde
- [ ] muss die gewählte Farbe nach einer Farbwahl visualisieren
- [ ] soll unnötige Anfragen an den Server verhindern (z.B. falsche Karte gespielt, nicht aktive SpielerIn versucht Karte zu spielen)
- [ ] soll nett aussehen

## Weitere Anforderungen (sind ein KANN):
- [ ] weitere Animationen
- [ ] weiteres *bling bling* Aussehen
- [ ] Uno Ruf Funktionalität
- [ ] Spielregeln anzeigen
- [ ] Knöpfe um Spiel erneut zu starten

## TODOs bis 11.11.:
- [ ] css
- [ ] eventlistener
- [ ] currentplayer field (indexOf?)

## Anmerkungen und Ideen
- backface-visibility? leider nicht
- für animationen siehe auch codepen Ideen (z.B. https://codepen.io/bitmapshades/pen/raOZMa) -coole idee
- karte nach farbwunsch liegt nicht am richtigen platz
- export/import functions (https://stackoverflow.com/questions/3809862/can-we-call-the-function-written-in-one-javascript-in-another-js-file)
- lösung für mehr karten finden

- CSS3 Media Query, Bootstrap Responsive Classes to scale web page according to screen resolution
- Eingabe der Namen anpassen - zur Zeit sind Namen mit gleichem Beginn nicht erlaubt
- laut ppt: Alle Karten Aktionen müssen animiert sein (!)


- Firework source: https://codepen.io/hmaw/pen/qBEMLxV

## Roadmap to WEB || Uno
 - 11.11. Ziel:
 - [x] Spieler*innennamen eingeben (nur unterschiedliche)
 - [x] Grundstruktur wie Daten gespeichert
 - [x] Spielstart vollständig (Karten am Tisch)
 - [x] Button Listner für Karten
 - [x] addEventListener auf UL, nicht LI
 - 18.11. Ziel:
 - [x] Karten spielen
 - [x] Karten hinzufügen/entfernen
 - 25.11. Ziel:
 - [ ] Sonderfälle abgedeck: Farbwechsel
 - 26.11. Ziel:
 - [ ] Animation vorhanden   


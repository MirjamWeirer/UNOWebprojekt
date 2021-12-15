# Unser Uno Projekt

Das ist unser super tolles Uno Projekt.

# Anforderungen - Das Unosystem...
- [x] muss den SpielerInnen die Möglichkeit bieten 4 Namen einzugeben
- [x] muss gleiche SpielerInnen Namen verhindern
- [x] muss alle Karten aller SpielerInnen darstellen
- [x] muss nach einer SpielerInnen Aktion etwaige neue Karten darstellen bzw. alte Karten entfernen
- [x] muss alle Namen aller SpielerInnen darstellen
- [x] muss die Punkte aller SpielerInnen darstellen
- [x] muss nach einer SpielerInnen Aktion etwaige Punkteveränderungen darstellen
- [x] muss aktive/n SpielerIn visuell hervorheben
- [x] muss die aufgedeckte Karte darstellen
- [x] muss für die aktive Spielerin / den aktiven Spieler die Möglichkeit bieten eine Karte zu spielen
- [x] muss das Spielen einer Karte animieren
- [x] muss nach dem Spielen einer Karte die aufgedeckte Karte aktualisieren
- [x] muss für die aktive Spielerin / den aktiven Spieler die Möglichkeit bieten eine Karte abzuheben
- [x] muss das Abheben einer Karte animieren
- [x] muss ungültige Aktionen animieren
- [x] muss das Spiel beenden und SiegerIn visualisieren, wenn eine Person keine Karten mehr besitzt
- [x] muss die Wahl einer Farbe erlauben, wenn eine Uno Sonderkarte gespielt wurde
- [x] muss die gewählte Farbe nach einer Farbwahl visualisieren
- [x] soll unnötige Anfragen an den Server verhindern (z.B. falsche Karte gespielt, nicht aktive SpielerIn versucht Karte zu spielen)
- [x] soll nett aussehen

## Weitere Anforderungen (sind ein KANN):
- [x] weitere Animationen
- [ ] weiteres *bling bling* Aussehen
- [x] Uno Ruf Funktionalität
- [x] Spielregeln anzeigen
- [x] Knöpfe um Spiel erneut zu starten

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


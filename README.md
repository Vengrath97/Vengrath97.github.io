# Vengrath

Struktura:

- `index.html` — strona główna GitHub Pages
- `Home/Code/` — kod strony głównej
- `Home/Graphics/` — grafiki
- `Home/Cards/` — karty TXT; strona automatycznie wykrywa pliki `.txt`
- `Subpages/` — podstrony

Karty nie są wpisane na stałe w JavaScript. `Home/Code/app.js` skanuje `Home/Cards/`:
- lokalnie / na serwerze HTTP odczytuje listing katalogu,
- na GitHub Pages korzysta z GitHub Contents API jako fallbacku.

Każdy plik TXT ma 4 linie: tytuł, tag, ścieżka grafiki, link docelowy.

# Vengrath

Panorama kampanii i materiałów Mistrza Gry.

## Struktura

- `index.html` — strona główna
- `styles.css` — grafitowo-szary styl, odstępy między shardami i typografia
- `app.js` — generowanie nieregularnej panoramy, filtry, wyszukiwanie i nawigacja
- `V/` — dane kafli; każdy plik ma 4 linie: tytuł, tag, grafika, link
- `graphics/` — grafiki kafli oraz logo MG

## Uruchomienie lokalne

```bash
python3 -m http.server
```

Następnie otwórz `http://localhost:8000/`.

Strona jest przygotowana do GitHub Pages i używa ścieżek względnych.

Obrazy w shardach zachowują oryginalne proporcje (`preserveAspectRatio: xMidYMid slice`): wypełniają cały kształt kafla, a nadmiar obrazu jest przycinany po bokach albo od góry/dołu zależnie od proporcji.

# Księga Mistrza Podziemi

Każdy fragment panoramy ma własny plik w `V/`.

Format pliku:

```text
Tytuł
Tag
Grafika
Link docelowy
```

Lokalnie uruchom:

```bash
python3 -m http.server
```

i wejdź na `http://localhost:8000/`.

Na GitHub Pages ta sama struktura działa bez zmian.

`V/*.txt` są źródłem danych. `V/index.json` zawiera listę tych plików.


## Grafiki kart

Tytuły nie są wyświetlane jako tekst na fragmentach panoramy. Karta pokazuje wyłącznie grafikę.

Grafiki zachowują proporcje źródłowego obrazu (`image ratio`). Obraz jest dopasowywany do obszaru fragmentu bez rozciągania; nieregularny kształt fragmentu nadal działa jako maska/klip.

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

# Vengrath

Statyczna strona GitHub Pages w grafitowo-szarej stylistyce.

## Wersja zoptymalizowana

- pliki `V/*.txt` są jedynym źródłem danych kart;
- grafiki kart zostały przekonwertowane z SVG do JPG;
- obrazy kart są ładowane leniwie — przeglądarka pobiera głównie grafiki znajdujące się w pobliżu aktualnego widoku panoramy;
- zachowane jest `xMidYMid slice`, więc każda grafika zachowuje proporcje i jest przycinana tylko wtedy, gdy jej proporcje nie pasują do sharda;
- logo MG zostało zmniejszone do rozsądnego rozmiaru webowego.

## Dane kart

Każdy plik w `V/` ma cztery linie:

1. Tytuł
2. Tag
3. Ścieżka grafiki
4. Link docelowy

`V/index.json` zawiera listę plików TXT. Strona pobiera je równolegle, więc zmiana grafiki lub linku w pojedynczym TXT jest używana bez synchronizowania dodatkowego manifestu.

## Mock-cardy

Projekt zawiera `Mock_01`–`Mock_60`. Wszystkie korzystają ze wspólnej grafiki `graphics/Default.jpg` i prowadzą do `./index.html`.

## Lokalnie

Uruchom przez serwer HTTP, np.:

```bash
python3 -m http.server
```

Następnie otwórz `http://localhost:8000/`.


### Źródło danych kart

Pliki `V/*.txt` są źródłem prawdy. Każdy plik ma dokładnie 4 linie:

1. tytuł
2. tag
3. ścieżka do grafiki
4. link docelowy

`app.js` ładuje listę plików z `V/index.json`, a następnie pobiera pliki TXT równolegle. Zmiana linku lub grafiki w konkretnym `V/*.txt` jest więc od razu używana przez stronę. `V/cards.json` nie jest już używany, aby nie pozostawał nieaktualnym kopią danych.

Grafiki kart są JPG i są ładowane leniwie. Dla lokalnego testu użyj `python3 -m http.server`.

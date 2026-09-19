# Vengrath

Statyczna strona GitHub Pages w grafitowo-szarej stylistyce.

## Wersja zoptymalizowana

- karta danych jest ładowana jednym requestem z `V/cards.json` zamiast wykonywania osobnego requestu HTTP dla każdego `V/*.txt`;
- pliki `V/*.txt` pozostają jako wygodny format źródłowy/edycyjny;
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

`V/cards.json` jest zoptymalizowanym manifestem używanym przez stronę. Jeśli zmienisz pliki `V/*.txt`, zaktualizuj również `cards.json` przed publikacją.

## Mock-cardy

Projekt zawiera `Mock_01`–`Mock_60`. Wszystkie korzystają ze wspólnej grafiki `graphics/Default.jpg` i prowadzą do `./index.html`.

## Lokalnie

Uruchom przez serwer HTTP, np.:

```bash
python3 -m http.server
```

Następnie otwórz `http://localhost:8000/`.

# Zdjęcia Jakuba Bednarza

Biblioteka zdjęć portretowych do grafik, ofert, prezentacji i stron. Pliki w tym folderze są już zmniejszone,
oryginały z sesji leżą w `oryginaly/` i nie trafiają do gita (59 MB).

Podgląd wszystkich zdjęć: `podglad.jpg`.

## Warianty plików

- `*.jpg` ma dłuższy bok 2400 px, jakość 84 i profil sRGB. To wersja do grafik, PDF-ów i druku małego formatu.
- `*-1200.webp` ma dłuższy bok 1200 px. To wersja na strony i do maili, które obsługują WebP.
- Oryginały mają 4242-4791 px na dłuższym boku. Po nie sięgasz tylko do druku dużego formatu.

## Zdjęcia

| Plik | Sesja | Ujęcie | Pasuje do |
|---|---|---|---|
| `jakub-2024-granat-jasne-tlo-przod` | 23.09.2024, Nikon D850, autor nieznany (pliki MMF_) | granatowy garnitur, biała koszula, dłonie złożone, jasnoszare tło, pion | jasne layouty, strona o mnie, oferty |
| `jakub-2024-granat-jasne-tlo-reka-w-kieszeni` | jw. | granatowy garnitur, ręka w kieszeni, lekko bokiem, pion | jasne layouty, prelekcje, LinkedIn |
| `jakub-niebieska-marynarka-wyciety` | sesja z niebieską marynarką, data nieznana | niebieska marynarka, beżowa koszulka polo, wycięte tło (PNG i WebP z przezroczystością) | grafiki na dowolnym tle, Vibers Tribe (niebieski marki) |
| `jakub-2021-koszula-beton-rece-skrzyzowane` | 07.06.2021, Canon EOS 6D, Bartosz Pussak Photography | jasna koszula, ręce skrzyżowane, betonowe tło, poziom | ciemne layouty, nagłówki stron |
| `jakub-2021-koszula-beton-usmiech` | jw. | jasna koszula, szeroki uśmiech, ręce skrzyżowane, poziom | ciemne layouty, posty |
| `jakub-2021-marynarka-beton-rece-skrzyzowane` | jw. | granatowa marynarka, ręce skrzyżowane, poziom | ciemne layouty, bardziej formalne materiały |

Zdjęcia z 2021 roku mają pięć lat, więc w materiałach o bieżącej pracy lepiej sprawdzają się te z 2024.
Przy publikacji zdjęć Bartosza Pussaka podpisuj autora, jeśli wymaga tego umowa z sesji.

## Inne zdjęcia w repo

- `public/Jakub-Bednarz.webp` (1365x2048, czarno-białe, sesja z niebieską marynarką) i `public/jakub-bednarz-hero.png`
  (400x600, wycięte) obsługują stronę workshift.pl i maile. Tych plików nie przenosimy, bo używa ich kod.
- Kwadratowy awatar z niebieską marynarką: vault `raw/assets/Kuba_zdjęcie_avatar.png` (1365x1365).

## Jak dodać nowe zdjęcia

Oryginał wrzucasz do `oryginaly/`. Wersje robi skrypt w Pythonie z biblioteką Pillow:
`thumbnail((2400, 2400))`, zapis JPG z `quality=84, progressive=True` i profilem ICC z oryginału oraz WebP 1200 px
z `quality=80`. Nazwa ma postać `jakub-<rok>-<strój>-<tło>-<poza>`.

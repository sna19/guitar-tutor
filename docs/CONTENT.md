# Источники нот и лицензии

## Гитарные пьесы — Mutopia Project
239 пьес (`src/lib/content/pieces/classical/*.abc`, каталог `classical.generated.json`) — из набора
[Mutopia Project](https://www.mutopiaproject.org/) (Public Domain и Creative Commons, лицензия — у каждой пьесы).
MIDI каждой пьесы переведён в ABC (`scripts/midi2abc.mjs`, `scripts/import-mutopia.mjs`); высота и начало каждой ноты
сверены с MIDI. Пропущены: пьесы на нескольких нотоносцах, с нотами ниже строя гитары (ошибка источника).
ABC из файлов CC BY-SA — производная работа на тех же условиях.

Теряется при переводе: повторы, аппликатура, украшения, лиги; табулатура подобрана автоматически.

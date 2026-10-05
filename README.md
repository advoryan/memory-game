# Memory — Pepe edition

Игра на поиск восьми пар по [заданию RS School](https://github.com/rolling-scopes-school/tasks/tree/master/tasks/memory-game). Откройте две карточки: совпавшие остаются открытыми, разные закрываются через секунду. Цель — найти все пары за наименьшее число ходов.

Есть новая игра, счётчики ходов и пар, таймер, окно победы и таблица десяти лучших результатов. Рейтинг хранится в `localStorage`, сортируется по числу ходов, при равенстве — по дате завершения. Интерфейс адаптируется к мобильным экранам и поддерживает клавиатуру.

## Локальный запуск

Готовый `style.css` включён в репозиторий. Для игры достаточно статического HTTP-сервера из корня проекта, например Python 3:

```sh
python3 -m http.server 8000
```

Откройте <http://localhost:8000>. Также подойдёт Live Server в VS Code. Открывать HTML через `file://` не нужно: JavaScript использует ES-модули.

## Стили

Для изменения SCSS нужны Node.js 20.19+ и npm:

```sh
npm ci
npm run scss
```

Команда компилирует `src/styles/main.scss` в `style.css` рядом с `index.html`. Этот CSS подключается обычным `<link>`. Для автоматической перекомпиляции:

```sh
npm run scss:watch
```

Sass — единственная зависимость разработки. Сборщика приложения нет: HTML, JS и картинки используются напрямую. После изменения SCSS сохраняйте в коммите и обновлённый `style.css`.

## Структура

```text
index.html
style.css
assets/images/
src/
├── index.js
├── game.js
├── ui.js
├── storage.js
├── utils.js
└── styles/
    ├── main.scss
    ├── _layout.scss
    ├── _cards.scss
    ├── _modal.scss
    └── _responsive.scss
```

- `index.js` запускает игру, связывает модули, обрабатывает события и обновляет таймер.
- `game.js` хранит состояние, перемешивает карточки, проверяет пары и отменяет задержку при перезапуске.
- `ui.js` создаёт DOM через `document.createElement`, отображает карточки, счётчики, рейтинг и общий modal на основе `<dialog>`.
- `storage.js` сохраняет и загружает топ-10. Если браузер запрещает сохранение, результаты остаются в памяти до перезагрузки.
- `utils.js` содержит перемешивание Фишера — Йейтса и форматирование даты и времени.

Обработчик в `index.js` вызывает `game.js`, затем передаёт обновлённое состояние в `ui.js`. При победе `index.js` сохраняет результат через `storage.js` и открывает окно победы.

## Изображения

Картинки скачаны и хранятся локально. Pepe the Frog — персонаж Matt Furie. Эмодзи сообщества взяты с BetterTTV; права на изображения принадлежат их авторам, открытая лицензия на эти изображения не заявляется.

| Файл | Источник |
| --- | --- |
| `pepe-happy.png` | [FeelsGoodMan](https://betterttv.com/emotes/566c9fde65dbbdab32ec053e) |
| `pepe-sad.png` | [FeelsBadMan](https://betterttv.com/emotes/566c9fc265dbbdab32ec053b) |
| `pepe-birthday.png` | [FeelsBirthdayMan](https://betterttv.com/emotes/55b6524154eefd53777b2580) |
| `pepe-worried.png` | [monkaS](https://betterttv.com/emotes/56e9f494fff3cc5c35e5287e) |
| `pepe-amazing.png` | [FeelsAmazingMan](https://betterttv.com/emotes/5733ff12e72c3c0814233e20) |
| `pepe-pumpkin.png` | [FeelsPumpkinMan](https://betterttv.com/emotes/580e438942170bfd57189866) |
| `pepe-snow.png` | [FeelsSnowMan](https://betterttv.com/emotes/566dde0e65dbbdab32ec068f) |
| `pepe-laugh.png` | [Pepe laugh](https://betterttv.com/emotes/59b73909b27c823d5b1f6052) |

Фоновая фотография: [Unsplash](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b), [лицензия Unsplash](https://unsplash.com/license).

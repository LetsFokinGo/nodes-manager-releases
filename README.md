# Nodes Manager — mod manager for BeamNG.drive

**Nodes Manager** is a free, unofficial mod manager and launcher for BeamNG.drive on Windows. Turn mods on and off with one click, install them from the beamng.com repository, find the mod that crashes your game, and start a run with the right car and map in one click.

> Not made, supported or endorsed by BeamNG GmbH. BeamNG and BeamNG.drive are registered trademarks of BeamNG GmbH.

<!-- screenshot: play (EN) -->

**Website:** https://letsfokingo.github.io/nodes-manager-releases/ · **Русский — ниже**

## Download
Get the latest version from [**Releases**](../../releases/latest) — the file `NodesManager_…_x64-setup.exe`. A SHA-256 checksum is published next to it.

Requirements: Windows 10 or 11 (64-bit) and BeamNG.drive.

> The installer is **not code-signed** yet, so Windows SmartScreen may show a warning: click “More info” → “Run anyway”. We have not bought a signing certificate yet; your support will help us get rid of this warning. Verify the file with `Get-FileHash NodesManager_…_x64-setup.exe -Algorithm SHA256`. A VirusTotal link is in the description of every release.

## Features
**Play**
- Free ride: pick a car and a map, press Play. Time of day, traffic, spawn point, run presets.
- Career and missions: continue where you left off.
- Find the culprit mod: if the game crashes, the app checks your mods step by step and finds the one that breaks loading.

**Mods**
- Library: turn mods on and off, folders, tags, notes, one-click mod updates.
- Repository: browse beamng.com/resources and install mods with one button.
- Mod profiles and a profile code to share with friends.
- Conflicts between mods and a game files check.

**Content**
- Car and map catalog with previews, brand badges, D–X classes and filters such as `power>400 year<1990 country:japan`.
- Your own configs, UI apps and UI layouts.
- Media: screenshots, replays, session history, records, statistics and achievements.
- Showroom: 3D car viewer, paints, snapshots.

**Settings**
- The game's own settings (graphics, sound, camera, controls) with “≈ −N % FPS” hints and a field-of-view calculator; settings sets per mode.
- Control presets and a preset code.
- Dark and light themes, accent colours, scale; English and Russian.

**Workshop (for modders)** — edit your own mods' files in the app and reload Lua in the game.

<!-- screenshots: library, cars (EN) -->

## Safety and privacy
- The app **sends nothing to the author**: no accounts, analytics or telemetry. Everything stays on your PC.
- It **never writes to the game installation folder**. It changes only your BeamNG user folder (`db.json`, `mods`, settings) and `%APPDATA%\NodesManager`.
- It backs up `db.json` before writing and does not write while the game is running.
- Network: `beamng.com`, mod file storage (when you click “Download”), Steam news, update check on `github.com`. Details: [Privacy Policy](PRIVACY.md), [Security](SECURITY.md).
- **The source code is closed.** Instead we describe openly what the app does with your files and publish checksums and the list of third-party components ([THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)).

## Bugs and ideas
- Open an [issue](../../issues/new/choose). Include the app version (“Settings → Advanced → About”) and the steps.
- The app works with your mods locally and never re-hosts other people's mods: files are downloaded from beamng.com or from the mod author's own link.

## License
Free for personal use, closed source — see the [License Agreement](EULA.md). Author: **LetsFokinGo**.

---

# Nodes Manager — менеджер модов для BeamNG.drive

**Nodes Manager** — бесплатный неофициальный менеджер модов и лаунчер для BeamNG.drive на Windows. Включает и выключает моды одним щелчком, ставит их из репозитория beamng.com, находит мод, из-за которого вылетает игра, и запускает заезд на нужной машине и карте за один клик.

> Программа **не создана, не поддерживается и не одобрена BeamNG GmbH**. BeamNG и BeamNG.drive — зарегистрированные товарные знаки BeamNG GmbH.

<!-- снимок: play (RU) -->

**Сайт:** https://letsfokingo.github.io/nodes-manager-releases/ru/

## Скачать
Последняя версия — в разделе [**Releases**](../../releases/latest), файл `NodesManager_…_x64-setup.exe`. Рядом лежит контрольная сумма SHA-256.

Требования: Windows 10 или 11 (64 бит) и BeamNG.drive.

> Установщик пока **не подписан** сертификатом Windows, поэтому SmartScreen может показать предупреждение: «Подробнее» → «Выполнить в любом случае». Мы пока не приобрели подпись: ваша поддержка поможет нам избавиться от этого предупреждения. Проверить файл можно по контрольной сумме: `Get-FileHash NodesManager_…_x64-setup.exe -Algorithm SHA256`. Ссылка на проверку VirusTotal — в описании каждого релиза.

## Что умеет
**Играть**
- «Свободная езда»: выберите машину и карту, нажмите «Играть». Время суток, трафик, точка старта, пресеты заездов.
- «Карьера» и «Миссии»: продолжить с того места, где остановились.
- «Найти виновный мод»: если игра вылетела, программа проверяет моды по очереди и находит тот, что ломает загрузку.

**Моды**
- Библиотека: включить и выключить мод, папки, теги, заметки, обновления модов в один щелчок.
- Репозиторий: витрина beamng.com/resources, установка модов по кнопке.
- Профили наборов модов, код профиля для обмена.
- Конфликты между модами и проверка файлов игры.

**Контент**
- Каталог машин и карт с превью, значками марок, классами D–X и фильтрами (например `power>400 year<1990 country:japan`).
- Свои конфиги, UI-приложения, компоновки интерфейса.
- Медиа: скриншоты, повторы, история сессий, рекорды, статистика и достижения.
- Шоурум: трёхмерный просмотр машин, раскраски, снимки.

**Настройки**
- Настройки самой игры (графика, звук, камера, управление) с пометками «≈ −N % к/с» и калькулятором поля зрения; наборы настроек по режиму.
- Пресеты управления и код пресета.
- Тёмная и светлая тема, акцентные цвета, масштаб, русский и английский.

**Мастерская (для моддеров)** — правка файлов своих модов прямо в приложении, перезагрузка Lua в игре.

<!-- снимки: library, cars (RU) -->

## Безопасность
- Программа **ничего не отправляет автору**: нет аккаунтов, аналитики, телеметрии. Всё хранится у вас.
- В **папку установки игры** программа ничего не пишет. Меняется только папка пользователя BeamNG (`db.json`, `mods`, настройки) и `%APPDATA%\NodesManager`.
- Перед записью `db.json` делается резервная копия; программа не пишет, пока игра запущена.
- Сеть: `beamng.com`, хранилище файлов модов (по вашей кнопке «Скачать»), новости Steam, проверка обновлений программы (`github.com`). Подробно — [Политика конфиденциальности](PRIVACY.md), [Безопасность](SECURITY.md).
- **Исходный код закрыт.** Вместо открытого кода мы открыто описываем, что программа делает с вашими файлами, и публикуем контрольные суммы и список сторонних компонентов ([THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)).

## Вопросы и ошибки
- Нашли ошибку или хотите предложить идею — [Issues](../../issues/new/choose). Приложите версию программы («Настройки → Дополнительно → О программе») и шаги.
- Программа работает с вашими модами локально и не раздаёт чужие моды: файлы скачиваются с beamng.com или по ссылке автора мода.

## Лицензия
Бесплатно для личного использования, исходный код закрыт — [Лицензионное соглашение](EULA.md). Автор — **LetsFokinGo**.

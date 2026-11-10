# Nodes Manager Privacy Policy

Author: **Vitaly Fokin (LetsFokinGo)**. Version of 10 November 2026.

## In brief
Nodes Manager **does not collect or send data to the author**. There are no user accounts, analytics, telemetry, advertising identifiers or error report submissions. Everything the application knows is stored on your computer.

## What is stored on your computer
- Application data: `%APPDATA%\NodesManager` (profiles, favourites, settings presets, preview cache, backups of `db.json`, downloaded mod archives).
- Game files in the BeamNG user folder (`%LOCALAPPDATA%\BeamNG\BeamNG.drive\current`): the list of enabled mods `db.json`, the `mods` folder, game settings and previews. The application changes them only on your action.
- The application writes nothing to the **game installation folder**.

You can remove all of this by deleting the `%APPDATA%\NodesManager` folder and the application itself.

## Where the application connects to the network
Only when a feature you have opened needs it:
- `beamng.com` and `media-cdn.beamng.com` — “Mods → Repository” (mod pages, images) and news; requests are infrequent, with a 10-minute cache and an honest application name in the request;
- mod file storage — only when you click “Download”;
- `api.steampowered.com` and `clan.akamai.steamstatic.com` — game news;
- addresses you paste into “Install from link” yourself (for example Google Drive or Dropbox);
- `github.com` (the public release repository `LetsFokinGo/nodes-manager-releases`) — application self-updates: checking the `latest.json` file at startup (at most once a day, can be disabled in “Settings → Advanced → App updates”) and downloading the installer only when you click “Install and restart”. The request contains the application version and system (Windows, architecture); nothing about you or your mods;
- `raw.githubusercontent.com` (the same repository) — the list of supporters on the “About” tab: the `supporters.json` file, at most once a day; no data about you.
- `127.0.0.1` — communication with the game on your computer; it does not leave your computer.

These websites see your requests just as when you open them in a browser (your IP address, application name). A proxy can be enabled in “Settings → Folders and files”.

## What is absent
There are no accounts or author-operated server, and no transfer of mod lists, profiles, paths or files to third parties. Self-updating installs nothing without your click, and every update is verified using the author's digital signature (Tauri update signature, minisign) before installation: if the signature does not match, installation is cancelled. You can also download a new version manually from the releases page.

## Supporting the project (Boosty)
Support is voluntary and unlocks nothing in the application: there are no paid features. The payment is accepted and processed by Boosty under its own rules, including refunds; the author does not receive your card details. If you supported the project and agreed to this on the Boosty page, your Boosty nickname and the amount are shown in the list of supporters: in the application ("About → Support") and in the public `supporters.json` file in the project repository. To remove or change your entry, message the author on Boosty or open an Issue.

## Children and personal data
The application does not require personal data from anyone, including children. Apart from supporters' nicknames and amounts (section above), the author does not process users' personal data.

## Changes
If this policy changes, the new version will be in the project repository together with the release. Contact: Issues in the project's public repository or nodesmanager777@gmail.com.

---

# Политика конфиденциальности Nodes Manager

Автор: **Виталий Фокин (LetsFokinGo)**. Редакция от 10.11.2026.

## Коротко
Nodes Manager **не собирает и не отправляет данные автору**. Нет учётных записей, аналитики, телеметрии, рекламных идентификаторов и отправки отчётов об ошибках. Всё, что программа знает, лежит на вашем компьютере.

## Что хранится на вашем компьютере
- Данные программы: `%APPDATA%\NodesManager` (профили, избранное, наборы настроек, кэш превью, резервные копии `db.json`, скачанные архивы модов).
- Файлы игры в папке пользователя BeamNG (`%LOCALAPPDATA%\BeamNG\BeamNG.drive\current`): список включённых модов `db.json`, папка `mods`, настройки игры, превью. Программа меняет их только по вашему действию.
- В **папку установки игры** программа ничего не пишет.

Удалить всё это можно, удалив папку `%APPDATA%\NodesManager` и саму программу.

## Куда программа ходит в сеть
Только когда это нужно открытой вами функции:
- `beamng.com` и `media-cdn.beamng.com` — «Моды → Репозиторий» (страницы модов, картинки) и новости; запросы редкие, с кэшем 10 минут и честным названием программы в запросе;
- хранилище файлов модов — только когда вы нажали «Скачать»;
- `api.steampowered.com` и `clan.akamai.steamstatic.com` — новости игры;
- адреса, которые вы сами вставили в «Установить по ссылке» (например Google Drive, Dropbox);
- `github.com` (публичный репозиторий релизов `LetsFokinGo/nodes-manager-releases`) — самообновление программы: проверка файла `latest.json` при запуске (не чаще раза в сутки, выключается в «Настройки → Дополнительно → Обновления приложения») и скачивание установщика, только когда вы нажали «Установить и перезапустить». В запросе — версия программы и система (Windows, архитектура); ничего о вас и ваших модах;
- `raw.githubusercontent.com` (тот же репозиторий) — список поддержавших на вкладке «О программе»: файл `supporters.json`, не чаще раза в сутки; без данных о вас.
- `127.0.0.1` — связь с игрой на вашем компьютере, наружу не выходит.

Эти сайты видят ваши запросы так же, как при открытии в браузере (ваш IP-адрес, название программы). Прокси включается в «Настройки → Папки и файлы».

## Чего нет
Нет аккаунтов и сервера автора, нет передачи списка модов, профилей, путей и файлов третьим лицам. Самообновление ничего не ставит без вашего нажатия, а каждое обновление проверяется цифровой подписью автора (подпись обновлений Tauri, minisign) до установки: если подпись не совпала, установка отменяется. Новую версию можно и скачать вручную со страницы релизов.

## Поддержка проекта (Boosty)
Поддержка добровольная и ничего не открывает в программе: платных функций нет. Платёж принимает и обрабатывает Boosty по своим правилам, в том числе о возвратах; данные вашей карты автор не получает. Если вы поддержали проект и согласились на это на странице Boosty, ваш ник на Boosty и сумма показываются в списке поддержавших: в программе («О программе → Поддержать») и в открытом файле `supporters.json` в репозитории проекта. Чтобы убрать или изменить запись, напишите автору в Boosty или в Issues.

## Дети и персональные данные
Программа не требует персональных данных ни от кого, включая детей. Кроме ника и суммы поддержавших (раздел выше), автор персональные данные пользователей не обрабатывает.

## Изменения
Если политика изменится, новая версия будет в репозитории проекта вместе с релизом. Контакт — Issues публичного репозитория проекта или почта nodesmanager777@gmail.com.

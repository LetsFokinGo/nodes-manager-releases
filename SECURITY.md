# Security

**Nodes Manager is a free, unofficial mod manager for BeamNG.drive. It sends nothing to the author, does not store your mods on any server and never writes to the game installation folder.** Русский — ниже.

## What the app reads and writes
| Where | What | When |
|---|---|---|
| BeamNG user folder (`…\BeamNG.drive\current`) | `db.json` (which mods are enabled), `mods\`, game settings, `vehicles\…` previews | only on your action; `db.json` is backed up before every write |
| `%APPDATA%\NodesManager` | profiles, favourites, preview cache, backups, downloaded archives | always |
| Game installation folder | **nothing is written** | never |

Close the game before the app changes `db.json`, otherwise the game overwrites the changes. While the game is running, the app does not write `db.json`.

## How to roll back
“Settings → Folders and files → Maintenance → Settings backup → Restore from backup” returns settings, car configs and `db.json`. If `db.json` is damaged, the app offers “Restore from backup” itself. An installed mod is removed as usual — it lives in `mods\`.

## Network
`beamng.com` (repository, news), mod file storage (when you click “Download”), Steam news, `github.com` (new version check and installer download when you click) and `raw.githubusercontent.com` (the supporters list on the “About” tab, once a day). Nothing else. No analytics, ads or accounts. The full list is in the [Privacy Policy](PRIVACY.md).

## App updates
Once a day the app checks for a new version (can be turned off in “Settings → Advanced → App updates”) and only shows a banner. Download and installation happen when you click “Install and restart”. Update installers are signed with the author's key (Tauri update signature): the app verifies the signature before running the installer and cancels if it does not match. Updates come only from this repository.

## Where to get the app
Only from [Releases](../../releases) of this repository. A SHA-256 checksum is next to the installer; check it with `Get-FileHash <file> -Algorithm SHA256`. The installer is not yet code-signed with a Windows certificate. Copies on other sites are not ours.

## If Windows or an antivirus complains
New, little-known programs often get a SmartScreen warning. That is what the checksum and the VirusTotal link in every release are for. If your antivirus flags the file, open an [issue](../../issues/new/choose): we will submit it to the vendor as a false positive.

## Reporting a vulnerability
Please do not post details of a security problem publicly. Use [private vulnerability reporting](../../security/advisories/new) on this repository. You will get an answer within a few days.

## Source code
Closed. Instead we describe openly what the app does with your files (table above) and publish what you can verify: checksums, the list of third-party components ([THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)) and the privacy policy.

---

# Безопасность

**Nodes Manager — неофициальный бесплатный менеджер модов для BeamNG.drive. Он ничего не отправляет автору, не хранит ваши моды на сервере и не пишет в папку установки игры.**

## Что программа читает и пишет
| Где | Что | Когда |
|---|---|---|
| Папка пользователя BeamNG (`…\BeamNG.drive\current`) | `db.json` (какие моды включены), `mods\`, настройки игры, превью `vehicles\…` | только по вашему действию; перед каждой записью `db.json` — резервная копия |
| `%APPDATA%\NodesManager` | профили, избранное, кэш превью, резервные копии, скачанные архивы | всегда |
| Папка установки игры | **ничего не пишется** | никогда |

Игру нужно закрыть, прежде чем программа изменит `db.json`, иначе игра перезапишет изменения. Пока игра запущена, программа не пишет в `db.json`.

## Как откатить
«Настройки → Папки и файлы → Обслуживание → Резервная копия настроек → Восстановить из копии» возвращает настройки, конфиги машин и `db.json`. Если `db.json` испорчен, программа сама предлагает «Восстановить из копии». Установленный мод удаляется как обычно — он лежит в `mods\`.

## Куда программа ходит в сеть
`beamng.com` (репозиторий, новости), хранилище файлов модов (по вашей кнопке «Скачать»), новости Steam, `github.com` (проверка новой версии и скачивание установщика по вашей кнопке) и `raw.githubusercontent.com` (список поддержавших на вкладке «О программе», раз в сутки). Больше никуда. Без аналитики, рекламы и аккаунтов. Полный список — в [Политике конфиденциальности](PRIVACY.md).

## Обновления программы
Раз в сутки программа проверяет, нет ли новой версии (выключается в «Настройки → Дополнительно → Обновления приложения»), и только показывает плашку. Скачивание и установка — по кнопке «Установить и перезапустить». Установщик обновления подписан ключом автора (подпись обновлений Tauri): программа проверяет подпись до запуска и отменяет установку, если она не совпала. Обновления берутся только из этого репозитория.

## Откуда брать программу
Только из раздела [Releases](../../releases) этого репозитория. Рядом с установщиком лежит контрольная сумма SHA-256; проверьте: `Get-FileHash <файл> -Algorithm SHA256`. Сертификатом Windows установщик пока не подписан. Копии на других сайтах не наши.

## Если Windows или антивирус ругается
Новые малоизвестные программы часто получают предупреждение SmartScreen. Для этого и нужны контрольная сумма и ссылка на VirusTotal в каждом релизе. Если антивирус ругается, напишите в [Issues](../../issues/new/choose): мы отправим файл производителю как ложное срабатывание.

## Сообщить об уязвимости
Пожалуйста, не публикуйте подробности проблемы безопасности открыто. Используйте [закрытое сообщение об уязвимости](../../security/advisories/new) в этом репозитории. Ответ — в течение нескольких дней.

## Исходный код
Закрыт. Вместо этого мы открыто описываем, что программа делает с вашими файлами (таблица выше), и даём то, что можно проверить: контрольные суммы, список сторонних компонентов ([THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)), политику конфиденциальности.

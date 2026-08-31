<div align="center">

<img src="frontend/public/favicon.svg" width="30%" alt="Logo">

### Картографы онлайн
##### Онлайн-версия настольной игры «Картографы».
###### Компоненты игры, иллюстрации и художественный текст защищены авторским правом (© 2020 Thunderworks Games) и здесь **не** воспроизводятся.

</div>

Go-бэкенд, React-фронтенд, монорепа.

Правила для референса: <https://tesera.ru/images/items/1711725/Rules-kartografy-rus.pdf>


## Правила сервера
- читы - бан
- кемперство - бан
- оскорбление администрации - расстрел, потом бан

## Запуск

```sh
cp .env.example .env
docker compose up
```
Фронт поднимается на <http://localhost:5173>

Подробнее:
[docs/local-setup.md](docs/local-setup.md).

## Документация

| файл | о чём |
|------|-------|
| [docs/local-setup.md](docs/local-setup.md) | локальное окружение: запуск, тесты, команды на каждый день, частые грабли |
| [docs/game-rules.md](docs/game-rules.md) | задача игры и правила своими словами + таблица «термин из правил → имя в коде» |
| [docs/architecture.md](docs/architecture.md) | архитектура и принятые договорённости |
| [docs/stack.md](docs/stack.md) | стек разработки |
| [docs/glossary.md](docs/glossary.md) | словарик: 73 термина, на него ссылается вся остальная документация |
| [docs/roadmap.md](docs/roadmap.md) | процесс разработки |

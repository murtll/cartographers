<div align="center">

<img src="frontend/public/favicon.svg" width="30%" alt="Logo">

### Картографы онлайн
##### Онлайн-версия настольной игры «Картографы».
###### Компоненты игры, иллюстрации и художественный текст защищены авторским правом (© 2020 Thunderworks Games) и здесь **не** воспроизводятся.

</div>

Стэк:
- монорепа
- db - postgres
- backend - go, chi
- frontend - react, vite

## Правила сервера
- читы - бан
- кемперство - бан
- оскорбление администрации - расстрел, потом бан

Правила для референса: [текст](https://tesera.ru/images/items/1711725/Rules-kartografy-rus.pdf) / [видео](https://youtu.be/Mem57wGkQuU)

## Запуск

```sh
cp backend/.env.example backend/.env
docker compose up
```
Фронт поднимается на <http://localhost:5173>

## Локальная разработка

Для локальной Go разработки используются: [air](https://github.com/air-verse/air), [migrate](https://github.com/golang-migrate/migrate)

# M0.5 · Сборка и запуск целиком

**Фаза 3.** Нужно сначала: [m05-frontend.md](m05-frontend.md), [m05-db-migrate-runner.md](m05-db-migrate-runner.md).
**Результат:** на чистой машине `git clone`, `cp .env.example .env`, `docker compose up` — и можно играть.

Это тоже мой шаг.

Этот шаг тоже мой. Docker, compose, nginx, healthcheck в словарике не объясняются
— на код это не влияет, всё нужное про запуск есть в `README.md` одной командой.

Compose уже есть, но он в режиме разработки: фронтенд поднимается через `npm run
dev` с монтированием папки.

- [ ] `frontend/Dockerfile` для сборки статики (nginx или отдача из бэкенда)
- [ ] Прокси `/api` на бэкенд в конфиге Vite
- [ ] Healthcheck у `backend` — с настоящей проверкой базы, не константой
- [ ] Второй бинарник `./cmd/migrate` и одноразовый сервис [миграций](../glossary.md#g-migration) в compose
- [ ] Убрать из `backend/Dockerfile` слой `go mod download`
- [ ] README: раздел про запуск дополнить, если что-то поменялось

Про `go mod download`: сейчас в Dockerfile есть слой `COPY go.mod go.sum* ./` и
`RUN go mod download`. Как только в [`go.mod`](../glossary.md#g-gomod) появится testcontainers, этот слой
начнёт тянуть примерно 79 МБ — клиент Docker, gRPC, OpenTelemetry — чтобы собрать
бинарник, который ничего из этого не импортирует. Go сам скачает только нужное, если
просто оставить `go build ./cmd/server`.

Главная проверка этапа, на чистой машине:

```
git clone <репозиторий>
cp .env.example .env
docker compose up
```

Открыть браузер, сыграть партию. Сработало — M0.5 закрыт.

---

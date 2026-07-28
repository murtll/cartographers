# Cartographers Online

Online implementation of the *Cartographers* board game (Jordy Adan, 2020).
Go backend + React frontend in a single repository.

Rules are the source of truth:
<https://tesera.ru/images/items/1711725/Rules-kartografy-rus.pdf>

Game components, artwork and card flavour text are copyrighted
(© 2020 Thunderworks Games) and are **not** reproduced here — the graphics in
this project are original.

## Run locally

```sh
cp .env.example .env
docker compose up
```

- frontend — <http://localhost:5173>
- backend health check — <http://localhost:8080/healthz>
- postgres — `localhost:5432`

## Layout

```
backend/    Go server
  cmd/server/       entry point
  internal/game/    game rules — no HTTP, no database
  internal/room/    one goroutine per room, event fold, per-player projection
  internal/store/   Postgres access
  internal/api/     HTTP handlers and SSE
  migrations/       SQL migrations
  data/boards/      board layouts (mountains, ruins, chasms)
frontend/   React + TypeScript (Vite)
infra/      deployment, currently a placeholder
docs/plans/ design and step-by-step plans (written in Russian)
```

The `internal/game` package must never import `net/http` or a database driver.
Rules are pure functions so they can be tested without a server.

## Conventions

Code, identifiers, comments, commit messages and PR descriptions are English.
Only the documents under `docs/plans/` are written in Russian.

## Current status

Milestone **M0.5** — skeleton with a degenerate game (all shapes are a single
cell). See [docs/plans/20260728-cartographers-m05.md](docs/plans/20260728-cartographers-m05.md).

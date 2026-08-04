import { useState } from 'react'
import { BoardGrid } from '../components/BoardGrid'
import { BoardLegend } from '../components/BoardLegend'
import { Countdown } from '../components/Countdown'
import { PlayerList } from '../components/PlayerList'
import { TerrainPicker } from '../components/TerrainPicker'
import { BOARD_NAMES, PHASE_NAMES } from '../labels'
import { STUB_BOARDS, stubSnapshot, stubSubmitMove } from '../stubs'
import type { Terrain } from '../types'

type Props = {
  code: string
  nick: string
  boardId: string
  onLeave: () => void
}

/** Комната: карта владений, счётчики и варианты хода. */
export function Room({ code, nick, boardId, onLeave }: Props) {
  // Настоящее состояние приедет потоком событий: сервер присылает снапшот целиком на
  // каждое изменение, а браузер просто рисует последний.
  const [snapshot, setSnapshot] = useState(() => stubSnapshot(nick, boardId))

  // Что игрок выбрал в вариантах хода. Карта раунда меняется, поэтому выбор
  // проверяем на актуальность, а не чиним эффектом.
  const [picked, setPicked] = useState<Terrain | null>(null)

  // Разметка планшета приезжает отдельным запросом и за партию не меняется.
  const layout = STUB_BOARDS[snapshot.board_id]
  const board = snapshot.boards[snapshot.you]

  const terrains = snapshot.options.flatMap((option) => option.terrains)
  const active = picked !== null && terrains.includes(picked) ? picked : terrains[0]

  function draw(row: number, col: number) {
    setSnapshot((current) => stubSubmitMove(current, active, row, col))
  }

  return (
    <section className="screen">
      <header className="room__head">
        <div>
          <h1 className="room__title">Комната {code}</h1>
          <p className="note">{BOARD_NAMES[snapshot.board_id] ?? layout.name}</p>
        </div>

        <ul className="stats">
          <li>
            <span className="stats__label">Раунд</span>
            <span className="stats__value">{snapshot.round}</span>
          </li>
          <li>
            <span className="stats__label">Фаза</span>
            <span className="stats__value">
              {PHASE_NAMES[snapshot.phase] ?? snapshot.phase}
            </span>
          </li>
          <li>
            <span className="stats__label">До дедлайна</span>
            <span className="stats__value">
              <Countdown deadline={snapshot.deadline} />
            </span>
          </li>
          <li>
            <span className="stats__label">Монеты</span>
            <span className="stats__value">{board.coins}</span>
          </li>
          <li>
            <span className="stats__label">Карт в колоде</span>
            <span className="stats__value">{snapshot.deck_remaining}</span>
          </li>
        </ul>

        <button type="button" className="button" onClick={onLeave}>
          Выйти
        </button>
      </header>

      <div className="room__body">
        <div className="room__board">
          <BoardGrid layout={layout} drawn={board.drawn} onDraw={draw} />
          <BoardLegend />
        </div>

        <aside className="room__side">
          <h2>Ход</h2>
          <TerrainPicker options={snapshot.options} active={active} onPick={setPicked} />
          <p className="note">
            Выбери тип местности и кликни по свободной клетке. Фигура в M0.5 всегда из
            одной клетки.
          </p>

          <h2>Игроки</h2>
          <PlayerList players={snapshot.players} you={snapshot.you} />
        </aside>
      </div>
    </section>
  )
}

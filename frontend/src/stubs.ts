// Единственный файл с выдуманными данными. Когда появится сервер, он удаляется целиком,
// а экраны переключаются на настоящие ответы:
//
//   разметка планшета — GET /api/boards/{id}, один раз за партию;
//   снапшот состояния — потоком событий, целиком на каждое изменение;
//   ход игрока — запрос на сервер, новое состояние приезжает тем же потоком.
//
// Формы полей здесь окончательные, они описаны в types.ts. Выдуманы только значения.

import type { BoardLayout, MoveOption, Snapshot, Terrain } from './types'

/** Копии `backend/internal/boards/*.json` — по файлу на сторону планшета. */
export const STUB_BOARDS: Record<string, BoardLayout> = {
  wildlands: {
    id: 'wildlands',
    name: 'Wildlands',
    grid: [
      '...........',
      '...M.R.....',
      '.R......MR.',
      '...........',
      '...........',
      '.....M.....',
      '...........',
      '...........',
      '.RM......R.',
      '.....R.M...',
      '...........',
    ],
  },
  wasteland: {
    id: 'wasteland',
    name: 'Wasteland',
    grid: [
      '...........',
      '......R.M..',
      '..RM.......',
      '.....C.....',
      '....CCR....',
      '....CCC....',
      '.R...C.....',
      '........R..',
      '.........M.',
      '..MR.......',
      '...........',
    ],
  },
}

/** Идентификатор стороны по умолчанию — той, что в примере снапшота. */
export const DEFAULT_BOARD_ID = 'wildlands'

/** Сколько сервер даёт на ход. */
const ROUND_SECONDS = 30

/**
 * Карты раундов. У настоящих карт исследования наборы фигур разные, но в M0.5 фигура
 * всегда из одной клетки, поэтому от карты к карте меняется только список типов
 * местности. Гор в этих списках нет и быть не может.
 */
const STUB_OPTIONS: MoveOption[][] = [
  [{ shape_id: 'single', terrains: ['forest', 'village'] }],
  [{ shape_id: 'single', terrains: ['water', 'farm'] }],
  [{ shape_id: 'single', terrains: ['forest', 'water', 'monster'] }],
]

/** Пустая карта владений: 11×11 клеток `"empty"`, потому что игрок ещё не рисовал. */
function emptyDrawn(size: number): Terrain[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, (): Terrain => 'empty'),
  )
}

/**
 * Дедлайн раунда. У сервера это абсолютное время, посчитанное по его часам; заглушка
 * считает от «сейчас», иначе отсчёт был бы просрочен ещё до открытия страницы.
 */
function deadlineIn(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString()
}

/** Код комнаты. На сервере его выдаёт комната при создании. */
export function stubRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

/** Состояние партии на входе в комнату. */
export function stubSnapshot(playerName: string, boardId: string): Snapshot {
  const size = STUB_BOARDS[boardId].grid.length
  return {
    seq: 42,
    phase: 'cartography',
    round: 7,
    deadline: deadlineIn(ROUND_SECONDS),
    you: 'p1',
    board_id: boardId,
    options: STUB_OPTIONS[0],
    constraint: null,
    boards: { p1: { drawn: emptyDrawn(size), coins: 0 } },
    players: [{ id: 'p1', name: playerName, submitted: false }],
    deck_remaining: 9,
  }
}

/**
 * Заглушка «сервер принял ход»: рисует клетку и возвращает новое состояние. Комната в
 * M0.5 на одного игрока, поэтому раунд закрывается сразу за ходом и тут же открывается
 * следующий — с новой картой и новым дедлайном.
 *
 * Монет заглушка не начисляет: монета за окружённую гору — правило, а правила считает
 * сервер, у него для этого есть весь лог событий.
 */
export function stubSubmitMove(
  snapshot: Snapshot,
  terrain: Terrain,
  row: number,
  col: number,
): Snapshot {
  const board = snapshot.boards[snapshot.you]
  const drawn = board.drawn.map((cells, r) =>
    r === row ? cells.map((cell, c) => (c === col ? terrain : cell)) : cells,
  )
  const round = snapshot.round + 1

  return {
    ...snapshot,
    seq: snapshot.seq + 1,
    round,
    deadline: deadlineIn(ROUND_SECONDS),
    options: STUB_OPTIONS[round % STUB_OPTIONS.length],
    boards: { ...snapshot.boards, [snapshot.you]: { ...board, drawn } },
    deck_remaining: Math.max(0, snapshot.deck_remaining - 1),
  }
}

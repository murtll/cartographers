// Русские подписи к тому, что в данных названо по-английски. Держим их в одном месте:
// в коде живут идентификаторы с сервера, на экране — слова из правил.

import type { BoardCell, Terrain } from './types'

export const TERRAIN_NAMES: Record<Terrain, string> = {
  empty: 'пусто',
  forest: 'лес',
  village: 'поселение',
  water: 'водоём',
  farm: 'поля',
  monster: 'монстры',
}

export const CELL_NAMES: Record<BoardCell, string> = {
  '.': 'обычная клетка',
  M: 'гора',
  R: 'руины',
  C: 'ущелье',
}

/** Планшеты. Ключ — `board_id`; со временем их станет больше. */
export const BOARD_NAMES: Record<string, string> = {
  wildlands: 'Дикие земли',
  wasteland: 'Пустошь',
}

/** Фигуры. В M0.5 сервер присылает только `single`. */
export const SHAPE_NAMES: Record<string, string> = {
  single: 'одна клетка',
}

/** Фазы раунда. Список значений сервер ещё не зафиксировал, поэтому с запасом. */
export const PHASE_NAMES: Record<string, string> = {
  exploration: 'исследование',
  cartography: 'картография',
}

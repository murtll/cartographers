// Работа с сеткой: как достать символ разметки и какие клетки предлагать под клик.

import type { BoardCell, BoardLayout, Terrain } from './types'

/** Что напечатано на клетке планшета. */
export function cellAt(layout: BoardLayout, row: number, col: number): BoardCell {
  return layout.grid[row][col] as BoardCell
}

/**
 * Свободна ли клетка, то есть стоит ли предлагать по ней клик.
 *
 * Гора и ущелье заняты типографией — поверх них рисовать нельзя. Руины занятыми не
 * считаются: на них рисовать можно и нужно, они свободны, пока игрок сам на них не
 * нарисовал. Это самое частое место, где путают руины с горой.
 *
 * Разрешён ход или нет, решает всё равно сервер. Браузер только не предлагает
 * заведомо запрещённое, чтобы не ловить отказ на каждый второй клик.
 */
export function isCellFree(
  layout: BoardLayout,
  drawn: Terrain[][],
  row: number,
  col: number,
): boolean {
  const cell = cellAt(layout, row, col)
  return cell !== 'M' && cell !== 'C' && drawn[row][col] === 'empty'
}

import { cellAt, isCellFree } from '../board'
import { CELL_NAMES, TERRAIN_NAMES } from '../labels'
import type { BoardCell, BoardLayout, Terrain } from '../types'

type Props = {
  /** Разметка планшета: горы, руины, ущелья. За партию не меняется. */
  layout: BoardLayout
  /** Что игрок нарисовал сам. Гор здесь нет — они только в разметке. */
  drawn: Terrain[][]
  onDraw: (row: number, col: number) => void
}

const MARK_CLASSES: Record<BoardCell, string> = {
  '.': '',
  M: 'cell--mountain',
  R: 'cell--ruins',
  C: 'cell--chasm',
}

/** Подпись клетки для наведения и для скринридера. */
function describe(mark: BoardCell, terrain: Terrain): string {
  const marked = mark === '.' ? [] : [CELL_NAMES[mark]]
  const drawnOn = terrain === 'empty' ? 'свободна' : `нарисовано: ${TERRAIN_NAMES[terrain]}`
  return [...marked, drawnOn].join(', ')
}

/**
 * Карта владений: сетка 11×11. Клетка — это кнопка, поэтому по полю можно ходить
 * табом, а занятые клетки просто выключены.
 */
export function BoardGrid({ layout, drawn, onDraw }: Props) {
  const size = layout.grid.length

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${size}, var(--cell))` }}
    >
      {drawn.map((cells, row) =>
        cells.map((terrain, col) => {
          const mark = cellAt(layout, row, col)
          const free = isCellFree(layout, drawn, row, col)
          const classes = ['cell', MARK_CLASSES[mark], `cell--${terrain}`]

          return (
            <button
              key={`${row}:${col}`}
              type="button"
              className={classes.filter(Boolean).join(' ')}
              disabled={!free}
              onClick={() => onDraw(row, col)}
              title={describe(mark, terrain)}
              aria-label={`строка ${row + 1}, столбец ${col + 1}: ${describe(mark, terrain)}`}
            />
          )
        }),
      )}
    </div>
  )
}

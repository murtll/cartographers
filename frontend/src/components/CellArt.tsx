import type { ReactNode } from 'react'
import type { BoardCell, Terrain } from '../types'

type Props = {
  mark: BoardCell
  terrain: Terrain
}

/**
 * Рисунок в клетке. Всё чертится линиями в svg и берёт цвет от самой клетки, поэтому
 * одна и та же картинка одинаково живёт и в поле 11×11, и в легенде, и в кнопках выбора
 * местности.
 *
 * Рисунки нарочно грубые, в одну краску: это гравюра на карте, а не иллюстрация. Своя,
 * не срисованная с настольной игры — её картинки защищены авторским правом.
 */
export function CellArt({ mark, terrain }: Props) {
  const art = terrain === 'empty' ? MARKS[mark] : TERRAINS[terrain]

  if (art === undefined) {
    return null
  }

  return (
    <svg className="art" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      {art}
    </svg>
  )
}

/** Заливка: рисунок вырезан в краске. Обводка: линии поверх заливки. */
const filled = { fill: 'currentColor' }
const stroked = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** То, что рисует игрок. */
const TERRAINS: Record<Exclude<Terrain, 'empty'>, ReactNode> = {
  // Ель: три яруса и ствол.
  forest: (
    <g {...filled}>
      <path d="M12 2.5 16 8.5H8ZM12 6.5 17.5 13.5H6.5ZM12 10.5 19 18.5H5Z" />
      <path d="M10.9 18h2.2v4h-2.2z" />
    </g>
  ),
  // Дом с проёмом двери: дверь — дырка в краске, поэтому видно цвет клетки.
  village: (
    <g fill="currentColor" fillRule="evenodd">
      <path d="M12 2.6 21 11.2V21.6H3V11.2ZM10.4 21.6V15.4h3.2v6.2Z" />
    </g>
  ),
  // Три волны.
  water: (
    <g {...stroked}>
      <path d="M3 8q2.8-2.6 5.6 0t5.6 0 5.6 0" />
      <path d="M3 13.4q2.8-2.6 5.6 0t5.6 0 5.6 0" />
      <path d="M3 18.8q2.8-2.6 5.6 0t5.6 0 5.6 0" />
    </g>
  ),
  // Колос над вспаханными бороздами.
  farm: (
    <g {...stroked}>
      <path d="M12 14.4V3" />
      <path d="M12 6.4 9 3.8M12 6.4 15 3.8M12 10 9 7.4M12 10 15 7.4M12 13.6 9.4 11.2M12 13.6 14.6 11.2" />
      <path d="M3 17.8q9-3.4 18 0M3 21.6q9-3.4 18 0" />
    </g>
  ),
  // Три следа когтей: к низу сходят на нет, как царапина.
  monster: (
    <g {...filled}>
      <path d="M4.6 3.4c2.8 5.2 4 10.6 3.4 16.8-1.4-6-2.8-11.4-4.8-16.2z" />
      <path d="M10.6 2.6c3 5.6 4.2 11.4 3.6 18-1.5-6.4-3-12.2-5-17.4z" />
      <path d="M16.8 4.2c2.6 4.8 3.6 9.6 3.2 15.2-1.3-5.4-2.6-10.4-4.4-14.6z" />
    </g>
  ),
}

/** То, что напечатано на планшете. Ущелье рисует не картинка, а штриховка в css. */
const MARKS: Partial<Record<BoardCell, ReactNode>> = {
  // Хребет о двух вершинах.
  M: (
    <g {...filled}>
      <path d="M2 20.8 8.8 7.4 12.4 13.8 16.6 5.4 22 20.8Z" />
    </g>
  ),
  // Обломки колонн и упавшая перекладина.
  R: (
    <g {...filled}>
      <path d="M4 6.6h7.6v2.4H4z" />
      <path d="M5.4 21.4V10.4l1.4 1.4 1.2-1.4 1.4 1.4V21.4Z" />
      <path d="M13.4 21.4V13.6l1.3 1.3 1.2-1.3 1.5 1.3V21.4Z" />
    </g>
  ),
}

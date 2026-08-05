import { CellArt } from './CellArt'

/**
 * Что означает разметка планшета. Нужна ровно затем, чтобы гора и руины не читались как
 * одно и то же: гора занята и рисовать поверх нельзя, руины свободны.
 */
export function BoardLegend() {
  return (
    <ul className="legend">
      <li>
        <span className="swatch cell--mountain cell--empty">
          <CellArt mark="M" terrain="empty" />
        </span>
        гора: занята, рисовать нельзя
      </li>
      <li>
        <span className="swatch cell--ruins cell--empty">
          <CellArt mark="R" terrain="empty" />
        </span>
        руины: свободны, рисовать можно
      </li>
      <li>
        <span className="swatch cell--chasm cell--empty" />
        ущелье: занято, рисовать нельзя
      </li>
    </ul>
  )
}

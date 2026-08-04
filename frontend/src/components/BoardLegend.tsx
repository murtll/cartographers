/**
 * Что означает разметка планшета. Нужна ровно затем, чтобы гора и руины не читались
 * как одно и то же: гора занята и рисовать поверх нельзя, руины свободны.
 */
export function BoardLegend() {
  return (
    <ul className="legend">
      <li>
        <span className="swatch cell--mountain" />
        гора: занята, рисовать нельзя
      </li>
      <li>
        <span className="swatch cell--ruins" />
        руины: свободны, рисовать можно
      </li>
      <li>
        <span className="swatch cell--chasm" />
        ущелье: занято, только на стороне Б
      </li>
    </ul>
  )
}

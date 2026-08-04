import { SHAPE_NAMES, TERRAIN_NAMES } from '../labels'
import type { MoveOption, Terrain } from '../types'

type Props = {
  /** Что предложила открытая карта раунда. */
  options: MoveOption[]
  active: Terrain
  onPick: (terrain: Terrain) => void
}

/**
 * Варианты хода с карты раунда: фигура и типы местности к ней.
 *
 * Гор в списке не бывает никогда — сервер их и не пришлёт. В M0.5 фигура всегда из
 * одной клетки, поэтому ход целиком — это «выбрал тип местности, кликнул по клетке».
 */
export function TerrainPicker({ options, active, onPick }: Props) {
  return (
    <div className="picker">
      {options.map((option) => (
        <div key={option.shape_id} className="picker__option">
          <p className="picker__shape">
            Фигура: {SHAPE_NAMES[option.shape_id] ?? option.shape_id}
          </p>
          <div className="picker__terrains">
            {option.terrains.map((terrain) => (
              <button
                key={terrain}
                type="button"
                className="terrain"
                aria-pressed={terrain === active}
                onClick={() => onPick(terrain)}
              >
                <span className={`swatch cell--${terrain}`} />
                {TERRAIN_NAMES[terrain]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

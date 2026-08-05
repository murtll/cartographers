import { useState } from 'react'
import { SCORING_NOTE, TERRAIN_HINTS } from '../hints'
import { SHAPE_NAMES, TERRAIN_NAMES } from '../labels'
import type { MoveOption, Terrain } from '../types'
import { CellArt } from './CellArt'

type Props = {
  /** Что предложила открытая карта раунда. */
  options: MoveOption[]
  active: Terrain
  onPick: (terrain: Terrain) => void
}

/**
 * Варианты хода с карты раунда: фигура и типы местности к ней.
 *
 * Клик по типу местности выбирает его и раскрывает под кнопками справку — что он даёт и
 * когда его ставить. Повторный клик по тому же типу справку сворачивает, выбор при этом
 * остаётся: закрыть подсказку и потерять ход — разные вещи.
 *
 * Гор в списке не бывает никогда — сервер их и не пришлёт. В M0.5 фигура всегда из одной
 * клетки, поэтому ход целиком — это «выбрал тип местности, кликнул по клетке».
 */
export function TerrainPicker({ options, active, onPick }: Props) {
  const [opened, setOpened] = useState<Terrain | null>(null)

  function choose(terrain: Terrain) {
    onPick(terrain)
    setOpened((current) => (current === terrain ? null : terrain))
  }

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
                aria-expanded={terrain === opened}
                onClick={() => choose(terrain)}
              >
                <span className={`swatch cell--${terrain}`}>
                  <CellArt mark="." terrain={terrain} />
                </span>
                {TERRAIN_NAMES[terrain]}
              </button>
            ))}
          </div>

          {opened !== null && opened !== 'empty' && option.terrains.includes(opened) ? (
            <div className="hint">
              <p className="hint__name">{TERRAIN_NAMES[opened]}</p>
              <p>
                <span className="hint__label">Даёт.</span> {TERRAIN_HINTS[opened].gives}
              </p>
              <p>
                <span className="hint__label">Когда ставить.</span>{' '}
                {TERRAIN_HINTS[opened].when}
              </p>
              <p className="note">{SCORING_NOTE}</p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

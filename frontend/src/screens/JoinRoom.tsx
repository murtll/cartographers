import { useState } from 'react'
import { BOARD_NAMES } from '../labels'
import { DEFAULT_BOARD_ID, STUB_BOARDS } from '../stubs'

type Props = {
  /** `create` — комнату создаём сами, `find` — входим в чужую по коду. */
  mode: 'create' | 'find'
  /** Код, который уже известен: при создании комнаты его выдаёт сервер. */
  initialCode: string
  onEnter: (code: string, nick: string, boardId: string) => void
  onBack: () => void
}

/**
 * Вход в комнату: код и ник.
 *
 * Сторону планшета выбираем только при создании: у чужой комнаты она уже выбрана и
 * приедет со снапшотом в поле `board_id`.
 */
export function JoinRoom({ mode, initialCode, onEnter, onBack }: Props) {
  const [code, setCode] = useState(initialCode)
  const [nick, setNick] = useState('')
  const [boardId, setBoardId] = useState(DEFAULT_BOARD_ID)

  const ready = code.trim().length > 0 && nick.trim().length > 0

  return (
    <section className="screen screen--center">
      <h1>{mode === 'create' ? 'Создать комнату' : 'Найти комнату'}</h1>

      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) {
            onEnter(code.trim().toUpperCase(), nick.trim(), boardId)
          }
        }}
      >
        <label className="field">
          Код комнаты
          <input
            className="input"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={12}
            autoComplete="off"
            autoFocus={mode === 'find'}
          />
        </label>

        <label className="field">
          Ник
          <input
            className="input"
            value={nick}
            onChange={(event) => setNick(event.target.value)}
            placeholder="Ваня"
            maxLength={24}
            autoComplete="off"
            autoFocus={mode === 'create'}
          />
        </label>

        {mode === 'create' ? (
          <fieldset className="field">
            <legend>Сторона планшета</legend>
            {Object.keys(STUB_BOARDS).map((id) => (
              <label key={id} className="radio">
                <input
                  type="radio"
                  name="board"
                  value={id}
                  checked={id === boardId}
                  onChange={() => setBoardId(id)}
                />
                {BOARD_NAMES[id] ?? STUB_BOARDS[id].name}
              </label>
            ))}
          </fieldset>
        ) : null}

        <div className="actions">
          <button type="submit" className="button button--main" disabled={!ready}>
            Войти
          </button>
          <button type="button" className="button" onClick={onBack}>
            Назад
          </button>
        </div>
      </form>
    </section>
  )
}

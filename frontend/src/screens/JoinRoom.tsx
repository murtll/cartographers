import { useState } from 'react'
import { Link } from 'react-router'
import { BOARD_NAMES } from '../labels'
import { readNick } from '../nick'
import { DEFAULT_BOARD_ID, STUB_BOARDS } from '../stubs'

type Props = {
  /**
   * `find` — входим в чужую комнату по коду, `create` — созываем свою,
   * `invited` — пришли по ссылке, код уже в адресе и спросить надо только имя.
   */
  mode: 'find' | 'create' | 'invited'
  /** Код, который уже известен: сгенерированный или взятый из адреса. */
  initialCode?: string
  onSubmit: (code: string, nick: string, boardId: string) => void
}

const TITLES = {
  find: 'Найти комнату',
  create: 'Создать комнату',
  invited: 'Тебя позвали за стол',
}

/**
 * Вход в комнату: код и ник.
 *
 * Сторону планшета выбираем только при создании: у чужой комнаты она уже выбрана и
 * приедет со снапшотом в поле `board_id`.
 */
export function JoinRoom({ mode, initialCode = '', onSubmit }: Props) {
  const [code, setCode] = useState(initialCode)
  const [nick, setNick] = useState(readNick)
  const [boardId, setBoardId] = useState(DEFAULT_BOARD_ID)

  const ready = code.trim().length > 0 && nick.trim().length > 0

  return (
    <section className="screen screen--center">
      <h1 className="title">{TITLES[mode]}</h1>

      {mode === 'invited' ? (
        <p className="lead">
          Комната <strong>{initialCode}</strong>. Напиши, как тебя записать в свиток.
        </p>
      ) : null}

      <form
        className="form panel"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) {
            onSubmit(code.trim().toUpperCase(), nick.trim(), boardId)
          }
        }}
      >
        {mode === 'invited' ? null : (
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
        )}

        <label className="field">
          Ник
          <input
            className="input"
            value={nick}
            onChange={(event) => setNick(event.target.value)}
            placeholder="Ваня"
            maxLength={24}
            autoComplete="off"
            autoFocus={mode !== 'find'}
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
            {mode === 'invited' ? 'За стол' : 'Войти'}
          </button>
          <Link className="button" to="/">
            Назад
          </Link>
        </div>
      </form>
    </section>
  )
}

import { useState } from 'react'
import { applyTheme, readTheme, saveTheme } from '../theme'

/**
 * Переключатель темы. На кнопке нарисовано, куда она переключит: солнце — к дневному
 * пергаменту, луна — к карте при свече. Подпись для скринридера говорит то же словами,
 * иначе кнопка-иконка остаётся безымянной.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  function flip() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    saveTheme(next)
    setTheme(next)
  }

  const toDay = theme === 'dark'
  const label = toDay ? 'Дневная тема: пергамент' : 'Ночная тема: карта при свече'

  return (
    <button
      type="button"
      className="button button--icon"
      onClick={flip}
      aria-pressed={theme === 'dark'}
      aria-label={label}
      title={label}
    >
      {toDay ? SUN : MOON}
    </button>
  )
}

/** Солнце: диск и восемь лучей. */
const SUN = (
  <svg
    className="theme-icon"
    viewBox="0 0 24 24"
    role="presentation"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4.8" fill="currentColor" />
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </g>
  </svg>
)

/**
 * Луна: серп из двух дуг — внешней по кругу и внутренней навстречу ей. Радиус внутренней
 * дуги больше внешней: чем она прямее, тем толще серп, а тонкий на 18 пикселях исчезает.
 */
const MOON = (
  <svg
    className="theme-icon"
    viewBox="0 0 24 24"
    role="presentation"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M13.2 3.3A8.7 8.7 0 1 0 15.8 20.6A12.5 12.5 0 0 1 13.2 3.3Z"
    />
  </svg>
)

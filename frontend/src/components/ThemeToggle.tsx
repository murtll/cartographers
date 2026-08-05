import { useState } from 'react'
import { applyTheme, readTheme, saveTheme } from '../theme'

/**
 * Переключатель темы. На кнопке написано, куда она переключит, а не что включено сейчас —
 * так понятнее, что будет по нажатию.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  function flip() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    saveTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="button button--small"
      onClick={flip}
      aria-pressed={theme === 'dark'}
      title={
        theme === 'dark' ? 'Дневной пергамент' : 'Ночная карта: свет свечи на бумаге'
      }
    >
      {theme === 'dark' ? 'День' : 'Ночь'}
    </button>
  )
}

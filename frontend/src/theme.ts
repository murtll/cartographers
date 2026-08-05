// Тема переключается кнопкой, а не системной настройкой: на дневном пергаменте и на
// ночной карте при свече игра выглядит по-разному, и выбирать должен игрок. Выбор
// помнится в браузере, тема пишется атрибутом на <html>, а цвета к ней подобраны в
// index.css.

export type Theme = 'light' | 'dark'

const KEY = 'cartographers:theme'

export function readTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    // приватный режим браузера: хранилища нет, начинаем со светлой
    return 'light'
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // не сохранилось — тема просто вернётся к светлой в следующий раз
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

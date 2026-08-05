// Ник игрока помнится в браузере: по ссылке-приглашению человек попадает прямо в комнату,
// и спрашивать имя второй раз незачем. Это не личность игрока — её потом выдаст сервер, —
// а только то, как игрок сам себя записал.

const KEY = 'cartographers:nick'

export function readNick(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    // приватный режим браузера: хранилища нет, ник просто спросим снова
    return ''
  }
}

export function saveNick(nick: string): void {
  try {
    localStorage.setItem(KEY, nick)
  } catch {
    // не сохранилось — не беда, на игру это не влияет
  }
}

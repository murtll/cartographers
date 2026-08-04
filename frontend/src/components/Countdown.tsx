import { useEffect, useState } from 'react'

type Props = {
  /** Абсолютное время дедлайна с сервера, ISO 8601. */
  deadline: string
}

function format(seconds: number): string {
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  return `${mm}:${String(ss).padStart(2, '0')}`
}

/**
 * Обратный отсчёт до дедлайна раунда.
 *
 * Браузер только рисует остаток: часы на машине игрока могут быть любыми, поэтому
 * решение «время вышло» принимает сервер — он пришлёт следующий снапшот сам. Ноль на
 * экране значит «ждём сервер», а не «ход больше не примут».
 */
export function Countdown({ deadline }: Props) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [])

  const left = Math.max(0, Math.ceil((Date.parse(deadline) - now) / 1000))

  return (
    <span
      className={left === 0 ? 'countdown countdown--over' : 'countdown'}
      title={left === 0 ? 'время вышло, ждём сервер' : `дедлайн: ${deadline}`}
    >
      {format(left)}
    </span>
  )
}

import type { Player } from '../types'

type Props = {
  players: Player[]
  /** Идентификатор получателя снапшота: `you`. */
  you: string
}

/**
 * Кто за столом и кто уже сдал ход. В M0.5 комната на одного игрока, так что список
 * из одной строки — это норма, а не недоделка: второй игрок появится на M2.
 */
export function PlayerList({ players, you }: Props) {
  return (
    <ul className="players">
      {players.map((player) => (
        <li key={player.id} className="players__item">
          <span className="players__name">
            {player.name}
            {player.id === you ? <span className="badge">это ты</span> : null}
          </span>
          <span className={player.submitted ? 'players__done' : 'players__wait'}>
            {player.submitted ? 'ход сдан' : 'рисует'}
          </span>
        </li>
      ))}
    </ul>
  )
}

import { useState } from 'react'
import { Home } from './screens/Home'
import { JoinRoom } from './screens/JoinRoom'
import { Room } from './screens/Room'
import { stubRoomCode } from './stubs'

/**
 * Какой экран открыт. Данные экрана лежат рядом с его именем, поэтому «комната без
 * кода» просто не собирается.
 */
type Screen =
  | { name: 'home' }
  | { name: 'join'; mode: 'create' | 'find'; code: string }
  | { name: 'room'; code: string; nick: string; boardId: string }

/**
 * Навигация состоянием, без роутера.
 *
 * Экрана три, переходы линейные: главная → вход → комната. Роутер понадобится, когда
 * появится ссылка-приглашение в комнату, — вот тогда его и добавим, вместе с адресами,
 * которые есть смысл открывать напрямую.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  switch (screen.name) {
    case 'home':
      return (
        <Home
          onFind={() => setScreen({ name: 'join', mode: 'find', code: '' })}
          onCreate={() =>
            setScreen({ name: 'join', mode: 'create', code: stubRoomCode() })
          }
        />
      )

    case 'join':
      return (
        <JoinRoom
          mode={screen.mode}
          initialCode={screen.code}
          onEnter={(code, nick, boardId) =>
            setScreen({ name: 'room', code, nick, boardId })
          }
          onBack={() => setScreen({ name: 'home' })}
        />
      )

    case 'room':
      return (
        <Room
          code={screen.code}
          nick={screen.nick}
          boardId={screen.boardId}
          onLeave={() => setScreen({ name: 'home' })}
        />
      )
  }
}

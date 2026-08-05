import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router'
import { readNick, saveNick } from './nick'
import { Home } from './screens/Home'
import { JoinRoom } from './screens/JoinRoom'
import { Room } from './screens/Room'
import { stubRememberSide, stubRoomCode, stubSideFor } from './stubs'

/**
 * Адреса приложения:
 *
 *   /            главная
 *   /join        вход по коду комнаты
 *   /create      своя комната: код, ник, сторона планшета
 *   /room/:code  комната — этой ссылкой и зовут игроков
 *
 * Код комнаты живёт в пути, поэтому ссылку можно просто отдать другому человеку.
 * Экраны про адреса не знают: маршруты разбираются здесь и передают вниз готовые
 * значения.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<FindRoute />} />
      <Route path="/create" element={<CreateRoute />} />
      <Route path="/room/:code" element={<RoomRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/** Вход в чужую комнату: код игрок вводит руками. */
function FindRoute() {
  const navigate = useNavigate()

  return (
    <JoinRoom
      mode="find"
      onSubmit={(code, nick) => {
        saveNick(nick)
        navigate(`/room/${code}`)
      }}
    />
  )
}

/** Своя комната. Код на сервере выдаёт комната, поэтому он тут уже готовый. */
function CreateRoute() {
  const navigate = useNavigate()
  const [code] = useState(stubRoomCode)

  return (
    <JoinRoom
      mode="create"
      initialCode={code}
      onSubmit={(chosenCode, nick, boardId) => {
        saveNick(nick)
        stubRememberSide(chosenCode, boardId)
        navigate(`/room/${chosenCode}`)
      }}
    />
  )
}

/**
 * Комната по ссылке. Код в адресе есть всегда, а ника у пришедшего по ссылке может и не
 * быть — тогда сначала спрашиваем имя, никуда не уходя с адреса комнаты.
 */
function RoomRoute() {
  const { code = '' } = useParams()
  const [nick, setNick] = useState(readNick)
  const roomCode = code.toUpperCase()

  // Код в адресе приводим к одному виду, чтобы ссылка из строки браузера совпадала с
  // той, которой зовут игроков.
  if (code !== roomCode) {
    return <Navigate to={`/room/${roomCode}`} replace />
  }

  if (nick === '') {
    return (
      <JoinRoom
        mode="invited"
        initialCode={roomCode}
        onSubmit={(_code, chosenNick) => {
          saveNick(chosenNick)
          setNick(chosenNick)
        }}
      />
    )
  }

  return <Room code={roomCode} nick={nick} boardId={stubSideFor(roomCode)} />
}

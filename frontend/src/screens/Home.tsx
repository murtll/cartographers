import { Link } from 'react-router'
import { CompassRose } from '../components/CompassRose'
import { ThemeToggle } from '../components/ThemeToggle'

/** Титульная страница: отсюда либо ищем комнату по коду, либо созываем свою. */
export function Home() {
  return (
    <section className="screen screen--center">
      <div className="corner">
        <ThemeToggle />
      </div>

      <CompassRose />

      <h1 className="title">Картографы</h1>

      <p className="lead">
        Рисуем карту владений на сетке 11×11: лес, поселения, водоёмы, поля. Горы и
        ущелья на планшете уже стоят, руины ждут, пока на них нарисуют.
      </p>

      <div className="actions">
        <Link className="button button--main" to="/join">
          Найти комнату
        </Link>
        <Link className="button" to="/create">
          Создать комнату
        </Link>
      </div>

      <p className="note">
        Каркас на заглушках: сервера в этой сборке нет, данные выдуманы.
      </p>
    </section>
  )
}

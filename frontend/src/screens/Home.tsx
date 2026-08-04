type Props = {
  onFind: () => void
  onCreate: () => void
}

/** Первый экран: отсюда либо ищем комнату по коду, либо создаём свою. */
export function Home({ onFind, onCreate }: Props) {
  return (
    <section className="screen screen--center">
      <h1>Картографы</h1>
      <p className="lead">
        Рисуем карту владений на сетке 11×11: лес, поселения, водоёмы, поля. Горы и
        ущелья уже стоят на планшете, руины ждут, пока на них нарисуют.
      </p>
      <div className="actions">
        <button type="button" className="button button--main" onClick={onFind}>
          Найти комнату
        </button>
        <button type="button" className="button" onClick={onCreate}>
          Создать комнату
        </button>
      </div>
      <p className="note">
        Каркас на заглушках: сервера в этой сборке нет, данные выдуманы.
      </p>
    </section>
  )
}

/**
 * Роза ветров. Своя, нарисованная линиями: чертёж, а не картинка из коробки.
 * Цвет берёт от текста, поэтому одинаково живёт на светлом и тёмном.
 */
export function CompassRose() {
  return (
    <svg
      className="compass"
      viewBox="0 0 100 100"
      role="presentation"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <path d="M28 28 72 72M72 28 28 72" stroke="currentColor" strokeWidth="0.5" />
      <path
        d="M50 7 55 45 50 50 45 45zM93 50 55 55 50 50 55 45zM50 93 45 55 50 50 55 55zM7 50 45 45 50 50 45 55z"
        fill="currentColor"
      />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
    </svg>
  )
}

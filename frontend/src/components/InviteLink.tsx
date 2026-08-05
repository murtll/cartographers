import { useState } from 'react'

type Props = {
  code: string
}

/**
 * Ссылка-приглашение. Код комнаты стоит в пути, так что адрес из строки браузера можно
 * просто переслать — тот, кто по нему придёт, окажется в этой же комнате.
 */
export function InviteLink({ code }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/room/${code}`

  function copy() {
    navigator.clipboard.writeText(url).then(
      () => setCopied(true),
      // буфер обмена доступен не всегда: тогда ссылку видно глазами и можно выделить
      () => setCopied(false),
    )
  }

  return (
    <p className="invite">
      <code className="invite__url">{url}</code>
      <button type="button" className="button button--small" onClick={copy}>
        {copied ? 'скопировано' : 'скопировать'}
      </button>
    </p>
  )
}

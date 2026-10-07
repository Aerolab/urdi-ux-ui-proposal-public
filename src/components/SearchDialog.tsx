import { FlatButton, LinkButton } from '@shadeui/ui'
import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GROUPS, STORE } from '../data'
import { KEY, useProto } from '../state'
import { AppIcon } from './ui'

type Result = { t: 'app' | 'group'; id: string; n: string; s: string }

function results(q: string): Result[] {
  const query = q.trim().toLowerCase()
  if (!query) return []
  const apps = STORE.filter((a) => a.n.toLowerCase().includes(query)).map((a) => ({ t: 'app' as const, id: a.id, n: a.n, s: a.g }))
  const groups = GROUPS.filter((g) => g.n.toLowerCase().includes(query)).map((g) => ({
    t: 'group' as const,
    id: g.id,
    n: g.n,
    s: `${g.m} personas`,
  }))
  return [...apps, ...groups]
}

/** Buscador ⌘K: apps y grupos de todo el espacio. Si no hay resultados, ofrece preguntarle a Urdi. */
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const { view, go, toast, openAssistant } = useProto()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const r = results(q)
  const mobile = view === 'mobile'

  useEffect(() => input.current?.focus(), [])

  const open = (x: Result) => {
    onClose()
    if (x.t === 'group') go('grupos')
    toast(`Abriendo ${x.n}`)
  }
  const ask = () => {
    onClose()
    openAssistant([{ me: true, t: q }, { t: 'Déjame buscarlo por vos…' }])
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown' && r.length) {
      e.preventDefault()
      setSel((sel + 1) % r.length)
    } else if (e.key === 'ArrowUp' && r.length) {
      e.preventDefault()
      setSel((sel - 1 + r.length) % r.length)
    } else if (e.key === 'Enter' && r.length) open(r[Math.min(sel, r.length - 1)])
  }

  let body
  if (!q.trim()) body = <div className="px-4 py-5 text-fg-muted">Buscá cualquier app o grupo de Acme.</div>
  else if (!r.length)
    body = (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 text-fg-muted">
        Nada en Acme coincide con “{q}”.
        <FlatButton size="sm" color="neutral" label="Preguntarle a Urdi" onClick={ask} />
      </div>
    )
  else
    body = (
      <div className={`overflow-auto p-1.5 ${mobile ? 'flex-1' : 'max-h-80'}`} role="listbox">
        {r.map((x, i) => (
          <div key={`${x.t}-${x.id}`}>
            {(i === 0 || r[i - 1].t !== x.t) && (
              <div className="px-2.5 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-wider text-fg-muted">
                {x.t === 'app' ? 'Apps' : 'Grupos'}
              </div>
            )}
            <button
              type="button"
              role="option"
              aria-selected={i === sel}
              onMouseEnter={() => setSel(i)}
              onClick={() => open(x)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${i === sel ? 'bg-surface-muted' : ''}`}
            >
              <AppIcon size={28} round={x.t === 'group'} />
              <span>
                {x.n}
                <small className="block text-fg-muted">{x.s}</small>
              </span>
            </button>
          </div>
        ))}
      </div>
    )

  return (
    <div
      className={`absolute inset-0 z-30 flex justify-center bg-[var(--shadeui-overlay)] ${mobile ? 'items-stretch' : 'items-start pt-[90px]'}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-label="Buscar"
        onKeyDown={onKeyDown}
        className={`flex flex-col overflow-hidden bg-surface ${
          mobile ? 'w-full' : 'w-[560px] max-w-[calc(100%-32px)] rounded-2xl border border-line shadow-2xl'
        }`}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
          <Search size={18} className="text-fg-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            placeholder="Buscar apps y grupos"
            autoComplete="off"
            className="flex-1 bg-transparent text-base outline-none"
          />
          <LinkButton iconOnly color="slate" size="sm" aria-label="Cerrar" leftIcon={<X size={16} />} onClick={onClose} />
        </div>
        {body}
        <div className="mt-auto flex justify-between gap-2.5 border-t border-line px-3.5 py-2 text-xs text-fg-muted">
          <span>↑↓ moverse · ↵ abrir · esc cerrar</span>
          <span>{KEY}</span>
        </div>
      </div>
    </div>
  )
}

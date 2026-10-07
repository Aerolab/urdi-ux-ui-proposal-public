import { BezelButton, ButtonGroup, DefaultInput, FlatButton, LinkButton } from '@shadeui/ui'
import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { AppIcon, BotMark, Grid, PageTitle, Placeholder, Row, Tile } from '../components/ui'
import { GROUPS, MINE, STORE, STORE_CATEGORIES, findApp } from '../data'
import { today, useProto, type Page } from '../state'

const DRAFTS = [
  { label: 'Seguimiento de pedidos', text: 'Un seguimiento de pedidos para mi equipo' },
  { label: 'Formulario de feedback', text: 'Un formulario para juntar feedback de clientes' },
  { label: 'Tablero del equipo', text: 'Un tablero con las métricas semanales del equipo' },
]

function Inicio() {
  const { hasApps, view, go, toast, createApp } = useProto()
  const [draft, setDraft] = useState('')

  const header = (
    <div className="mb-7">
      <h1 className={`${view === 'mobile' ? 'text-2xl' : 'text-[28px]'} font-semibold tracking-tight`}>¡Hola, Mila!</h1>
      <p className="mt-0.5 text-fg-muted">{today()}</p>
    </div>
  )

  if (!hasApps) {
    const send = () => {
      if (!draft.trim()) return
      setDraft('')
      createApp()
    }
    return (
      <>
        {header}
        <section aria-label="Asistente" className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-fg-muted">
              <BotMark /> Tu asistente
            </div>
            <h2 className="mt-3 text-[22px] font-semibold">¿Qué app necesitás?</h2>
            <p className="mt-1 text-fg-muted">Contala con tus palabras y Urdi la arma con vos. Sin escribir código.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DRAFTS.map((d) => (
                <FlatButton key={d.label} size="sm" color="neutral" label={d.label} onClick={() => setDraft(d.text)} />
              ))}
            </div>
            <form
              className={`flex items-end gap-2 ${view === 'mobile' ? 'mt-7' : 'mt-10'}`}
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <DefaultInput
                className="flex-1"
                size="md"
                placeholder="Describí tu app"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Describí tu app"
              />
              <BezelButton type="submit" color="slate" label="Enviar" disabled={!draft.trim()} />
            </form>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface-muted px-6 py-3 text-fg-muted">
            ¿Preferís usar algo que ya existe?
            <LinkButton color="slate" label="Explorar el Store" rightIcon={<ArrowRight size={14} />} showRightIcon onClick={() => go('store')} />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {header}
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Tu tablero</h2>
        <LinkButton color="slate" size="sm" label="Editar" onClick={() => toast('Modo edición del tablero')} />
      </div>
      <Grid>
        {MINE.map((id) => {
          const a = findApp(id)
          return (
            <Tile key={id} onClick={() => toast(`Abriendo ${a.n}`)}>
              <AppIcon size={34} />
              <span>
                {a.n}
                <br />
                <small className="text-fg-muted">{a.g}</small>
              </span>
            </Tile>
          )
        })}
        <button
          type="button"
          onClick={() => go('store')}
          className="grid h-32 place-items-center rounded-xl border border-dashed border-line-strong text-fg-muted hover:text-fg"
        >
          + Agregar
        </button>
      </Grid>
    </>
  )
}

function TusApps() {
  const { hasApps, go, toast } = useProto()
  const head = <PageTitle title="Tus apps" lead="Las apps que creaste e instalaste, de todos tus grupos." />
  if (!hasApps)
    return (
      <>
        {head}
        <div className="rounded-2xl border border-line bg-surface px-5 py-14 text-center text-fg-muted">
          <b className="mb-1 block text-base text-fg">Todavía no tenés apps</b>
          Creá la primera con Urdi o instalá una del Store.
          <div className="mt-4 flex justify-center gap-2">
            <BezelButton color="slate" label="Crear una app" onClick={() => go('inicio')} />
            <FlatButton color="neutral" label="Ir al Store" onClick={() => go('store')} />
          </div>
        </div>
      </>
    )
  return (
    <>
      {head}
      {MINE.map((id) => {
        const a = findApp(id)
        return <Row key={id} title={a.n} subtitle={a.g} action={<FlatButton size="sm" color="neutral" label="Abrir" onClick={() => toast(`Abriendo ${a.n}`)} />} />
      })}
    </>
  )
}

function StorePage() {
  const { hasApps, toast } = useProto()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todas')
  const query = q.trim().toLowerCase()
  const list = STORE.filter(
    (a) => (cat === 'Todas' || a.g === cat) && (!query || a.n.toLowerCase().includes(query) || a.g.toLowerCase().includes(query)),
  )
  return (
    <>
      <PageTitle title="Store" lead="Instalá, remixá o compartí apps de tu espacio de trabajo." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DefaultInput
          className="min-w-[220px] max-w-[360px] flex-1"
          size="md"
          placeholder="Buscar en el Store"
          leadingIcon={<Search size={16} />}
          showLeadingIcon
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar en el Store"
        />
        <div className="max-w-full overflow-x-auto [scrollbar-width:none]">
          <ButtonGroup size="sm" value={cat} onValueChange={setCat} items={STORE_CATEGORIES.map((c) => ({ label: c, value: c }))} />
        </div>
      </div>
      {list.length ? (
        <Grid>
          {list.map((a) => (
            <Tile key={a.id}>
              <AppIcon size={34} />
              <span>
                {a.n}
                <br />
                <small className="text-fg-muted">{a.g}</small>
              </span>
              <FlatButton
                size="sm"
                color="neutral"
                className="self-start"
                label={MINE.includes(a.id) && hasApps ? 'Abrir' : 'Instalar'}
                onClick={() => toast(`${a.n} instalada`)}
              />
            </Tile>
          ))}
        </Grid>
      ) : (
        <p className="py-10 text-center text-fg-muted">No hay apps que coincidan.</p>
      )}
    </>
  )
}

function Grupos() {
  const { toast } = useProto()
  return (
    <>
      <PageTitle title="Grupos" lead="Grupos de personas que comparten apps y datos." />
      <div className="mb-4">
        <BezelButton color="slate" label="Crear grupo" onClick={() => toast('Crear grupo')} />
      </div>
      {GROUPS.map((g) => (
        <Row
          key={g.id}
          round
          title={g.n}
          subtitle={`${g.m} personas`}
          action={<FlatButton size="sm" color="neutral" label="Ver" onClick={() => toast(`Abriendo ${g.n}`)} />}
        />
      ))}
    </>
  )
}

function Ajustes() {
  return (
    <>
      <PageTitle title="Ajustes" lead="Tu perfil, preferencias y sesión." />
      {['Perfil', 'Conexiones personales', 'Preferencias', 'Sesión'].map((s) => (
        <Placeholder key={s} label={s} />
      ))}
    </>
  )
}

const ADMIN_TITLES: Record<string, string> = {
  'a-apps': 'Apps',
  'a-conectores': 'Conectores',
  'a-permisos': 'Permisos',
  'a-budget': 'Budget',
}

function Admin({ page }: { page: Page }) {
  const title = ADMIN_TITLES[page]
  return (
    <>
      <PageTitle title={title} lead="Administración del espacio de trabajo · solo admins." />
      <Placeholder label={`Contenido de ${title}`} />
    </>
  )
}

export function CurrentPage() {
  const { page } = useProto()
  switch (page) {
    case 'inicio':
      return <Inicio />
    case 'apps':
      return <TusApps />
    case 'store':
      return <StorePage />
    case 'grupos':
      return <Grupos />
    case 'ajustes':
      return <Ajustes />
    default:
      return <Admin page={page} />
  }
}

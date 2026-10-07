import { ButtonGroup } from '@shadeui/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppSidebar } from './components/AppSidebar'
import { AssistantDrawer } from './components/AssistantDrawer'
import { MobileTabBar, MobileTopBar } from './components/MobileChrome'
import { SearchDialog } from './components/SearchDialog'
import { BotMark } from './components/ui'
import { CurrentPage } from './pages/Pages'
import { ProtoContext, type ChatMsg, type Page, type Proto, type Role, type UserKind, type View } from './state'

const NOTES = [
  ['Sidebar del usuario', 'Espacio de trabajo arriba (con cambio de empresa), Buscar ⌘K, Inicio, Tus apps, Store y Grupos. El perfil y sus ajustes viven al pie, no en el Inicio.'],
  ['Minimizar', 'El botón vive en la fila del logo. Minimizada queda el logo; al pasar el mouse se convierte en "expandir" en el mismo lugar.'],
  ['Buscador independiente', 'Busca apps y grupos en todo el espacio de trabajo. Si no encuentra nada, ofrece "Preguntarle a Urdi" como salida, no como primera opción.'],
  ['Inicio para usuario nuevo', 'El asistente toma la pantalla para crear la primera app. El botón flotante del asistente aparece recién cuando el usuario ya tiene apps.'],
  ['Admin', 'Con rol admin aparece la sección Administración: Apps, Conectores, Permisos y Budget, separada de la navegación personal.'],
  ['Mobile', 'Misma estructura en una tab bar de 5: Inicio, Tus apps, Store, Grupos y Perfil. Buscar y el asistente van en el header.'],
]

function Control<T extends string>(props: { label: string; value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="flex items-center gap-2 text-xs text-fg-muted">
      {props.label}
      <ButtonGroup
        size="sm"
        value={props.value}
        onValueChange={(v) => props.onChange(v as T)}
        items={props.items.map(([value, label]) => ({ value, label }))}
      />
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('desktop')
  const [user, setUser] = useState<UserKind>('new')
  const [role, setRole] = useState<Role>('member')
  const [page, setPage] = useState<Page>('inicio')
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [toastText, setToastText] = useState('')
  const [toastOn, setToastOn] = useState(false)
  const toastTimer = useRef<number>(undefined)
  const main = useRef<HTMLElement>(null)

  const hasApps = user === 'apps'
  const currentPage: Page = role !== 'admin' && page.startsWith('a-') ? 'inicio' : page

  const toast = useCallback((t: string) => {
    setToastText(t)
    setToastOn(true)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastOn(false), 1600)
  }, [])

  const proto: Proto = useMemo(
    () => ({
      view,
      user,
      role,
      page: currentPage,
      hasApps,
      go: (p) => {
        setPage(p)
        main.current?.scrollTo(0, 0)
      },
      toast,
      openSearch: () => setSearch(true),
      openAssistant: (c) => {
        if (c) setChat(c)
        setDrawer(true)
      },
      createApp: () => {
        setUser('apps')
        toast('Creando tu app… queda en el tablero')
      },
    }),
    [view, user, role, currentPage, hasApps, toast],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch((s) => !s)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const mobile = view === 'mobile'
  const control = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setDrawer(false)
  }

  return (
    <ProtoContext.Provider value={proto}>
      <div className="p-4 max-sm:p-2">
        <div className="mx-auto mb-3.5 flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2.5">
          <h1 className="mr-auto text-[15px] font-semibold">Navegación · Urdi</h1>
          <Control label="Vista" value={view} onChange={control(setView)} items={[['desktop', 'Desktop'], ['mobile', 'Mobile']]} />
          <Control label="Usuario" value={user} onChange={control(setUser)} items={[['new', 'Nuevo'], ['apps', 'Con apps']]} />
          <Control label="Rol" value={role} onChange={control(setRole)} items={[['member', 'Miembro'], ['admin', 'Admin']]} />
        </div>

        <div className="flex justify-center">
          <div
            className={`relative overflow-clip border border-line-strong bg-bg ${
              mobile ? 'h-[780px] w-[390px] max-w-full rounded-[28px]' : 'h-[740px] w-full max-w-[1240px] rounded-xl max-sm:h-[700px]'
            }`}
          >
            <div className={`absolute inset-0 flex ${mobile ? 'flex-col' : ''}`}>
              {mobile ? <MobileTopBar /> : <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />}
              <main ref={main} className={`relative min-w-0 flex-1 overflow-auto ${mobile ? 'px-4 pb-24 pt-5' : 'px-9 pb-10 pt-8'}`}>
                <CurrentPage />
              </main>
            </div>

            {mobile && <MobileTabBar />}

            {hasApps && !drawer && (
              <button
                type="button"
                aria-label="Abrir asistente"
                onClick={() => setDrawer(true)}
                className={`absolute right-5 z-[5] rounded-xl shadow-lg ${mobile ? 'bottom-[86px]' : 'bottom-5'}`}
              >
                <BotMark size={48} />
              </button>
            )}

            <AssistantDrawer open={drawer} chat={chat} onChatChange={setChat} onClose={() => setDrawer(false)} />
            {search && <SearchDialog onClose={() => setSearch(false)} />}

            <div
              role="status"
              className={`pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-fg px-3.5 py-2 text-bg transition-all duration-200 ${
                toastOn ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              {toastText}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
          {NOTES.map(([t, p]) => (
            <div key={t} className="rounded-xl border border-line bg-surface px-3.5 py-3">
              <b className="mb-1 block">{t}</b>
              <p className="text-[13px] text-fg-muted">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </ProtoContext.Provider>
  )
}

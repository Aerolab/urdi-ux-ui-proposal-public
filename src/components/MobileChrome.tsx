import { Avatar, LinkButton } from '@shadeui/ui'
import { ChevronDown, Home, LayoutGrid, Search, Store, Users } from 'lucide-react'
import { useProto, type Page } from '../state'
import { WorkspaceMark } from './AppSidebar'

export function MobileTopBar() {
  const { openSearch, toast } = useProto()
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-muted px-3.5 py-3">
      <WorkspaceMark letter="A" />
      <button type="button" className="flex flex-1 items-center gap-1 font-semibold" onClick={() => toast('Cambiar espacio de trabajo')}>
        Acme <ChevronDown size={14} className="text-fg-muted" />
      </button>
      <LinkButton iconOnly color="slate" aria-label="Buscar" leftIcon={<Search size={18} />} onClick={openSearch} />
    </div>
  )
}

const TABS: { id: Page; n: string; icon?: React.ReactNode }[] = [
  { id: 'inicio', n: 'Inicio', icon: <Home size={20} /> },
  { id: 'apps', n: 'Tus apps', icon: <LayoutGrid size={20} /> },
  { id: 'store', n: 'Store', icon: <Store size={20} /> },
  { id: 'grupos', n: 'Grupos', icon: <Users size={20} /> },
  { id: 'ajustes', n: 'Perfil' },
]

export function MobileTabBar() {
  const { page, go } = useProto()
  return (
    <nav className="absolute inset-x-0 bottom-0 z-10 flex border-t border-line bg-surface-muted px-1 pb-3.5 pt-1.5">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => go(t.id)}
          aria-current={page === t.id ? 'page' : undefined}
          className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] ${page === t.id ? 'font-semibold text-fg' : 'text-fg-muted'}`}
        >
          {t.icon ?? <Avatar type="letters" name="Mila" initials="M" size="sm" className="!size-5 !text-[10px]" />}
          {t.n}
        </button>
      ))}
    </nav>
  )
}

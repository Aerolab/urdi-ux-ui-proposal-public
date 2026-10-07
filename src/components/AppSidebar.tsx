import { Navigation } from '@shadeui/ui'
import type { ComponentProps } from 'react'
import { Home, LayoutGrid, Lock, Plug, Search, Store, Users, Wallet } from 'lucide-react'
import { KEY, useProto, type Page } from '../state'

type Props = {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function AppSidebar({ collapsed, onCollapsedChange }: Props) {
  const { page, role, go, toast, openSearch } = useProto()
  const nav = (id: Page, label: string, icon: React.ReactNode) => ({ id, label, icon, onClick: () => go(id) })

  const sections: NonNullable<ComponentProps<typeof Navigation>['sections']> = [
    {
      id: 'buscar',
      items: [{ id: 'buscar', label: `Buscar  ${KEY}`, icon: <Search size={18} />, onClick: openSearch }],
    },
    {
      id: 'principal',
      items: [
        nav('inicio', 'Inicio', <Home size={18} />),
        nav('apps', 'Tus apps', <LayoutGrid size={18} />),
        nav('store', 'Store', <Store size={18} />),
        nav('grupos', 'Grupos', <Users size={18} />),
      ],
    },
  ]
  if (role === 'admin') {
    sections.push({
      id: 'admin',
      label: 'Administración',
      items: [
        nav('a-apps', 'Apps', <LayoutGrid size={18} />),
        nav('a-conectores', 'Conectores', <Plug size={18} />),
        nav('a-permisos', 'Permisos', <Lock size={18} />),
        nav('a-budget', 'Budget', <Wallet size={18} />),
      ],
    })
  }

  return (
    <Navigation
      className="h-full shrink-0"
      state={collapsed ? 'collapse' : 'expand'}
      onStateChange={(s) => onCollapsedChange(s === 'collapse')}
      brandName="Acme"
      brandSubtitle="Espacio de trabajo"
      brandIcon={<WorkspaceMark letter="A" />}
      brandMenu={[
        { id: 'acme', label: 'Acme', icon: <WorkspaceMark letter="A" small />, active: true },
        {
          id: 'sur',
          label: 'Estudio Sur',
          icon: <WorkspaceMark letter="E" small />,
          onClick: () => toast('Cambiando a Estudio Sur'),
        },
        {
          id: 'nuevo',
          label: 'Crear espacio de trabajo',
          separatorBefore: true,
          onClick: () => toast('Crear espacio de trabajo'),
        },
      ]}
      sections={sections}
      activeId={page}
      showWidget={false}
      userName="Mila"
      userEmail="Ajustes"
      userMenu={[
        { id: 'ajustes', label: 'Ajustes', onClick: () => go('ajustes') },
        { id: 'salir', label: 'Cerrar sesión', destructive: true, separatorBefore: true, onClick: () => toast('Sesión cerrada') },
      ]}
    />
  )
}

export function WorkspaceMark({ letter, small }: { letter: string; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-fg font-bold text-bg ${small ? 'size-5 text-[11px]' : 'size-8'}`}
    >
      {letter}
    </span>
  )
}

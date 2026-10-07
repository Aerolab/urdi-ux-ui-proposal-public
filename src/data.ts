export type App = { id: string; n: string; g: string }
export type Group = { id: string; n: string; m: number }

export const APPS: App[] = [
  { id: 'pedidos', n: 'Seguimiento de pedidos', g: 'Operaciones' },
  { id: 'brand', n: 'Brand Guidelines', g: 'Diseño' },
  { id: 'feedback', n: 'Formulario de feedback', g: 'Producto' },
  { id: 'metricas', n: 'Tablero de métricas', g: 'Producto' },
  { id: 'onboarding', n: 'Onboarding de clientes', g: 'Ventas' },
  { id: 'inventario', n: 'Inventario de oficina', g: 'Operaciones' },
]

export const STORE: App[] = [
  ...APPS,
  { id: 'crm', n: 'CRM liviano', g: 'Ventas' },
  { id: 'changelog', n: 'Changelog semanal', g: 'Producto' },
  { id: 'oncall', n: 'Guardias rotativas', g: 'Ingeniería' },
  { id: 'okr', n: 'OKRs del trimestre', g: 'Dirección' },
]

export const GROUPS: Group[] = [
  { id: 'empresa', n: 'Toda la empresa', m: 48 },
  { id: 'diseno', n: 'Diseño', m: 9 },
  { id: 'producto', n: 'Producto', m: 12 },
  { id: 'ops', n: 'Operaciones', m: 7 },
  { id: 'ventas', n: 'Ventas', m: 11 },
]

export const MINE = ['pedidos', 'brand', 'feedback', 'metricas']

export const STORE_CATEGORIES = ['Todas', 'Producto', 'Diseño', 'Operaciones', 'Ventas']

export const findApp = (id: string) => APPS.find((a) => a.id === id)!

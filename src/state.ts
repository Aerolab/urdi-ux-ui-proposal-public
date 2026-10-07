import { createContext, useContext } from 'react'

export type View = 'desktop' | 'mobile'
export type UserKind = 'new' | 'apps'
export type Role = 'member' | 'admin'
export type Page =
  | 'inicio'
  | 'apps'
  | 'store'
  | 'grupos'
  | 'ajustes'
  | 'a-apps'
  | 'a-conectores'
  | 'a-permisos'
  | 'a-budget'

export type ChatMsg = { me?: boolean; t: string }

export type Proto = {
  view: View
  user: UserKind
  role: Role
  page: Page
  hasApps: boolean
  go: (p: Page) => void
  toast: (t: string) => void
  openSearch: () => void
  openAssistant: (chat?: ChatMsg[]) => void
  createApp: () => void
}

export const ProtoContext = createContext<Proto | null>(null)

export function useProto() {
  const ctx = useContext(ProtoContext)
  if (!ctx) throw new Error('useProto fuera de ProtoContext')
  return ctx
}

export const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
export const KEY = isMac ? '⌘K' : 'Ctrl K'

export function today() {
  const d = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  return d[0].toUpperCase() + d.slice(1)
}

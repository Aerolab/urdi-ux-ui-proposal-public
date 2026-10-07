import type { ReactNode } from 'react'

/** Piezas de layout propias del prototipo. Los controles vienen de @shadeui/ui. */

export function PageTitle({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-fg-muted">{lead}</p>
    </div>
  )
}

export function AppIcon({ round, size = 36 }: { round?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-surface-muted ${round ? 'rounded-full' : 'rounded-lg'}`}
      style={{ width: size, height: size }}
    />
  )
}

export function Tile({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const cls =
    'flex min-h-32 flex-col justify-between gap-2 rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong'
  return onClick ? (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={cls}>{children}</div>
  )
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">{children}</div>
}

export function Row({ title, subtitle, round, action }: { title: string; subtitle: string; round?: boolean; action: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-line py-3">
      <AppIcon round={round} />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-fg-muted">{subtitle}</div>
      </div>
      {action}
    </div>
  )
}

export function Placeholder({ label }: { label: string }) {
  return (
    <div className="mb-3 grid h-28 place-items-center rounded-xl border-[1.5px] border-dashed border-line-strong text-fg-muted">
      {label}
    </div>
  )
}

export function BotMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-lg bg-[var(--shadeui-color-purple-200)] text-[var(--shadeui-color-purple-900)]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M12 3v4M9 12h.01M15 12h.01M9.5 16h5" />
      </svg>
    </span>
  )
}

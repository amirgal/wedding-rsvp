import type { InviteStatus } from '@/lib/types'

const STATUS_CONFIG: Record<InviteStatus, { label: string; dot: string; bg: string; text: string }> = {
  pending:   { label: 'Pending',   dot: 'bg-stone-400',   bg: 'bg-stone-100',   text: 'text-stone-600' },
  opened:    { label: 'Opened',    dot: 'bg-amber-400',   bg: 'bg-amber-50',    text: 'text-amber-700' },
  submitted: { label: 'Submitted', dot: 'bg-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  edited:    { label: 'Edited',    dot: 'bg-sky-500',     bg: 'bg-sky-50',      text: 'text-sky-700' },
}

export function StatusBadge({ status }: { status: InviteStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

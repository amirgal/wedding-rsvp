import type { Stats } from '@/lib/types'

interface StatsTabProps {
  stats: Stats | null
  loading: boolean
}

function StatCard({
  label,
  value,
  accent,
  description,
}: {
  label: string
  value: number | string
  accent?: string
  description?: string
}) {
  return (
    <div className="bg-white border border-[var(--color-warm-border)] rounded-lg p-6 hover:shadow-sm transition-shadow">
      <p className="font-body text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-stone)] mb-3">
        {label}
      </p>
      <p className={`font-display text-4xl font-light ${accent ?? 'text-[var(--color-ink)]'}`}>
        {value}
      </p>
      {description && (
        <p className="font-body text-xs text-[var(--color-stone)] mt-1.5">{description}</p>
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-white border border-[var(--color-warm-border)] rounded-lg p-6 animate-pulse">
      <div className="h-3 bg-stone-100 rounded w-24 mb-4" />
      <div className="h-10 bg-stone-100 rounded w-16" />
    </div>
  )
}

export function StatsTab({ stats, loading }: StatsTabProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (!stats) return null

  const totalResponded = stats.submitted + stats.edited
  const totalAttending = stats.totalAdults + stats.totalKids

  return (
    <div className="space-y-8">
      {/* Response status */}
      <section>
        <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
          סטטוס הזמנה
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="סה״כ מוזמנים" value={stats.totalInvited} />
          <StatCard label="ממתין" value={stats.pending} description="עדיין לא נפתח" />
          <StatCard label="נפתח" value={stats.opened} accent="text-amber-600" description="נראה, לא הוגש" />
          <StatCard label="הגיבו" value={totalResponded} accent="text-emerald-700" description="הוגש או עודכן" />
        </div>
      </section>

      {/* Attendance */}
      <section>
        <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
          נוכחות
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="מבוגרים" value={stats.totalAdults} accent="text-[var(--color-forest)]" description="גיל 7+" />
          <StatCard label="ילדים" value={stats.totalKids} accent="text-[var(--color-forest)]" description="גילאים 2–7" />
          <StatCard label="סה״כ מגיעים" value={totalAttending} accent="text-[var(--color-forest)]" />
          <StatCard label="לא מגיעים" value={stats.totalNotAttending} accent="text-stone-500" />
        </div>
      </section>

      {/* Dietary preferences */}
      {(stats.totalVegan > 0 || stats.totalGlutenFree > 0) && (
        <section>
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
            הפסידות תזונה
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="טבעונים" value={stats.totalVegan} accent="text-green-700" description="המוכרזים כטבעונים" />
            <StatCard label="רגישים לגלוטן" value={stats.totalGlutenFree} accent="text-blue-700" description="רגישים לגלוטן" />
          </div>
        </section>
      )}

      {/* Edited */}
      {stats.edited > 0 && (
        <section>
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
            שינויים
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="תשובות מעודכנות" value={stats.edited} accent="text-sky-700" description="עודכן לאחר ההגשה הראשונית" />
          </div>
        </section>
      )}
    </div>
  )
}

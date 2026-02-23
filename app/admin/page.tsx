'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { InviteesTab } from '@/components/admin/invitees-tab'
import { ResponsesTab } from '@/components/admin/responses-tab'
import { StatsTab } from '@/components/admin/stats-tab'
import type { InviteWithResponse, Stats } from '@/lib/types'

type Tab = 'invitees' | 'responses' | 'statistics'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('invitees')
  const [invites, setInvites] = useState<InviteWithResponse[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const [invitesRes, statsRes] = await Promise.all([
        fetch('/api/invites').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ])
      if (invitesRes.success) setInvites(invitesRes.data)
      if (statsRes.success) setStats(statsRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'invitees', label: 'מוזמנים', count: invites.length },
    {
      id: 'responses',
      label: 'תשובות',
      count: stats ? stats.submitted + stats.edited : undefined,
    },
    { id: 'statistics', label: 'סטטיסטיקה' },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light italic text-[var(--color-ink)]">
            לוח בקרה
          </h1>
          <p className="font-body text-sm text-[var(--color-stone)] mt-1">
            נהל את הזמנות החתונה שלך וועקוב אחרי תשובות.
          </p>
        </div>

        {/* Quick stats bar */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: 'מוזמנים', value: stats.totalInvited },
              { label: 'נפתח', value: stats.opened, color: 'text-amber-600' },
              { label: 'הגיבו', value: stats.submitted + stats.edited, color: 'text-emerald-700' },
              { label: 'מגיעים', value: stats.totalAdults + stats.totalKids, color: 'text-[var(--color-forest)]' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[var(--color-warm-border)] rounded-lg px-4 py-3 text-center"
              >
                <p className={`font-display text-2xl font-light ${s.color ?? 'text-[var(--color-ink)]'}`}>
                  {s.value}
                </p>
                <p className="font-body text-[0.65rem] tracking-wide uppercase text-[var(--color-stone)] mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[var(--color-warm-border)] mb-8">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  font-body text-sm pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer
                  ${
                    activeTab === tab.id
                      ? 'border-[var(--color-forest)] text-[var(--color-forest)] font-medium'
                      : 'border-transparent text-[var(--color-stone)] hover:text-[var(--color-ink)]'
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`
                      text-xs px-1.5 py-0.5 rounded-full
                      ${activeTab === tab.id
                        ? 'bg-[var(--color-forest)] text-white'
                        : 'bg-[var(--color-parchment)] text-[var(--color-stone)]'}
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === 'invitees' && (
          <InviteesTab invites={invites} loading={loading} onRefresh={refresh} />
        )}
        {activeTab === 'responses' && (
          <ResponsesTab invites={invites} loading={loading} />
        )}
        {activeTab === 'statistics' && (
          <StatsTab stats={stats} loading={loading} />
        )}
      </main>
    </div>
  )
}

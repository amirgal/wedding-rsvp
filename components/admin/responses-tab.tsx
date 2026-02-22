'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/status-badge'
import type { InviteWithResponse, InviteWithHistory, ResponseHistory } from '@/lib/types'

interface ResponsesTabProps {
  invites: InviteWithResponse[]
  loading: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HistoryModal({
  invite,
  onClose,
}: {
  invite: InviteWithHistory
  onClose: () => void
}) {
  const current = invite.responses
  const history = invite.response_history ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl border border-[var(--color-warm-border)] shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-warm-border)] flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-light italic text-[var(--color-ink)]">
              {invite.name}
            </h3>
            <div className="mt-1">
              <StatusBadge status={invite.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-parchment)] text-[var(--color-stone)] transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Current response */}
          {current ? (
            <section>
              <p className="font-body text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
                Current response
              </p>
              <div className="bg-[var(--color-parchment)] rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-[var(--color-stone)]">Attending</span>
                  <span className="font-body font-medium text-[var(--color-ink)]">
                    {current.attending ? 'Yes' : 'No'}
                  </span>
                </div>
                {current.attending && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-[var(--color-stone)]">Adults (7+)</span>
                      <span className="font-body font-medium text-[var(--color-ink)]">{current.adult_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-[var(--color-stone)]">Children (2–7)</span>
                      <span className="font-body font-medium text-[var(--color-ink)]">{current.kid_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-body text-[var(--color-stone)]">Total guests</span>
                      <span className="font-display text-lg font-light text-[var(--color-forest)]">
                        {current.adult_count + current.kid_count}
                      </span>
                    </div>
                  </>
                )}
                <p className="text-xs text-[var(--color-stone)] font-body pt-1 border-t border-[var(--color-warm-border)]">
                  Last updated {formatDate(current.updated_at)}
                </p>
              </div>
            </section>
          ) : (
            <p className="text-sm text-[var(--color-stone)] italic font-body">No response yet.</p>
          )}

          {/* History */}
          {history.length > 0 && (
            <section>
              <p className="font-body text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
                Submission history ({history.length})
              </p>
              <div className="space-y-2">
                {history.map((h: ResponseHistory, i: number) => (
                  <div
                    key={h.id}
                    className="border border-[var(--color-warm-border)] rounded-lg p-3.5 text-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-xs text-[var(--color-stone)]">
                        #{history.length - i}
                      </span>
                      <span className="font-body text-xs text-[var(--color-stone)]">
                        {formatDate(h.submitted_at)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-stone)] font-body">Attending</span>
                        <span className="font-body text-[var(--color-ink)]">{h.attending ? 'Yes' : 'No'}</span>
                      </div>
                      {h.attending && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-[var(--color-stone)] font-body">Adults</span>
                            <span className="font-body text-[var(--color-ink)]">{h.adult_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--color-stone)] font-body">Children</span>
                            <span className="font-body text-[var(--color-ink)]">{h.kid_count}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export function ResponsesTab({ invites, loading }: ResponsesTabProps) {
  const [selectedInvite, setSelectedInvite] = useState<InviteWithHistory | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const responded = invites.filter(
    (i) => i.status === 'submitted' || i.status === 'edited'
  )

  const handleRowClick = async (invite: InviteWithResponse) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/invites/${invite.id}`)
      const data = await res.json()
      if (data.success) setSelectedInvite(data.data)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-white border border-[var(--color-warm-border)] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (responded.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl font-light italic text-[var(--color-stone)]">
          No responses yet.
        </p>
        <p className="font-body text-sm text-[var(--color-stone)] mt-2">
          Responses will appear here once invitees submit their RSVP.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-[var(--color-warm-border)] rounded-xl overflow-hidden">
        <table className="w-full admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Attending</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {responded.map((invite) => {
              const r = invite.responses
              return (
                <tr
                  key={invite.id}
                  onClick={() => handleRowClick(invite)}
                  className="cursor-pointer"
                  title="Click to view full history"
                >
                  <td className="font-medium">{invite.name}</td>
                  <td className="text-[var(--color-stone)]">{invite.phone ?? '—'}</td>
                  <td>
                    {r ? (
                      <span className={r.attending ? 'text-emerald-700' : 'text-stone-500'}>
                        {r.attending ? 'Yes' : 'No'}
                      </span>
                    ) : '—'}
                  </td>
                  <td>{r?.attending ? r.adult_count : '—'}</td>
                  <td>{r?.attending ? r.kid_count : '—'}</td>
                  <td><StatusBadge status={invite.status} /></td>
                  <td className="text-[var(--color-stone)] text-xs whitespace-nowrap">
                    {r ? formatDate(r.updated_at) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="bg-white rounded-lg px-8 py-6 shadow-lg border border-[var(--color-warm-border)]">
            <p className="font-body text-sm text-[var(--color-stone)]">Loading…</p>
          </div>
        </div>
      )}

      {selectedInvite && (
        <HistoryModal
          invite={selectedInvite}
          onClose={() => setSelectedInvite(null)}
        />
      )}
    </>
  )
}

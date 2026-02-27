'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/status-badge'
import { CopyLinkButton } from '@/components/copy-link-button'
import type { InviteWithResponse } from '@/lib/types'
import { Trash2, Plus, Upload, UserPlus, FileDown } from 'lucide-react'
import * as XLSX from 'xlsx'

const DEFAULT_TEMPLATE =
  '{{name}} היקר/ה,\n\nאנחנו שמחים להזמין אותך להשתתף בנו ביום המיוחד שלנו. אנא השתמש בקישור למטה כדי להשיב:\n\n{{link}}\n\nבחום,'

interface InviteesTabProps {
  invites: InviteWithResponse[]
  loading: boolean
  onRefresh: () => void
}

type StatusFilter = 'pending' | 'opened' | 'submitted' | 'edited'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'pending', label: 'ממתין' },
  { value: 'opened', label: 'נפתח' },
  { value: 'submitted', label: 'הגיב' },
  { value: 'edited', label: 'ערך' },
]

export function InviteesTab({ invites, loading, onRefresh }: InviteesTabProps) {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<StatusFilter>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleFilter = (status: StatusFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const filteredInvites = activeFilters.size === 0
    ? invites
    : invites.filter((inv) => activeFilters.has(inv.status as StatusFilter))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')

  const getMessagePreview = (invite: InviteWithResponse) => {
    const link = `${siteUrl}/?token=${invite.token}`
    return template.replace(/\{\{name\}\}/g, invite.name).replace(/\{\{link\}\}/g, link)
  }

  const handleExport = () => {
    const dateStr = new Date().toISOString().slice(0, 10)
    const filterStr = activeFilters.size === 0
      ? 'all'
      : [...activeFilters].join('+')
    const fileName = `invitees-${filterStr}-${dateStr}.xlsx`

    const rows = filteredInvites.map((invite) => {
      const link = `${siteUrl}/?token=${invite.token}`
      const message = getMessagePreview(invite)
      const r = invite.responses
      let attending = '—'
      if (r) attending = r.attending ? `כן (${r.adult_count}מ${r.kid_count > 0 ? ` · ${r.kid_count}י` : ''})` : 'לא'
      return {
        name: invite.name,
        phone: invite.phone ?? '',
        status: invite.status,
        attending,
        link,
        message,
      }
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // שם
      { wch: 15 }, // טלפון
      { wch: 12 }, // סטטוס
      { wch: 15 }, // מגיע/מגיעה
      { wch: 50 }, // קישור
      { wch: 80 }, // הודעה
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'מוזמנים')
    XLSX.writeFile(wb, fileName)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAddLoading(true)
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined }),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error)
        return
      }
      toast.success(`${name.trim()} נוסף.`)
      setName('')
      setPhone('')
      onRefresh()
    } catch {
      toast.error('נכשל בהוספת המוזמן.')
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async (id: string, inviteName: string) => {
    if (!confirm(`הסר את ${inviteName} מרשימת ההזמנות?`)) return
    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/invites/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error)
        return
      }
      toast.success(`${inviteName} הוסר.`)
      onRefresh()
    } catch {
      toast.error('נכשל בהסרת המוזמן.')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/invites/import', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error)
        return
      }
      toast.success(`יובאו ${data.data.imported} מוזמנ${data.data.imported !== 1 ? 'ים' : 'ה'}.`)
      onRefresh()
    } catch {
      toast.error('הייבוא נכשל.')
    } finally {
      setImportLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Message template */}
      <section className="bg-white border border-[var(--color-warm-border)] rounded-xl p-6">
        <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
          תבנית הודעה
        </h2>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={7}
          className="w-full px-4 py-3 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                     rounded-lg font-body text-sm text-[var(--color-ink)] resize-none
                     focus:outline-none focus:border-[var(--color-forest)] focus:ring-1
                     focus:ring-[var(--color-forest)] transition-colors leading-relaxed"
          placeholder="כתוב את ההודעה שלך..."
        />
        <div className="mt-3 flex gap-3 flex-wrap">
          <span className="font-body text-xs text-[var(--color-stone)]">משתנים זמינים:</span>
          {['{{name}}', '{{link}}'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTemplate((t) => t + v)}
              className="px-2.5 py-1 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                         rounded text-xs font-mono text-[var(--color-stone)] hover:border-[var(--color-forest)]
                         hover:text-[var(--color-forest)] transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* Add invitee + Import */}
      <section className="flex flex-col sm:flex-row gap-4">
        {/* Add one */}
        <form
          onSubmit={handleAdd}
          className="flex-1 bg-white border border-[var(--color-warm-border)] rounded-xl p-5"
        >
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4 flex items-center gap-2">
            <UserPlus className="w-3.5 h-3.5" />
            הוסף מוזמן
          </h2>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא *"
              required
              className="w-full px-4 py-2.5 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                         rounded-lg font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1 focus:ring-[var(--color-forest)] transition-colors"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="טלפון (אופציונלי)"
              className="w-full px-4 py-2.5 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                         rounded-lg font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1 focus:ring-[var(--color-forest)] transition-colors"
            />
            <button
              type="submit"
              disabled={addLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--color-forest)] text-white
                         font-body text-sm font-medium rounded-lg hover:bg-[oklch(0.33_0.065_152)]
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {addLoading ? 'מוסיף…' : 'הוסף'}
            </button>
          </div>
        </form>

        {/* Bulk import */}
        <div className="flex-1 bg-white border border-[var(--color-warm-border)] rounded-xl p-5 flex flex-col">
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            ייבוא בכמות
          </h2>
          <p className="font-body text-xs text-[var(--color-stone)] mb-4 leading-relaxed">
            העלה קובץ <strong>.xlsx</strong> עם עמודות{' '}
            <code className="bg-[var(--color-parchment)] px-1.5 py-0.5 rounded text-[0.7rem]">name</code>{' '}
            וברירה{' '}
            <code className="bg-[var(--color-parchment)] px-1.5 py-0.5 rounded text-[0.7rem]">phone</code>.
          </p>
          <div className="mt-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
              id="xlsx-upload"
            />
            <label
              htmlFor="xlsx-upload"
              className={`flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed
                         border-[var(--color-warm-border)] rounded-lg font-body text-sm text-[var(--color-stone)]
                         hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-colors
                         cursor-pointer ${importLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Upload className="w-4 h-4" />
              {importLoading ? 'מייבא…' : 'בחר קובץ'}
            </label>
          </div>
        </div>
      </section>

      {/* Invitees table */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)]">
              מוזמנים ({filteredInvites.length}{activeFilters.size > 0 ? ` מתוך ${invites.length}` : ''})
            </h2>
            <button
              type="button"
              onClick={handleExport}
              disabled={filteredInvites.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body
                         text-[var(--color-stone)] border border-[var(--color-warm-border)] rounded-md
                         hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]
                         transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileDown className="w-3.5 h-3.5" />
              ייצא XLSX{activeFilters.size > 0 ? ` (${filteredInvites.length})` : ''}
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-[0.65rem] text-[var(--color-stone)] tracking-wide">סינון:</span>
            {STATUS_FILTERS.map(({ value, label }) => {
              const count = invites.filter((inv) => inv.status === value).length
              const active = activeFilters.has(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleFilter(value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body
                              border transition-colors cursor-pointer
                              ${active
                                ? 'bg-[var(--color-forest)] border-[var(--color-forest)] text-white'
                                : 'bg-white border-[var(--color-warm-border)] text-[var(--color-stone)] hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]'
                              }`}
                >
                  {label}
                  <span className={`text-[0.65rem] px-1 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[var(--color-parchment)] text-[var(--color-stone)]'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
            {activeFilters.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilters(new Set())}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body
                           border border-[var(--color-warm-border)] text-[var(--color-stone)]
                           hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer"
              >
                ✕ נקה
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-white border border-[var(--color-warm-border)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[var(--color-warm-border)] rounded-xl">
            <p className="font-display text-2xl font-light italic text-[var(--color-stone)]">
              אין מוזמנים עדיין.
            </p>
            <p className="font-body text-sm text-[var(--color-stone)] mt-2">
              הוסף מוזמנים למעלה או ייבא מגיליון אלקטרוני.
            </p>
          </div>
        ) : filteredInvites.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[var(--color-warm-border)] rounded-xl">
            <p className="font-display text-xl font-light italic text-[var(--color-stone)]">
              אין מוזמנים עם הסטטוס שנבחר.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[var(--color-warm-border)] rounded-xl overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>שם</th>
                  <th>טלפון</th>
                  <th>סטטוס</th>
                  <th>מגיע/מגיעה</th>
                  <th>קישור</th>
                  <th>הודעה</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvites.map((invite) => {
                  const r = invite.responses
                  return (
                    <tr key={invite.id}>
                      <td className="font-medium whitespace-nowrap">{invite.name}</td>
                      <td className="text-[var(--color-stone)]">{invite.phone ?? '—'}</td>
                      <td><StatusBadge status={invite.status} /></td>
                      <td>
                        {r ? (
                          <span className={r.attending ? 'text-emerald-700 text-sm' : 'text-stone-500 text-sm'}>
                            {r.attending
                              ? `כן (${r.adult_count}מ${r.kid_count > 0 ? ` · ${r.kid_count}י` : ''})`
                              : 'לא'}
                          </span>
                        ) : (
                          <span className="text-[var(--color-stone)] text-sm">—</span>
                        )}
                      </td>
                      <td>
                        <CopyLinkButton token={invite.token} />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            const msg = getMessagePreview(invite)
                            navigator.clipboard.writeText(msg)
                            toast.success('ההודעה הועתקה ללוח העריכה.')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body
                                     text-[var(--color-stone)] border border-[var(--color-warm-border)]
                                     rounded-md hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]
                                     transition-colors cursor-pointer"
                        >
                          העתק הודעה
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(invite.id, invite.name)}
                          disabled={deleteLoading === invite.id}
                          className="p-1.5 text-[var(--color-stone)] hover:text-red-600 transition-colors
                                     disabled:opacity-40 cursor-pointer"
                          title="מחק מוזמן"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

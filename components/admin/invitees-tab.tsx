'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/status-badge'
import { CopyLinkButton } from '@/components/copy-link-button'
import type { InviteWithResponse } from '@/lib/types'
import { Trash2, Plus, Upload, UserPlus } from 'lucide-react'

const DEFAULT_TEMPLATE =
  'Dear {{name}},\n\nWe joyfully invite you to join us on our special day. Please use the link below to RSVP:\n\n{{link}}\n\nWith love,'

interface InviteesTabProps {
  invites: InviteWithResponse[]
  loading: boolean
  onRefresh: () => void
}

export function InviteesTab({ invites, loading, onRefresh }: InviteesTabProps) {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')

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
      toast.success(`${name.trim()} added.`)
      setName('')
      setPhone('')
      onRefresh()
    } catch {
      toast.error('Failed to add invitee.')
    } finally {
      setAddLoading(false)
    }
  }

  const handleDelete = async (id: string, inviteName: string) => {
    if (!confirm(`Remove ${inviteName} from the invite list?`)) return
    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/invites/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error)
        return
      }
      toast.success(`${inviteName} removed.`)
      onRefresh()
    } catch {
      toast.error('Failed to remove invitee.')
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
      toast.success(`Imported ${data.data.imported} invitee${data.data.imported !== 1 ? 's' : ''}.`)
      onRefresh()
    } catch {
      toast.error('Import failed.')
    } finally {
      setImportLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getMessagePreview = (invite: InviteWithResponse) => {
    const link = `${siteUrl}/?token=${invite.token}`
    return template.replace(/\{\{name\}\}/g, invite.name).replace(/\{\{link\}\}/g, link)
  }

  return (
    <div className="space-y-8">
      {/* Message template */}
      <section className="bg-white border border-[var(--color-warm-border)] rounded-xl p-6">
        <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4">
          Message template
        </h2>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={7}
          className="w-full px-4 py-3 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                     rounded-lg font-body text-sm text-[var(--color-ink)] resize-none
                     focus:outline-none focus:border-[var(--color-forest)] focus:ring-1
                     focus:ring-[var(--color-forest)] transition-colors leading-relaxed"
          placeholder="Write your message..."
        />
        <div className="mt-3 flex gap-3 flex-wrap">
          <span className="font-body text-xs text-[var(--color-stone)]">Available variables:</span>
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
            Add invitee
          </h2>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name *"
              required
              className="w-full px-4 py-2.5 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                         rounded-lg font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1 focus:ring-[var(--color-forest)] transition-colors"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full px-4 py-2.5 bg-[var(--color-parchment)] border border-[var(--color-warm-border)]
                         rounded-lg font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1 focus:ring-[var(--color-forest)] transition-colors"
            />
            <button
              type="submit"
              disabled={addLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--color-forest)] text-white
                         font-body text-sm font-medium rounded-lg hover:bg-[oklch(0.33_0.065_152)]
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {addLoading ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>

        {/* Bulk import */}
        <div className="flex-1 bg-white border border-[var(--color-warm-border)] rounded-xl p-5 flex flex-col">
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-4 flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            Bulk import
          </h2>
          <p className="font-body text-xs text-[var(--color-stone)] mb-4 leading-relaxed">
            Upload an <strong>.xlsx</strong> file with columns{' '}
            <code className="bg-[var(--color-parchment)] px-1.5 py-0.5 rounded text-[0.7rem]">name</code>{' '}
            and optionally{' '}
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
              {importLoading ? 'Importing…' : 'Choose file'}
            </label>
          </div>
        </div>
      </section>

      {/* Invitees table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-stone)]">
            Invitees ({invites.length})
          </h2>
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
              No invitees yet.
            </p>
            <p className="font-body text-sm text-[var(--color-stone)] mt-2">
              Add invitees above or import from a spreadsheet.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[var(--color-warm-border)] rounded-xl overflow-hidden">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Attending</th>
                  <th>Link</th>
                  <th>Message</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
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
                              ? `Yes (${r.adult_count}A${r.kid_count > 0 ? ` · ${r.kid_count}K` : ''})`
                              : 'No'}
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
                            toast.success('Message copied to clipboard.')
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body
                                     text-[var(--color-stone)] border border-[var(--color-warm-border)]
                                     rounded-md hover:border-[var(--color-forest)] hover:text-[var(--color-forest)]
                                     transition-colors"
                        >
                          Copy message
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(invite.id, invite.name)}
                          disabled={deleteLoading === invite.id}
                          className="p-1.5 text-[var(--color-stone)] hover:text-red-600 transition-colors
                                     disabled:opacity-40"
                          title="Delete invitee"
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

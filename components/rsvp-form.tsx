'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Response } from '@/lib/types'

interface RsvpFormProps {
  inviteId: string
  token: string
  existingResponse: Response | null
  isEditing: boolean
}

function CounterField({
  label,
  sublabel,
  value,
  onChange,
  min,
}: {
  label: string
  sublabel: string
  value: number
  onChange: (v: number) => void
  min: number
}) {
  return (
    <div className="flex items-center justify-between py-5 px-3 border-b border-[var(--warm-border,oklch(0.882_0.013_72))] last:border-b-0">
      <div>
        <p className="font-display text-[1.15rem] font-light text-[var(--color-ink)]">{label}</p>
        <p className="text-xs text-[var(--color-stone)] mt-0.5 font-body">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(value + 1)}
          aria-label={`הוסף ${label}`}
        >
          +
        </button>
        <span className="font-display text-3xl font-light w-7 text-center leading-none text-[var(--color-ink)]">
          {value}
        </span>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`הפחת ${label}`}
        >
          −
        </button>
      </div>
    </div>
  )
}

export function RsvpForm({ inviteId, token, existingResponse, isEditing }: RsvpFormProps) {
  const [adultCount, setAdultCount] = useState(existingResponse?.adult_count ?? 1)
  const [kidCount, setKidCount] = useState(existingResponse?.kid_count ?? 0)
  const [loading, setLoading] = useState<'attending' | 'not-attending' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [didNotAttend, setDidNotAttend] = useState(
    existingResponse ? !existingResponse.attending : false
  )

  const submit = async (attending: boolean) => {
    setLoading(attending ? 'attending' : 'not-attending')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, attending, adult_count: adultCount, kid_count: kidCount }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data.error ?? 'משהו השתבש. נא נסו שנית.')
        return
      }

      setDidNotAttend(!attending)
      setSubmitted(true)
    } catch {
      toast.error('שגיאת רשת. נא בדקו את החיבור.')
    } finally {
      setLoading(null)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-12 h-12 rounded-full border border-[var(--color-forest)] flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 stroke-[var(--color-forest)]" strokeWidth={1.5}>
            {didNotAttend ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.5L10 7l5.5 5.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5l4 4 7-7" />
            )}
          </svg>
        </div>
        <p className="font-display text-3xl font-light text-[var(--color-ink)] leading-snug">
          {didNotAttend ? 'נשמח אם תוכלו להצטרף בפעם הבאה.' : 'מחכים לחגוג יחד איתכם!'}
        </p>
        <p className="mt-3 text-sm text-[var(--color-stone)] font-body">
          {isEditing ? 'תגובתכם עודכנה.' : 'אישורכם התקבל.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {isEditing && (
        <p className="text-sm text-[var(--color-stone)] italic font-body border-r-2 border-[var(--color-forest)] pr-4 py-1">
          כבר שלחתם אישור. ניתן לעדכן את תגובתכם למטה.
        </p>
      )}

      <div className="border border-[var(--color-warm-border)] rounded-lg overflow-hidden bg-white/60">
        <CounterField
          label="מבוגרים"
          sublabel="גיל 7 ומעלה"
          value={adultCount}
          onChange={setAdultCount}
          min={1}
        />
        <CounterField
          label="ילדים"
          sublabel="גילאי 2–7"
          value={kidCount}
          onChange={setKidCount}
          min={0}
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={() => submit(true)}
          disabled={!!loading}
          className="w-full py-4 px-6 bg-[var(--color-forest)] text-white font-body font-medium
                     tracking-wide rounded-lg hover:bg-[oklch(0.33_0.065_152)] transition-colors
                     disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {loading === 'attending' ? 'שומר...' : isEditing ? 'עדכון אישור' : 'אישור הגעה'}
        </button>

        <button
          onClick={() => submit(false)}
          disabled={!!loading}
          className="w-full py-3 px-6 text-[var(--color-stone)] font-body font-normal text-sm
                     hover:text-[var(--color-ink)] transition-colors disabled:opacity-50"
        >
          {loading === 'not-attending' ? 'שומר...' : 'לא אוכל להגיע'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Response } from '@/lib/types'

interface RsvpFormProps {
  inviteId: string
  token: string
  existingResponse: Response | null
  isEditing: boolean
  inviteName: string
}

// Small flower cluster for confirmation state
function SmallFlowerCluster() {
  return (
    <svg
      viewBox="0 0 140 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="130"
      height="55"
      aria-hidden
    >
      {/* Pink cosmos */}
      <ellipse cx="30" cy="28" rx="9" ry="5" fill="#f0a0b0" opacity="0.60" transform="rotate(-30 30 28)" />
      <ellipse cx="30" cy="28" rx="9" ry="5" fill="#f0a0b0" opacity="0.55" transform="rotate(30 30 28)" />
      <ellipse cx="30" cy="28" rx="9" ry="5" fill="#e890a0" opacity="0.50" transform="rotate(90 30 28)" />
      <ellipse cx="30" cy="28" rx="9" ry="5" fill="#f0a0b0" opacity="0.52" transform="rotate(-90 30 28)" />
      <circle cx="30" cy="28" r="4" fill="#f8d060" opacity="0.75" />
      <circle cx="30" cy="28" r="2.5" fill="#f0a828" opacity="0.85" />

      {/* Lavender wisteria cluster */}
      <ellipse cx="60" cy="22" rx="6" ry="4" fill="#c8a8d8" opacity="0.55" transform="rotate(-10 60 22)" />
      <ellipse cx="66" cy="18" rx="5" ry="3.5" fill="#b896c8" opacity="0.50" />
      <ellipse cx="56" cy="30" rx="5" ry="7" fill="#d4b4e0" opacity="0.48" />
      <ellipse cx="64" cy="32" rx="4" ry="6" fill="#c0a0d0" opacity="0.50" transform="rotate(-5 64 32)" />
      <ellipse cx="70" cy="26" rx="4" ry="6" fill="#c8a8d8" opacity="0.45" transform="rotate(10 70 26)" />

      {/* Yellow daffodil */}
      <ellipse cx="100" cy="26" rx="9" ry="5" fill="#f0d040" opacity="0.62" transform="rotate(-20 100 26)" />
      <ellipse cx="100" cy="26" rx="9" ry="5" fill="#e8c838" opacity="0.57" transform="rotate(20 100 26)" />
      <ellipse cx="100" cy="26" rx="9" ry="5" fill="#f0d040" opacity="0.52" transform="rotate(70 100 26)" />
      <ellipse cx="100" cy="26" rx="9" ry="5" fill="#e8c838" opacity="0.54" transform="rotate(-70 100 26)" />
      <ellipse cx="100" cy="26" rx="4.5" ry="3.5" fill="#f0a020" opacity="0.82" />
      <ellipse cx="100" cy="26" rx="2.8" ry="2.2" fill="#e09018" opacity="0.88" />

      {/* Leaves */}
      <ellipse cx="20" cy="38" rx="14" ry="4" fill="#78b870" opacity="0.38" transform="rotate(-15 20 38)" />
      <ellipse cx="50" cy="44" rx="16" ry="4" fill="#6aaa6a" opacity="0.35" transform="rotate(-5 50 44)" />
      <ellipse cx="82" cy="40" rx="14" ry="4" fill="#72b472" opacity="0.36" transform="rotate(10 82 40)" />
      <ellipse cx="116" cy="38" rx="12" ry="3.5" fill="#78b870" opacity="0.34" transform="rotate(-12 116 38)" />
    </svg>
  )
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
    <div className="flex items-center justify-between py-4 px-2 border-b last:border-b-0"
      style={{ borderColor: 'rgba(200,170,130,0.25)' }}
    >
      <div>
        <p className="font-display text-[1.1rem] font-light" style={{ color: '#3a2e22' }}>{label}</p>
        <p className="text-xs font-body mt-0.5" style={{ color: '#8a7a6a' }}>{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(value + 1)}
          aria-label={`הוסף ${label}`}
          style={{ borderColor: 'rgba(200,160,100,0.5)', color: '#6a5a4a' }}
        >
          +
        </button>
        <span
          className="font-display w-7 text-center leading-none"
          style={{ fontSize: '2.5rem', color: '#3a2e22', fontWeight: 300 }}
        >
          {value}
        </span>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`הפחת ${label}`}
          style={{ borderColor: 'rgba(200,160,100,0.5)', color: '#6a5a4a' }}
        >
          −
        </button>
      </div>
    </div>
  )
}

export function RsvpForm({ token, existingResponse, isEditing, inviteName }: RsvpFormProps) {
  const [adultCount, setAdultCount] = useState(existingResponse?.adult_count ?? 1)
  const [kidCount, setKidCount] = useState(existingResponse?.kid_count ?? 0)
  const [loading, setLoading] = useState<'attending' | 'not-attending' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [didNotAttend, setDidNotAttend] = useState(
    existingResponse ? !existingResponse.attending : false
  )

  const firstName = inviteName.split(' ')[0]

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
      <div dir="rtl" className="text-center py-8 animate-fade-in flex flex-col items-center gap-4">
        <SmallFlowerCluster />
        <p
          className="font-handwriting leading-snug"
          style={{ fontSize: '2.4rem', color: '#3a2e22' }}
        >
          {didNotAttend ? 'תודה על העדכון.' : 'מחכים לחגוג יחד איתכם!'}
        </p>
        <p className="font-body text-sm" style={{ color: '#8a7a6a' }}>
          {isEditing ? 'תגובתכם עודכנה.' : didNotAttend ? 'תגובתכם התקבלה.' : 'אישורכם התקבל.'}
        </p>
        <p className="font-body text-sm" style={{ color: '#a09080' }}>
          במידת הצורך ניתן לעדכן את תשובתכם.
        </p>
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex flex-col items-center text-center">

      {/* Name greeting — large handwriting */}
      <div className="animate-fade-up mb-1">
        <h1
          className="font-handwriting leading-tight"
          style={{ fontSize: '3.8rem', color: '#2a2018', letterSpacing: '0.02em' }}
        >
          שלום {firstName},
        </h1>
      </div>

      {/* Invitation text — handwriting style, italic */}
      <div className="animate-fade-up delay-100 mb-3 px-4">
        <p
          className="font-handwriting leading-relaxed"
          style={{ fontSize: '1.25rem', color: '#4a3e30' }}
        >
          אנחנו מתרגשים להזמין אתכם לחגוג איתנו את יום חתונתנו.
        </p>
      </div>

      {/* Date-style accent — rose pink */}
      <div className="animate-fade-up delay-200 mb-6">
        <p
          className="font-display font-bold tracking-wide"
          style={{ fontSize: '1.3rem', color: '#d4607a' }}
        >
          נשמח לדעת — מגיעים?
        </p>
      </div>

      {/* Editing notice */}
      {isEditing && (
        <p
          className="font-body text-sm italic mb-5 px-4"
          style={{ color: '#8a7a6a' }}
        >
          כבר שלחתם אישור. ניתן לעדכן את תגובתכם למטה.
        </p>
      )}

      {/* Counter widget */}
      <div className="w-full animate-fade-up delay-300 mb-6">
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

      {/* Buttons */}
      <div className="w-full animate-fade-up delay-400 space-y-3">
        <button
          onClick={() => submit(true)}
          disabled={!!loading}
          className="w-full font-body font-medium tracking-wide disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
          style={{
            padding: '0.95rem 1.5rem',
            background: '#d4607a',
            color: 'white',
            borderRadius: '0.6rem',
            fontSize: '1rem',
            letterSpacing: '0.06em',
            border: 'none',
            boxShadow: '0 2px 12px rgba(212,96,122,0.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#c04e68' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#d4607a' }}
        >
          {loading === 'attending' ? 'שומר...' : isEditing ? 'עדכון אישור' : 'אישור הגעה'}
        </button>

        <button
          onClick={() => submit(false)}
          disabled={!!loading}
          className="w-full font-body font-normal text-sm disabled:opacity-50 cursor-pointer transition-colors"
          style={{
            padding: '0.65rem',
            background: 'transparent',
            border: 'none',
            color: '#9a8a7a',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(154,138,122,0.4)',
            textUnderlineOffset: '3px',
          }}
        >
          {loading === 'not-attending' ? 'שומר...' : 'לא אוכל להגיע'}
        </button>
      </div>
    </div>
  )
}

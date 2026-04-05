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
      <defs>
        {/* Soft watercolor gradients - delicate and translucent */}
        <radialGradient id="pinkPetalSmall" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="30%" stopColor="#ffc8d8" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#ff9bb8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff88a8" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="purplePetalSmall" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="35%" stopColor="#d8c0f0" stopOpacity="0.45" />
          <stop offset="75%" stopColor="#b898d8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a080c8" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="yellowPetalSmall" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#fffef8" stopOpacity="0.4" />
          <stop offset="35%" stopColor="#ffe8a0" stopOpacity="0.55" />
          <stop offset="75%" stopColor="#ffd060" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f0b840" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="yellowCenterSmall" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#ffd850" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e0a830" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="leafGreenSmall" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#e8f8d8" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#a8d888" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#78b860" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Pink cosmos - delicate */}
      <ellipse cx="30" cy="28" rx="8" ry="4.5" fill="url(#pinkPetalSmall)" transform="rotate(-30 30 28)" />
      <ellipse cx="30" cy="28" rx="8" ry="4.5" fill="url(#pinkPetalSmall)" transform="rotate(30 30 28)" />
      <ellipse cx="30" cy="28" rx="8" ry="4.5" fill="url(#pinkPetalSmall)" transform="rotate(90 30 28)" />
      <ellipse cx="30" cy="28" rx="8" ry="4.5" fill="url(#pinkPetalSmall)" transform="rotate(-90 30 28)" />
      <circle cx="30" cy="28" r="3" fill="url(#yellowCenterSmall)" />
      <circle cx="30" cy="28" r="1.5" fill="#d89020" opacity="0.7" />

      {/* Lavender wisteria cluster - delicate */}
      <ellipse cx="60" cy="22" rx="5" ry="3.5" fill="url(#purplePetalSmall)" transform="rotate(-10 60 22)" />
      <ellipse cx="66" cy="18" rx="4.5" ry="3" fill="url(#purplePetalSmall)" />
      <ellipse cx="56" cy="30" rx="4" ry="6" fill="url(#purplePetalSmall)" />
      <ellipse cx="64" cy="32" rx="3.5" ry="5" fill="url(#purplePetalSmall)" transform="rotate(-5 64 32)" />
      <ellipse cx="70" cy="26" rx="3.5" ry="5" fill="url(#purplePetalSmall)" transform="rotate(10 70 26)" />
      <path d="M62 20 Q60 26, 58 32" stroke="url(#leafGreenSmall)" strokeWidth="0.7" fill="none" opacity="0.4" />

      {/* Yellow daffodil - delicate */}
      <ellipse cx="100" cy="26" rx="8" ry="4.5" fill="url(#yellowPetalSmall)" transform="rotate(-20 100 26)" />
      <ellipse cx="100" cy="26" rx="8" ry="4.5" fill="url(#yellowPetalSmall)" transform="rotate(20 100 26)" />
      <ellipse cx="100" cy="26" rx="8" ry="4.5" fill="url(#yellowPetalSmall)" transform="rotate(70 100 26)" />
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

      {/* Date & venue */}
      <div className="animate-fade-up delay-200 mb-2">
        <p
          className="font-display font-bold tracking-wide"
          style={{ fontSize: '1.4rem', color: '#d4607a' }}
        >
          שישי, 12 ליוני בשעה 11:00
        </p>
        <p
          className="font-display"
          style={{ fontSize: '1rem', color: '#b8860b' }}
        >
          בית גלילי, קיבוץ נען
        </p>
      </div>

      {/* RSVP prompt */}
      <div className="animate-fade-up delay-300 mb-6">
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

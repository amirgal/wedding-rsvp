'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('דוא״ל או סיסמה לא תקינים.')
      setLoading(false)
      return
    }

    const redirectTo = searchParams.get('redirectTo') ?? '/admin'
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream)] parchment-texture flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="mb-10">
          <p className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-[var(--color-stone)] mb-3 animate-fade-in">
            ניהול
          </p>
          <h1 className="font-display text-4xl font-light italic text-[var(--color-ink)] animate-fade-up">
            כניסה
          </h1>
          <div className="mt-4 h-px w-10 bg-[var(--color-forest)] opacity-60 animate-line-grow delay-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5 animate-fade-up delay-200">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="font-body text-[0.72rem] tracking-wide text-[var(--color-stone)] uppercase"
            >
              דוא״ל
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-white border border-[var(--color-warm-border)] rounded-md
                         font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1
                         focus:ring-[var(--color-forest)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="font-body text-[0.72rem] tracking-wide text-[var(--color-stone)] uppercase"
            >
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white border border-[var(--color-warm-border)] rounded-md
                         font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-stone)]/50
                         focus:outline-none focus:border-[var(--color-forest)] focus:ring-1
                         focus:ring-[var(--color-forest)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-body">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-forest)] text-white font-body font-medium
                       text-sm tracking-wide rounded-md hover:bg-[oklch(0.33_0.065_152)]
                       transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'נכנסים…' : 'כניסה'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

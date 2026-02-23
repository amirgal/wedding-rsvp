'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function AdminHeader() {
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-[var(--color-warm-border)] bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-light italic text-[var(--color-ink)]">
            חתונה
          </span>
          <span className="text-[var(--color-warm-border)]">·</span>
          <span className="font-body text-xs tracking-[0.18em] uppercase text-[var(--color-stone)]">
            ניהול
          </span>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-xs text-[var(--color-stone)] hover:text-[var(--color-ink)]
                     transition-colors font-body"
        >
          <LogOut className="w-3.5 h-3.5" />
          יציאה
        </button>
      </div>
    </header>
  )
}

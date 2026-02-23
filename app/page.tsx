import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { RsvpForm } from '@/components/rsvp-form'

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function RsvpPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) notFound()

  const supabase = createAdminClient()

  const { data: invite } = await supabase
    .from('invites')
    .select('*, responses(*)')
    .eq('token', token)
    .single()

  if (!invite) notFound()

  // Mark pending → opened server-side (no client round-trip needed)
  if (invite.status === 'pending') {
    await supabase.from('invites').update({ status: 'opened' }).eq('id', invite.id)
  }

  const existingResponse = Array.isArray(invite.responses)
    ? invite.responses[0] ?? null
    : invite.responses ?? null

  const isEditing = invite.status === 'submitted' || invite.status === 'edited'

  return (
    <main className="min-h-screen bg-[var(--color-cream)] parchment-texture relative overflow-hidden">
      {/* Botanical SVG accent — top left (RTL) */}
      <div className="absolute top-0 left-0 w-72 h-72 pointer-events-none opacity-[0.08]" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M40 10 C60 40, 80 20, 100 50 C120 80, 100 100, 120 130" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--color-forest)]"/>
          <path d="M40 10 C25 35, 45 55, 30 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.6"/>
          <path d="M100 50 C115 40, 125 55, 135 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <path d="M120 130 C135 120, 145 140, 155 125" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <circle cx="40" cy="10" r="3" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.4"/>
          <ellipse cx="75" cy="35" rx="12" ry="7" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.15" transform="rotate(20 75 35)"/>
          <ellipse cx="110" cy="65" rx="10" ry="6" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.12" transform="rotate(-15 110 65)"/>
          <ellipse cx="130" cy="105" rx="14" ry="8" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.12" transform="rotate(10 130 105)"/>
        </svg>
      </div>

      {/* Bottom-right mirror botanical (RTL) */}
      <div className="absolute bottom-0 right-0 w-56 h-56 pointer-events-none opacity-[0.06] rotate-180" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M40 10 C60 40, 80 20, 100 50 C120 80, 100 100, 120 130" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--color-forest)]"/>
          <path d="M100 50 C115 40, 125 55, 135 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <ellipse cx="75" cy="35" rx="12" ry="7" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.15" transform="rotate(20 75 35)"/>
        </svg>
      </div>

      <div className="max-w-md mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <header className="mb-14">
          <p className="animate-fade-up font-body text-[0.72rem] tracking-[0.15em] text-[var(--color-stone)] mb-4">
            הוזמנתם
          </p>
          <h1 className="animate-fade-up delay-100 font-handwriting text-6xl font-bold text-[var(--color-ink)] leading-tight">
            שלום, {invite.name}
          </h1>
          <div className="animate-line-grow delay-300 mt-5 h-px bg-[var(--color-forest)] w-14 opacity-60" />
        </header>

        {/* Invitation text */}
        <div className="animate-fade-up delay-200 mb-12">
          <p className="font-display text-xl font-light text-[var(--color-stone)] leading-relaxed">
            בשמחה ובאהבה מזמינים אנו אתכם לחגוג עמנו את יום חתונתנו.
          </p>
        </div>

        {/* RSVP Form */}
        <div className="animate-fade-up delay-400">
          <p className="font-body text-[0.72rem] tracking-[0.1em] text-[var(--color-stone)] mb-6">
            נא לאשר הגעה
          </p>
          <RsvpForm
            inviteId={invite.id}
            token={token}
            existingResponse={existingResponse}
            isEditing={isEditing}
          />
        </div>
      </div>
    </main>
  )
}

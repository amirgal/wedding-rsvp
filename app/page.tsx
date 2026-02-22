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
      {/* Botanical SVG accent — top right */}
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-[0.08]" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M160 10 C140 40, 120 20, 100 50 C80 80, 100 100, 80 130" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--color-forest)]"/>
          <path d="M160 10 C175 35, 155 55, 170 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.6"/>
          <path d="M100 50 C85 40, 75 55, 65 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <path d="M80 130 C65 120, 55 140, 45 125" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <circle cx="160" cy="10" r="3" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.4"/>
          <ellipse cx="125" cy="35" rx="12" ry="7" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.15" transform="rotate(-20 125 35)"/>
          <ellipse cx="90" cy="65" rx="10" ry="6" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.12" transform="rotate(15 90 65)"/>
          <ellipse cx="70" cy="105" rx="14" ry="8" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.12" transform="rotate(-10 70 105)"/>
        </svg>
      </div>

      {/* Bottom-left mirror botanical */}
      <div className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none opacity-[0.06] rotate-180" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M160 10 C140 40, 120 20, 100 50 C80 80, 100 100, 80 130" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--color-forest)]"/>
          <path d="M100 50 C85 40, 75 55, 65 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-[var(--color-forest)]" opacity="0.5"/>
          <ellipse cx="125" cy="35" rx="12" ry="7" fill="currentColor" className="text-[var(--color-forest)]" opacity="0.15" transform="rotate(-20 125 35)"/>
        </svg>
      </div>

      <div className="max-w-md mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <header className="mb-14">
          <p className="animate-fade-up font-body text-[0.68rem] tracking-[0.3em] uppercase text-[var(--color-stone)] mb-4">
            You are invited
          </p>
          <h1 className="animate-fade-up delay-100 font-display text-5xl font-light italic text-[var(--color-ink)] leading-tight">
            Dear {invite.name},
          </h1>
          <div className="animate-line-grow delay-300 mt-5 h-px bg-[var(--color-forest)] w-14 opacity-60" />
        </header>

        {/* Invitation text placeholder */}
        <div className="animate-fade-up delay-200 mb-12">
          <p className="font-display text-xl font-light text-[var(--color-stone)] italic leading-relaxed">
            We joyfully invite you to share in the celebration of our wedding day.
          </p>
        </div>

        {/* RSVP Form */}
        <div className="animate-fade-up delay-400">
          <p className="font-body text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-stone)] mb-6">
            Kindly respond
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

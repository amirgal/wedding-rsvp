import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { RsvpForm } from '@/components/rsvp-form'
import WeddingLanding from '@/components/wedding-landing'

const BOT_UA_PATTERN =
  /whatsapp|facebookexternalhit|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|googlebot|bingbot|crawler|spider|preview/i

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function RsvpPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) return <WeddingLanding />

  const supabase = createAdminClient()

  const { data: invite } = await supabase
    .from('invites')
    .select('*, responses(*)')
    .eq('token', token)
    .single()

  if (!invite) notFound()

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? ''
  const isBot = BOT_UA_PATTERN.test(userAgent)

  if (invite.status === 'pending' && !isBot) {
    await supabase.from('invites').update({ status: 'opened' }).eq('id', invite.id)
  }

  const existingResponse = Array.isArray(invite.responses)
    ? invite.responses[0] ?? null
    : invite.responses ?? null

  const isEditing = invite.status === 'submitted' || invite.status === 'edited'

  return (
    <main
      className="min-h-screen relative flex flex-col"
      style={{ background: '#ffffff' }}
    >
      {/* ═══════════════════════════════════════════════
          TOP FLORAL BORDER — full width, dense clusters
          ═══════════════════════════════════════════════ */}
      <div className="w-full pointer-events-none relative overflow-hidden" aria-hidden style={{ lineHeight: 0, maxHeight: 'clamp(55px, 11vw, 160px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flowers/flowersTop.svg"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.85, marginTop: '-13%' }}
        />
      </div>

      {/* ═════════════════════════
          MAIN CONTENT
          ═════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-8">
        <div className="w-full max-w-sm">
          <RsvpForm
            inviteId={invite.id}
            token={token}
            existingResponse={existingResponse}
            isEditing={isEditing}
            inviteName={invite.name}
          />
        </div>
      </div>
    </main>
  )
}

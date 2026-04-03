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
      <div className="w-full pointer-events-none" aria-hidden style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 390 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: 'block', maxHeight: '190px' }}
          preserveAspectRatio="xMidYMin slice"
        >
          {/* ─── LEFT CLUSTER ─── */}

          {/* Wisteria cascade — hanging purple clusters */}
          <ellipse cx="8" cy="12" rx="7" ry="5" fill="#c8a8d8" opacity="0.6" transform="rotate(-10 8 12)" />
          <ellipse cx="14" cy="8" rx="6" ry="4" fill="#b896c8" opacity="0.55" transform="rotate(5 14 8)" />
          <ellipse cx="5" cy="20" rx="5" ry="7" fill="#d4b4e0" opacity="0.5" />
          <ellipse cx="12" cy="22" rx="4" ry="6" fill="#c0a0d0" opacity="0.55" transform="rotate(-5 12 22)" />
          <ellipse cx="20" cy="15" rx="5" ry="7" fill="#c8a8d8" opacity="0.5" transform="rotate(10 20 15)" />
          <ellipse cx="18" cy="28" rx="4" ry="6" fill="#b896c8" opacity="0.45" transform="rotate(-8 18 28)" />
          <ellipse cx="3" cy="32" rx="4" ry="5" fill="#d4b4e0" opacity="0.45" />
          <ellipse cx="25" cy="10" rx="5" ry="4" fill="#c8a8d8" opacity="0.5" transform="rotate(15 25 10)" />
          <ellipse cx="28" cy="22" rx="4" ry="5" fill="#b896c8" opacity="0.45" transform="rotate(-12 28 22)" />
          <ellipse cx="8" cy="40" rx="4" ry="6" fill="#c0a0d0" opacity="0.40" />
          <ellipse cx="22" cy="38" rx="3" ry="5" fill="#d4b4e0" opacity="0.40" transform="rotate(8 22 38)" />

          {/* Pink cosmos — left */}
          {/* Cosmos 1 */}
          <ellipse cx="45" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.55" transform="rotate(-30 45 14)" />
          <ellipse cx="45" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.50" transform="rotate(30 45 14)" />
          <ellipse cx="45" cy="14" rx="9" ry="5" fill="#e890a0" opacity="0.45" transform="rotate(90 45 14)" />
          <ellipse cx="45" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.48" transform="rotate(-90 45 14)" />
          <circle cx="45" cy="14" r="4" fill="#f8d060" opacity="0.70" />
          <circle cx="45" cy="14" r="2.5" fill="#f0a828" opacity="0.80" />

          {/* Cosmos 2 — slightly overlapping */}
          <ellipse cx="62" cy="22" rx="8" ry="4.5" fill="#f4a8b8" opacity="0.55" transform="rotate(-20 62 22)" />
          <ellipse cx="62" cy="22" rx="8" ry="4.5" fill="#ec98a8" opacity="0.50" transform="rotate(20 62 22)" />
          <ellipse cx="62" cy="22" rx="8" ry="4.5" fill="#f4a8b8" opacity="0.45" transform="rotate(70 62 22)" />
          <ellipse cx="62" cy="22" rx="8" ry="4.5" fill="#ec98a8" opacity="0.48" transform="rotate(-70 62 22)" />
          <circle cx="62" cy="22" r="3.5" fill="#f8d060" opacity="0.70" />
          <circle cx="62" cy="22" r="2" fill="#f0a828" opacity="0.80" />

          {/* Small pink buds */}
          <ellipse cx="35" cy="30" rx="5" ry="3" fill="#f4b0c0" opacity="0.50" transform="rotate(-40 35 30)" />
          <ellipse cx="35" cy="30" rx="5" ry="3" fill="#f4b0c0" opacity="0.45" transform="rotate(40 35 30)" />
          <circle cx="35" cy="30" r="2.5" fill="#f8d878" opacity="0.65" />

          <ellipse cx="52" cy="38" rx="5" ry="3" fill="#f0a8b8" opacity="0.45" transform="rotate(-30 52 38)" />
          <ellipse cx="52" cy="38" rx="5" ry="3" fill="#f0a8b8" opacity="0.40" transform="rotate(30 52 38)" />
          <circle cx="52" cy="38" r="2" fill="#f8d060" opacity="0.60" />

          {/* Red/coral wildflower */}
          <ellipse cx="75" cy="10" rx="7" ry="4" fill="#f08060" opacity="0.55" transform="rotate(-35 75 10)" />
          <ellipse cx="75" cy="10" rx="7" ry="4" fill="#e87050" opacity="0.50" transform="rotate(35 75 10)" />
          <ellipse cx="75" cy="10" rx="7" ry="4" fill="#f08060" opacity="0.45" transform="rotate(80 75 10)" />
          <ellipse cx="75" cy="10" rx="7" ry="4" fill="#e87050" opacity="0.48" transform="rotate(-80 75 10)" />
          <circle cx="75" cy="10" r="3" fill="#f8e060" opacity="0.75" />
          <circle cx="75" cy="10" r="1.8" fill="#e8a020" opacity="0.80" />

          {/* Small red bud */}
          <ellipse cx="88" cy="20" rx="5" ry="3" fill="#f09070" opacity="0.45" transform="rotate(-25 88 20)" />
          <ellipse cx="88" cy="20" rx="5" ry="3" fill="#e88060" opacity="0.40" transform="rotate(25 88 20)" />
          <circle cx="88" cy="20" r="2" fill="#f8d060" opacity="0.65" />

          {/* Blue iris — left */}
          <ellipse cx="30" cy="12" rx="5" ry="9" fill="#7890d8" opacity="0.50" transform="rotate(-15 30 12)" />
          <ellipse cx="33" cy="10" rx="5" ry="9" fill="#8898d8" opacity="0.45" transform="rotate(5 33 10)" />
          <ellipse cx="27" cy="15" rx="4" ry="7" fill="#6880c8" opacity="0.55" transform="rotate(-30 27 15)" />
          <ellipse cx="30" cy="8" rx="3" ry="5" fill="#9090e0" opacity="0.50" />

          {/* Yellow daffodil — left */}
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.60" transform="rotate(-20 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.55" transform="rotate(20 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.50" transform="rotate(70 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.52" transform="rotate(-70 95 8)" />
          <ellipse cx="95" cy="8" rx="4" ry="3" fill="#f0a020" opacity="0.80" />
          <ellipse cx="95" cy="8" rx="2.5" ry="2" fill="#e09018" opacity="0.85" />

          {/* Leaves — left cluster */}
          <ellipse cx="40" cy="20" rx="14" ry="5" fill="#7ab878" opacity="0.45" transform="rotate(-35 40 20)" />
          <ellipse cx="55" cy="30" rx="16" ry="5" fill="#68a868" opacity="0.40" transform="rotate(-20 55 30)" />
          <ellipse cx="20" cy="35" rx="12" ry="4" fill="#80c080" opacity="0.38" transform="rotate(-50 20 35)" />
          <ellipse cx="70" cy="28" rx="15" ry="5" fill="#78b870" opacity="0.42" transform="rotate(-10 70 28)" />
          <ellipse cx="85" cy="32" rx="13" ry="4" fill="#6aaa6a" opacity="0.38" transform="rotate(5 85 32)" />
          <ellipse cx="50" cy="44" rx="18" ry="5" fill="#72b472" opacity="0.35" transform="rotate(-15 50 44)" />
          <ellipse cx="10" cy="50" rx="12" ry="4" fill="#80c080" opacity="0.32" transform="rotate(-60 10 50)" />

          {/* ─── RIGHT CLUSTER ─── */}

          {/* Wisteria — right */}
          <ellipse cx="382" cy="10" rx="7" ry="5" fill="#c8a8d8" opacity="0.60" transform="rotate(10 382 10)" />
          <ellipse cx="376" cy="7" rx="6" ry="4" fill="#b896c8" opacity="0.55" transform="rotate(-5 376 7)" />
          <ellipse cx="385" cy="20" rx="5" ry="7" fill="#d4b4e0" opacity="0.50" />
          <ellipse cx="378" cy="22" rx="4" ry="6" fill="#c0a0d0" opacity="0.55" transform="rotate(5 378 22)" />
          <ellipse cx="370" cy="15" rx="5" ry="7" fill="#c8a8d8" opacity="0.50" transform="rotate(-10 370 15)" />
          <ellipse cx="372" cy="28" rx="4" ry="6" fill="#b896c8" opacity="0.45" transform="rotate(8 372 28)" />
          <ellipse cx="387" cy="32" rx="4" ry="5" fill="#d4b4e0" opacity="0.45" />
          <ellipse cx="365" cy="10" rx="5" ry="4" fill="#c8a8d8" opacity="0.50" transform="rotate(-15 365 10)" />
          <ellipse cx="362" cy="22" rx="4" ry="5" fill="#b896c8" opacity="0.45" transform="rotate(12 362 22)" />
          <ellipse cx="382" cy="40" rx="4" ry="6" fill="#c0a0d0" opacity="0.40" />
          <ellipse cx="368" cy="38" rx="3" ry="5" fill="#d4b4e0" opacity="0.40" transform="rotate(-8 368 38)" />

          {/* Pink cosmos — right */}
          <ellipse cx="345" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.55" transform="rotate(30 345 14)" />
          <ellipse cx="345" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.50" transform="rotate(-30 345 14)" />
          <ellipse cx="345" cy="14" rx="9" ry="5" fill="#e890a0" opacity="0.45" transform="rotate(90 345 14)" />
          <ellipse cx="345" cy="14" rx="9" ry="5" fill="#f0a0b0" opacity="0.48" transform="rotate(-90 345 14)" />
          <circle cx="345" cy="14" r="4" fill="#f8d060" opacity="0.70" />
          <circle cx="345" cy="14" r="2.5" fill="#f0a828" opacity="0.80" />

          <ellipse cx="328" cy="22" rx="8" ry="4.5" fill="#f4a8b8" opacity="0.55" transform="rotate(20 328 22)" />
          <ellipse cx="328" cy="22" rx="8" ry="4.5" fill="#ec98a8" opacity="0.50" transform="rotate(-20 328 22)" />
          <ellipse cx="328" cy="22" rx="8" ry="4.5" fill="#f4a8b8" opacity="0.45" transform="rotate(70 328 22)" />
          <ellipse cx="328" cy="22" rx="8" ry="4.5" fill="#ec98a8" opacity="0.48" transform="rotate(-70 328 22)" />
          <circle cx="328" cy="22" r="3.5" fill="#f8d060" opacity="0.70" />
          <circle cx="328" cy="22" r="2" fill="#f0a828" opacity="0.80" />

          {/* Small pink buds — right */}
          <ellipse cx="355" cy="30" rx="5" ry="3" fill="#f4b0c0" opacity="0.50" transform="rotate(40 355 30)" />
          <ellipse cx="355" cy="30" rx="5" ry="3" fill="#f4b0c0" opacity="0.45" transform="rotate(-40 355 30)" />
          <circle cx="355" cy="30" r="2.5" fill="#f8d878" opacity="0.65" />

          <ellipse cx="338" cy="38" rx="5" ry="3" fill="#f0a8b8" opacity="0.45" transform="rotate(30 338 38)" />
          <ellipse cx="338" cy="38" rx="5" ry="3" fill="#f0a8b8" opacity="0.40" transform="rotate(-30 338 38)" />
          <circle cx="338" cy="38" r="2" fill="#f8d060" opacity="0.60" />

          {/* Red/coral wildflower — right */}
          <ellipse cx="315" cy="10" rx="7" ry="4" fill="#f08060" opacity="0.55" transform="rotate(35 315 10)" />
          <ellipse cx="315" cy="10" rx="7" ry="4" fill="#e87050" opacity="0.50" transform="rotate(-35 315 10)" />
          <ellipse cx="315" cy="10" rx="7" ry="4" fill="#f08060" opacity="0.45" transform="rotate(80 315 10)" />
          <ellipse cx="315" cy="10" rx="7" ry="4" fill="#e87050" opacity="0.48" transform="rotate(-80 315 10)" />
          <circle cx="315" cy="10" r="3" fill="#f8e060" opacity="0.75" />
          <circle cx="315" cy="10" r="1.8" fill="#e8a020" opacity="0.80" />

          <ellipse cx="302" cy="20" rx="5" ry="3" fill="#f09070" opacity="0.45" transform="rotate(25 302 20)" />
          <ellipse cx="302" cy="20" rx="5" ry="3" fill="#e88060" opacity="0.40" transform="rotate(-25 302 20)" />
          <circle cx="302" cy="20" r="2" fill="#f8d060" opacity="0.65" />

          {/* Blue iris — right */}
          <ellipse cx="360" cy="12" rx="5" ry="9" fill="#7890d8" opacity="0.50" transform="rotate(15 360 12)" />
          <ellipse cx="357" cy="10" rx="5" ry="9" fill="#8898d8" opacity="0.45" transform="rotate(-5 357 10)" />
          <ellipse cx="363" cy="15" rx="4" ry="7" fill="#6880c8" opacity="0.55" transform="rotate(30 363 15)" />
          <ellipse cx="360" cy="8" rx="3" ry="5" fill="#9090e0" opacity="0.50" />

          {/* Yellow daffodil — right */}
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.60" transform="rotate(20 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.55" transform="rotate(-20 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.50" transform="rotate(70 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.52" transform="rotate(-70 295 8)" />
          <ellipse cx="295" cy="8" rx="4" ry="3" fill="#f0a020" opacity="0.80" />
          <ellipse cx="295" cy="8" rx="2.5" ry="2" fill="#e09018" opacity="0.85" />

          {/* Leaves — right cluster */}
          <ellipse cx="350" cy="20" rx="14" ry="5" fill="#7ab878" opacity="0.45" transform="rotate(35 350 20)" />
          <ellipse cx="335" cy="30" rx="16" ry="5" fill="#68a868" opacity="0.40" transform="rotate(20 335 30)" />
          <ellipse cx="370" cy="35" rx="12" ry="4" fill="#80c080" opacity="0.38" transform="rotate(50 370 35)" />
          <ellipse cx="320" cy="28" rx="15" ry="5" fill="#78b870" opacity="0.42" transform="rotate(10 320 28)" />
          <ellipse cx="305" cy="32" rx="13" ry="4" fill="#6aaa6a" opacity="0.38" transform="rotate(-5 305 32)" />
          <ellipse cx="340" cy="44" rx="18" ry="5" fill="#72b472" opacity="0.35" transform="rotate(15 340 44)" />
          <ellipse cx="380" cy="50" rx="12" ry="4" fill="#80c080" opacity="0.32" transform="rotate(60 380 50)" />

          {/* ─── CENTER TOP — lighter fill ─── */}
          {/* Scattered small flowers bridging left and right */}
          <ellipse cx="140" cy="8" rx="5" ry="3" fill="#f4a8b8" opacity="0.35" transform="rotate(-20 140 8)" />
          <ellipse cx="140" cy="8" rx="5" ry="3" fill="#f4a8b8" opacity="0.30" transform="rotate(20 140 8)" />
          <circle cx="140" cy="8" r="2" fill="#f8d060" opacity="0.45" />

          <ellipse cx="165" cy="5" rx="5" ry="3" fill="#c8a8d8" opacity="0.30" transform="rotate(10 165 5)" />
          <ellipse cx="165" cy="5" rx="5" ry="3" fill="#c8a8d8" opacity="0.25" transform="rotate(-10 165 5)" />

          <ellipse cx="195" cy="7" rx="4" ry="6" fill="#f0d040" opacity="0.25" transform="rotate(5 195 7)" />
          <ellipse cx="195" cy="7" rx="4" ry="6" fill="#e8c838" opacity="0.20" transform="rotate(-5 195 7)" />

          <ellipse cx="225" cy="5" rx="5" ry="3" fill="#f4b0c0" opacity="0.28" transform="rotate(-15 225 5)" />
          <ellipse cx="225" cy="5" rx="5" ry="3" fill="#f4b0c0" opacity="0.22" transform="rotate(15 225 5)" />
          <circle cx="225" cy="5" r="1.5" fill="#f8d878" opacity="0.40" />

          <ellipse cx="250" cy="8" rx="5" ry="3" fill="#7890d8" opacity="0.25" transform="rotate(20 250 8)" />
          <ellipse cx="250" cy="8" rx="3" ry="5" fill="#8898d8" opacity="0.20" transform="rotate(-10 250 8)" />

          {/* Scattered leaves — center */}
          <ellipse cx="120" cy="18" rx="16" ry="4" fill="#78b870" opacity="0.28" transform="rotate(-5 120 18)" />
          <ellipse cx="200" cy="12" rx="14" ry="4" fill="#6aaa6a" opacity="0.22" transform="rotate(8 200 12)" />
          <ellipse cx="270" cy="18" rx="15" ry="4" fill="#72b472" opacity="0.25" transform="rotate(-12 270 18)" />
        </svg>
      </div>

      {/* ═════════════════════════
          MAIN CONTENT
          ═════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-4">
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

      {/* ═══════════════════════════════════════════════
          BOTTOM FLORAL STRIP — individual flowers row
          ═══════════════════════════════════════════════ */}
      <div className="w-full pointer-events-none mt-auto" aria-hidden style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 390 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: 'block', maxHeight: '130px' }}
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Yellow daffodil — far left */}
          <ellipse cx="18" cy="80" rx="10" ry="5" fill="#f0d040" opacity="0.65" transform="rotate(-15 18 80)" />
          <ellipse cx="18" cy="80" rx="10" ry="5" fill="#e8c838" opacity="0.60" transform="rotate(15 18 80)" />
          <ellipse cx="18" cy="80" rx="10" ry="5" fill="#f0d040" opacity="0.55" transform="rotate(60 18 80)" />
          <ellipse cx="18" cy="80" rx="10" ry="5" fill="#e8c838" opacity="0.55" transform="rotate(-60 18 80)" />
          <ellipse cx="18" cy="80" rx="5" ry="4" fill="#f0a020" opacity="0.85" />
          <ellipse cx="18" cy="80" rx="3" ry="2.5" fill="#e09018" opacity="0.90" />
          <path d="M18 90 C16 108, 14 118, 12 128" stroke="#78b870" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
          <ellipse cx="10" cy="112" rx="10" ry="3.5" fill="#78b870" opacity="0.40" transform="rotate(-25 10 112)" />

          {/* White/cream flower */}
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#f0ece0" opacity="0.70" transform="rotate(-25 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#e8e4d8" opacity="0.65" transform="rotate(25 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#f0ece0" opacity="0.60" transform="rotate(80 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#e8e4d8" opacity="0.62" transform="rotate(-80 55 75)" />
          <circle cx="55" cy="75" r="4" fill="#f8e880" opacity="0.75" />
          <circle cx="55" cy="75" r="2.5" fill="#f0d040" opacity="0.85" />
          <path d="M55 84 C54 100, 53 115, 52 128" stroke="#6aaa6a" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />

          {/* Blue iris */}
          <ellipse cx="92" cy="68" rx="7" ry="12" fill="#7890d8" opacity="0.55" transform="rotate(-8 92 68)" />
          <ellipse cx="96" cy="66" rx="7" ry="11" fill="#8898e0" opacity="0.50" transform="rotate(8 96 66)" />
          <ellipse cx="88" cy="70" rx="6" ry="10" fill="#6880c8" opacity="0.58" transform="rotate(-20 88 70)" />
          <ellipse cx="92" cy="62" rx="4" ry="7" fill="#9898e8" opacity="0.52" />
          <ellipse cx="90" cy="72" rx="3" ry="5" fill="#7070c0" opacity="0.60" />
          <path d="M92 80 C91 98, 90 113, 89 128" stroke="#68a868" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />
          <ellipse cx="85" cy="108" rx="9" ry="3" fill="#78b870" opacity="0.35" transform="rotate(20 85 108)" />

          {/* Pink cosmos */}
          <ellipse cx="128" cy="72" rx="11" ry="6" fill="#f0a0b0" opacity="0.60" transform="rotate(-30 128 72)" />
          <ellipse cx="128" cy="72" rx="11" ry="6" fill="#f0a0b0" opacity="0.55" transform="rotate(30 128 72)" />
          <ellipse cx="128" cy="72" rx="11" ry="6" fill="#e890a0" opacity="0.50" transform="rotate(90 128 72)" />
          <ellipse cx="128" cy="72" rx="11" ry="6" fill="#f0a0b0" opacity="0.52" transform="rotate(-90 128 72)" />
          <circle cx="128" cy="72" r="4.5" fill="#f8d060" opacity="0.75" />
          <circle cx="128" cy="72" r="2.8" fill="#f0a828" opacity="0.85" />
          <path d="M128 83 C127 100, 126 115, 125 128" stroke="#72b472" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />

          {/* Lavender wisteria small bunch */}
          <ellipse cx="162" cy="70" rx="6" ry="4" fill="#c8a8d8" opacity="0.55" transform="rotate(-10 162 70)" />
          <ellipse cx="168" cy="66" rx="5" ry="3.5" fill="#b896c8" opacity="0.50" transform="rotate(8 168 66)" />
          <ellipse cx="158" cy="78" rx="5" ry="7" fill="#d4b4e0" opacity="0.48" />
          <ellipse cx="166" cy="80" rx="4" ry="6" fill="#c0a0d0" opacity="0.50" transform="rotate(-5 166 80)" />
          <ellipse cx="172" cy="74" rx="4" ry="6" fill="#c8a8d8" opacity="0.45" transform="rotate(10 172 74)" />
          <path d="M164 88 C163 105, 162 116, 161 128" stroke="#6aaa6a" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

          {/* Red/coral wildflower */}
          <ellipse cx="200" cy="74" rx="9" ry="5" fill="#f08060" opacity="0.60" transform="rotate(-25 200 74)" />
          <ellipse cx="200" cy="74" rx="9" ry="5" fill="#e87050" opacity="0.55" transform="rotate(25 200 74)" />
          <ellipse cx="200" cy="74" rx="9" ry="5" fill="#f08060" opacity="0.50" transform="rotate(80 200 74)" />
          <ellipse cx="200" cy="74" rx="9" ry="5" fill="#e87050" opacity="0.52" transform="rotate(-80 200 74)" />
          <circle cx="200" cy="74" r="4" fill="#f8e060" opacity="0.75" />
          <circle cx="200" cy="74" r="2.5" fill="#e8a020" opacity="0.85" />
          <path d="M200 83 C199 100, 198 114, 197 128" stroke="#78b870" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />

          {/* White delicate flower */}
          <ellipse cx="236" cy="70" rx="8" ry="4.5" fill="#f4f0e8" opacity="0.68" transform="rotate(-20 236 70)" />
          <ellipse cx="236" cy="70" rx="8" ry="4.5" fill="#eceae0" opacity="0.62" transform="rotate(20 236 70)" />
          <ellipse cx="236" cy="70" rx="8" ry="4.5" fill="#f4f0e8" opacity="0.58" transform="rotate(70 236 70)" />
          <ellipse cx="236" cy="70" rx="8" ry="4.5" fill="#eceae0" opacity="0.60" transform="rotate(-70 236 70)" />
          <circle cx="236" cy="70" r="3.5" fill="#f8e880" opacity="0.72" />
          <path d="M236 79 C235 97, 234 113, 233 128" stroke="#70ae70" strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
          <ellipse cx="228" cy="110" rx="10" ry="3" fill="#72b472" opacity="0.35" transform="rotate(15 228 110)" />

          {/* Pink cosmos 2 */}
          <ellipse cx="270" cy="72" rx="10" ry="5.5" fill="#f4a8b8" opacity="0.58" transform="rotate(30 270 72)" />
          <ellipse cx="270" cy="72" rx="10" ry="5.5" fill="#ec98a8" opacity="0.52" transform="rotate(-30 270 72)" />
          <ellipse cx="270" cy="72" rx="10" ry="5.5" fill="#f4a8b8" opacity="0.48" transform="rotate(85 270 72)" />
          <ellipse cx="270" cy="72" rx="10" ry="5.5" fill="#ec98a8" opacity="0.50" transform="rotate(-85 270 72)" />
          <circle cx="270" cy="72" r="4" fill="#f8d060" opacity="0.72" />
          <circle cx="270" cy="72" r="2.5" fill="#f0a828" opacity="0.82" />
          <path d="M270 82 C269 99, 268 114, 267 128" stroke="#68a868" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />

          {/* Blue iris 2 */}
          <ellipse cx="306" cy="68" rx="7" ry="12" fill="#8090d8" opacity="0.52" transform="rotate(8 306 68)" />
          <ellipse cx="310" cy="66" rx="6" ry="11" fill="#9098e0" opacity="0.48" transform="rotate(-8 310 66)" />
          <ellipse cx="302" cy="70" rx="5" ry="10" fill="#7080c8" opacity="0.55" transform="rotate(20 302 70)" />
          <ellipse cx="306" cy="62" rx="4" ry="7" fill="#a0a0e8" opacity="0.50" />
          <path d="M306 80 C305 97, 304 113, 303 128" stroke="#70b070" strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
          <ellipse cx="298" cy="108" rx="9" ry="3" fill="#78b870" opacity="0.32" transform="rotate(-15 298 108)" />

          {/* Yellow daffodil — far right */}
          <ellipse cx="372" cy="80" rx="10" ry="5" fill="#f0d040" opacity="0.65" transform="rotate(15 372 80)" />
          <ellipse cx="372" cy="80" rx="10" ry="5" fill="#e8c838" opacity="0.60" transform="rotate(-15 372 80)" />
          <ellipse cx="372" cy="80" rx="10" ry="5" fill="#f0d040" opacity="0.55" transform="rotate(65 372 80)" />
          <ellipse cx="372" cy="80" rx="10" ry="5" fill="#e8c838" opacity="0.55" transform="rotate(-65 372 80)" />
          <ellipse cx="372" cy="80" rx="5" ry="4" fill="#f0a020" opacity="0.85" />
          <ellipse cx="372" cy="80" rx="3" ry="2.5" fill="#e09018" opacity="0.90" />
          <path d="M372 90 C373 108, 374 118, 375 128" stroke="#78b870" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
          <ellipse cx="378" cy="112" rx="10" ry="3.5" fill="#78b870" opacity="0.38" transform="rotate(20 378 112)" />

          {/* Scattered bottom leaves */}
          <ellipse cx="38" cy="115" rx="14" ry="4" fill="#72b472" opacity="0.35" transform="rotate(-10 38 115)" />
          <ellipse cx="110" cy="118" rx="12" ry="3.5" fill="#7ab878" opacity="0.32" transform="rotate(8 110 118)" />
          <ellipse cx="148" cy="112" rx="11" ry="3" fill="#68a868" opacity="0.30" transform="rotate(-15 148 112)" />
          <ellipse cx="215" cy="118" rx="13" ry="3.5" fill="#78b870" opacity="0.32" transform="rotate(5 215 118)" />
          <ellipse cx="252" cy="114" rx="11" ry="3" fill="#6aaa6a" opacity="0.30" transform="rotate(-8 252 114)" />
          <ellipse cx="320" cy="116" rx="12" ry="3.5" fill="#72b472" opacity="0.32" transform="rotate(12 320 116)" />
          <ellipse cx="350" cy="110" rx="10" ry="3" fill="#80c080" opacity="0.30" transform="rotate(-18 350 110)" />
        </svg>
      </div>
    </main>
  )
}

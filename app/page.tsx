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
          style={{ display: 'block', maxHeight: '80px' }}
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            {/* Soft watercolor gradients - delicate and translucent */}
            <radialGradient id="pinkPetal" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#ffc8d8" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#ff9bb8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff88a8" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="purplePetal" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#d8c0f0" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#b898d8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a080c8" stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="yellowPetal" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fffef8" stopOpacity="0.4" />
              <stop offset="35%" stopColor="#ffe8a0" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#ffd060" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f0b840" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="yellowCenter" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffd850" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e0a830" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="bluePetal" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="35%" stopColor="#c8d8f8" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#98b8e8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7898d8" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="leafGreen" cx="45%" cy="40%">
              <stop offset="0%" stopColor="#e8f8d8" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#a8d888" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78b860" stopOpacity="0.25" />
            </radialGradient>
          </defs>
          {/* ─── LEFT CLUSTER ─── */}

          {/* Wisteria cascade — delicate hanging clusters */}
          <ellipse cx="8" cy="12" rx="6" ry="4" fill="url(#purplePetal)" transform="rotate(-10 8 12)" />
          <ellipse cx="14" cy="8" rx="5" ry="3.5" fill="url(#purplePetal)" transform="rotate(5 14 8)" />
          <ellipse cx="5" cy="20" rx="4" ry="6" fill="url(#purplePetal)" />
          <ellipse cx="12" cy="22" rx="3.5" ry="5" fill="url(#purplePetal)" transform="rotate(-5 12 22)" />
          <ellipse cx="20" cy="15" rx="4" ry="6" fill="url(#purplePetal)" transform="rotate(10 20 15)" />
          <ellipse cx="18" cy="28" rx="3" ry="5" fill="url(#purplePetal)" transform="rotate(-8 18 28)" />
          <path d="M10 10 Q8 18, 6 26" stroke="url(#leafGreen)" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M16 8 Q14 16, 12 24" stroke="url(#leafGreen)" strokeWidth="0.8" fill="none" opacity="0.4" />

          {/* Pink cosmos — delicate petals */}
          <ellipse cx="45" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(-30 45 14)" />
          <ellipse cx="45" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(30 45 14)" />
          <ellipse cx="45" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(90 45 14)" />
          <ellipse cx="45" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(-90 45 14)" />
          <circle cx="45" cy="14" r="3" fill="url(#yellowCenter)" />
          <circle cx="45" cy="14" r="1.5" fill="#f0b830" opacity="0.7" />
          <path d="M45 18 L45 35" stroke="url(#leafGreen)" strokeWidth="1" fill="none" opacity="0.35" />
          <ellipse cx="42" cy="28" rx="8" ry="2.5" fill="url(#leafGreen)" transform="rotate(-15 42 28)" />

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

          {/* Blue iris — delicate petals */}
          <ellipse cx="30" cy="12" rx="4.5" ry="8" fill="url(#bluePetal)" transform="rotate(-15 30 12)" />
          <ellipse cx="33" cy="10" rx="4.5" ry="8" fill="url(#bluePetal)" transform="rotate(5 33 10)" />
          <ellipse cx="27" cy="15" rx="3.5" ry="6.5" fill="url(#bluePetal)" transform="rotate(-30 27 15)" />
          <circle cx="30" cy="12" r="2" fill="#ffe8a0" opacity="0.5" />
          <path d="M30 18 L30 36" stroke="url(#leafGreen)" strokeWidth="0.9" fill="none" opacity="0.35" />
          <ellipse cx="28" cy="28" rx="10" ry="2.8" fill="url(#leafGreen)" transform="rotate(5 28 28)" />

          {/* Yellow daffodil — left */}
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.60" transform="rotate(-20 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.55" transform="rotate(20 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.50" transform="rotate(70 95 8)" />
          <ellipse cx="95" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.52" transform="rotate(-70 95 8)" />
          <ellipse cx="95" cy="8" rx="4" ry="3" fill="#f0a020" opacity="0.80" />
          <ellipse cx="95" cy="8" rx="2.5" ry="2" fill="#e09018" opacity="0.85" />

          {/* Delicate leaves */}
          <ellipse cx="40" cy="20" rx="12" ry="3.5" fill="url(#leafGreen)" transform="rotate(-35 40 20)" />
          <ellipse cx="55" cy="30" rx="14" ry="3.8" fill="url(#leafGreen)" transform="rotate(-20 55 30)" />
          <ellipse cx="20" cy="35" rx="10" ry="3" fill="url(#leafGreen)" transform="rotate(-50 20 35)" />
          <ellipse cx="70" cy="28" rx="13" ry="3.5" fill="url(#leafGreen)" transform="rotate(-10 70 28)" />
          <ellipse cx="85" cy="32" rx="11" ry="3.2" fill="url(#leafGreen)" transform="rotate(5 85 32)" />

          {/* ─── RIGHT CLUSTER ─── */}

          {/* Wisteria — right delicate clusters */}
          <ellipse cx="382" cy="10" rx="6" ry="4" fill="url(#purplePetal)" transform="rotate(10 382 10)" />
          <ellipse cx="376" cy="7" rx="5" ry="3.5" fill="url(#purplePetal)" transform="rotate(-5 376 7)" />
          <ellipse cx="385" cy="20" rx="4" ry="6" fill="url(#purplePetal)" />
          <ellipse cx="378" cy="22" rx="3.5" ry="5" fill="url(#purplePetal)" transform="rotate(5 378 22)" />
          <ellipse cx="370" cy="15" rx="4" ry="6" fill="url(#purplePetal)" transform="rotate(-10 370 15)" />
          <ellipse cx="372" cy="28" rx="3" ry="5" fill="url(#purplePetal)" transform="rotate(8 372 28)" />
          <path d="M380 10 Q382 18, 384 26" stroke="url(#leafGreen)" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M374 8 Q376 16, 378 24" stroke="url(#leafGreen)" strokeWidth="0.8" fill="none" opacity="0.4" />

          {/* Pink cosmos — right delicate */}
          <ellipse cx="345" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(30 345 14)" />
          <ellipse cx="345" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(-30 345 14)" />
          <ellipse cx="345" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(90 345 14)" />
          <ellipse cx="345" cy="14" rx="8" ry="4.5" fill="url(#pinkPetal)" transform="rotate(-90 345 14)" />
          <circle cx="345" cy="14" r="3" fill="url(#yellowCenter)" />
          <circle cx="345" cy="14" r="1.5" fill="#f0b830" opacity="0.7" />
          <path d="M345 18 L345 35" stroke="url(#leafGreen)" strokeWidth="1" fill="none" opacity="0.35" />
          <ellipse cx="348" cy="28" rx="8" ry="2.5" fill="url(#leafGreen)" transform="rotate(15 348 28)" />

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

          {/* Blue iris — right delicate */}
          <ellipse cx="360" cy="12" rx="4.5" ry="8" fill="url(#bluePetal)" transform="rotate(15 360 12)" />
          <ellipse cx="357" cy="10" rx="4.5" ry="8" fill="url(#bluePetal)" transform="rotate(-5 357 10)" />
          <ellipse cx="363" cy="15" rx="3.5" ry="6.5" fill="url(#bluePetal)" transform="rotate(30 363 15)" />
          <circle cx="360" cy="12" r="2" fill="#ffe8a0" opacity="0.5" />
          <path d="M360 18 L360 36" stroke="url(#leafGreen)" strokeWidth="0.9" fill="none" opacity="0.35" />
          <ellipse cx="362" cy="28" rx="10" ry="2.8" fill="url(#leafGreen)" transform="rotate(-5 362 28)" />

          {/* Yellow daffodil — right */}
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.60" transform="rotate(20 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.55" transform="rotate(-20 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#f0d040" opacity="0.50" transform="rotate(70 295 8)" />
          <ellipse cx="295" cy="8" rx="8" ry="4" fill="#e8c838" opacity="0.52" transform="rotate(-70 295 8)" />
          <ellipse cx="295" cy="8" rx="4" ry="3" fill="#f0a020" opacity="0.80" />
          <ellipse cx="295" cy="8" rx="2.5" ry="2" fill="#e09018" opacity="0.85" />

          {/* Delicate leaves — right */}
          <ellipse cx="350" cy="20" rx="12" ry="3.5" fill="url(#leafGreen)" transform="rotate(35 350 20)" />
          <ellipse cx="335" cy="30" rx="14" ry="3.8" fill="url(#leafGreen)" transform="rotate(20 335 30)" />
          <ellipse cx="370" cy="35" rx="10" ry="3" fill="url(#leafGreen)" transform="rotate(50 370 35)" />
          <ellipse cx="320" cy="28" rx="13" ry="3.5" fill="url(#leafGreen)" transform="rotate(10 320 28)" />
          <ellipse cx="305" cy="32" rx="11" ry="3.2" fill="url(#leafGreen)" transform="rotate(-5 305 32)" />

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
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-2">
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
          <defs>
            {/* Soft watercolor gradients - delicate and translucent */}
            <radialGradient id="pinkPetal2" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#ffc8d8" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#ff9bb8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff88a8" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="purplePetal2" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#d8c0f0" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#b898d8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a080c8" stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="yellowPetal2" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fffef8" stopOpacity="0.4" />
              <stop offset="35%" stopColor="#ffe8a0" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#ffd060" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f0b840" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="yellowCenter2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff8d0" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffd850" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e0a830" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="bluePetal2" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="35%" stopColor="#c8d8f8" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#98b8e8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7898d8" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="leafGreen2" cx="45%" cy="40%">
              <stop offset="0%" stopColor="#e8f8d8" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#a8d888" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78b860" stopOpacity="0.25" />
            </radialGradient>
          </defs>
          {/* Yellow daffodil — delicate */}
          <ellipse cx="18" cy="80" rx="9" ry="4.5" fill="url(#yellowPetal2)" transform="rotate(-15 18 80)" />
          <ellipse cx="18" cy="80" rx="9" ry="4.5" fill="url(#yellowPetal2)" transform="rotate(15 18 80)" />
          <ellipse cx="18" cy="80" rx="9" ry="4.5" fill="url(#yellowPetal2)" transform="rotate(60 18 80)" />
          <ellipse cx="18" cy="80" rx="9" ry="4.5" fill="url(#yellowPetal2)" transform="rotate(-60 18 80)" />
          <circle cx="18" cy="80" r="3.5" fill="url(#yellowCenter2)" />
          <circle cx="18" cy="80" r="1.8" fill="#d89020" opacity="0.7" />
          <path d="M18 85 L18 120" stroke="url(#leafGreen2)" strokeWidth="1.2" fill="none" opacity="0.35" />
          <ellipse cx="16" cy="105" rx="9" ry="3" fill="url(#leafGreen2)" transform="rotate(-25 16 105)" />

          {/* White/cream flower */}
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#f0ece0" opacity="0.70" transform="rotate(-25 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#e8e4d8" opacity="0.65" transform="rotate(25 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#f0ece0" opacity="0.60" transform="rotate(80 55 75)" />
          <ellipse cx="55" cy="75" rx="9" ry="5" fill="#e8e4d8" opacity="0.62" transform="rotate(-80 55 75)" />
          <circle cx="55" cy="75" r="4" fill="#f8e880" opacity="0.75" />
          <circle cx="55" cy="75" r="2.5" fill="#f0d040" opacity="0.85" />
          <path d="M55 84 C54 100, 53 115, 52 128" stroke="#6aaa6a" strokeWidth="1.5" strokeLinecap="round" opacity="0.50" />

          {/* Blue iris — delicate */}
          <ellipse cx="92" cy="68" rx="6" ry="10" fill="url(#bluePetal2)" transform="rotate(-8 92 68)" />
          <ellipse cx="96" cy="66" rx="6" ry="9.5" fill="url(#bluePetal2)" transform="rotate(8 96 66)" />
          <ellipse cx="88" cy="70" rx="5" ry="8.5" fill="url(#bluePetal2)" transform="rotate(-20 88 70)" />
          <circle cx="92" cy="68" r="2.5" fill="#ffe8a0" opacity="0.5" />
          <path d="M92 78 L92 122" stroke="url(#leafGreen2)" strokeWidth="1.1" fill="none" opacity="0.35" />
          <ellipse cx="90" cy="102" rx="10" ry="3.2" fill="url(#leafGreen2)" transform="rotate(20 90 102)" />

          {/* Pink cosmos — delicate */}
          <ellipse cx="128" cy="72" rx="10" ry="5.5" fill="url(#pinkPetal2)" transform="rotate(-30 128 72)" />
          <ellipse cx="128" cy="72" rx="10" ry="5.5" fill="url(#pinkPetal2)" transform="rotate(30 128 72)" />
          <ellipse cx="128" cy="72" rx="10" ry="5.5" fill="url(#pinkPetal2)" transform="rotate(90 128 72)" />
          <ellipse cx="128" cy="72" rx="10" ry="5.5" fill="url(#pinkPetal2)" transform="rotate(-90 128 72)" />
          <circle cx="128" cy="72" r="3.5" fill="url(#yellowCenter2)" />
          <circle cx="128" cy="72" r="1.8" fill="#f0b830" opacity="0.7" />
          <path d="M128 78 L128 122" stroke="url(#leafGreen2)" strokeWidth="1.2" fill="none" opacity="0.35" />
          <ellipse cx="125" cy="100" rx="11" ry="3.2" fill="url(#leafGreen2)" transform="rotate(-8 125 100)" />

          {/* Lavender wisteria small bunch with depth */}
          <ellipse cx="162" cy="71" rx="6.5" ry="4.5" fill="url(#softShadow2)" transform="rotate(-10 162 71)" />
          <ellipse cx="162" cy="70" rx="6" ry="4" fill="url(#purplePetal2)" transform="rotate(-10 162 70)" />
          <ellipse cx="168" cy="67" rx="5.5" ry="4" fill="url(#softShadow2)" transform="rotate(8 168 67)" />
          <ellipse cx="168" cy="66" rx="5" ry="3.5" fill="url(#purplePetal2)" transform="rotate(8 168 66)" />
          <ellipse cx="158" cy="79" rx="5.5" ry="7.5" fill="url(#softShadow2)" />
          <ellipse cx="158" cy="78" rx="5" ry="7" fill="url(#purplePetal2)" />
          <ellipse cx="166" cy="81" rx="4.5" ry="6.5" fill="url(#softShadow2)" transform="rotate(-5 166 81)" />
          <ellipse cx="166" cy="80" rx="4" ry="6" fill="url(#purplePetal2)" transform="rotate(-5 166 80)" />
          <ellipse cx="172" cy="75" rx="4.5" ry="6.5" fill="url(#softShadow2)" transform="rotate(10 172 75)" />
          <ellipse cx="172" cy="74" rx="4" ry="6" fill="url(#purplePetal2)" transform="rotate(10 172 74)" />
          <path d="M164 88 C163 105, 162 116, 161 128" stroke="url(#leafGreen2)" strokeWidth="2" strokeLinecap="round" />

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

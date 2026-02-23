import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Stats } from '@/lib/types'

export async function GET() {
  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const [{ data: invites }, { data: responses }] = await Promise.all([
    supabase.from('invites').select('status'),
    supabase.from('responses').select('attending, adult_count, kid_count, vegan_count, gluten_free_count'),
  ])

  const stats: Stats = {
    pending: invites?.filter((i) => i.status === 'pending').length ?? 0,
    opened: invites?.filter((i) => i.status === 'opened').length ?? 0,
    submitted: invites?.filter((i) => i.status === 'submitted').length ?? 0,
    edited: invites?.filter((i) => i.status === 'edited').length ?? 0,
    totalAdults:
      responses
        ?.filter((r) => r.attending)
        .reduce((sum, r) => sum + (r.adult_count ?? 0), 0) ?? 0,
    totalKids:
      responses
        ?.filter((r) => r.attending)
        .reduce((sum, r) => sum + (r.kid_count ?? 0), 0) ?? 0,
    totalVegan:
      responses
        ?.filter((r) => r.attending)
        .reduce((sum, r) => sum + (r.vegan_count ?? 0), 0) ?? 0,
    totalGlutenFree:
      responses
        ?.filter((r) => r.attending)
        .reduce((sum, r) => sum + (r.gluten_free_count ?? 0), 0) ?? 0,
    totalNotAttending: responses?.filter((r) => !r.attending).length ?? 0,
    totalInvited: invites?.length ?? 0,
  }

  return NextResponse.json({ success: true, data: stats })
}

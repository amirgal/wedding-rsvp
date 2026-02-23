import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { token, attending, adult_count = 0, kid_count = 0, vegan_count = 0, gluten_free_count = 0 } = body

  if (!token || typeof attending !== 'boolean') {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Invalid request' }, { status: 400 })
  }

  if (attending && adult_count < 1) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'At least one adult is required' },
      { status: 400 }
    )
  }

  const totalGuests = adult_count + kid_count
  if (attending && (vegan_count > totalGuests || gluten_free_count > totalGuests)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Dietary counts cannot exceed total guests' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Resolve invite by token
  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .select('id, status')
    .eq('token', token)
    .single()

  if (inviteError || !invite) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Invalid invite token' }, { status: 404 })
  }

  // Determine new status: submitted → edited on second submission
  const newStatus =
    invite.status === 'submitted' || invite.status === 'edited' ? 'edited' : 'submitted'

  const finalAdultCount = attending ? adult_count : 0
  const finalKidCount = attending ? kid_count : 0
  const finalVeganCount = attending ? vegan_count : 0
  const finalGlutenFreeCount = attending ? gluten_free_count : 0

  // Upsert current response
  const { error: upsertError } = await supabase.from('responses').upsert(
    {
      invite_id: invite.id,
      attending,
      adult_count: finalAdultCount,
      kid_count: finalKidCount,
      vegan_count: finalVeganCount,
      gluten_free_count: finalGlutenFreeCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'invite_id' }
  )

  if (upsertError) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    )
  }

  // Append immutable history entry
  await supabase.from('response_history').insert({
    invite_id: invite.id,
    attending,
    adult_count: finalAdultCount,
    kid_count: finalKidCount,
    vegan_count: finalVeganCount,
    gluten_free_count: finalGlutenFreeCount,
  })

  // Update invite status
  await supabase.from('invites').update({ status: newStatus }).eq('id', invite.id)

  return NextResponse.json<ApiResponse>({ success: true })
}

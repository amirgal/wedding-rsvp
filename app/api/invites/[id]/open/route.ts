import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json()
  const { token } = body

  if (!token) {
    return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // Verify token matches this specific invite
  const { data: invite } = await supabase
    .from('invites')
    .select('id, status, token')
    .eq('id', id)
    .eq('token', token)
    .single()

  if (!invite) {
    return NextResponse.json({ success: false, error: 'Invalid' }, { status: 404 })
  }

  // Only transition pending → opened
  if (invite.status === 'pending') {
    await supabase.from('invites').update({ status: 'opened' }).eq('id', invite.id)
  }

  return NextResponse.json({ success: true })
}

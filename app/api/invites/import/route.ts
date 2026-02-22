import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

export async function POST(request: NextRequest) {
  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: 'File too large (max 4MB)' }, { status: 400 })
  }

  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    return NextResponse.json({ success: false, error: 'File must be .xlsx or .xls' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { defval: '' })

  if (rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Spreadsheet is empty' }, { status: 400 })
  }

  const normalized: Array<{ name: string; phone: string | null }> = []
  const errors: string[] = []

  rows.forEach((row, i) => {
    const rowNum = i + 2 // +2: 1-indexed + header row
    const nameKey = Object.keys(row).find((k) => k.toLowerCase().trim() === 'name')
    const phoneKey = Object.keys(row).find((k) => k.toLowerCase().trim() === 'phone')

    const name = nameKey ? String(row[nameKey]).trim() : ''
    const phone = phoneKey ? String(row[phoneKey]).trim() : ''

    if (!name) {
      errors.push(`Row ${rowNum}: missing name`)
      return
    }

    normalized.push({ name, phone: phone || null })
  })

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, error: `Validation errors: ${errors.join('; ')}` },
      { status: 400 }
    )
  }

  if (normalized.length === 0) {
    return NextResponse.json({ success: false, error: 'No valid rows found' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('invites').insert(normalized).select()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data: { imported: data?.length ?? 0 } }, { status: 201 })
}

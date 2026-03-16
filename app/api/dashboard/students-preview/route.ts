import { requireAuthenticatedContext } from '@/lib/api/auth'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_GENDERS = new Set(['male', 'female', 'unspecified'])

function parseLimit(value: string | null) {
  if (!value) {
    return 3
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) {
    return null
  }

  return Math.min(Math.max(parsed, 1), 50)
}

export async function GET(request: NextRequest) {
  const { context, errorResponse } = await requireAuthenticatedContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  const search = request.nextUrl.searchParams.get('search')?.trim() || null
  const department = request.nextUrl.searchParams.get('department')?.trim() || null
  const genderParam = request.nextUrl.searchParams.get('gender')
  const genderRaw = genderParam ? genderParam.trim().toLowerCase() : null
  const limit = parseLimit(request.nextUrl.searchParams.get('limit'))

  if (limit === null) {
    return NextResponse.json(
      { error: 'Invalid limit value' },
      { status: 400 }
    )
  }

  if (genderRaw && !ALLOWED_GENDERS.has(genderRaw)) {
    return NextResponse.json(
      { error: 'Invalid gender value' },
      { status: 400 }
    )
  }

  const { data, error } = await context.supabase.rpc('get_students_preview', {
    p_search: search,
    p_department: department,
    p_gender: genderRaw,
    p_limit: limit,
  })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch student preview' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}

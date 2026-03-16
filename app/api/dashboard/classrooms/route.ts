import { requireAuthenticatedContext } from '@/lib/api/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { context, errorResponse } = await requireAuthenticatedContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  const search = request.nextUrl.searchParams.get('search')?.trim()

  let query = context.supabase
    .from('classrooms')
    .select('id, name, year_level, is_active, created_at, updated_at')
    .eq('is_active', true)
    .order('year_level', { ascending: true })
    .order('name', { ascending: true })

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch classrooms' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}

import { requireAdminContext } from '@/lib/api/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { context, errorResponse } = await requireAdminContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  const { data, error } = await context.supabase
    .rpc('get_dashboard_stats')
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    data: data as {
      total_classrooms: number
      total_teachers: number
      total_students: number
      recent_activity: string
    },
  })
}

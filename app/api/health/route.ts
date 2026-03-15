import { checkSupabaseConnection } from '@/lib/supabase-healthcheck'
import { NextResponse } from 'next/server'

export async function GET() {
  const health = await checkSupabaseConnection()
  
  return NextResponse.json(
    {
      status: health.connected ? 'healthy' : 'unhealthy',
      supabase: health.connected ? 'connected' : 'disconnected',
      error: health.error || null,
      timestamp: new Date().toISOString(),
    },
    { status: health.connected ? 200 : 503 }
  )
}

import { createClient } from '@/lib/server'
import type { Profile } from '@/types/auth'
import { NextResponse } from 'next/server'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export interface AuthenticatedRouteContext {
  supabase: SupabaseServerClient
  profile: Profile
}

interface ContextResult {
  context?: AuthenticatedRouteContext
  errorResponse?: NextResponse
}

const PROFILE_SELECT = 'id, email, full_name, role, is_active, created_at, updated_at'

export async function requireAuthenticatedContext(): Promise<ContextResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', user.id)
    .single()

  const typedProfile = profile as Profile | null

  if (profileError || !typedProfile || !typedProfile.is_active) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      ),
    }
  }

  return {
    context: {
      supabase,
      profile: typedProfile,
    },
  }
}

export async function requireAdminContext(): Promise<ContextResult> {
  const result = await requireAuthenticatedContext()
  if (result.errorResponse || !result.context) {
    return result
  }

  if (result.context.profile.role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      ),
    }
  }

  return result
}

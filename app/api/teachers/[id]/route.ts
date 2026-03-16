import { requireAdminContext } from '@/lib/api/auth'
import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const ALLOWED_GENDERS = new Set(['male', 'female', 'unspecified'])

type GenderValue = 'male' | 'female' | 'unspecified'

type RouteParams = { id: string }
type RouteContext = { params: Promise<RouteParams> | RouteParams }

type TeacherProfileRow = {
  profile_id: string
  department: string
  joining_date: string
  gender: GenderValue
}

function toDisplayGender(gender: string) {
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

async function getTeacherId(context: RouteContext) {
  const params = await Promise.resolve(context.params)
  return params.id
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime())
}

function normalizeGender(value: unknown): GenderValue | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (!ALLOWED_GENDERS.has(normalized)) {
    return null
  }

  return normalized as GenderValue
}

export async function PATCH(request: NextRequest, routeContext: RouteContext) {
  const teacherId = await getTeacherId(routeContext)

  if (!UUID_REGEX.test(teacherId)) {
    return NextResponse.json(
      { error: 'Invalid teacher id' },
      { status: 400 }
    )
  }

  const { context, errorResponse } = await requireAdminContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { data: existingProfile, error: existingProfileError } = await context.supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active')
    .eq('id', teacherId)
    .single()

  const typedExistingProfile = existingProfile as {
    id: string
    full_name: string
    email: string
    role: string
    is_active: boolean
  } | null

  if (existingProfileError || !typedExistingProfile || typedExistingProfile.role !== 'teacher') {
    return NextResponse.json(
      { error: 'Teacher not found' },
      { status: 404 }
    )
  }

  const { data: existingTeacherProfile } = await context.supabase
    .from('teacher_profiles')
    .select('profile_id, department, joining_date, gender')
    .eq('profile_id', teacherId)
    .maybeSingle()

  const typedExistingTeacherProfile = existingTeacherProfile as TeacherProfileRow | null

  const profileUpdates: {
    full_name?: string
    email?: string
    is_active?: boolean
  } = {}

  const teacherProfileUpdates: {
    department?: string
    joining_date?: string
    gender?: GenderValue
  } = {}

  if (payload.full_name !== undefined) {
    if (typeof payload.full_name !== 'string') {
      return NextResponse.json(
        { error: 'full_name must be a string' },
        { status: 400 }
      )
    }

    const fullName = payload.full_name.trim()
    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        { error: 'Full name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    profileUpdates.full_name = fullName
  }

  if (payload.email !== undefined) {
    if (typeof payload.email !== 'string') {
      return NextResponse.json(
        { error: 'email must be a string' },
        { status: 400 }
      )
    }

    const email = payload.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    profileUpdates.email = email
  }

  if (payload.is_active !== undefined) {
    if (typeof payload.is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean' },
        { status: 400 }
      )
    }

    profileUpdates.is_active = payload.is_active
  }

  if (payload.department !== undefined) {
    if (typeof payload.department !== 'string') {
      return NextResponse.json(
        { error: 'department must be a string' },
        { status: 400 }
      )
    }

    const department = payload.department.trim()
    if (department.length < 2 || department.length > 120) {
      return NextResponse.json(
        { error: 'Department must be between 2 and 120 characters' },
        { status: 400 }
      )
    }

    teacherProfileUpdates.department = department
  }

  if (payload.joining_date !== undefined) {
    if (typeof payload.joining_date !== 'string' || !isIsoDate(payload.joining_date.trim())) {
      return NextResponse.json(
        { error: 'joining_date must be in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    teacherProfileUpdates.joining_date = payload.joining_date.trim()
  }

  if (payload.gender !== undefined) {
    const gender = normalizeGender(payload.gender)
    if (!gender) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      )
    }

    teacherProfileUpdates.gender = gender
  }

  const hasProfileUpdates = Object.keys(profileUpdates).length > 0
  const hasTeacherProfileUpdates = Object.keys(teacherProfileUpdates).length > 0

  if (!hasProfileUpdates && !hasTeacherProfileUpdates) {
    return NextResponse.json(
      { error: 'No updates provided' },
      { status: 400 }
    )
  }

  if (profileUpdates.email) {
    const adminClient = createAdminClient()
    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(teacherId, {
      email: profileUpdates.email,
    })

    if (authUpdateError) {
      if (authUpdateError.message.toLowerCase().includes('already')) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to update teacher email' },
        { status: 500 }
      )
    }
  }

  if (hasProfileUpdates) {
    const { error: profileUpdateError } = await context.supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', teacherId)

    if (profileUpdateError) {
      return NextResponse.json(
        { error: 'Failed to update teacher profile' },
        { status: 500 }
      )
    }
  }

  if (hasTeacherProfileUpdates) {
    if (typedExistingTeacherProfile) {
      const { error: teacherProfileUpdateError } = await context.supabase
        .from('teacher_profiles')
        .update(teacherProfileUpdates)
        .eq('profile_id', teacherId)

      if (teacherProfileUpdateError) {
        return NextResponse.json(
          { error: 'Failed to update teacher details' },
          { status: 500 }
        )
      }
    } else {
      const { error: teacherProfileInsertError } = await context.supabase
        .from('teacher_profiles')
        .insert({
          profile_id: teacherId,
          department: teacherProfileUpdates.department ?? 'General Department',
          joining_date: teacherProfileUpdates.joining_date ?? new Date().toISOString().slice(0, 10),
          gender: teacherProfileUpdates.gender ?? 'unspecified',
        })

      if (teacherProfileInsertError) {
        return NextResponse.json(
          { error: 'Failed to create missing teacher details' },
          { status: 500 }
        )
      }
    }
  }

  const { data: updatedProfile, error: updatedProfileError } = await context.supabase
    .from('profiles')
    .select('id, full_name, email, is_active')
    .eq('id', teacherId)
    .single()

  const typedUpdatedProfile = updatedProfile as {
    id: string
    full_name: string
    email: string
    is_active: boolean
  } | null

  const { data: updatedTeacherProfile, error: updatedTeacherProfileError } = await context.supabase
    .from('teacher_profiles')
    .select('department, joining_date, gender')
    .eq('profile_id', teacherId)
    .single()

  const typedUpdatedTeacherProfile = updatedTeacherProfile as {
    department: string
    joining_date: string
    gender: string
  } | null

  if (updatedProfileError || updatedTeacherProfileError || !typedUpdatedProfile || !typedUpdatedTeacherProfile) {
    return NextResponse.json(
      { error: 'Teacher updated but failed to fetch latest data' },
      { status: 500 }
    )
  }

  await context.supabase.from('activity_logs').insert({
    actor_id: context.profile.id,
    action: 'teacher_updated',
    details: `Teacher ${typedUpdatedProfile.full_name} was updated`,
  })

  return NextResponse.json({
    data: {
      id: typedUpdatedProfile.id,
      name: typedUpdatedProfile.full_name,
      department: typedUpdatedTeacherProfile.department,
      joining_date: typedUpdatedTeacherProfile.joining_date,
      gender: toDisplayGender(typedUpdatedTeacherProfile.gender),
      email: typedUpdatedProfile.email,
      is_active: typedUpdatedProfile.is_active,
    },
  })
}

export async function DELETE(_request: NextRequest, routeContext: RouteContext) {
  const teacherId = await getTeacherId(routeContext)

  if (!UUID_REGEX.test(teacherId)) {
    return NextResponse.json(
      { error: 'Invalid teacher id' },
      { status: 400 }
    )
  }

  const { context, errorResponse } = await requireAdminContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  const { data: existingProfile, error: existingProfileError } = await context.supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', teacherId)
    .single()

  const typedExistingProfile = existingProfile as {
    id: string
    full_name: string
    role: string
  } | null

  if (existingProfileError || !typedExistingProfile || typedExistingProfile.role !== 'teacher') {
    return NextResponse.json(
      { error: 'Teacher not found' },
      { status: 404 }
    )
  }

  const adminClient = createAdminClient()
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(teacherId)

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to delete teacher account' },
      { status: 500 }
    )
  }

  await context.supabase.from('activity_logs').insert({
    actor_id: context.profile.id,
    action: 'teacher_deleted',
    details: `Teacher ${typedExistingProfile.full_name} was removed`,
  })

  return NextResponse.json({
    success: true,
    message: 'Teacher removed successfully',
  })
}

import { requireAdminContext } from '@/lib/api/auth'
import { createAdminClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_GENDERS = new Set(['male', 'female', 'unspecified'])

type GenderValue = 'male' | 'female' | 'unspecified'

type TeachersListRow = {
  id: string
  name: string
  department: string
  joining_date: string
  gender: string
  email: string
  is_active: boolean
  total_count: number
}

function toDisplayGender(gender: string) {
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

function normalizeGender(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (!ALLOWED_GENDERS.has(normalized)) {
    return null
  }

  return normalized as GenderValue
}

function parsePositiveInt(value: string | null, fallback: number, max: number) {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return null
  }

  return Math.min(parsed, max)
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime())
}

export async function GET(request: NextRequest) {
  const { context, errorResponse } = await requireAdminContext()
  if (errorResponse || !context) {
    return errorResponse
  }

  const page = parsePositiveInt(request.nextUrl.searchParams.get('page'), 1, 100000)
  const pageSize = parsePositiveInt(
    request.nextUrl.searchParams.get('page_size') ?? request.nextUrl.searchParams.get('pageSize'),
    10,
    100
  )

  if (page === null || pageSize === null) {
    return NextResponse.json(
      { error: 'Invalid pagination values' },
      { status: 400 }
    )
  }

  const search = request.nextUrl.searchParams.get('search')?.trim() || null
  const department = request.nextUrl.searchParams.get('department')?.trim() || null

  const genderParam = request.nextUrl.searchParams.get('gender')
  const genderRaw = genderParam ? genderParam.trim().toLowerCase() : null
  if (genderRaw && !ALLOWED_GENDERS.has(genderRaw)) {
    return NextResponse.json(
      { error: 'Invalid gender value' },
      { status: 400 }
    )
  }

  const { data, error } = await context.supabase.rpc('get_teachers_list', {
    p_page: page,
    p_page_size: pageSize,
    p_search: search,
    p_department: department,
    p_gender: genderRaw,
  })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }

  const rows = (data ?? []) as TeachersListRow[]
  const total = rows[0]?.total_count ?? 0

  const teachers = rows.map((row) => ({
    id: row.id,
    name: row.name,
    department: row.department,
    joining_date: row.joining_date,
    gender: row.gender,
    email: row.email,
    is_active: row.is_active,
  }))

  return NextResponse.json({
    data: teachers,
    pagination: {
      page,
      page_size: pageSize,
      total,
      total_pages: total > 0 ? Math.ceil(total / pageSize) : 0,
    },
  })
}

export async function POST(request: NextRequest) {
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

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const password = typeof payload.password === 'string' ? payload.password : ''
  const fullName = typeof payload.full_name === 'string' ? payload.full_name.trim() : ''
  const department = typeof payload.department === 'string' ? payload.department.trim() : ''

  const gender = payload.gender === undefined ? 'unspecified' : normalizeGender(payload.gender)
  const joiningDateInput = typeof payload.joining_date === 'string'
    ? payload.joining_date.trim()
    : new Date().toISOString().slice(0, 10)

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return NextResponse.json(
      { error: 'Full name must be between 2 and 100 characters' },
      { status: 400 }
    )
  }

  if (department.length < 2 || department.length > 120) {
    return NextResponse.json(
      { error: 'Department must be between 2 and 120 characters' },
      { status: 400 }
    )
  }

  if (!isIsoDate(joiningDateInput)) {
    return NextResponse.json(
      { error: 'joining_date must be in YYYY-MM-DD format' },
      { status: 400 }
    )
  }

  if (!gender) {
    return NextResponse.json(
      { error: 'Invalid gender value' },
      { status: 400 }
    )
  }

  const adminClient = createAdminClient()

  const { data: createdUserData, error: createUserError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: 'teacher',
    },
  })

  if (createUserError || !createdUserData.user) {
    if (createUserError?.message.toLowerCase().includes('already')) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create teacher account' },
      { status: 500 }
    )
  }

  const teacherId = createdUserData.user.id

  const { error: teacherProfileError } = await context.supabase
    .from('teacher_profiles')
    .insert({
      profile_id: teacherId,
      department,
      joining_date: joiningDateInput,
      gender,
    })

  if (teacherProfileError) {
    await adminClient.auth.admin.deleteUser(teacherId)

    return NextResponse.json(
      { error: 'Failed to create teacher profile details' },
      { status: 500 }
    )
  }

  await context.supabase.from('activity_logs').insert({
    actor_id: context.profile.id,
    action: 'teacher_created',
    details: `Teacher ${fullName} was added`,
  })

  return NextResponse.json(
    {
      data: {
        id: teacherId,
        name: fullName,
        department,
        joining_date: joiningDateInput,
        gender: toDisplayGender(gender),
        email,
        is_active: true,
      },
    },
    { status: 201 }
  )
}

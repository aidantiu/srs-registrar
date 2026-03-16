import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

type UserRole = 'admin' | 'teacher'
type GenderType = 'male' | 'female' | 'unspecified'

interface SeedUser {
  email: string
  password: string
  full_name: string
  role: UserRole
  department?: string
  joining_date?: string
  gender?: GenderType
}

interface ClassroomSeed {
  name: string
  year_level: number
}

interface StudentSeed {
  id: string
  full_name: string
  department: string
  gender: GenderType
  enrollment_date: string
}

interface EnrollmentSeed {
  student_id: string
  classroom_name: string
}

interface TeacherAssignmentSeed {
  teacher_email: string
  classroom_name: string
}

interface ResolvedSeedUser extends SeedUser {
  id: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key-here') {
  console.error('Missing environment variables.')
  console.error('Set SUPABASE_SERVICE_ROLE_KEY in your .env file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@school.edu',
    password: 'admin1234',
    full_name: 'System Admin',
    role: 'admin',
  },
  {
    email: 'teacher@school.edu',
    password: 'teacher1234',
    full_name: 'Juan Dela Cruz',
    role: 'teacher',
    department: 'General Studies',
    joining_date: '2021-06-01',
    gender: 'male',
  },
  {
    email: 'davidwilley@gmail.com',
    password: 'teacher1234',
    full_name: 'David Willey',
    role: 'teacher',
    department: 'Mathematics',
    joining_date: '2016-01-01',
    gender: 'male',
  },
  {
    email: 'helinamatt@gmail.com',
    password: 'teacher1234',
    full_name: 'Helina Matt',
    role: 'teacher',
    department: 'Physics and Chemistry',
    joining_date: '2013-02-28',
    gender: 'female',
  },
  {
    email: 'matthenry@gmail.com',
    password: 'teacher1234',
    full_name: 'Matt Henry',
    role: 'teacher',
    department: 'History and Geography',
    joining_date: '2015-08-31',
    gender: 'male',
  },
  {
    email: 'davidmiller@gmail.com',
    password: 'teacher1234',
    full_name: 'David Miller',
    role: 'teacher',
    department: 'Computer Science',
    joining_date: '2019-03-30',
    gender: 'male',
  },
  {
    email: 'herrybrooks@gmail.com',
    password: 'teacher1234',
    full_name: 'Herry Brooks',
    role: 'teacher',
    department: 'Software Engineering',
    joining_date: '2020-11-01',
    gender: 'male',
  },
  {
    email: 'timdavid@gmail.com',
    password: 'teacher1234',
    full_name: 'Tim David',
    role: 'teacher',
    department: 'Mathematics',
    joining_date: '2023-06-01',
    gender: 'male',
  },
  {
    email: 'tahiyakhan@gmail.com',
    password: 'teacher1234',
    full_name: 'Tahiya Khan',
    role: 'teacher',
    department: 'History and Geography',
    joining_date: '2022-07-30',
    gender: 'female',
  },
]

const CLASSROOM_SEEDS: ClassroomSeed[] = [
  { name: '1st Year', year_level: 1 },
  { name: '2nd Year', year_level: 2 },
  { name: '3rd Year', year_level: 3 },
  { name: '4th Year', year_level: 4 },
]

const STUDENT_SEEDS: StudentSeed[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    full_name: 'David Willey',
    department: 'Mathematics',
    gender: 'male',
    enrollment_date: '2025-01-01',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    full_name: 'Helina Matt',
    department: 'Physics and Chemistry',
    gender: 'female',
    enrollment_date: '2025-01-03',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    full_name: 'Matt Henry',
    department: 'History and Geography',
    gender: 'male',
    enrollment_date: '2025-01-05',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    full_name: 'Nina Cruz',
    department: 'Computer Science',
    gender: 'female',
    enrollment_date: '2025-01-06',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    full_name: 'Paolo Reyes',
    department: 'Software Engineering',
    gender: 'male',
    enrollment_date: '2025-01-07',
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    full_name: 'Anna Soriano',
    department: 'Mathematics',
    gender: 'female',
    enrollment_date: '2025-01-08',
  },
]

const ENROLLMENT_SEEDS: EnrollmentSeed[] = [
  { student_id: '11111111-1111-4111-8111-111111111111', classroom_name: '1st Year' },
  { student_id: '22222222-2222-4222-8222-222222222222', classroom_name: '2nd Year' },
  { student_id: '33333333-3333-4333-8333-333333333333', classroom_name: '3rd Year' },
  { student_id: '44444444-4444-4444-8444-444444444444', classroom_name: '4th Year' },
  { student_id: '55555555-5555-4555-8555-555555555555', classroom_name: '1st Year' },
  { student_id: '66666666-6666-4666-8666-666666666666', classroom_name: '2nd Year' },
]

const TEACHER_ASSIGNMENTS: TeacherAssignmentSeed[] = [
  { teacher_email: 'teacher@school.edu', classroom_name: '1st Year' },
  { teacher_email: 'davidwilley@gmail.com', classroom_name: '1st Year' },
  { teacher_email: 'helinamatt@gmail.com', classroom_name: '2nd Year' },
  { teacher_email: 'matthenry@gmail.com', classroom_name: '3rd Year' },
  { teacher_email: 'davidmiller@gmail.com', classroom_name: '4th Year' },
  { teacher_email: 'herrybrooks@gmail.com', classroom_name: '3rd Year' },
  { teacher_email: 'timdavid@gmail.com', classroom_name: '2nd Year' },
  { teacher_email: 'tahiyakhan@gmail.com', classroom_name: '4th Year' },
]

const SCHOOL_YEAR = '2025-2026'

function toEmailKey(email: string) {
  return email.trim().toLowerCase()
}

async function listAllUsers() {
  const users: Array<{ id: string; email: string | null }> = []
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 })
    if (error) {
      throw new Error(`Failed listing users: ${error.message}`)
    }

    const batch = data.users ?? []
    users.push(...batch.map((user) => ({ id: user.id, email: user.email ?? null })))

    if (batch.length < 100) {
      break
    }

    page += 1
  }

  return users
}

async function ensureAuthUsers() {
  const existingUsers = await listAllUsers()
  const usersByEmail = new Map(
    existingUsers
      .filter((user) => user.email)
      .map((user) => [toEmailKey(user.email!), user])
  )

  const seededUsers: ResolvedSeedUser[] = []

  for (const user of SEED_USERS) {
    const normalizedEmail = toEmailKey(user.email)
    const existing = usersByEmail.get(normalizedEmail)

    if (!existing) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      })

      if (error || !data.user) {
        throw new Error(`Failed creating ${normalizedEmail}: ${error?.message ?? 'Unknown error'}`)
      }

      usersByEmail.set(normalizedEmail, { id: data.user.id, email: normalizedEmail })
      console.log(`Created ${user.role}: ${normalizedEmail}`)
    } else {
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      })

      if (updateError) {
        throw new Error(`Failed updating ${normalizedEmail}: ${updateError.message}`)
      }

      console.log(`Exists ${user.role}: ${normalizedEmail}`)
    }

    const ensured = usersByEmail.get(normalizedEmail)
    if (!ensured) {
      throw new Error(`Failed to resolve id for ${normalizedEmail}`)
    }

    seededUsers.push({
      ...user,
      email: normalizedEmail,
      id: ensured.id,
    })
  }

  return seededUsers
}

async function seedProfiles(seededUsers: ResolvedSeedUser[]) {
  const { error } = await supabase.from('profiles').upsert(
    seededUsers.map((user) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: true,
    })),
    { onConflict: 'id' }
  )

  if (error) {
    throw new Error(`Failed seeding profiles: ${error.message}`)
  }

  const teacherRows = seededUsers
    .filter((user) => user.role === 'teacher')
    .map((user) => ({
      profile_id: user.id,
      department: user.department ?? 'General Studies',
      joining_date: user.joining_date ?? '2024-01-01',
      gender: user.gender ?? 'unspecified',
    }))

  const { error: teacherError } = await supabase
    .from('teacher_profiles')
    .upsert(teacherRows, { onConflict: 'profile_id' })

  if (teacherError) {
    throw new Error(`Failed seeding teacher profiles: ${teacherError.message}`)
  }
}

async function seedClassrooms() {
  const { error } = await supabase
    .from('classrooms')
    .upsert(CLASSROOM_SEEDS, { onConflict: 'name' })

  if (error) {
    throw new Error(`Failed seeding classrooms: ${error.message}`)
  }

  const { data, error: fetchError } = await supabase
    .from('classrooms')
    .select('id, name')
    .in('name', CLASSROOM_SEEDS.map((classroom) => classroom.name))

  if (fetchError || !data) {
    throw new Error(`Failed fetching classrooms: ${fetchError?.message ?? 'Unknown error'}`)
  }

  return new Map(data.map((classroom) => [classroom.name, classroom.id]))
}

async function seedTeacherAssignments(
  seededUsers: ResolvedSeedUser[],
  classroomIdByName: Map<string, string>
) {
  const teacherIdByEmail = new Map(
    seededUsers
      .filter((user) => user.role === 'teacher')
      .map((user) => [toEmailKey(user.email), user.id])
  )

  const rows = TEACHER_ASSIGNMENTS
    .map((assignment) => {
      const teacherId = teacherIdByEmail.get(toEmailKey(assignment.teacher_email))
      const classroomId = classroomIdByName.get(assignment.classroom_name)

      if (!teacherId || !classroomId) {
        return null
      }

      return {
        teacher_id: teacherId,
        classroom_id: classroomId,
      }
    })
    .filter((row): row is { teacher_id: string; classroom_id: string } => row !== null)

  if (rows.length === 0) {
    return
  }

  const { error } = await supabase
    .from('teacher_classroom_assignments')
    .upsert(rows, { onConflict: 'teacher_id,classroom_id' })

  if (error) {
    throw new Error(`Failed seeding teacher assignments: ${error.message}`)
  }
}

async function seedStudents(classroomIdByName: Map<string, string>) {
  const { error } = await supabase
    .from('students')
    .upsert(
      STUDENT_SEEDS.map((student) => ({
        ...student,
        is_active: true,
      })),
      { onConflict: 'id' }
    )

  if (error) {
    throw new Error(`Failed seeding students: ${error.message}`)
  }

  const enrollmentRows = ENROLLMENT_SEEDS
    .map((seed) => {
      const classroomId = classroomIdByName.get(seed.classroom_name)
      if (!classroomId) {
        return null
      }

      return {
        student_id: seed.student_id,
        classroom_id: classroomId,
        school_year: SCHOOL_YEAR,
        is_active: true,
      }
    })
    .filter(
      (row): row is {
        student_id: string
        classroom_id: string
        school_year: string
        is_active: boolean
      } => row !== null
    )

  if (enrollmentRows.length === 0) {
    return
  }

  const { error: enrollmentError } = await supabase
    .from('student_classroom_enrollments')
    .upsert(enrollmentRows, { onConflict: 'student_id,classroom_id,school_year' })

  if (enrollmentError) {
    throw new Error(`Failed seeding enrollments: ${enrollmentError.message}`)
  }
}

async function seedActivityLog(seededUsers: ResolvedSeedUser[]) {
  const adminId = seededUsers.find((user) => user.email === 'admin@school.edu')?.id ?? null

  const { error } = await supabase.from('activity_logs').insert({
    actor_id: adminId,
    action: 'teacher_activity',
    details: 'Teacher David Willey was last active 2 hours ago',
  })

  if (error) {
    throw new Error(`Failed seeding activity logs: ${error.message}`)
  }
}

async function seed() {
  console.log('Seeding auth users and dashboard test data...')

  const seededUsers = await ensureAuthUsers()
  await seedProfiles(seededUsers)
  const classroomIdByName = await seedClassrooms()
  await seedTeacherAssignments(seededUsers, classroomIdByName)
  await seedStudents(classroomIdByName)
  await seedActivityLog(seededUsers)

  console.log('Seeding complete.')
  console.log('Login credentials:')
  console.log('  Admin:   admin@school.edu   / admin1234')
  console.log('  Teacher: teacher@school.edu / teacher1234')
  console.log('Dashboard test data loaded successfully.')
}

seed().catch((error: unknown) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

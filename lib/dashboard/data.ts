import { createClient } from '@/lib/server'

export interface DashboardStats {
  total_classrooms: number
  total_teachers: number
  total_students: number
  recent_activity: string
}

export interface DashboardTeacher {
  id: string
  name: string
  department: string
  joining_date: string
  gender: string
  email: string
  is_active: boolean
}

export interface DashboardClassroom {
  id: string
  name: string
  year_level: number
}

export interface DashboardStudentPreview {
  id: string
  name: string
  department: string
  enrollment_date: string
  gender: string
}

export interface TeachersPagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

interface DashboardTeacherRpcRow extends DashboardTeacher {
  total_count: number
}

export async function getDashboardData() {
  const supabase = await createClient()

  const [statsResult, teachersResult, classroomsResult, studentsResult] = await Promise.all([
    supabase.rpc('get_dashboard_stats').single(),
    supabase.rpc('get_teachers_list', {
      p_page: 1,
      p_page_size: 10,
      p_search: null,
      p_department: null,
      p_gender: null,
    }),
    supabase
      .from('classrooms')
      .select('id, name, year_level')
      .eq('is_active', true)
      .order('year_level', { ascending: true })
      .order('name', { ascending: true }),
    supabase.rpc('get_students_preview', {
      p_search: null,
      p_department: null,
      p_gender: null,
      p_limit: 3,
    }),
  ])

  const stats = (statsResult.data as DashboardStats | null) ?? {
    total_classrooms: 0,
    total_teachers: 0,
    total_students: 0,
    recent_activity: 'No recent activity',
  }

  const teacherRows = (teachersResult.data ?? []) as DashboardTeacherRpcRow[]
  const totalTeachers = teacherRows[0]?.total_count ?? 0
  const teachers: DashboardTeacher[] = teacherRows.map((row) => ({
    id: row.id,
    name: row.name,
    department: row.department,
    joining_date: row.joining_date,
    gender: row.gender,
    email: row.email,
    is_active: row.is_active,
  }))

  const classrooms = (classroomsResult.data ?? []) as DashboardClassroom[]

  const students = ((studentsResult.data ?? []) as Array<
    DashboardStudentPreview & {
      classroom_id?: string
      classroom_name?: string
    }
  >).map((student) => ({
    id: student.id,
    name: student.name,
    department: student.department,
    enrollment_date: student.enrollment_date,
    gender: student.gender,
  }))

  const teachersPagination: TeachersPagination = {
    page: 1,
    page_size: 10,
    total: totalTeachers,
    total_pages: totalTeachers > 0 ? Math.ceil(totalTeachers / 10) : 0,
  }

  return {
    stats,
    teachers,
    classrooms,
    students,
    teachersPagination,
  }
}

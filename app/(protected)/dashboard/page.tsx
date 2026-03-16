import { getCurrentUser } from '@/lib/auth/actions'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { TeachersTable } from '@/components/dashboard/teachers-table'
import { ClassroomList } from '@/components/dashboard/classroom-list'
import { StudentList } from '@/components/dashboard/student-list'
import { StatCard } from '@/components/dashboard/stat-card'
import { School, Users, GraduationCap, Activity } from 'lucide-react'
import { getDashboardData } from '@/lib/dashboard/data'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.profile.role !== 'admin') {
    redirect('/login')
  }

  const dashboardData = await getDashboardData()

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <DashboardHeader title="Admin View" />
      
      <main className="flex-1 p-8 space-y-12 max-w-400 mx-auto w-full">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Classrooms"
            value={dashboardData.stats.total_classrooms}
            icon={<School className="h-6 w-6 text-[#00754a]" />}
            iconBgColor="bg-[#d4e9e2]"
          />
          <StatCard
            title="Total Teachers"
            value={dashboardData.stats.total_teachers}
            icon={<Users className="h-6 w-6 text-[#6b21a8]" />}
            iconBgColor="bg-[#f3e8ff]"
          />
          <StatCard
            title="Total Students"
            value={dashboardData.stats.total_students}
            icon={<GraduationCap className="h-6 w-6 text-[#0ea5e9]" />}
            iconBgColor="bg-[#e0f2fe]"
          />
          <StatCard
            title="Recent Activity"
            value={dashboardData.stats.recent_activity}
            icon={<Activity className="h-6 w-6 text-[#f97316]" />}
            iconBgColor="bg-[#ffedd5]"
          />
        </div>

        {/* Teachers Table Section */}
        <div className="space-y-4">
          <TeachersTable
            title="Teacher List"
            teachers={dashboardData.teachers}
            pagination={dashboardData.teachersPagination}
          />
        </div>

        {/* Bottom Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-10">
          <ClassroomList classrooms={dashboardData.classrooms} />
          <StudentList students={dashboardData.students} />
        </div>
      </main>
    </div>
  )
}

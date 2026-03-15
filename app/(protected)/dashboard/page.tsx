import { getCurrentUser } from '@/lib/auth/actions'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { TeachersTable } from '@/components/dashboard/teachers-table'
import { ClassroomList } from '@/components/dashboard/classroom-list'
import { StudentList } from '@/components/dashboard/student-list'
import { StatCard } from '@/components/dashboard/stat-card'
import { School, Users, GraduationCap, Activity } from 'lucide-react'

export default async function DashboardPage() {
  await getCurrentUser()

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <DashboardHeader title="Admin View" />
      
      <main className="flex-1 p-8 space-y-12 max-w-[1600px] mx-auto w-full">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Classrooms"
            value="45"
            icon={<School className="h-6 w-6 text-[#00754a]" />}
            iconBgColor="bg-[#d4e9e2]"
          />
          <StatCard
            title="Total Teachers"
            value="1,900"
            icon={<Users className="h-6 w-6 text-[#6b21a8]" />}
            iconBgColor="bg-[#f3e8ff]"
          />
          <StatCard
            title="Total Students"
            value="5,240"
            icon={<GraduationCap className="h-6 w-6 text-[#0ea5e9]" />}
            iconBgColor="bg-[#e0f2fe]"
          />
          <StatCard
            title="Activity"
            value="89%"
            icon={<Activity className="h-6 w-6 text-[#f97316]" />}
            iconBgColor="bg-[#ffedd5]"
          />
        </div>

        {/* Teachers Table Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#171717] px-2">Teacher List</h2>
          <TeachersTable />
        </div>

        {/* Bottom Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-10">
          <ClassroomList />
          <StudentList />
        </div>
      </main>
    </div>
  )
}

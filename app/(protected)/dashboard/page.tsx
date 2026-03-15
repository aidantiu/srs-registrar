import { getCurrentUser } from '@/lib/auth/actions'
import { UserInfoCard } from '@/components/dashboard/user-info-card'
import { LogoutButton } from '@/components/auth/logout-button'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: '#fafafa' }}>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
          Welcome back, <span className="font-medium" style={{ color: '#00754a' }}>{user?.profile.full_name ?? 'User'}</span>
        </p>
        {user && (
          <div className="mt-4">
            <UserInfoCard user={user} />
          </div>
        )}
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

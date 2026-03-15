import type { AuthUser } from '@/types/auth'

interface UserInfoCardProps {
  user: AuthUser
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <div className="rounded-md p-4" style={{ backgroundColor: '#d4e9e2' }}>
      <p className="text-sm font-medium" style={{ color: '#171717' }}>
        Role: <span className="capitalize">{user.profile.role}</span>
      </p>
      <p className="text-sm" style={{ color: '#171717' }}>
        Email: {user.email}
      </p>
    </div>
  )
}

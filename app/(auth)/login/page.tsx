import { AuthCard } from '@/components/auth/auth-card'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: '#fafafa' }}>
      <AuthCard
        title="Student Record System"
        description="Sign in to your account"
      >
        <LoginForm />
      </AuthCard>
    </div>
  )
}

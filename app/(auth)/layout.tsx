import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Student Record System',
  description: 'Sign in to the Student Record System',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

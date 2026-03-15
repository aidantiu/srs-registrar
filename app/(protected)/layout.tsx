import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Student Record System',
  description: 'Student Record System Dashboard',
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export const metadata: Metadata = {
  title: 'Dashboard | Student Record System',
  description: 'Student Record System Dashboard',
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full bg-[#fafafa]">
        {children}
      </main>
    </SidebarProvider>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getCurrentUser } from '@/lib/auth/actions'

export async function DashboardHeader({ title = "Admin View" }: { title?: string }) {
  const user = await getCurrentUser()
  const userName = user?.profile?.full_name ?? "Admin123"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 text-[#6b7280] hover:text-[#171717]" />
        <h1 className="text-xl font-bold text-[#171717]">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-l border-[#e5e7eb] pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none text-[#171717]">{userName}</p>
            <p className="text-xs text-[#6b7280] mt-1">Admin</p>
          </div>
          <Avatar className="h-9 w-9 border border-[#e5e7eb]">
            <AvatarImage src="" alt={`@${userName}`} />
            <AvatarFallback className="bg-[#d4e9e2] text-[#00754a] font-medium">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

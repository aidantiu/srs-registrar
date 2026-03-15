import {
  GraduationCap,
  LayoutDashboard,
  School as SchoolIcon,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { LogoutButton } from "@/components/auth/logout-button"

const schoolItems = [
  { title: "Classrooms", url: "#", icon: SchoolIcon },
  { title: "Teachers", url: "#", icon: Users },
  { title: "Students", url: "#", icon: GraduationCap },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-[#e5e7eb] bg-[#fafafa]">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 font-bold text-2xl text-[#171717]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00754a] text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          SRS
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Dashboard"
                  className="bg-gradient-to-r from-[#d4e9e2] to-[#f3f4f6] text-[#00754a] font-semibold h-12 text-lg"
                >
                  <Link href="#">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#9ca3af] mb-2">
            School
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {schoolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className="text-[#6b7280] hover:text-[#171717] hover:bg-[#f3f4f6] h-12 text-lg"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center px-1">
              <LogoutButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

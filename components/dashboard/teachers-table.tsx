import { MoreVertical, Edit2, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const mockTeachers = [
  { id: 1, name: "David Willey", department: "Mathematics", date: "Jan 01, 2016", gender: "Male", email: "davidwilley@gmail.com", avatar: "DW" },
  { id: 2, name: "Helina Matt", department: "Physics and Chemistry", date: "Feb 28, 2013", gender: "Female", email: "helinamatt@gmail.com", avatar: "HM" },
  { id: 3, name: "Matt Henry", department: "History and Geography", date: "Aug 31, 2015", gender: "Male", email: "matthenry@gmail.com", avatar: "MH" },
  { id: 4, name: "David Miller", department: "Computer Science", date: "Mar 30, 2019", gender: "Male", email: "davidmiller@gmail.com", avatar: "DM" },
  { id: 5, name: "Herry Brooks", department: "Software Engineer", date: "Nov 01, 2020", gender: "Male", email: "herrybrooks@gmail.com", avatar: "HB" },
  { id: 6, name: "Tim David", department: "Mathematics", date: "Jun 01, 2023", gender: "Male", email: "timdavid@gmail.com", avatar: "TD" },
  { id: 7, name: "Tahiya Khan", department: "History and Geography", date: "Jul 30, 2022", gender: "Female", email: "tahiyakhan@gmail.com", avatar: "TK" },
]

export function TeachersTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#f9fafb]">
            <TableRow className="border-[#e5e7eb] hover:bg-transparent">
              <TableHead className="font-bold text-[#171717] h-14 px-6 text-sm">Teacher Name</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Department</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Joining Date</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Gender</TableHead>
              <TableHead className="font-bold text-[#171717] px-6 text-sm">Email</TableHead>
              <TableHead className="text-right font-bold text-[#171717] px-6 text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTeachers.map((teacher) => (
              <TableRow key={teacher.id} className="border-[#e5e7eb] hover:bg-[#f9fafb]/50 transition-colors">
                <TableCell className="font-medium text-[#171717] py-4 px-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder-${teacher.id}.jpg`} alt={teacher.name} />
                      <AvatarFallback className="bg-[#d4e9e2] text-[#00754a] text-xs font-bold">
                        {teacher.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{teacher.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.department}</TableCell>
                <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.date}</TableCell>
                <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.gender}</TableCell>
                <TableCell className="text-[#6b7280] py-4 px-6 text-sm">{teacher.email}</TableCell>
                <TableCell className="text-right py-4 px-6">
                  <div className="flex items-center justify-end gap-3 text-[#6b7280]">
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[#00754a] hover:bg-[#d4e9e2]/50">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-[#f9fafb]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 border-[#e5e7eb] shadow-md">
                        <DropdownMenuItem className="cursor-pointer hover:bg-[#f9fafb] focus:bg-[#f9fafb] py-2">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-[#f9fafb] focus:bg-[#f9fafb] py-2">
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <div className="text-sm text-[#6b7280] font-medium">
          Showing 1-10 of 120
        </div>
        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="text-[#6b7280] hover:text-[#171717] hover:bg-transparent" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-[#6b7280] hover:bg-transparent">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-[#6b7280] hover:bg-transparent">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="bg-[#6b21a8] text-white hover:bg-[#581c87] border-transparent rounded-lg">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-[#6b7280] hover:bg-transparent">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-[#6b7280] hover:bg-transparent">16</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-[#6b7280] hover:text-[#171717] hover:bg-transparent" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

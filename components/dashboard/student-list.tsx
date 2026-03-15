import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const mockStudents = [
  { id: 1, name: "David Willey", department: "Mathematics", education: "B.A, B.C.A", date: "Jan 01, 2016", gender: "Male" },
  { id: 2, name: "Helina Matt", department: "Physics and Chemistry", education: "B.COM, M.COM", date: "Feb 28, 2013", gender: "Female" },
  { id: 3, name: "Matt Henry", department: "History and Geography", education: "B.TACH, M.TACH", date: "Aug 31, 2015", gender: "Male" },
]

export function StudentList() {
  return (
    <div className="space-y-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#171717] px-2">Student List</h2>
      <Card className="rounded-xl border-[#e5e7eb] shadow-sm bg-white overflow-hidden flex-1">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6b7280]" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full bg-[#f9fafb] pl-10 h-10 rounded-full border-none focus-visible:ring-1 focus-visible:ring-[#00754a]"
              />
            </div>
            <Button variant="ghost" className="text-[#6b7280] hover:text-[#00754a] font-medium">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="w-full overflow-auto flex-1">
            <table className="w-full text-sm text-left h-full">
              <thead className="bg-[#f9fafb] text-[#171717] font-bold border-b border-[#e5e7eb]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[#f9fafb]/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-[#171717]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#d4e9e2] text-[#00754a] text-[10px] font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {student.name}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#6b7280]">{student.department}</td>
                    <td className="py-4 px-4 text-[#6b7280]">{student.date}</td>
                    <td className="py-4 px-4 text-[#6b7280]">{student.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

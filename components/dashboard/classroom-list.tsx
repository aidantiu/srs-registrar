import { Card, CardContent } from "@/components/ui/card"

interface ClassroomItem {
  id: string
  name: string
  year_level: number
}

interface ClassroomListProps {
  classrooms: ClassroomItem[]
}

export function ClassroomList({ classrooms }: ClassroomListProps) {
  return (
    <div className="space-y-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#171717] px-2">Classroom List</h2>
      <Card className="rounded-xl border-[#e5e7eb] shadow-sm bg-white overflow-hidden flex-1">
        <CardContent className="p-6 h-full">
          <ul className="space-y-3 h-full flex flex-col justify-between">
            {classrooms.length > 0 ? (
              classrooms.map((classroom) => (
                <li key={classroom.id} className="p-4 rounded-lg bg-[#fafafa] border border-[#e5e7eb] text-[#171717] font-medium hover:bg-[#d4e9e2] hover:text-[#00754a] transition-colors cursor-pointer flex-1 flex items-center">
                  {classroom.name}
                </li>
              ))
            ) : (
              <li className="p-4 rounded-lg bg-[#fafafa] border border-[#e5e7eb] text-[#6b7280] font-medium flex-1 flex items-center justify-center">
                No classrooms found.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

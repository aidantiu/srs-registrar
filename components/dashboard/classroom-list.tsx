import { Card, CardContent } from "@/components/ui/card"

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
]

export function ClassroomList() {
  return (
    <div className="space-y-4 flex flex-col h-full">
      <h2 className="text-xl font-bold text-[#171717] px-2">Classroom List</h2>
      <Card className="rounded-xl border-[#e5e7eb] shadow-sm bg-white overflow-hidden flex-1">
        <CardContent className="p-6 h-full">
          <ul className="space-y-3 h-full flex flex-col justify-between">
            {years.map((year) => (
              <li key={year} className="p-4 rounded-lg bg-[#fafafa] border border-[#e5e7eb] text-[#171717] font-medium hover:bg-[#d4e9e2] hover:text-[#00754a] transition-colors cursor-pointer flex-1 flex items-center">
                {year}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

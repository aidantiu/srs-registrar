import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor?: string
}

export function StatCard({ title, value, icon, iconBgColor = "bg-[#d4e9e2]" }: StatCardProps) {
  const isLongText = typeof value === 'string' && value.length > 20

  return (
    <Card className="shadow-sm border-[#e5e7eb] rounded-xl bg-white transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6b7280]">{title}</p>
            <h3
              className={cn(
                "font-bold text-[#171717] mt-2",
                isLongText ? "text-base leading-5 max-w-57.5" : "text-3xl"
              )}
            >
              {value}
            </h3>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

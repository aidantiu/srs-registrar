import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-lg border-0 shadow-lg">
      <CardHeader className="space-y-3 text-center pb-2 pt-10">
        <div
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: '#d4e9e2' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            style={{ color: '#00754a' }}
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <CardTitle className="text-3xl font-bold" style={{ color: '#171717' }}>
          {title}
        </CardTitle>
        <CardDescription className="text-base" style={{ color: '#6b7280' }}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10 pt-4">{children}</CardContent>
    </Card>
  )
}

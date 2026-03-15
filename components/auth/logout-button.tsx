import { logout } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        className="cursor-pointer text-white"
        style={{ backgroundColor: '#00754a' }}
      >
        Sign out
      </Button>
    </form>
  )
}

import { GalleryVerticalEnd, Eye, EyeOff } from "lucide-react"
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { login, type UserRole, type AuthResponse } from '@/common/auth';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (role: UserRole): Promise<void> => {
    setError('');
    setLoading(true);

    try {
      const data: AuthResponse = await login(email, password, role);

      if (data.success) {
        await navigate({ to: '/' });
      } else {
        setError(data.message ?? 'Login failed');
      }
    } catch (error_) {
      setError('An error occurred during login');
      console.error('Login error:', error_);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className={cn("w-full h-full p-6 bg-gray-50 shadow-none", className)} {...props}>
      <CardContent>
      <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 p-6">
            <h1 className="text-2xl font-bold">Welcome to SRS</h1>
            {error.length > 0 && (
              <div className="rounded bg-red-50 p-2 text-center text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                className="py-5"
                disabled={loading}
                id="email"
                placeholder="teacher1@srs.edu"
                type="email"
                value={email}
                onChange={(event_: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event_.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  required
                  className="py-5 pr-12"
                  disabled={loading}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event_: ChangeEvent<HTMLInputElement>) => {
                    setPassword(event_.target.value);
                  }}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded text-muted-foreground hover:bg-muted/10"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-3 py-1 rounded-sm text-muted-foreground">
              Login as
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button 
              className="w-full"
              disabled={loading || !email || !password}
              variant="outline"
              onClick={() => {
                void handleLogin('admin');
              }}
            >
              Admin
            </Button>
            <Button 
              className="w-full"
              disabled={loading || !email || !password}
              variant="outline"
              onClick={() => {
                void handleLogin('teacher');
              }}
            >
              Teacher
            </Button>
          </div>
        </div>
      <div className="text-balance text-center text-xs text-muted-foreground my-5">
        {loading ? 'Logging in...' : 'Enter your credentials and select your role to continue.'}
      </div>
      </CardContent>
    </Card>
  )
}

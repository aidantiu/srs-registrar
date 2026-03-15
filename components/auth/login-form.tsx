'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await login({ email, password })

      if (!result.success) {
        setError(result.error ?? 'An unexpected error occurred')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-md px-4 py-3 text-sm"
          style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="space-y-4">
        <Label htmlFor="email" style={{ color: '#171717' }}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@school.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={isLoading}
          className="focus-visible:ring-[#00754a] h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" style={{ color: '#171717' }}>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={isLoading}
          minLength={8}
          className="focus-visible:ring-[#00754a] h-10"
        />
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer text-white"
        style={{ backgroundColor: '#00754a' }}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}

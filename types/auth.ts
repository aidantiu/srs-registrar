export type UserRole = 'admin' | 'teacher'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateTeacherPayload {
  email: string
  password: string
  full_name: string
}

export interface AuthResponse {
  success: boolean
  error?: string
}

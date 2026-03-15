'use server'

import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import type { LoginCredentials, CreateTeacherPayload } from '@/types/auth'

export async function login(credentials: LoginCredentials) {
  const supabase = await createClient()

  // Input validation
  const email = credentials.email?.trim().toLowerCase()
  const password = credentials.password

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email format' }
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Generic error message to prevent user enumeration
    return { success: false, error: 'Invalid email or password' }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  // Check if the user is active
  if (!profile.is_active) {
    await supabase.auth.signOut()
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    profile,
  }
}

export async function createTeacher(payload: CreateTeacherPayload) {
  const supabase = await createClient()

  // Verify the current user is an admin
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.profile.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Input validation
  const email = payload.email?.trim().toLowerCase()
  const fullName = payload.full_name?.trim()
  const password = payload.password

  if (!email || !password || !fullName) {
    return { success: false, error: 'All fields are required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email format' }
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return { success: false, error: 'Full name must be between 2 and 100 characters' }
  }

  // Use Supabase Admin API to create the user
  // Note: This requires the service_role key on the server side
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: 'teacher',
    },
  })

  if (error) {
    if (error.message.includes('already been registered')) {
      return { success: false, error: 'A user with this email already exists' }
    }
    return { success: false, error: 'Failed to create teacher account' }
  }

  return { success: true }
}

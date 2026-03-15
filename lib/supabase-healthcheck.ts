import { createClient } from '@/lib/server'

export async function checkSupabaseConnection() {
  try {
    const supabase = await createClient()
    
    // Test connection by checking auth session (lightweight check)
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return { connected: false, error: error.message }
    }
    
    console.log('✅ Supabase connected successfully')
    return { connected: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Supabase connection failed:', errorMessage)
    return { connected: false, error: errorMessage }
  }
}

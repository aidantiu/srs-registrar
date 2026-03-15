import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key-here') {
  console.error('❌ Missing environment variables.')
  console.error('   Set SUPABASE_SERVICE_ROLE_KEY in your .env file.')
  console.error('   Find it in: Supabase Dashboard → Settings → API → service_role')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SEED_USERS = [
  {
    email: 'admin@school.edu',
    password: 'admin1234',
    full_name: 'System Admin',
    role: 'admin',
  },
  {
    email: 'teacher@school.edu',
    password: 'teacher1234',
    full_name: 'Juan Dela Cruz',
    role: 'teacher',
  },
]

async function seed() {
  console.log('🌱 Seeding users...\n')

  for (const user of SEED_USERS) {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const exists = existingUsers?.users?.some((u) => u.email === user.email)

    if (exists) {
      console.log(`⏭  Skipped (already exists): ${user.email}`)
      continue
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        role: user.role,
      },
    })

    if (error) {
      console.error(`❌ Failed to create ${user.email}:`, error.message)
      continue
    }

    console.log(`✅ Created ${user.role}: ${user.email} (id: ${data.user.id})`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log('\n📋 Login credentials:')
  console.log('   Admin:   admin@school.edu   / admin1234')
  console.log('   Teacher: teacher@school.edu / teacher1234')
}

seed().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import 'dotenv/config'

interface CliOptions {
  dryRun: boolean
  includeAll: boolean
  local: boolean
  yes: boolean
}

function parseOptions(args: string[]): CliOptions {
  return {
    dryRun: args.includes('--dry-run'),
    includeAll: args.includes('--include-all'),
    local: args.includes('--local'),
    yes: args.includes('--yes'),
  }
}

function splitCsv(input: string | undefined, fallback: string[]): string[] {
  if (!input) {
    return fallback
  }

  const values = input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return values.length > 0 ? values : fallback
}

function readInlineDbUrlFromEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  if (!existsSync(envPath)) {
    return null
  }

  const content = readFileSync(envPath, 'utf8')
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    if (trimmed.startsWith('SUPABASE_DB_URL=')) {
      return trimmed.slice('SUPABASE_DB_URL='.length).replace(/^['\"]|['\"]$/g, '')
    }

    if (trimmed.startsWith('DATABASE_URL=')) {
      return trimmed.slice('DATABASE_URL='.length).replace(/^['\"]|['\"]$/g, '')
    }

    if (trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://')) {
      return trimmed.replace(/^['\"]|['\"]$/g, '')
    }
  }

  return null
}

function getProjectRef() {
  if (process.env.SUPABASE_PROJECT_REF) {
    return process.env.SUPABASE_PROJECT_REF
  }

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!publicUrl) {
    return null
  }

  try {
    return new URL(publicUrl).hostname.split('.')[0] ?? null
  } catch {
    return null
  }
}

function buildDbUrlCandidates(rawDbUrl: string) {
  const normalized = new URL(rawDbUrl)
  if (!normalized.searchParams.has('sslmode')) {
    normalized.searchParams.set('sslmode', 'require')
  }

  const candidates: string[] = []
  const projectRef = getProjectRef()

  if (normalized.hostname.startsWith('db.') && normalized.hostname.endsWith('.supabase.co')) {
    const region = process.env.SUPABASE_POOLER_REGION ?? 'ap-southeast-1'
    const poolerHosts = splitCsv(
      process.env.SUPABASE_POOLER_HOSTS ?? process.env.SUPABASE_POOLER_HOST,
      [
        `aws-1-${region}.pooler.supabase.com`,
        `aws-0-${region}.pooler.supabase.com`,
      ]
    )

    const poolerPorts = splitCsv(
      process.env.SUPABASE_POOLER_PORTS ?? process.env.SUPABASE_POOLER_PORT,
      ['5432', '6543']
    )

    for (const poolerHost of poolerHosts) {
      for (const poolerPort of poolerPorts) {
        const poolerUrl = new URL(normalized.toString())
        poolerUrl.hostname = poolerHost
        poolerUrl.port = poolerPort

        if (projectRef && poolerUrl.username === 'postgres') {
          poolerUrl.username = `postgres.${projectRef}`
        }

        candidates.push(poolerUrl.toString())
      }
    }
  }

  candidates.push(normalized.toString())

  return Array.from(new Set(candidates))
}

function maskDbUrl(dbUrl: string) {
  const parsed = new URL(dbUrl)
  if (parsed.password) {
    parsed.password = '***'
  }
  return parsed.toString()
}

function runPushWithArgs(args: string[]) {
  const result = spawnSync('pnpm', ['dlx', 'supabase', 'db', 'push', ...args], {
    stdio: 'inherit',
    env: process.env,
  })

  return result.status ?? 1
}

function main() {
  const options = parseOptions(process.argv.slice(2))

  const commonArgs: string[] = []
  if (options.dryRun) {
    commonArgs.push('--dry-run')
  }
  if (options.includeAll) {
    commonArgs.push('--include-all')
  }
  if (options.yes) {
    commonArgs.push('--yes')
  }

  if (options.local) {
    const exitCode = runPushWithArgs(['--local', ...commonArgs])
    process.exit(exitCode)
  }

  const rawDbUrl = process.env.SUPABASE_DB_URL
    ?? process.env.DATABASE_URL
    ?? readInlineDbUrlFromEnvFile()

  if (!rawDbUrl) {
    console.error('❌ Missing database URL.')
    console.error('   Set SUPABASE_DB_URL in .env, or add a postgresql:// line.')
    process.exit(1)
  }

  const candidates = buildDbUrlCandidates(rawDbUrl)

  let lastExitCode = 1

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index]
    console.log(`\n🔌 Migration attempt ${index + 1}/${candidates.length}: ${maskDbUrl(candidate)}`)

    const exitCode = runPushWithArgs(['--db-url', candidate, ...commonArgs])
    if (exitCode === 0) {
      console.log('\n✅ Migration completed successfully.')
      process.exit(0)
    }

    lastExitCode = exitCode
  }

  console.error('\n❌ Migration failed for all connection candidates.')
  console.error('   Tip: set SUPABASE_POOLER_HOST/SUPABASE_POOLER_REGION explicitly in .env.')
  process.exit(lastExitCode)
}

main()

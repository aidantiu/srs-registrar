# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Student Record System (SRS) Registrar application built with Next.js 16, featuring authentication, dashboard, and role-based access control. The application uses Supabase for backend services and Shadcn/ui for the component library.

## Development Commands

### Running the Application
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed initial users (see below)

### Seeding Initial Users
Run `npm run seed` to create initial test users. Requires:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key from Supabase dashboard

Default seeded users:
- Admin: admin@school.edu / admin1234
- Teacher: teacher@school.edu / teacher1234

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Authentication**: Supabase Auth (SSR + Client)
- **UI Components**: Shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `(auth)/` - Authentication pages (login, future auth routes)
  - `(protected)/` - Protected pages requiring authentication
  - `api/` - API routes (health check endpoint)
- `components/` - React components
  - `auth/` - Authentication-related components
  - `ui/` - Shadcn/ui components
  - `dashboard/` - Dashboard-specific components
- `lib/` - Utilities and configurations
  - `server.ts` - Server-side Supabase client
  - `client.ts` - Client-side Supabase client
  - `middleware.ts` - Auth middleware and route protection
  - `auth/actions.ts` - Auth-related actions
  - `utils.ts` - Utility functions (class-variance-authority, clsx)
- `scripts/` - Utility scripts
  - `seed.ts` - Database seeding script

### Authentication Flow
1. **Middleware** (`lib/middleware.ts`) handles route protection:
   - Unauthenticated users redirected to `/login` for protected routes
   - Authenticated users redirected to `/dashboard` when accessing auth routes
2. **Server Client** (`lib/server.ts`) - For Server Components and API routes
3. **Client Client** (`lib/client.ts`) - For Client Components and hooks

### Key Implementation Details
- Uses Next.js middleware for client-side route protection
- Supabase SSR configuration for cookie-based auth
- Role-based access control planned (admin/teacher roles defined in seed script)
- Responsive design with Tailwind CSS v4
- Custom theme configuration via Shadcn/ui

### Environment Setup
Required environment variables (in `.env` file):
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Component Library
- Uses Shadcn/ui with New York style variant
- Components are generated in `components/ui/` with aliases configured
- Customizable via `components.json`
- Uses `cn()` utility (import from `@/lib/utils`) for class merging
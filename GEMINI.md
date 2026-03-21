# SRS Registrar

## Project Overview
The **SRS Registrar** is a web-based Student Record System tailored for managing student files across different school years. The platform incorporates a role-based access control system catering to Admins, Teachers, and Students.
- **Admins**: Can create teacher accounts and perform any action a teacher can.
- **Teachers**: Can view student records of a certain section for a specific school year.
- **Students**: System contains records of their files per school year.

### Tech Stack & Architecture
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI/Styling**: React 19, Tailwind CSS v4, Radix UI primitives, shadcn/ui components (e.g., Lucide React, Sonner).
- **Database & Authentication**: Supabase (PostgreSQL, Supabase Auth, Row Level Security).
- **Core Architecture**: Relies heavily on **Server Actions** for secure, server-side data mutations (avoiding REST API routes) and **Next.js Middleware** for cookie-based session management and route protection.

## Building and Running

The project utilizes `npm` / `pnpm` / `yarn` / `bun` for package management. Key scripts defined in `package.json`:

- **Development Server**: `npm run dev` (Runs `next dev`)
- **Production Build**: `npm run build` (Runs `next build`)
- **Start Production Server**: `npm run start` (Runs `next start`)
- **Linting**: `npm run lint` (Runs `eslint`)
- **Database Seeding**: `npm run seed` (Runs `tsx scripts/seed.ts`)

*Note: Access the application locally at `http://localhost:3000`.*

## Development Conventions

- **Authentication & Security**:
  - Uses Supabase Auth combined with Next.js Middleware (`middleware.ts`) for refreshing sessions and protecting routes.
  - Authentication processes (login, logout, account creation) are executed via **Server Actions** located in `lib/auth/actions.ts` to ensure built-in CSRF protection.
  - Implements soft-delete (`is_active` flag) and role-checking at both the application tier and database tier (via Supabase Row Level Security).
  - Uses generic error messages on authentication failures to prevent user enumeration.
- **Role-Based Access Control (RBAC)**:
  - Users have either an `admin` or `teacher` role stored in the `profiles` table. Admin capabilities (such as `createTeacher`) are strictly validated server-side.
- **Component & Directory Structure**:
  - Standard Next.js App Router conventions are followed: route groups for auth (`app/(auth)`) and protected paths (`app/(protected)`).
  - UI components reside in `components/`, segregating domain-specific components (`auth`, `dashboard`) from generic, reusable components (`ui`).
- **Styling**:
  - Utility-first CSS using Tailwind CSS and the `next-themes` library for theme switching. The Geist font family is used as the default typeface.
- **Code Quality**:
  - Enforces strict TypeScript rules (`strict: true`). Ensure all new code adheres to defined types (found in `types/`).
  - Architecture emphasizes single responsibility, high cohesion, and separation of concerns as detailed in `agents/architect.md`.

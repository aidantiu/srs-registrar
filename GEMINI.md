# Project Overview

This is a **Student Record System** built to manage academic records for administrators, teachers, and students.
- **Admins** have global access and can create or manage teacher accounts.
- **Teachers** are authorized to view student records for specific sections within a given school year.
- **Students** have access to their personal file records categorized by school year.

### Technologies & Architecture
- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, `shadcn/ui` (using the new-york style, neutral base color, and CSS variables)
- **Database & Authentication:** Supabase (utilizing `@supabase/ssr` and `@supabase/supabase-js`)
- **Icons:** `lucide-react`
- **Architecture:** 
  - `app/`: Next.js App Router structure with logical route groups like `(auth)` for login flows and `(protected)` for dashboard access.
  - `components/`: Modular UI elements (`ui/` for shadcn) and feature-specific components (`auth/`, `dashboard/`).
  - `lib/`: Utilities (`utils.ts` for standard shadcn merging) and Supabase client/server initializations.
  - `agents/`: A unique directory containing specialized markdown instructions (e.g., `database-reviewer.md`, `architect.md`) designed to strictly enforce architectural and database best practices for AI agents interacting with the codebase.

---

# Building and Running

The project uses standard Next.js npm scripts. You can run them using your preferred package manager (e.g., `npm`, `yarn`, `pnpm`, or `bun`).

- **Development Server:** `pnpm run dev` (Starts the app on `http://localhost:3000`)
- **Production Build:** `pnpm run build`
- **Start Production Server:** `pnpm run start`
- **Linting:** `pnpm run lint`.
- **Database Seeding:** `pnpm run seed` (Executes `tsx scripts/seed.ts` to populate the database)

---

# Development Conventions

### Coding Style & Structure
- **Component Composition:** Build complex UIs from simple, reusable components. Always separate data fetching/logic from presentation (Container/Presenter pattern).
- **Styling:** Utilize Tailwind CSS. Use the `cn` utility (combining `clsx` and `tailwind-merge`) to conditionally apply and merge Tailwind classes dynamically.
- **State Management:** Leverage custom hooks for reusable stateful logic and React Context for global state to avoid prop drilling.
- **Routing:** Maximize Next.js App Router features, utilizing layout grouping (e.g., `(auth)`, `(protected)`) for shared layouts that do not affect the URL path.

### Database & Security (Supabase)
- **Row Level Security (RLS):** CRITICAL. All multi-tenant tables must have RLS explicitly enabled and enforced. Policies should utilize patterns like `(SELECT auth.uid())` for optimal performance.
- **Data Types & Schema:** Use `bigint` (IDENTITY) or `uuid` (UUIDv7) for IDs, `text` for strings, and `timestamptz` for timestamps. Always use lowercase identifiers to avoid quoting issues in SQL queries.
- **Query Optimization:** Ensure proper indexing on `WHERE` and `JOIN` columns. Avoid N+1 query patterns. Prefer cursor-based pagination over `OFFSET` for large datasets.

### AI Agent Integration Workflow
- The `agents/` directory defines specific personas (e.g., Architect, Database Reviewer, Security). When making architectural decisions, writing SQL, or implementing features, strictly adhere to the guidelines, checklists, and anti-patterns defined in these markdown files to ensure scalability, security, and maintainability.

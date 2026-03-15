# Auth API Documentation

## Overview

The SRS Registrar auth system uses **Supabase Auth** with cookie-based sessions managed via Next.js middleware. Authentication is handled through **Server Actions** (not REST API routes), providing built-in CSRF protection.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│                                                      │
│  Login Page ──► Server Action (login) ──► Supabase  │
│                                             Auth     │
│  Dashboard  ◄── Server Action (getCurrentUser)      │
└───────────────────────┬─────────────────────────────┘
                        │
              ┌─────────▼──────────┐
              │  Next.js Middleware │
              │  (session refresh + │
              │   route protection) │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │   Supabase Auth    │
              │   + profiles table │
              │   (with RLS)       │
              └────────────────────┘
```

---

## Server Actions

### `login(credentials)`

**File:** `lib/auth/actions.ts`

Authenticates a user (admin or teacher) with email and password.

| Parameter  | Type     | Required | Description               |
|------------|----------|----------|---------------------------|
| `email`    | `string` | ✅       | User's email address      |
| `password` | `string` | ✅       | User's password (min 8ch) |

**Returns:** `{ success: boolean, error?: string }`

**Validations:**
- Email format validation
- Password minimum length (8 characters)
- Generic error messages to prevent user enumeration

**Example:**
```typescript
import { login } from '@/lib/auth/actions'

const result = await login({
  email: 'admin@school.edu',
  password: 'securepassword'
})

if (result.success) {
  router.push('/dashboard')
}
```

---

### `logout()`

**File:** `lib/auth/actions.ts`

Signs out the current user and redirects to `/login`.

**Returns:** Redirects (never returns)

---

### `getCurrentUser()`

**File:** `lib/auth/actions.ts`

Retrieves the authenticated user with their profile.

**Returns:** `AuthUser | null`

```typescript
interface AuthUser {
  id: string
  email: string
  profile: {
    id: string
    email: string
    full_name: string
    role: 'admin' | 'teacher'
    is_active: boolean
    created_at: string
    updated_at: string
  }
}
```

**Security:** Returns `null` and signs out if the user's `is_active` is `false`.

---

### `createTeacher(payload)`

**File:** `lib/auth/actions.ts`

Creates a new teacher account. **Admin only.**

| Parameter   | Type     | Required | Description                        |
|-------------|----------|----------|------------------------------------|
| `email`     | `string` | ✅       | Teacher's email address            |
| `password`  | `string` | ✅       | Initial password (min 8ch)         |
| `full_name` | `string` | ✅       | Teacher's full name (2-100 chars)  |

**Returns:** `{ success: boolean, error?: string }`

**Authorization:** Requires the calling user to have `role = 'admin'`.

**Note:** Uses `supabase.auth.admin.createUser()` — requires the `SUPABASE_SERVICE_ROLE_KEY` environment variable for production use.

---

## API Routes

### `GET /api/health`

Health check endpoint. Returns Supabase connection status.

**Auth Required:** No

**Response:**
```json
{
  "status": "healthy",
  "supabase": "connected",
  "error": null,
  "timestamp": "2026-02-07T12:00:00.000Z"
}
```

| Status Code | Meaning                        |
|-------------|--------------------------------|
| `200`       | Supabase is connected          |
| `503`       | Supabase connection failed     |

---

## Database Schema

### `profiles` table

| Column       | Type                          | Description                |
|--------------|-------------------------------|----------------------------|
| `id`         | `uuid` (FK → auth.users)     | Primary key                |
| `email`      | `text` (unique)               | User's email               |
| `full_name`  | `text`                        | User's display name        |
| `role`       | `enum ('admin', 'teacher')`   | User role                  |
| `is_active`  | `boolean` (default: true)     | Soft-delete flag           |
| `created_at` | `timestamptz`                 | Creation timestamp         |
| `updated_at` | `timestamptz`                 | Auto-updated on change     |

### Row Level Security (RLS) Policies

| Policy                        | Operation | Who                      |
|-------------------------------|-----------|--------------------------|
| View all profiles             | SELECT    | Admins                   |
| View own profile              | SELECT    | Any authenticated user   |
| Create profiles               | INSERT    | Admins                   |
| Update any profile            | UPDATE    | Admins                   |
| Update own profile            | UPDATE    | Any authenticated user   |
| Delete profiles               | DELETE    | Admins                   |

---

## Middleware & Route Protection

### Protected Routes
All routes are protected by default via Next.js middleware.

### Public Routes
- `/login` — Login page

### Auto-Redirects
| Condition                | From         | To           |
|--------------------------|--------------|--------------|
| Unauthenticated user     | Any route    | `/login`     |
| Authenticated user       | `/login`     | `/dashboard` |
| Root path `/`            | —            | `/login`     |

---

## Roles & Permissions

| Action                | Admin | Teacher |
|-----------------------|-------|---------|
| Login                 | ✅    | ✅      |
| View own profile      | ✅    | ✅      |
| View all profiles     | ✅    | ❌      |
| Create teacher        | ✅    | ❌      |
| Update any profile    | ✅    | ❌      |
| Deactivate user       | ✅    | ❌      |

---

## Security Measures

1. **Cookie-based sessions** — Tokens stored in HttpOnly cookies, not localStorage
2. **Server-side validation** — All auth logic runs on the server via Server Actions
3. **CSRF protection** — Built-in with Next.js Server Actions
4. **User enumeration prevention** — Generic "Invalid email or password" error
5. **Input sanitization** — Email trimmed/lowercased, length validation on all fields
6. **RLS enforcement** — Database-level access control, not just app-level
7. **Soft deletes** — Deactivated users are signed out and blocked from re-auth
8. **Middleware session refresh** — Tokens auto-refreshed on every request
9. **Route protection** — Middleware-level redirect for unauthenticated requests

# Admin Dashboard Context: Frontend Specifications & Dynamic Requirements

This document summarizes the frontend structure and data requirements for the **Admin Dashboard** of the Student Record System (SRS). This context is intended for backend implementation to transition the current static UI into a fully dynamic, data-driven dashboard.

## 1. Architectural Overview
- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4, `shadcn/ui`.
- **Icons:** `lucide-react`.
- **Branding:** 
  - Primary: `#00754a` (Starbucks-style green)
  - Secondary: `#d4e9e2` (Light mint)
  - Base Background: `#fafafa`
  - Text/Accents: `#171717` (Neutral Black)

## 2. Page Layout: `app/(protected)/dashboard/page.tsx`
The dashboard is a single-column layout with three primary sections:
1. **Summary Statistics Grid** (4 Cards)
2. **Teacher Management Table** (Full Width)
3. **Split-View Lists** (Classrooms & Students)

---

## 3. Data Components & Requirements

### A. Summary Stats (`StatCard`)
The backend needs to provide aggregate counts and activity logs for:
- **Total Classrooms:** Integer count of all active sections.
- **Total Teachers:** Integer count of all registered teacher profiles.
- **Total Students:** Integer count of all enrolled student profiles.
- **Recent Activity:** A string summarizing the most recent system event (e.g., "Teacher [Name] was last active [Time]").

### B. Teacher List (`TeachersTable`)
A detailed management grid with the following fields:
- `id`: UUID.
- `name`: Full name + Avatar logic.
- `department`: String (e.g., "Mathematics", "Computer Science").
- `joining_date`: Formatted date string (e.g., "Jan 01, 2016").
- `gender`: Enum ("Male", "Female").
- `email`: Valid email address.
- **Actions Required:**
  - `GET /api/teachers`: Should support pagination and basic search/filtering.
  - `POST /api/teachers`: (Add New) Logic for creating teacher accounts.
  - `PATCH /api/teachers/[id]`: Edit existing teacher records.
  - `DELETE /api/teachers/[id]`: Remove teacher records.

### C. Classroom List (`ClassroomList`)
A high-level list of academic levels:
- Currently displays: "1st Year", "2nd Year", "3rd Year", "4th Year".
- Backend should provide a list of year levels or active classroom categories.

### D. Student List (`StudentList`)
A miniature preview table limited to the top 3 records for layout balance:
- `name`: Full name + Avatar.
- `department`: String.
- `date`: Enrollment date.
- `gender`: Enum.
- **Search/Filter:** The UI includes a search input and a filter button that should trigger server-side queries.

---

## 4. Navigation & Auth Context
- **Sidebar (`AppSidebar`):**
  - Navigation hierarchy: `Dashboard` (Main), `School` (Label), `Classrooms`, `Teachers`, `Students`.
  - **Dynamic Requirement:** Profile section should display the currently authenticated Admin's name and role.
- **Header (`DashboardHeader`):**
  - Displays the current page title ("Admin View").
  - Displays the active Admin's avatar and name fetched from `getCurrentUser()`.

## 5. Backend Logic Mapping
To make this dashboard dynamic, the backend should implement:
1. **Supabase Edge Functions / API Routes:**
   - `get_dashboard_stats`: Returns counts for the 4 stat cards.
   - `get_teachers_list`: Returns paginated teacher records.
   - `get_students_preview`: Returns the 3 most recent student enrollments.
2. **RLS (Row Level Security):**
   - Ensure only users with the `admin` role can access these aggregate views.
   - Teachers should have restricted access to only their assigned sections (per `GEMINI.md` mandates).

# SRS Registrar API - MVC Structure

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── models/               # Data models and types
│   ├── types.ts         # Shared types (UserRole enum)
│   ├── admin.model.ts   # Admin model and validation
│   ├── teacher.model.ts # Teacher model and validation
│   └── index.ts         # Model exports
├── services/            # Business logic layer
│   ├── admin.service.ts
│   ├── teacher.service.ts
│   └── index.ts
├── controllers/         # Request handlers
│   ├── admin.controller.ts
│   ├── teacher.controller.ts
│   └── index.ts
└── routes/              # API routes
    ├── admin.routes.ts
    ├── teacher.routes.ts
    └── index.ts
```

## API Endpoints

### Admin Endpoints
- `GET    /api/admins`     - Get all admins
- `GET    /api/admins/:id` - Get admin by ID
- `POST   /api/admins`     - Create new admin
- `PUT    /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

### Teacher Endpoints
- `GET    /api/teachers`     - Get all teachers
- `GET    /api/teachers/:id` - Get teacher by ID
- `POST   /api/teachers`     - Create new teacher
- `PUT    /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

## Request/Response Examples

### Create Admin
```bash
POST /api/admins
Content-Type: application/json

{
  "fullName": "John Admin",
  "password": "securepass123",
  "role": "admin"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "fullName": "John Admin",
    "role": "admin",
    "createdAt": "2025-12-22T..."
  },
  "message": "Admin created successfully"
}
```

### Get All Teachers
```bash
GET /api/teachers
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "fullName": "Jane Teacher",
      "role": "teacher",
      "createdAt": "2025-12-22T..."
    }
  ]
}
```

## MVC Pattern Explanation

### Models (`models/`)
- Define data structures (interfaces, types)
- Data validation logic
- Model creation and transformation methods
- No database or business logic

### Services (`services/`)
- Business logic layer
- Data manipulation and validation
- Database operations (currently in-memory)
- Reusable across different controllers

### Controllers (`controllers/`)
- Handle HTTP requests and responses
- Call service methods
- Return appropriate status codes
- Error handling

### Routes (`routes/`)
- Define API endpoints
- Map URLs to controller methods
- Middleware attachment point

## Development

```bash
# Start development server
make dev

# Build for production
make build

# Start production server
make prod
```

## Notes

- Currently using in-memory storage
- Ready for database integration (Prisma, TypeORM, etc.)
- Password returned in responses should be hashed in production
- Add authentication middleware before deploying

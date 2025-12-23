import { Router, type IRouter } from 'express';
import { TeacherController } from '../controllers/teacher.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { UserRole } from '../models/types.js';

const router: IRouter = Router();

/**
 * Teacher routes
 * Base path: /api/teachers
 * 
 * All routes require authentication
 * Admin can access all routes
 * Teachers can only view (GET) routes
 */

// GET /api/teachers - Get all teachers (Admin and Teacher can view)
router.get('/', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), TeacherController.getAll);

// GET /api/teachers/:id - Get teacher by ID (Admin and Teacher can view)
router.get('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), TeacherController.getById);

// POST /api/teachers - Create new teacher (Admin only)
router.post('/', authenticate, authorize(UserRole.ADMIN), TeacherController.create);

// PUT /api/teachers/:id - Update teacher (Admin only)
router.put('/:id', authenticate, authorize(UserRole.ADMIN), TeacherController.update);

// DELETE /api/teachers/:id - Delete teacher (Admin only)
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), TeacherController.delete);

export default router;

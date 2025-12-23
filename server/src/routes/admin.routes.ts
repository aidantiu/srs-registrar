import { Router, type IRouter } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { UserRole } from '../models/types.js';

const router: IRouter = Router();

/**
 * Admin routes
 * Base path: /api/admins
 * 
 * All routes require authentication
 * Most routes require ADMIN role
 */

// GET /api/admins - Get all admins (Admin only)
router.get('/', authenticate, authorize(UserRole.ADMIN), AdminController.getAll);

// GET /api/admins/:id - Get admin by ID (Admin only)
router.get('/:id', authenticate, authorize(UserRole.ADMIN), AdminController.getById);

// POST /api/admins - Create new admin (Admin only)
router.post('/', authenticate, authorize(UserRole.ADMIN), AdminController.create);

// PUT /api/admins/:id - Update admin (Admin only)
router.put('/:id', authenticate, authorize(UserRole.ADMIN), AdminController.update);

// DELETE /api/admins/:id - Delete admin (Admin only)
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), AdminController.delete);

export default router;

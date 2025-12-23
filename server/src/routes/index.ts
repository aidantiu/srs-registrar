import { Router, type IRouter } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import teacherRoutes from './teacher.routes.js';

const router: IRouter = Router();

/**
 * API Routes
 * Base path: /api
 */

// Auth routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admins', adminRoutes);

// Teacher routes
router.use('/teachers', teacherRoutes);

export default router;

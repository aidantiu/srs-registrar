import { Router, type IRouter } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: IRouter = Router();

/**
 * POST /api/auth/login
 * Login with ID, password, and role
 */
router.post('/login', AuthController.login);

/**
 * GET /api/auth/verify
 * Verify JWT token
 */
router.get('/verify', AuthController.verify);

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', authenticate, AuthController.logout);

export default router;

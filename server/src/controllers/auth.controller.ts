import type { Request, Response, NextFunction } from 'express';
import { AuthService, type LoginCredentials } from '../services/auth.service.js';
import { UserRole } from '../models/types.js';

/**
 * Auth Controller
 */
export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, role } = req.body as LoginCredentials;

      // Validate input
      if (!email || !password || !role) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and role are required',
        });
        return;
      }

      // Normalize role to lowercase
      const normalizedRole = role.toLowerCase() as UserRole;

      // Validate role
      if (![UserRole.ADMIN, UserRole.TEACHER].includes(normalizedRole)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role. Must be ADMIN or TEACHER',
        });
        return;
      }

      const result = await AuthService.login({ email, password, role: normalizedRole });

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/verify
   */
  static async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
        });
        return;
      }

      const token = authHeader.substring(7);
      const result = await AuthService.verifyAuth(token);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Since JWT is stateless, logout is handled on client side
      // This endpoint is just for consistency
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

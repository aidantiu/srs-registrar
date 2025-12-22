import { getSequelize } from '../config/database.js';
import type { Admin } from '../models/admin.model.js';
import type { Teacher } from '../models/teacher.model.js';
import { UserRole } from '../models/types.js';
import { comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    fullName: string;
    role: UserRole;
  };
  message?: string;
}

/**
 * Auth Service
 */
export class AuthService {
  /**
   * Login user (admin or teacher)
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password, role } = credentials;

    try {
      console.log('Login attempt:', { email, role });
      
      // Get models from sequelize instance
      const sequelize = getSequelize();
      const AdminModel = sequelize.models.Admin as typeof Admin;
      const TeacherModel = sequelize.models.Teacher as typeof Teacher;
      
      let user: Admin | Teacher | null = null;

      // Find user based on role
      if (role === UserRole.ADMIN) {
        user = await AdminModel.findOne({ where: { email } });
        console.log('Admin found:', user ? 'yes' : 'no');
      } else if (role === UserRole.TEACHER) {
        user = await TeacherModel.findOne({ where: { email } });
        console.log('Teacher found:', user ? 'yes' : 'no');
      } else {
        console.log('Invalid role:', role);
        return {
          success: false,
          message: 'Invalid role',
        };
      }

      // Check if user exists
      if (!user) {
        console.log('User not found for email:', email);
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        role: user.role,
        fullName: user.fullName,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  /**
   * Verify token and return user info
   */
  static async verifyAuth(token: string): Promise<AuthResponse> {
    try {
      const { verifyToken } = await import('../utils/jwt.js');
      const decoded = verifyToken(token);

      // Get models from sequelize instance
      const sequelize = getSequelize();
      const AdminModel = sequelize.models.Admin as typeof Admin;
      const TeacherModel = sequelize.models.Teacher as typeof Teacher;

      let user: Admin | Teacher | null = null;

      if (decoded.role === UserRole.ADMIN) {
        user = await AdminModel.findByPk(decoded.id);
      } else if (decoded.role === UserRole.TEACHER) {
        user = await TeacherModel.findByPk(decoded.id);
      }

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
      };
    }
  }
}

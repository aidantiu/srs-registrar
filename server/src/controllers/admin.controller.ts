import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import type { CreateAdminInput } from '../models/index.js';

/**
 * Admin Controller
 * Handles HTTP requests for admin operations
 */
export class AdminController {
  /**
   * Get all admins
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admins = await AdminService.getAllAdmins();
      res.status(200).json({
        success: true,
        data: admins,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get admin by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Admin ID is required',
        });
        return;
      }

      const admin = await AdminService.getAdminById(id);

      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new admin
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminData: CreateAdminInput = req.body;
      const admin = await AdminService.createAdmin(adminData);

      res.status(201).json({
        success: true,
        data: admin,
        message: 'Admin created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update admin
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Admin ID is required',
        });
        return;
      }

      const updateData = req.body;
      const admin = await AdminService.updateAdmin(id, updateData);

      if (!admin) {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: admin,
        message: 'Admin updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete admin
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Admin ID is required',
        });
        return;
      }

      const deleted = await AdminService.deleteAdmin(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Admin not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

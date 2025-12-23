import type { Request, Response, NextFunction } from 'express';
import { TeacherService } from '../services/teacher.service.js';
import type { CreateTeacherInput } from '../models/index.js';

/**
 * Teacher Controller
 * Handles HTTP requests for teacher operations
 */
export class TeacherController {
  /**
   * Get all teachers
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teachers = await TeacherService.getAllTeachers();
      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get teacher by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Teacher ID is required',
        });
        return;
      }

      const teacher = await TeacherService.getTeacherById(id);

      if (!teacher) {
        res.status(404).json({
          success: false,
          message: 'Teacher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new teacher
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacherData: CreateTeacherInput = req.body;
      const teacher = await TeacherService.createTeacher(teacherData);

      res.status(201).json({
        success: true,
        data: teacher,
        message: 'Teacher created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update teacher
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Teacher ID is required',
        });
        return;
      }

      const updateData = req.body;
      const teacher = await TeacherService.updateTeacher(id, updateData);

      if (!teacher) {
        res.status(404).json({
          success: false,
          message: 'Teacher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: teacher,
        message: 'Teacher updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete teacher
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Teacher ID is required',
        });
        return;
      }

      const deleted = await TeacherService.deleteTeacher(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Teacher not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

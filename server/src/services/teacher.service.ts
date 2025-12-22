import { Teacher, type CreateTeacherInput, type SafeTeacher, type UpdateTeacherInput } from '../models/index.js';

/**
 * Teacher Service
 * Contains business logic for teacher operations using Sequelize
 */
export class TeacherService {
  /**
   * Get all teachers
   */
  static async getAllTeachers(): Promise<SafeTeacher[]> {
    const teachers = await Teacher.findAll();
    return teachers.map((teacher) => teacher.toSafeObject());
  }

  /**
   * Get teacher by ID
   */
  static async getTeacherById(id: string): Promise<SafeTeacher | null> {
    const teacher = await Teacher.findByPk(id);
    return teacher ? teacher.toSafeObject() : null;
  }

  /**
   * Create new teacher
   */
  static async createTeacher(data: CreateTeacherInput): Promise<SafeTeacher> {
    // Validate input
    const errors = Teacher.validateInput(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Check if teacher with same name already exists
    const existingTeacher = await Teacher.findOne({
      where: { fullName: data.fullName },
    });
    if (existingTeacher) {
      throw new Error('Teacher with this name already exists');
    }

    // Create teacher
    const teacher = await Teacher.create(data);
    return teacher.toSafeObject();
  }

  /**
   * Update teacher
   */
  static async updateTeacher(id: string, data: UpdateTeacherInput): Promise<SafeTeacher | null> {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return null;
    }

    // Validate update data
    if (data.fullName || data.password) {
      const fullName = data.fullName ?? teacher.fullName;
      const password = data.password ?? teacher.password;
      const errors = Teacher.validateInput({ fullName, password });
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    }

    // Update teacher
    await teacher.update(data);
    return teacher.toSafeObject();
  }

  /**
   * Delete teacher
   */
  static async deleteTeacher(id: string): Promise<boolean> {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return false;
    }

    await teacher.destroy();
    return true;
  }

  /**
   * Find teacher by full name (useful for login)
   */
  static async findByFullName(fullName: string): Promise<Teacher | null> {
    return await Teacher.findOne({
      where: { fullName },
    });
  }
}

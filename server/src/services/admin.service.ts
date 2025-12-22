import { Admin, type CreateAdminInput, type SafeAdmin, type UpdateAdminInput } from '../models/index.js';

/**
 * Admin Service
 * Contains business logic for admin operations using Sequelize
 */
export class AdminService {
  /**
   * Get all admins
   */
  static async getAllAdmins(): Promise<SafeAdmin[]> {
    const admins = await Admin.findAll();
    return admins.map((admin) => admin.toSafeObject());
  }

  /**
   * Get admin by ID
   */
  static async getAdminById(id: string): Promise<SafeAdmin | null> {
    const admin = await Admin.findByPk(id);
    return admin ? admin.toSafeObject() : null;
  }

  /**
   * Create new admin
   */
  static async createAdmin(data: CreateAdminInput): Promise<SafeAdmin> {
    // Validate input
    const errors = Admin.validateInput(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Check if admin with same name already exists
    const existingAdmin = await Admin.findOne({
      where: { fullName: data.fullName },
    });
    if (existingAdmin) {
      throw new Error('Admin with this name already exists');
    }

    // Create admin
    const admin = await Admin.create(data);
    return admin.toSafeObject();
  }

  /**
   * Update admin
   */
  static async updateAdmin(id: string, data: UpdateAdminInput): Promise<SafeAdmin | null> {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return null;
    }

    // Validate update data
    if (data.fullName || data.password) {
      const fullName = data.fullName ?? admin.fullName;
      const password = data.password ?? admin.password;
      const errors = Admin.validateInput({ fullName, password });
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    }

    // Update admin
    await admin.update(data);
    return admin.toSafeObject();
  }

  /**
   * Delete admin
   */
  static async deleteAdmin(id: string): Promise<boolean> {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return false;
    }

    await admin.destroy();
    return true;
  }

  /**
   * Find admin by full name (useful for login)
   */
  static async findByFullName(fullName: string): Promise<Admin | null> {
    return await Admin.findOne({
      where: { fullName },
    });
  }
}

import { Table, Column, Model, DataType, CreatedAt, Default, PrimaryKey, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { UserRole } from './types.js';
import { hashPassword } from '../utils/password.js';

/**
 * Admin user interface
 */
export interface AdminAttributes {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole.ADMIN;
  createdAt: Date;
}

/**
 * Type for creating a new admin (without id and createdAt)
 */
export type CreateAdminInput = Omit<AdminAttributes, 'id' | 'createdAt'>;

/**
 * Type for updating admin (all fields optional except id)
 */
export type UpdateAdminInput = Partial<Omit<AdminAttributes, 'id' | 'createdAt'>>;

/**
 * Type for safe admin response (without password)
 */
export type SafeAdmin = Omit<AdminAttributes, 'password'>;

/**
 * Admin Sequelize Model
 */
@Table({
  tableName: 'admins',
  timestamps: true,
  updatedAt: false,
})
export class Admin extends Model<AdminAttributes, CreateAdminInput> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullName: string;

  @Default(UserRole.ADMIN)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: UserRole.ADMIN;

  @CreatedAt
  declare createdAt: Date;

  /**
   * Hash password before creating admin
   */
  @BeforeCreate
  static async hashPasswordBeforeCreate(admin: Admin) {
    if (admin.password) {
      admin.password = await hashPassword(admin.password);
    }
  }

  /**
   * Hash password before updating admin
   */
  @BeforeUpdate
  static async hashPasswordBeforeUpdate(admin: Admin) {
    if (admin.changed('password')) {
      admin.password = await hashPassword(admin.password);
    }
  }

  /**
   * Remove password from admin object for safe responses
   */
  toSafeObject(): SafeAdmin {
    const { password, ...safeAdmin } = this.toJSON();
    return safeAdmin as SafeAdmin;
  }

  /**
   * Validate admin data
   */
  static validateInput(data: Partial<AdminAttributes>): string[] {
    const errors: string[] = [];

    if (data.fullName !== undefined && data.fullName.trim().length === 0) {
      errors.push('Full name is required');
    }

    if (data.password !== undefined && data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (data.role && data.role !== UserRole.ADMIN) {
      errors.push('Invalid role for admin');
    }

    return errors;
  }
}

export default Admin;

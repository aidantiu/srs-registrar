import { Table, Column, Model, DataType, CreatedAt, Default, PrimaryKey, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { UserRole } from './types.js';
import { hashPassword } from '../utils/password.js';

/**
 * Teacher user interface
 */
export interface TeacherAttributes {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole.TEACHER;
  createdAt: Date;
}

/**
 * Type for creating a new teacher (without id and createdAt)
 */
export type CreateTeacherInput = Omit<TeacherAttributes, 'id' | 'createdAt'>;

/**
 * Type for updating teacher (all fields optional except id)
 */
export type UpdateTeacherInput = Partial<Omit<TeacherAttributes, 'id' | 'createdAt'>>;

/**
 * Type for safe teacher response (without password)
 */
export type SafeTeacher = Omit<TeacherAttributes, 'password'>;

/**
 * Teacher Sequelize Model
 */
@Table({
  tableName: 'teachers',
  timestamps: true,
  updatedAt: false,
})
export class Teacher extends Model<TeacherAttributes, CreateTeacherInput> {
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

  @Default(UserRole.TEACHER)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: UserRole.TEACHER;

  @CreatedAt
  declare createdAt: Date;

  /**
   * Hash password before creating teacher
   */
  @BeforeCreate
  static async hashPasswordBeforeCreate(teacher: Teacher) {
    if (teacher.password) {
      teacher.password = await hashPassword(teacher.password);
    }
  }

  /**
   * Hash password before updating teacher
   */
  @BeforeUpdate
  static async hashPasswordBeforeUpdate(teacher: Teacher) {
    if (teacher.changed('password')) {
      teacher.password = await hashPassword(teacher.password);
    }
  }

  /**
   * Remove password from teacher object for safe responses
   */
  toSafeObject(): SafeTeacher {
    const { password, ...safeTeacher } = this.toJSON();
    return safeTeacher as SafeTeacher;
  }

  /**
   * Validate teacher data
   */
  static validateInput(data: Partial<TeacherAttributes>): string[] {
    const errors: string[] = [];

    if (data.fullName !== undefined && data.fullName.trim().length === 0) {
      errors.push('Full name is required');
    }

    if (data.password !== undefined && data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (data.role && data.role !== UserRole.TEACHER) {
      errors.push('Invalid role for teacher');
    }

    return errors;
  }
}

export default Teacher;

import { Sequelize } from 'sequelize';
import { UserRole } from '../models/types.js';

/**
 * Seeder: Create test teacher users
 */
export async function seed(sequelize: Sequelize): Promise<void> {
  console.log('   Running seeder: 002-seed-teachers');
  
  const Teacher = sequelize.models.Teacher as any;
  
  // Check if teachers already exist (idempotent)
  const existingCount = await Teacher.count();
  
  if (existingCount > 0) {
    console.log(`   ℹ️  Skipping - ${existingCount} teachers already exist`);
    return;
  }
  
  // Create test teachers
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    console.log('   ℹ️  Production environment - skipping test teacher creation');
    return;
  }
  
  // Development/test teachers
  const teachers = [
    {
      email: 'teacher1@srs.edu',
      password: 'teacher123',
      fullName: 'Juan Dela Cruz',
      role: UserRole.TEACHER,
    },
    {
      email: 'teacher2@srs.edu',
      password: 'teacher123',
      fullName: 'Maria Santos',
      role: UserRole.TEACHER,
    },
    {
      email: 'teacher3@srs.edu',
      password: 'teacher123',
      fullName: 'Pedro Garcia',
      role: UserRole.TEACHER,
    },
  ];
  
  for (const teacherData of teachers) {
    await Teacher.create(teacherData);
    console.log(`   ✅ Created teacher: ${teacherData.email}`);
  }
  
  console.log(`   ✅ Successfully created ${teachers.length} test teachers`);
}

export default { seed };

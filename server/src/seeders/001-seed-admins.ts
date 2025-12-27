import { Sequelize } from 'sequelize';
import { UserRole } from '../models/types.js';

/**
 * Seeder: Create default admin users
 */
export async function seed(sequelize: Sequelize): Promise<void> {
  console.log('   Running seeder: 001-seed-admins');
  
  const Admin = sequelize.models.Admin as any;
  
  // Check if admins already exist (idempotent)
  const existingCount = await Admin.count();
  
  if (existingCount > 0) {
    console.log(`   ℹ️  Skipping - ${existingCount} admins already exist`);
    return;
  }
  
  // Create default admin based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  const adminData = {
    email: isProduction ? 'admin@srs.edu' : 'testadmin@srs.edu',
    password: isProduction ? 'adminsrs123' : 'testadmin123',
    fullName: isProduction ? 'Admin SRS' : 'Test Admin',
    role: UserRole.ADMIN,
  };
  
  await Admin.create(adminData);
  
  console.log(`   ✅ Created admin: ${adminData.email}`);
  if (isProduction) {
    console.log('   ⚠️  IMPORTANT: Change this password after first login!');
  }
}

export default { seed };

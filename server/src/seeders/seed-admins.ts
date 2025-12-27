import 'reflect-metadata';
import dotenv from 'dotenv';
import { getSequelize, initializeDatabase, closeDatabase } from '../config/database.js';
import { UserRole } from '../models/types.js';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.prod' 
  : '.env.development';

dotenv.config({ path: envFile });

/**
 * Seed admin users
 */
async function seedAdmins(): Promise<void> {
  try {
    console.log('🌱 Starting admin seed...');

    // Get sequelize instance without calling initializeDatabase
    const sequelize = getSequelize();
    
    console.log('🔌 Testing connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Get Admin model from sequelize instance
    const Admin = sequelize.models.Admin as any;

    // Clear existing admins
    console.log('🗑️  Clearing existing admins...');
    await Admin.destroy({ where: {}, truncate: true });

    // Create test admin
    const testAdmin = await Admin.create({
      email: 'testadmin@srs.edu',
      password: 'testadmin123',
      fullName: 'Test Admin',
      role: UserRole.ADMIN,
    });
    console.log('✅ Created test admin:');
    console.log(`   Email: ${testAdmin.email}`);
    console.log(`   Name: ${testAdmin.fullName}`);
    console.log(`   Password: testadmin123`);

    // Create adminsrs
    const adminSrs = await Admin.create({
      email: 'admin@srs.edu',
      password: 'adminsrs123',
      fullName: 'Admin SRS',
      role: UserRole.ADMIN,
    });
    console.log('✅ Created adminsrs:');
    console.log(`   Email: ${adminSrs.email}`);
    console.log(`   Name: ${adminSrs.fullName}`);
    console.log(`   Password: adminsrs123`);

    console.log('\n✅ Admin seed completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Test Admin:');
    console.log(`     Email: ${testAdmin.email}`);
    console.log('     Password: testadmin123');
    console.log('   Admin SRS:');
    console.log(`     Email: ${adminSrs.email}`);
    console.log('     Password: adminsrs123');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    await closeDatabase();
    process.exit(1);
  }
}

// Run seed
seedAdmins();

import 'reflect-metadata';
import dotenv from 'dotenv';
import { getSequelize, closeDatabase } from '../config/database.js';
import { UserRole } from '../models/types.js';

// Load production environment variables
dotenv.config({ path: '.env.prod' });

/**
 * Initialize production database
 */
async function initProduction(): Promise<void> {
  try {
    console.log('🚀 Initializing production database...');
    console.log(`📍 Database: ${process.env.DB_DATABASE}`);
    console.log(`📍 Host: ${process.env.DB_HOST}`);

    // Get sequelize instance
    const sequelize = getSequelize();
    
    console.log('🔌 Testing connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (create tables)
    console.log('📊 Creating tables...');
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Tables created successfully.');

    // Get models
    const Admin = sequelize.models.Admin as any;
    const Teacher = sequelize.models.Teacher as any;

    // Check if admins already exist
    const adminCount = await Admin.count();
    
    if (adminCount > 0) {
      console.log(`ℹ️  Found ${adminCount} existing admins. Skipping seed.`);
      console.log('💡 To force re-seed, delete existing admins first or run seed-admins.ts');
    } else {
      console.log('🌱 Seeding admin users...');
      
      // Create production admin
      const adminSrs = await Admin.create({
        email: 'admin@srs.edu',
        password: 'adminsrs123',
        fullName: 'Admin SRS',
        role: UserRole.ADMIN,
      });
      console.log('✅ Created production admin:');
      console.log(`   Email: ${adminSrs.email}`);
      console.log(`   Name: ${adminSrs.fullName}`);
      console.log(`   Password: adminsrs123`);
      console.log('   ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!');
    }

    console.log('');
    console.log('🎉 Production database initialization complete!');
    console.log('');
    console.log('📝 Summary:');
    console.log(`   - Tables: admins, teachers`);
    console.log(`   - Admin users: ${await Admin.count()}`);
    console.log(`   - Teacher users: ${await Teacher.count()}`);
    console.log('');

  } catch (error) {
    console.error('❌ Production initialization failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Run initialization
initProduction();
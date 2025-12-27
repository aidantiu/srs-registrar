import 'reflect-metadata';
import dotenv from 'dotenv';
import { getSequelize, closeDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: envFile });

/**
 * Load all migration files from migrations directory
 */
async function loadMigrations(): Promise<any[]> {
  const migrationsDir = path.join(__dirname, '../migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('   No migrations directory found. Creating...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => {
      // In production, only load .js files (not .d.ts)
      if (file.endsWith('.d.ts')) return false;
      return file.endsWith('.ts') || file.endsWith('.js');
    })
    .sort(); // Ensures migrations run in order (001, 002, etc.)
  
  const migrations = [];
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const migration = await import(`file://${filePath}`);
    migrations.push({ file, ...migration.default || migration });
  }
  
  return migrations;
}

/**
 * Load all seeder files from seeders directory
 */
async function loadSeeders(): Promise<any[]> {
  const seedersDir = __dirname;
  
  const files = fs.readdirSync(seedersDir)
    .filter(file => {
      // Exclude declaration files and special files
      if (file.endsWith('.d.ts')) return false;
      if (file === 'init-database.ts' || file === 'init-database.js') return false;
      if (file === 'init-prod.ts' || file === 'init-prod.js') return false;
      if (file.startsWith('seed-')) return false;
      
      return file.endsWith('.ts') || file.endsWith('.js');
    })
    .sort(); // Ensures seeders run in order
  
  const seeders = [];
  for (const file of files) {
    const filePath = path.join(seedersDir, file);
    const seeder = await import(`file://${filePath}`);
    seeders.push({ file, ...seeder.default || seeder });
  }
  
  return seeders;
}

/**
 * Initialize database with migrations and seeds
 * This script is idempotent - safe to run multiple times
 */
async function initDatabase(): Promise<void> {
  try {
    console.log('🚀 Initializing database...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Database: ${process.env.DB_DATABASE}`);
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log('');

    // Get sequelize instance
    const sequelize = getSequelize();
    
    // Test connection
    console.log('🔌 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    console.log('');

    // Run migrations
    console.log('📊 Running migrations...');
    const migrations = await loadMigrations();
    
    if (migrations.length === 0) {
      console.log('   No migrations found.');
    } else {
      for (const migration of migrations) {
        if (migration.up) {
          await migration.up(sequelize);
        }
      }
      console.log(`✅ Completed ${migrations.length} migration(s).`);
    }
    console.log('');

    // Run seeders
    console.log('🌱 Running seeders...');
    const seeders = await loadSeeders();
    
    if (seeders.length === 0) {
      console.log('   No seeders found.');
    } else {
      for (const seeder of seeders) {
        if (seeder.seed) {
          await seeder.seed(sequelize);
        }
      }
      console.log(`✅ Completed ${seeders.length} seeder(s).`);
    }
    console.log('');

    // Get summary
    const Admin = sequelize.models.Admin as any;
    const Teacher = sequelize.models.Teacher as any;

    console.log('🎉 Database initialization complete!');
    console.log('');
    console.log('📝 Summary:');
    console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   - Migrations run: ${migrations.length}`);
    console.log(`   - Seeders run: ${seeders.length}`);
    console.log(`   - Admin users: ${await Admin.count()}`);
    console.log(`   - Teacher users: ${await Teacher.count()}`);
    console.log('');
    console.log('✨ Database is ready for use!');
    console.log('');

  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Run initialization
initDatabase();

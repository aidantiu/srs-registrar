import { Sequelize } from 'sequelize';

/**
 * Migration: Create initial tables
 */
export async function up(sequelize: Sequelize): Promise<void> {
  console.log('   Running migration: 001-create-tables');
  
  // Get query interface
  const queryInterface = sequelize.getQueryInterface();
  
  // Check if tables already exist
  const tables = await queryInterface.showAllTables();
  const existingTables = tables.map((t: any) => typeof t === 'string' ? t : t.tableName || t.name);
  
  // Check if our main tables exist
  const hasAdmins = existingTables.includes('admins');
  const hasTeachers = existingTables.includes('teachers');
  
  if (hasAdmins && hasTeachers) {
    console.log('   ℹ️  Tables already exist. Skipping creation.');
    return;
  }
  
  // Tables don't exist yet, create them
  console.log('   Creating tables...');
  
  // Use sync with force: false to only create missing tables
  await sequelize.sync({ force: false, alter: false });
  
  console.log('   ✅ Tables created successfully');
}

/**
 * Rollback: Drop all tables (use with caution!)
 */
export async function down(sequelize: Sequelize): Promise<void> {
  console.log('   Rolling back migration: 001-create-tables');
  
  // Drop all tables in reverse order
  await sequelize.drop();
  console.log('   ✅ Tables dropped successfully');
}

export default { up, down };

import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize: Sequelize;

/**
 * Get or create Sequelize instance
 */
export const getSequelize = (): Sequelize => {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      database: process.env.DB_DATABASE || process.env.DB_NAME || 'srs_registrar',
      username: process.env.DB_USERNAME || process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      logging: false,
      models: [path.join(__dirname, '../models/**/*.model.{ts,js}')],
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
    });
  }
  return sequelize;
};

/**
 * Initialize database connection and sync models
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = getSequelize();
    await db.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://johnwesley8113:v9kmS6jnuLSks4IH@cluster0.gpsnyuz.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  CLIENT_URL: process.env.CLIENT_URL || 'https://chat-app-beta-six-31.vercel.app/',
};

// Validate required environment variables
export const validateEnv = (): void => {
  const requiredEnvs = ['JWT_SECRET', 'MONGO_URI'];
  
  for (const envVar of requiredEnvs) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Environment variable ${envVar} is not set.`);
    }
  }
};
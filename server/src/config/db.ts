import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://johnwesley8113:v9kmS6jnuLSks4IH@cluster0.gpsnyuz.mongodb.net/chat-app';
    
    const conn = await mongoose.connect(MONGO_URI);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred while connecting to MongoDB');
    }
    process.exit(1);
  }
};
import mongoose from 'mongoose';
import { MONGODB_URI } from "../config/env.js";
import Logger from '../utils/logger.js';

/**
 * Connect to MongoDB database with improved error handling and retry logic
 */
export const connectDB = async (retryAttempts = 5, initialDelayMs = 1000) => {
    let attempt = 0;
    let delay = initialDelayMs;
    
    // Configure mongoose settings
    mongoose.set('strictQuery', false);
    
    // Connection options
    const options = {
        // These options help with connection stability
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Use IPv4, avoid issues with IPv6
    };

    while (attempt < retryAttempts) {
        try {
            attempt++;
            
            Logger.info(`Connecting to MongoDB (attempt ${attempt}/${retryAttempts})...`);
            const conn = await mongoose.connect(MONGODB_URI, options);
            
            Logger.info(`MongoDB connected: ${conn.connection.host}`);
            
            // Set up connection event handlers
            mongoose.connection.on('error', (err) => {
                Logger.error('MongoDB connection error:', err);
            });
            
            mongoose.connection.on('disconnected', () => {
                Logger.warn('MongoDB disconnected');
            });
            
            // Graceful shutdown handling
            process.on('SIGINT', async () => {
                try {
                    await mongoose.connection.close();
                    Logger.info('MongoDB connection closed through app termination');
                    process.exit(0);
                } catch (err) {
                    Logger.error('Error during MongoDB disconnect:', err);
                    process.exit(1);
                }
            });
            
            return conn;
        } catch (error) {
            Logger.error(`MongoDB connection error (attempt ${attempt}/${retryAttempts}):`, error);
            
            if (attempt >= retryAttempts) {
                Logger.error('Failed to connect to MongoDB after multiple attempts');
                throw error; // Let the caller handle the final failure
            }
            
            // Exponential backoff with jitter for retries
            const jitter = Math.floor(Math.random() * 500);
            delay = Math.min(delay * 2, 30000) + jitter; // Cap at ~30 seconds
            
            Logger.info(`Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

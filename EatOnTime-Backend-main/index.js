import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { connectDB } from './database/mongodb.database.js';
import restaurantRoute from './routes/restaurant.routes.js';
import productRoute from './routes/product.routes.js';
import clientRoute from './routes/client.routes.js';
import orderRoute from './routes/order.routes.js';

import { PORT } from "./config/env.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import cookieParser from "cookie-parser";
import configureSecurityMiddleware from './config/security.js';
import errorMiddleware, { requestLogger } from './middleware/error.middleware.js';
import { ApiResponse } from './utils/ApiResponse.js';
import Logger from './utils/logger.js';

// Initialize environment variables
dotenv.config();

// Create Express application
const app = express();

// Basic middleware setup
app.use(express.json({ limit: '10kb' }));  // Limit JSON body size
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Security middleware setup
configureSecurityMiddleware(app, {
  corsOptions: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*'
  }
});

// Request logging middleware (in development)
app.use(requestLogger);

// Custom middleware
app.use(arcjetMiddleware);

// API routes
app.get('/', (req, res) => {
    res.json(ApiResponse.success('Welcome to EatOnTime API', { version: '1.0.0' }));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json(ApiResponse.success('Service is healthy', {
        uptime: Math.floor(process.uptime()),
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || 'development'
    }));
});

// Readiness check endpoint
app.get('/ready', async (req, res) => {
    try {
        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json(
                ApiResponse.error('Database not connected', 503, 'SERVICE_UNAVAILABLE')
            );
        }
        
        res.json(ApiResponse.success('Service is ready', {
            database: 'connected',
            services: {
                auth: 'ready',
                api: 'ready'
            }
        }));
    } catch (error) {
        res.status(503).json(
            ApiResponse.error('Service not ready', 503, 'SERVICE_UNAVAILABLE')
        );
    }
});

app.use('/api/v1/restaurants', restaurantRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/client', clientRoute);
app.use('/api/v1/orders', orderRoute);

// 404 Route Not Found handler
app.all('*', (req, res) => {
  res.status(404).json(
    ApiResponse.error(`Route not found: ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND')
  );
});

// Global error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
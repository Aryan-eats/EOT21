import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';

/**
 * Configures security middlewares for Express app
 * @param {Object} app - Express app instance
 * @param {Object} options - Configuration options
 */
const configureSecurityMiddleware = (app, options = {}) => {
  const {
    corsOptions = {},
    rateLimitOptions = {},
    helmetOptions = {},
    compressionOptions = {},
  } = options;

  // Set security HTTP headers using helmet
  app.use(helmet(helmetOptions));
  
  // CORS configuration
  const defaultCorsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Version'],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
  
  app.use(cors({
    ...defaultCorsOptions,
    ...corsOptions
  }));

  // Rate limiting - protect against brute force attacks
  const defaultRateLimitOptions = {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      errorCode: 'RATE_LIMIT_EXCEEDED'
    }
  };
  
  app.use('/api/', rateLimit({
    ...defaultRateLimitOptions,
    ...rateLimitOptions
  }));

  // Stricter rate limit for authentication routes
  app.use('/api/v1/client/login', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // 10 requests per hour
    message: {
      success: false,
      message: 'Too many login attempts, please try again after an hour.',
      errorCode: 'LOGIN_RATE_LIMIT_EXCEEDED'
    }
  }));
  
  app.use('/api/v1/restaurants/login', rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // 10 requests per hour
    message: {
      success: false,
      message: 'Too many login attempts, please try again after an hour.',
      errorCode: 'LOGIN_RATE_LIMIT_EXCEEDED'
    }
  }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: [
      'name', 'price', 'rating', 'category', 'cuisineType', 
      'page', 'limit', 'sort', 'fields'
    ]
  }));

  // Compress responses
  app.use(compression(compressionOptions));
};

export default configureSecurityMiddleware;

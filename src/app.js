require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const dbSelector = require('./middleware/dbSelector');
const { verifyApiKey } = require('./middleware/auth');

const app = express();
const upload = multer();

// Security & Performance
app.use(helmet({
  contentSecurityPolicy: false,  // Disable CSP for Swagger UI to work
}));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'token', 'domain', 'appname', 'lang', 'client_type', 'client-type', 'Cache-Control'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer for FormData
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload.none()(req, res, next);
  } else {
    next();
  }
});

// Static files
app.use('/uploads', express.static('uploads'));

// Swagger Documentation (before API key check)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global middleware
app.use(dbSelector);
// app.use(verifyApiKey); // Disabled for testing

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    dbName: req.dbName
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v16/users', require('./routes/users'));
app.use('/api/v16/users', require('./routes/farm'));
app.use('/api/v16/trade', require('./routes/trade'));
app.use('/api/v16/buyer', require('./routes/buyer'));
app.use('/api/v16/vendor', require('./routes/vendor'));
app.use('/api/v16/chat', require('./routes/chat'));
app.use('/api/v16/emeeting', require('./routes/emeeting'));
app.use('/api/v16/notification', require('./routes/notification'));
app.use('/api/v16/farmer', require('./routes/farmer'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: true,
    status: 404,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: true,
    status: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

module.exports = app;

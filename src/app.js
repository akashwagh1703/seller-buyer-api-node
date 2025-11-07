require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const dbSelector = require('./middleware/dbSelector');
const { verifyApiKey } = require('./middleware/auth');

const app = express();

// Security & Performance
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'token', 'domain', 'appname', 'lang']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Swagger Documentation (before API key check)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global middleware
app.use(dbSelector);
app.use('/api/v16/users/resend_otp', verifyApiKey);
// app.use('/api/v16/users/profile', verifyApiKey);
app.use('/api/v16/users/update_profile', verifyApiKey);
app.use('/api/v16/users/logout_check', verifyApiKey);
// Other endpoints don't need API key for testing

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
app.use('/api/v16/farm', require('./routes/farm'));
app.use('/api/v16/trade', require('./routes/trade'));
app.use('/api/v16/market', require('./routes/market'));
app.use('/api/v16/npk', require('./routes/npk'));
app.use('/api/v16/location', require('./routes/location'));
app.use('/api/v16/trading', require('./routes/trading'));
app.use('/api/v16/buyer', require('./routes/buyer'));
app.use('/api/v16/payment', require('./routes/payment'));
app.use('/api/v16/notification', require('./routes/notification'));

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

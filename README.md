# Nerace API - Node.js Migration

Node.js/Express migration of the Nerace API from CodeIgniter 3 with 100% parity.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### 3. Create Logs Directory
```bash
mkdir logs
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Run Tests
```bash
npm test
```

## Project Structure

```
nerace-api-node/
├── src/
│   ├── config/          # Database and app configuration
│   ├── middleware/      # Auth, DB selector, validation
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Database queries
│   ├── utils/           # Helper functions
│   ├── validators/      # Request validation schemas
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── tests/
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── uploads/            # File uploads
└── logs/              # Application logs
```

## Key Features

- ✅ Dynamic database selection (multi-tenant)
- ✅ JWT + API Key authentication
- ✅ Standardized response format
- ✅ Request logging with Winston
- ✅ CORS and security headers
- ✅ File upload support
- ✅ Environment-based configuration

## API Endpoints

See `inventory.json` for complete endpoint documentation.

## Testing

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- Coverage report: `npm test`

## Migration Status

Phase 1: Foundation Setup ✅ COMPLETE
- Project structure created
- Core middleware implemented
- Database configuration ready
- Authentication system ready
- Utilities and helpers ready

Next: Phase 2 - Users Module Migration

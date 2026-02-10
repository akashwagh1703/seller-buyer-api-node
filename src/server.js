const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`Healthcheck: http://localhost:${PORT}/health`);
});

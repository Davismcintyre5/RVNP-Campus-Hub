require('./scripts/dnsSet.js');

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const env = require('./config/env.js');
const prisma = require('./config/database.js');
const redis = require('./config/redis.js');
const logger = require('./utils/logger.js');
const routes = require('./routes/index.js');
const corsMiddleware = require('./middleware/global/cors.js');
const { rateLimiter } = require('./middleware/global/rateLimiter.js');
const requestLogger = require('./middleware/global/requestLogger.js');
const errorHandler = require('./middleware/global/errorHandler.js');
const notFound = require('./middleware/global/notFound.js');
const initSchedulers = require('./schedulers/index.js');
const initKeepAlive = require('./config/keepAlive.js');
const { initSocket } = require('./config/socket.js');

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(corsMiddleware);
app.use(requestLogger);
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = path.resolve(env.upload.local.path);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use('/uploads', express.static(uploadPath));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to RVNP Campus Hub API',
    app: 'RVNP Campus Hub',
    tagline: 'RVNP Connected',
    version: '1.0.0',
    environment: env.server.nodeEnv,
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'RVNP Campus Hub API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: env.server.nodeEnv,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'RVNP Campus Hub API is running',
    timestamp: new Date().toISOString(),
    environment: env.server.nodeEnv,
    url: env.server.apiUrl,
  });
});

app.use(routes);

app.use(notFound);
app.use(errorHandler);

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected successfully');
  } catch (error) {
    logger.error('PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDatabase();
  initSchedulers();

  server.listen(env.server.port, () => {
    logger.info(`Server running on ${env.server.apiUrl}`);
    logger.info(`Environment: ${env.server.nodeEnv}`);

    initKeepAlive();
  });
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      await prisma.$disconnect();
      logger.info('PostgreSQL disconnected.');
    } catch (error) {
      logger.error('Error disconnecting PostgreSQL:', error.message);
    }

    if (env.redis.enabled && redis) {
      try {
        await redis.quit();
        logger.info('Redis disconnected.');
      } catch (error) {
        logger.error('Error disconnecting Redis:', error.message);
      }
    }

    logger.info('Shutdown complete.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const prisma = require('../../config/database.js');
const redis = require('../../config/redis.js');
const env = require('../../config/env.js');

const checkHealth = asyncHandler(async (req, res) => {
  let databaseStatus = 'disconnected';
  let redisStatus = 'disabled';

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';
  } catch {
    databaseStatus = 'disconnected';
  }

  if (env.redis.enabled && redis) {
    try {
      await redis.ping();
      redisStatus = 'connected';
    } catch {
      redisStatus = 'disconnected';
    }
  }

  res.json(
    ApiResponse.ok({
      status: 'ok',
      message: 'RVNP Campus Hub API is running',
      timestamp: new Date().toISOString(),
      environment: env.server.nodeEnv,
      services: {
        database: databaseStatus,
        redis: redisStatus,
      },
    })
  );
});

module.exports = {
  checkHealth,
};
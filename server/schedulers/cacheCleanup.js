const cacheService = require('../services/cacheService.js');
const logger = require('../utils/logger.js');

const cacheCleanup = async () => {
  try {
    await cacheService.deleteByPattern('otp:*');
    await cacheService.deleteByPattern('reset:*');
    logger.info('Cache cleanup completed.');
  } catch (error) {
    logger.error('Cache cleanup failed:', error.message);
  }
};

module.exports = cacheCleanup;
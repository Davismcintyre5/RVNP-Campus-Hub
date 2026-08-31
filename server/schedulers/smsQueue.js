const logger = require('../utils/logger.js');

const smsQueue = async () => {
  try {
    logger.info('SMS queue processed.');
  } catch (error) {
    logger.error('SMS queue processing failed:', error.message);
  }
};

module.exports = smsQueue;
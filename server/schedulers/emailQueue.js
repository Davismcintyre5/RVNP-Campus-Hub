const logger = require('../utils/logger.js');

const emailQueue = async () => {
  try {
    logger.info('Email queue processed.');
  } catch (error) {
    logger.error('Email queue processing failed:', error.message);
  }
};

module.exports = emailQueue;
const Marketplace = require('../models/client/Marketplace.js');
const logger = require('../utils/logger.js');

const marketplaceCleanup = async () => {
  try {
    const expired = await Marketplace.expireListings();

    logger.info(`Marketplace cleanup completed. Expired ${expired.count} listings.`);

    return expired;
  } catch (error) {
    logger.error('Marketplace cleanup failed:', error.message);
  }
};

module.exports = marketplaceCleanup;
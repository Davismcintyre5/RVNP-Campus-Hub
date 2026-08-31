const Story = require('../models/client/Story.js');
const logger = require('../utils/logger.js');

const storyCleanup = async () => {
  try {
    const deleted = await Story.deleteExpired();
    logger.info(`Story cleanup completed. Deleted ${deleted.count} expired stories.`);
    return deleted;
  } catch (error) {
    logger.error('Story cleanup failed:', error.message);
  }
};

module.exports = storyCleanup;
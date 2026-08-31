const backupService = require('../services/backupService.js');
const logger = require('../utils/logger.js');

const backup = async () => {
  try {
    await backupService.backupDatabase();
    await backupService.cleanupOldBackups(7);
    logger.info('Backup completed successfully.');
  } catch (error) {
    logger.error('Backup failed:', error.message);
  }
};

module.exports = backup;
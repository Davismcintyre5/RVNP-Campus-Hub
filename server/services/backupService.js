const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const env = require('../config/env.js');
const logger = require('../utils/logger.js');
const dayjs = require('dayjs');

const backupDatabase = async () => {
  if (!env.backup.enabled) {
    logger.info('Backup is disabled');
    return null;
  }

  const timestamp = dayjs().format('YYYY-MM-DD-HH-mm-ss');
  const backupDir = path.resolve(env.backup.path);
  const backupFile = path.join(backupDir, `rvnp-backup-${timestamp}.sql`);

  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const databaseUrl = new URL(env.database.url);
    const dbName = databaseUrl.pathname.replace('/', '');
    const dbUser = databaseUrl.username;
    const dbPassword = databaseUrl.password;
    const dbHost = databaseUrl.hostname;
    const dbPort = databaseUrl.port || 5432;

    const command = `PGPASSWORD=${dbPassword} pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f "${backupFile}"`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('Database backup failed:', stderr);
          reject(error);
        } else {
          logger.info(`Database backup created: ${backupFile}`);
          resolve(backupFile);
        }
      });
    });
  } catch (error) {
    logger.error('Backup error:', error.message);
    throw error;
  }
};

const cleanupOldBackups = async (daysToKeep = 7) => {
  try {
    const backupDir = path.resolve(env.backup.path);

    if (!fs.existsSync(backupDir)) {
      return;
    }

    const files = fs.readdirSync(backupDir);
    const now = dayjs();

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now.diff(dayjs(stats.mtime), 'day');

      if (fileAge > daysToKeep) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Cleanup old backups error:', error.message);
  }
};

module.exports = {
  backupDatabase,
  cleanupOldBackups,
};
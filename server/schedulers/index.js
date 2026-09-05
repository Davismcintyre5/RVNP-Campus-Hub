require('../scripts/dnsSet.js');

const cron = require('node-cron');
const storyCleanup = require('./storyCleanup.js');
const backup = require('./backup.js');
const emailQueue = require('./emailQueue.js');
const smsQueue = require('./smsQueue.js');
const cacheCleanup = require('./cacheCleanup.js');
const marketplaceCleanup = require('./marketplaceCleanup.js');
const env = require('../config/env.js');
const logger = require('../utils/logger.js');

const initSchedulers = () => {
  logger.info('Initializing schedulers...');

  cron.schedule('0 * * * *', () => {
    logger.info('Running story cleanup...');
    storyCleanup();
  });

  cron.schedule('0 1 * * *', () => {
    logger.info('Running marketplace cleanup...');
    marketplaceCleanup();
  });

  cron.schedule(env.backup.schedule || '0 2 * * *', () => {
    logger.info('Running backup...');
    backup();
  });

  cron.schedule('*/5 * * * *', () => {
    logger.info('Running email queue...');
    emailQueue();
  });

  cron.schedule('*/5 * * * *', () => {
    logger.info('Running SMS queue...');
    smsQueue();
  });

  cron.schedule('0 3 * * *', () => {
    logger.info('Running cache cleanup...');
    cacheCleanup();
  });

  logger.info('Schedulers initialized successfully.');
};

module.exports = initSchedulers;
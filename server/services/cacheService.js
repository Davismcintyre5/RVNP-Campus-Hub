const redis = require('../config/redis.js');
const env = require('../config/env.js');
const logger = require('../utils/logger.js');

const setCache = async (key, value, expirySeconds = 300) => {
  try {
    if (!env.redis.enabled || !redis) return null;

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.set(key, stringValue, 'EX', expirySeconds);
    return true;
  } catch (error) {
    logger.error('Cache set error:', error.message);
    return null;
  }
};

const getCache = async (key) => {
  try {
    if (!env.redis.enabled || !redis) return null;

    const value = await redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.error('Cache get error:', error.message);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    if (!env.redis.enabled || !redis) return null;

    await redis.del(key);
    return true;
  } catch (error) {
    logger.error('Cache delete error:', error.message);
    return null;
  }
};

const deleteByPattern = async (pattern) => {
  try {
    if (!env.redis.enabled || !redis) return null;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Cache delete by pattern error:', error.message);
    return null;
  }
};

const clearAllCache = async () => {
  try {
    if (!env.redis.enabled || !redis) return null;

    await redis.flushall();
    return true;
  } catch (error) {
    logger.error('Cache clear all error:', error.message);
    return null;
  }
};

const getOrSetCache = async (key, callback, expirySeconds = 300) => {
  const cached = await getCache(key);
  if (cached) return cached;

  const freshData = await callback();
  await setCache(key, freshData, expirySeconds);
  return freshData;
};

module.exports = {
  setCache,
  getCache,
  deleteCache,
  deleteByPattern,
  clearAllCache,
  getOrSetCache,
};
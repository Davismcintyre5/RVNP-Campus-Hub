const redis = require('../config/redis.js');
const env = require('../config/env.js');
const logger = require('../utils/logger.js');

const memoryCache = new Map();

const setCache = async (key, value, expirySeconds = 300) => {
  try {
    if (env.redis.enabled && redis) {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await redis.set(key, stringValue, 'EX', expirySeconds);
      return true;
    }

    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + expirySeconds * 1000,
    });
    return true;
  } catch (error) {
    logger.error('Cache set error:', error.message);
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + expirySeconds * 1000,
    });
    return true;
  }
};

const getCache = async (key) => {
  try {
    if (env.redis.enabled && redis) {
      const value = await redis.get(key);
      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return item.value;
  } catch (error) {
    logger.error('Cache get error:', error.message);

    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return item.value;
  }
};

const deleteCache = async (key) => {
  try {
    if (env.redis.enabled && redis) {
      await redis.del(key);
      return true;
    }

    memoryCache.delete(key);
    return true;
  } catch (error) {
    memoryCache.delete(key);
    return true;
  }
};

const deleteByPattern = async (pattern) => {
  try {
    if (env.redis.enabled && redis) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
      }
      return true;
    }

    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
    return true;
  } catch (error) {
    logger.error('Cache delete by pattern error:', error.message);
    return null;
  }
};

const clearAllCache = async () => {
  try {
    if (env.redis.enabled && redis) {
      await redis.flushall();
      return true;
    }

    memoryCache.clear();
    return true;
  } catch (error) {
    memoryCache.clear();
    return true;
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
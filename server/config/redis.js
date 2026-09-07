const Redis = require('ioredis');
const env = require('./env.js');

let redis = null;

if (env.redis.enabled) {
  const redisUrl = new URL(env.redis.url);
  const useTls = redisUrl.protocol === 'rediss:';

  redis = new Redis({
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port) || 6379,
    password: redisUrl.password || undefined,
    username: redisUrl.username || undefined,
    tls: useTls ? {} : undefined,
    connectTimeout: 10000,
    retryStrategy: (times) => {
      if (times > 5) {
        console.error('Redis max retries reached, giving up');
        return null;
      }
      return Math.min(times * 2000, 10000);
    },
    maxRetriesPerRequest: 1,
  });

  redis.on('connect', () => {
    console.log('Redis connected');
  });

  redis.on('ready', () => {
    console.log('Redis ready');
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err.message);
  });
}

module.exports = redis;
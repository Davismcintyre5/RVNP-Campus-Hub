const Redis = require('ioredis');
const env = require('./env.js');

let redis = null;

if (env.redis.enabled) {
  redis = new Redis({
    host: env.redis.url.replace('redis://', '').split(':')[0],
    port: parseInt(env.redis.url.replace('redis://', '').split(':')[1]) || 6379,
    password: env.redis.password || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    console.log('Redis connected');
  });

  redis.on('error', (err) => {
    console.error('Redis error:', err.message);
  });
}

module.exports = redis;
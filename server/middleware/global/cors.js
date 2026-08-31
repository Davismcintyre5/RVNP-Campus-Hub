const cors = require('cors');
const env = require('../../config/env.js');

const corsMiddleware = cors({
  origin: env.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

module.exports = corsMiddleware;
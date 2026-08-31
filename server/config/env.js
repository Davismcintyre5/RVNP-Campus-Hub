const dotenv = require('dotenv');

dotenv.config();

const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

const env = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    apiUrl: API_URL,
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },

  upload: {
    provider: process.env.UPLOAD_PROVIDER || 'local',
    local: {
      path: process.env.LOCAL_UPLOAD_PATH || './uploads',
      url: `${API_URL}/uploads`,
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },

  sms: {
    provider: process.env.SMS_PROVIDER || 'hdm',
    hdm: {
      apiKey: process.env.HDM_API_KEY,
      apiUrl: process.env.HDM_API_URL,
      senderId: process.env.HDM_SMS_SENDER_ID,
    },
    brevo: {
      apiKey: process.env.BREVO_SMS_API_KEY,
      sender: process.env.BREVO_SMS_SENDER,
    },
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || 'hdm',
    hdm: {
      apiKey: process.env.HDM_API_KEY,
      apiUrl: process.env.HDM_API_URL,
      fromEmail: process.env.HDM_FROM_EMAIL,
      fromName: process.env.HDM_FROM_NAME,
    },
    brevo: {
      apiKey: process.env.BREVO_EMAIL_API_KEY,
      fromEmail: process.env.BREVO_EMAIL_FROM,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  clientUrls: {
    client: process.env.CLIENT_URL || 'http://localhost:3000',
    admin: process.env.ADMIN_URL || 'http://localhost:3001',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    uploadMax: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX) || 20,
  },

  otp: {
    length: parseInt(process.env.OTP_LENGTH) || 6,
    expiresIn: parseInt(process.env.OTP_EXPIRES_IN) || 600,
  },

  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    path: process.env.BACKUP_PATH || './backups',
  },
};

module.exports = env;
const dayjs = require('dayjs');

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const log = (level, message, meta = null) => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  if (meta) {
    if (level === levels.ERROR) {
      console.error(logMessage, meta);
    } else if (level === levels.WARN) {
      console.warn(logMessage, meta);
    } else {
      console.log(logMessage, meta);
    }
  } else {
    if (level === levels.ERROR) {
      console.error(logMessage);
    } else if (level === levels.WARN) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  }
};

const logger = {
  info: (message, meta = null) => log(levels.INFO, message, meta),
  warn: (message, meta = null) => log(levels.WARN, message, meta),
  error: (message, meta = null) => log(levels.ERROR, message, meta),
  debug: (message, meta = null) => {
    if (process.env.NODE_ENV === 'development') {
      log(levels.DEBUG, message, meta);
    }
  },
};

module.exports = logger;
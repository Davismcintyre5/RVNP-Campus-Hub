const ApiError = require('../../utils/ApiError.js');
const logger = require('../../utils/logger.js');
const env = require('../../config/env.js');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message);
  }

  logger.error(`${req.method} ${req.originalUrl} - ${error.message}`);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || null,
    stack: env.server.nodeEnv === 'development' ? error.stack : undefined,
  });
};

module.exports = errorHandler;
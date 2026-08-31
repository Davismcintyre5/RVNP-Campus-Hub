const ApiError = require('../../utils/ApiError.js');

const requireVerified = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw ApiError.unauthorized('Not authenticated');
    }

    if (user.verificationStatus !== 'VERIFIED') {
      throw ApiError.forbidden('Account not verified');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireVerified;
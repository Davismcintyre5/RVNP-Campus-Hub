const ApiError = require('../../utils/ApiError.js');

const selfOnly = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params[paramName] || req.body[paramName];

      if (!user) {
        throw ApiError.unauthorized('Not authenticated');
      }

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.id !== resourceId) {
        throw ApiError.forbidden('You can only modify your own data');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = selfOnly;
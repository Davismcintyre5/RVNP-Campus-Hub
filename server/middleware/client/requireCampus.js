const ApiError = require('../../utils/ApiError.js');

const requireCampus = (...allowedCampuses) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw ApiError.unauthorized('Not authenticated');
      }

      if (!user.campusId) {
        throw ApiError.forbidden('No campus assigned');
      }

      if (allowedCampuses.length > 0 && !allowedCampuses.includes(user.campusId)) {
        throw ApiError.forbidden('Campus access denied');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requireCampus;
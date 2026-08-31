const ApiError = require('../../utils/ApiError.js');
const { verifyAccessToken } = require('../../utils/auth.js');
const prisma = require('../../config/database.js');

const requireSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw ApiError.forbidden('Account suspended');
    }

    if (user.accountStatus === 'DELETED') {
      throw ApiError.unauthorized('Account deleted');
    }

    if (user.role !== 'SUPER_ADMIN') {
      throw ApiError.forbidden('Super admin access required');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireSuperAdmin;
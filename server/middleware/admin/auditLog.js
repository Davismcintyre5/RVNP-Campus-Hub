const prisma = require('../../config/database.js');

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || null;
};

const auditLog = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (user) {
        await prisma.auditLog.create({
          data: {
            adminId: user.id,
            action,
            details: {
              method: req.method,
              url: req.originalUrl,
              body: req.body,
              params: req.params,
              query: req.query,
            },
            ipAddress: getClientIp(req),
          },
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = auditLog;
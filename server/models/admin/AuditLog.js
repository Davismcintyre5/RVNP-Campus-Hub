const prisma = require('../../config/database.js');

const create = async (data) => {
  return prisma.auditLog.create({
    data,
  });
};

const findAll = async ({ page = 1, limit = 20, adminId = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (adminId) {
    where.adminId = adminId;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        details: true,
        ipAddress: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
};

const findByAdmin = async (adminId) => {
  return prisma.auditLog.findMany({
    where: { adminId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      action: true,
      details: true,
      ipAddress: true,
      createdAt: true,
      admin: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });
};

const deleteOldLogs = async (days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });
};

module.exports = {
  create,
  findAll,
  findByAdmin,
  deleteOldLogs,
};
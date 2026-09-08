const prisma = require('../../config/database.js');

const findAll = async ({ page = 1, limit = 10, status = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status) {
    where.status = status;
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            hdmVerified: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        reel: {
          select: {
            id: true,
            caption: true,
            videoUrl: true,
            createdAt: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, total };
};

const findById = async (id) => {
  return prisma.report.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
      post: true,
      reel: true,
      comment: true,
    },
  });
};

const updateStatus = async (id, status, reviewedBy) => {
  return prisma.report.update({
    where: { id },
    data: {
      status,
      reviewedBy,
      reviewedAt: new Date(),
    },
  });
};

const deleteReport = async (id) => {
  return prisma.report.delete({
    where: { id },
  });
};

module.exports = {
  findAll,
  findById,
  updateStatus,
  deleteReport,
};
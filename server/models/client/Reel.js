const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.reel.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          campus: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      campus: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          reactions: true,
        },
      },
    },
  });
};

const create = async (data) => {
  return prisma.reel.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

const update = async (id, data) => {
  return prisma.reel.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const getFeed = async ({ page = 1, limit = 10, campusId = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (campusId) {
    where.campusId = campusId;
  }

  const [reels, total] = await Promise.all([
    prisma.reel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            campus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    }),
    prisma.reel.count({ where }),
  ]);

  return { reels, total };
};

const findByUser = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    deletedAt: null,
  };

  const [reels, total] = await Promise.all([
    prisma.reel.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    }),
    prisma.reel.count({ where }),
  ]);

  return { reels, total };
};

const incrementView = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

const incrementLike = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
};

const decrementLike = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { likeCount: { decrement: 1 } },
  });
};

const incrementComment = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { commentCount: { increment: 1 } },
  });
};

const decrementComment = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: { commentCount: { decrement: 1 } },
  });
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  getFeed,
  findByUser,
  incrementView,
  incrementLike,
  decrementLike,
  incrementComment,
  decrementComment,
};
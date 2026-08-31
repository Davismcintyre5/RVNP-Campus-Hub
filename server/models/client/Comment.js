const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.comment.findUnique({
    where: { id },
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

const create = async (data) => {
  return prisma.comment.create({
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
  return prisma.comment.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const findByPost = async (postId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    postId,
    deletedAt: null,
    parentId: null,
  };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
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
          },
        },
        replies: {
          take: 5,
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            replies: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { comments, total };
};

const findByReel = async (reelId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    reelId,
    deletedAt: null,
    parentId: null,
  };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
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
          },
        },
        replies: {
          take: 5,
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            replies: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { comments, total };
};

const getReplies = async (parentId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const where = {
    parentId,
    deletedAt: null,
  };

  const [replies, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { replies, total };
};

const incrementLike = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
};

const decrementLike = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: { likeCount: { decrement: 1 } },
  });
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findByPost,
  findByReel,
  getReplies,
  incrementLike,
  decrementLike,
};
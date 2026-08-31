const prisma = require('../../config/database.js');

const findAllPosts = async ({ page = 1, limit = 20, status = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status === 'deleted') {
    where.deletedAt = { not: null };
  } else if (status === 'active') {
    where.deletedAt = null;
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

const findAllReels = async ({ page = 1, limit = 20, status = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status === 'deleted') {
    where.deletedAt = { not: null };
  } else if (status === 'active') {
    where.deletedAt = null;
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
            email: true,
          },
        },
      },
    }),
    prisma.reel.count({ where }),
  ]);

  return { reels, total };
};

const findAllComments = async ({ page = 1, limit = 20, status = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status === 'deleted') {
    where.deletedAt = { not: null };
  } else if (status === 'active') {
    where.deletedAt = null;
  }

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
            email: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { comments, total };
};

const softDeletePost = async (id) => {
  return prisma.post.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

const softDeleteReel = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

const softDeleteComment = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

const restorePost = async (id) => {
  return prisma.post.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

const restoreReel = async (id) => {
  return prisma.reel.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

const restoreComment = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
};

module.exports = {
  findAllPosts,
  findAllReels,
  findAllComments,
  softDeletePost,
  softDeleteReel,
  softDeleteComment,
  restorePost,
  restoreReel,
  restoreComment,
};
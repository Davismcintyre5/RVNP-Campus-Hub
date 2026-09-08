const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
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
      sharedFrom: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              hdmVerified: true,
            },
          },
        },
      },
      comments: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              hdmVerified: true,
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
  });
};

const create = async (data) => {
  return prisma.post.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
    },
  });
};

const createShare = async (postId, userId, content = null) => {
  const originalPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { content: true, privacy: true },
  });

  if (!originalPost) return null;

  return prisma.post.create({
    data: {
      userId,
      content: content || { text: '' },
      privacy: originalPost.privacy,
      sharedFromId: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
      sharedFrom: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              hdmVerified: true,
            },
          },
        },
      },
    },
  });
};

const update = async (id, data) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const findByUser = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    deletedAt: null,
  };

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
            avatarUrl: true,
            hdmVerified: true,
          },
        },
        sharedFrom: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                hdmVerified: true,
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
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

const findByCampus = async (campusId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    campusId,
    deletedAt: null,
  };

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
            avatarUrl: true,
            hdmVerified: true,
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
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

const incrementLike = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
};

const decrementLike = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { likeCount: { decrement: 1 } },
  });
};

const incrementComment = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { commentCount: { increment: 1 } },
  });
};

const decrementComment = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { commentCount: { decrement: 1 } },
  });
};

const incrementShare = async (id) => {
  return prisma.post.update({
    where: { id },
    data: { shareCount: { increment: 1 } },
  });
};

module.exports = {
  findById,
  create,
  createShare,
  update,
  softDelete,
  findByUser,
  findByCampus,
  incrementLike,
  decrementLike,
  incrementComment,
  decrementComment,
  incrementShare,
};
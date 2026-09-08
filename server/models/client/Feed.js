const prisma = require('../../config/database.js');

const getFeed = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      campusId: true,
      following: {
        select: {
          followingId: true,
        },
      },
    },
  });

  const followingIds = user.following.map((f) => f.followingId);
  followingIds.push(userId);

  const where = {
    deletedAt: null,
    OR: [
      { userId: { in: followingIds } },
      { campusId: user.campusId },
      { privacy: 'PUBLIC' },
    ],
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
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

const getCampusFeed = async (campusId, { page = 1, limit = 20 }) => {
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

module.exports = {
  getFeed,
  getCampusFeed,
};
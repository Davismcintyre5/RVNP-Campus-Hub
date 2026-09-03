const prisma = require('../../config/database.js');

const follow = async (followerId, followingId) => {
  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
};

const unfollow = async (followerId, followingId) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

const isFollowing = async (followerId, followingId) => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return !!follow;
};

const getFollowers = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = { followingId: userId };

  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hdmVerified: true,
            course: true,
            campus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({ where }),
  ]);

  return { followers, total };
};

const getFollowing = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = { followerId: userId };

  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        following: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hdmVerified: true,
            course: true,
            campus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({ where }),
  ]);

  return { following, total };
};

const getFollowerCount = async (userId) => {
  return prisma.follow.count({
    where: { followingId: userId },
  });
};

const getFollowingCount = async (userId) => {
  return prisma.follow.count({
    where: { followerId: userId },
  });
};

module.exports = {
  follow,
  unfollow,
  isFollowing,
  getFollowers,
  getFollowing,
  getFollowerCount,
  getFollowingCount,
};
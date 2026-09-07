const prisma = require('../../config/database.js');

const getTopContributors = async ({ period = 'all', limit = 10 }) => {
  const where = {};

  if (period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    where.createdAt = { gte: weekAgo };
  }

  if (period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    where.createdAt = { gte: monthAgo };
  }

  const users = await prisma.user.findMany({
    take: limit,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      hdmVerified: true,
      _count: {
        select: {
          posts: true,
          reels: true,
          comments: true,
          reactions: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    contributionScore:
      (user._count.posts * 4) +
      (user._count.reels * 3) +
      (user._count.comments * 2) +
      (user._count.reactions * 1),
  }));
};

const getTopFans = async ({ limit = 10 }) => {
  const users = await prisma.user.findMany({
    take: limit,
    orderBy: {
      reactions: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      hdmVerified: true,
      _count: {
        select: {
          reactions: true,
          comments: true,
          sentMessages: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    fanScore:
      (user._count.reactions * 3) +
      (user._count.comments * 2) +
      (user._count.sentMessages * 1),
  }));
};

module.exports = {
  getTopContributors,
  getTopFans,
};
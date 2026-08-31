const prisma = require('../../config/database.js');

const getUserGrowth = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const grouped = {};
  users.forEach((user) => {
    const date = user.createdAt.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

const getPostGrowth = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const grouped = {};
  posts.forEach((post) => {
    const date = post.createdAt.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

const getEngagementStats = async () => {
  const [totalLikes, totalComments, totalShares, totalViews] = await Promise.all([
    prisma.reaction.count(),
    prisma.comment.count(),
    prisma.post.aggregate({ _sum: { shareCount: true } }),
    prisma.reel.aggregate({ _sum: { viewCount: true } }),
  ]);

  return {
    totalLikes,
    totalComments,
    totalShares: totalShares._sum.shareCount || 0,
    totalReelViews: totalViews._sum.viewCount || 0,
  };
};

const getMostActiveUsers = async (limit = 10) => {
  return prisma.user.findMany({
    take: limit,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      _count: {
        select: {
          posts: true,
          reels: true,
          followers: true,
        },
      },
    },
  });
};

const getMostPopularPosts = async (limit = 10) => {
  return prisma.post.findMany({
    take: limit,
    orderBy: {
      likeCount: 'desc',
    },
    select: {
      id: true,
      content: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
};

module.exports = {
  getUserGrowth,
  getPostGrowth,
  getEngagementStats,
  getMostActiveUsers,
  getMostPopularPosts,
};
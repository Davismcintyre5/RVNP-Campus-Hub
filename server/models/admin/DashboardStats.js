const prisma = require('../../config/database.js');

const getTotalUsers = async () => {
  return prisma.user.count();
};

const getTotalPosts = async () => {
  return prisma.post.count();
};

const getTotalReels = async () => {
  return prisma.reel.count();
};

const getTotalGroups = async () => {
  return prisma.group.count();
};

const getTotalEvents = async () => {
  return prisma.event.count();
};

const getTotalListings = async () => {
  return prisma.marketplaceListing.count();
};

const getActiveUsers = async () => {
  return prisma.user.count({
    where: {
      accountStatus: 'ACTIVE',
    },
  });
};

const getSuspendedUsers = async () => {
  return prisma.user.count({
    where: {
      accountStatus: 'SUSPENDED',
    },
  });
};

const getPendingReports = async () => {
  return prisma.report.count({
    where: {
      status: 'PENDING',
    },
  });
};

const getUsersByCampus = async () => {
  return prisma.user.groupBy({
    by: ['campusId'],
    _count: {
      id: true,
    },
  });
};

const getPostsByCampus = async () => {
  return prisma.post.groupBy({
    by: ['campusId'],
    _count: {
      id: true,
    },
  });
};

const getNewUsersToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.user.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
};

const getNewPostsToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.post.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
};

const getFullStats = async () => {
  const [
    totalUsers,
    totalPosts,
    totalReels,
    totalGroups,
    totalEvents,
    totalListings,
    activeUsers,
    suspendedUsers,
    pendingReports,
    newUsersToday,
    newPostsToday,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalPosts(),
    getTotalReels(),
    getTotalGroups(),
    getTotalEvents(),
    getTotalListings(),
    getActiveUsers(),
    getSuspendedUsers(),
    getPendingReports(),
    getNewUsersToday(),
    getNewPostsToday(),
  ]);

  return {
    totalUsers,
    totalPosts,
    totalReels,
    totalGroups,
    totalEvents,
    totalListings,
    activeUsers,
    suspendedUsers,
    pendingReports,
    newUsersToday,
    newPostsToday,
  };
};

module.exports = {
  getTotalUsers,
  getTotalPosts,
  getTotalReels,
  getTotalGroups,
  getTotalEvents,
  getTotalListings,
  getActiveUsers,
  getSuspendedUsers,
  getPendingReports,
  getUsersByCampus,
  getPostsByCampus,
  getNewUsersToday,
  getNewPostsToday,
  getFullStats,
};
const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.story.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      campus: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const create = async (data) => {
  return prisma.story.create({
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

const softDelete = async (id) => {
  return prisma.story.delete({
    where: { id },
  });
};

const getActiveStories = async ({ campusId = null, userId = null }) => {
  const now = new Date();

  const where = {
    expiresAt: {
      gt: now,
    },
  };

  if (campusId) where.campusId = campusId;
  if (userId) where.userId = userId;

  const stories = await prisma.story.findMany({
    where,
    orderBy: { createdAt: 'desc' },
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

  const grouped = {};
  stories.forEach((story) => {
    if (!grouped[story.userId]) {
      grouped[story.userId] = {
        user: story.user,
        stories: [],
      };
    }
    grouped[story.userId].stories.push(story);
  });

  return Object.values(grouped);
};

const getExpiredStories = async () => {
  const now = new Date();

  return prisma.story.findMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
};

const deleteExpired = async () => {
  const now = new Date();

  return prisma.story.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
};

const incrementView = async (id) => {
  return prisma.story.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
};

module.exports = {
  findById,
  create,
  softDelete,
  getActiveStories,
  getExpiredStories,
  deleteExpired,
  incrementView,
};
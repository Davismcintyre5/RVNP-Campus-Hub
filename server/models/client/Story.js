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
      views: {
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
      reactions: {
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
    },
  });
};

const create = async (data) => {
  return prisma.story.create({
    data,
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
      views: true,
      reactions: true,
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

const addView = async (storyId, userId) => {
  return prisma.storyView.upsert({
    where: {
      storyId_userId: {
        storyId,
        userId,
      },
    },
    update: {},
    create: {
      storyId,
      userId,
    },
  });
};

const getViewers = async (storyId) => {
  return prisma.storyView.findMany({
    where: { storyId },
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
    orderBy: { createdAt: 'desc' },
  });
};

const addReaction = async (storyId, userId, type = 'LIKE') => {
  return prisma.storyReaction.upsert({
    where: {
      storyId_userId: {
        storyId,
        userId,
      },
    },
    update: { type },
    create: {
      storyId,
      userId,
      type,
    },
  });
};

const removeReaction = async (storyId, userId) => {
  return prisma.storyReaction.delete({
    where: {
      storyId_userId: {
        storyId,
        userId,
      },
    },
  });
};

const getReactions = async (storyId) => {
  return prisma.storyReaction.findMany({
    where: { storyId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
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
  addView,
  getViewers,
  addReaction,
  removeReaction,
  getReactions,
  incrementView,
};
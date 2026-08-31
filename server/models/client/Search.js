const prisma = require('../../config/database.js');

const searchUsers = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { fullName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { course: { contains: query, mode: 'insensitive' } },
    ],
    accountStatus: 'ACTIVE',
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const searchPosts = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        deletedAt: null,
        content: {
          path: ['text'],
          string_contains: query,
        },
      },
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
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    }),
    prisma.post.count({
      where: {
        deletedAt: null,
        content: {
          path: ['text'],
          string_contains: query,
        },
      },
    }),
  ]);

  return { posts, total };
};

const searchReels = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    caption: {
      contains: query,
      mode: 'insensitive',
    },
  };

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
            avatarUrl: true,
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
    prisma.reel.count({ where }),
  ]);

  return { reels, total };
};

const searchGroups = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where,
      skip,
      take: limit,
      orderBy: { memberCount: 'desc' },
      include: {
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
};

const searchEvents = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startTime: 'asc' },
      include: {
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
};

const searchMarketplace = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    status: 'ACTIVE',
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
  };

  const [listings, total] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.marketplaceListing.count({ where }),
  ]);

  return { listings, total };
};

const searchAll = async (query, { page = 1, limit = 10 }) => {
  const [users, posts, reels, groups, events, listings] = await Promise.all([
    searchUsers(query, { page, limit }),
    searchPosts(query, { page, limit }),
    searchReels(query, { page, limit }),
    searchGroups(query, { page, limit }),
    searchEvents(query, { page, limit }),
    searchMarketplace(query, { page, limit }),
  ]);

  return {
    users: users.users,
    posts: posts.posts,
    reels: reels.reels,
    groups: groups.groups,
    events: events.events,
    listings: listings.listings,
  };
};

module.exports = {
  searchUsers,
  searchPosts,
  searchReels,
  searchGroups,
  searchEvents,
  searchMarketplace,
  searchAll,
};
const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.group.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
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
          members: true,
          posts: true,
        },
      },
    },
  });
};

const create = async (data) => {
  return prisma.group.create({
    data,
  });
};

const update = async (id, data) => {
  return prisma.group.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.group.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const findAll = async ({ page = 1, limit = 20, campusId = null, search = null, category = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (campusId) where.campusId = campusId;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where,
      skip,
      take: limit,
      orderBy: { memberCount: 'desc' },
      include: {
        creator: {
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
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
};

const findByUser = async (userId) => {
  return prisma.group.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
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
          posts: true,
        },
      },
    },
  });
};

const getMembers = async (groupId, { page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;

  const where = { groupId };

  const [members, total] = await Promise.all([
    prisma.groupMember.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
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
    prisma.groupMember.count({ where }),
  ]);

  return { members, total };
};

const addMember = async (groupId, userId, role = 'MEMBER') => {
  return prisma.groupMember.create({
    data: {
      groupId,
      userId,
      role,
    },
  });
};

const removeMember = async (groupId, userId) => {
  return prisma.groupMember.delete({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });
};

const isMember = async (groupId, userId) => {
  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  return !!member;
};

const getMemberRole = async (groupId, userId) => {
  const member = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
    select: { role: true },
  });

  return member?.role || null;
};

const incrementMemberCount = async (id) => {
  return prisma.group.update({
    where: { id },
    data: { memberCount: { increment: 1 } },
  });
};

const decrementMemberCount = async (id) => {
  return prisma.group.update({
    where: { id },
    data: { memberCount: { decrement: 1 } },
  });
};

const createGroupPost = async (groupId, userId, content) => {
  const post = await prisma.groupPost.create({
    data: {
      groupId,
      userId,
      content,
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
    },
  });

  await prisma.group.update({
    where: { id: groupId },
    data: { postCount: { increment: 1 } },
  });

  return post;
};

const getGroupPosts = async (groupId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    groupId,
    deletedAt: null,
  };

  const [posts, total] = await Promise.all([
    prisma.groupPost.findMany({
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
          },
        },
      },
    }),
    prisma.groupPost.count({ where }),
  ]);

  return { posts, total };
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findAll,
  findByUser,
  getMembers,
  addMember,
  removeMember,
  isMember,
  getMemberRole,
  incrementMemberCount,
  decrementMemberCount,
  createGroupPost,
  getGroupPosts,
};
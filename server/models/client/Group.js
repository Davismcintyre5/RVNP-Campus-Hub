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

const findAll = async ({ page = 1, limit = 20, campusId = null, search = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (campusId) where.campusId = campusId;
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
          },
        },
      },
    }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
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

const addMember = async (groupId, userId) => {
  return prisma.groupMember.create({
    data: {
      groupId,
      userId,
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

const updateMemberRole = async (groupId, userId, role) => {
  return prisma.groupMember.update({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
    data: { role },
  });
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
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findAll,
  getMembers,
  addMember,
  removeMember,
  updateMemberRole,
  incrementMemberCount,
  decrementMemberCount,
  findByUser,
};
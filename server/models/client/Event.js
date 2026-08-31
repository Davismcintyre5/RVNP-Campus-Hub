const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.event.findUnique({
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
    },
  });
};

const create = async (data) => {
  return prisma.event.create({
    data,
    include: {
      creator: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

const update = async (id, data) => {
  return prisma.event.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.event.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
};

const findAll = async ({ page = 1, limit = 20, campusId = null, status = null }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (campusId) where.campusId = campusId;
  if (status) where.status = status;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startTime: 'asc' },
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
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
};

const getUpcoming = async ({ campusId = null, limit = 10 }) => {
  const now = new Date();

  const where = {
    startTime: {
      gte: now,
    },
    status: 'UPCOMING',
  };

  if (campusId) where.campusId = campusId;

  return prisma.event.findMany({
    where,
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
  });
};

const getOngoing = async ({ campusId = null }) => {
  const now = new Date();

  const where = {
    startTime: {
      lte: now,
    },
    endTime: {
      gte: now,
    },
  };

  if (campusId) where.campusId = campusId;

  return prisma.event.findMany({
    where,
    orderBy: { startTime: 'asc' },
  });
};

const getCompleted = async ({ page = 1, limit = 20, campusId = null }) => {
  const skip = (page - 1) * limit;
  const now = new Date();

  const where = {
    endTime: {
      lt: now,
    },
  };

  if (campusId) where.campusId = campusId;

  return prisma.event.findMany({
    where,
    skip,
    take: limit,
    orderBy: { endTime: 'desc' },
  });
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findAll,
  getUpcoming,
  getOngoing,
  getCompleted,
};
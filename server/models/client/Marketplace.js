const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          phoneNumber: true,
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
  return prisma.marketplaceListing.create({
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

const update = async (id, data) => {
  return prisma.marketplaceListing.update({
    where: { id },
    data,
  });
};

const softDelete = async (id) => {
  return prisma.marketplaceListing.update({
    where: { id },
    data: { status: 'REMOVED' },
  });
};

const findAll = async ({ page = 1, limit = 20, campusId = null, category = null, search = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    status: 'ACTIVE',
  };

  if (campusId) where.campusId = campusId;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [listings, total] = await Promise.all([
    prisma.marketplaceListing.findMany({
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
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.marketplaceListing.count({ where }),
  ]);

  return { listings, total };
};

const findByUser = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    status: 'ACTIVE',
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

const markAsSold = async (id) => {
  return prisma.marketplaceListing.update({
    where: { id },
    data: { status: 'SOLD' },
  });
};

const getCategories = async () => {
  const listings = await prisma.marketplaceListing.findMany({
    where: { status: 'ACTIVE' },
    select: { category: true },
    distinct: ['category'],
  });

  return listings.map((l) => l.category);
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findAll,
  findByUser,
  markAsSold,
  getCategories,
};
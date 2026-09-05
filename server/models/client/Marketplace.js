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
          hdmVerified: true,
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

const findAll = async ({
  page = 1,
  limit = 20,
  campusId = null,
  category = null,
  search = null,
  status = 'ACTIVE',
  minPrice = null,
  maxPrice = null,
}) => {
  const skip = (page - 1) * limit;

  const where = {
    status,
  };

  if (campusId) where.campusId = campusId;
  if (category) where.category = category;
  if (minPrice !== null) where.price = { ...(where.price || {}), gte: minPrice };
  if (maxPrice !== null) where.price = { ...(where.price || {}), lte: maxPrice };
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
            hdmVerified: true,
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

const findByUser = async (userId, { page = 1, limit = 20, status = null }) => {
  const skip = (page - 1) * limit;

  const where = { userId };
  if (status) where.status = status;

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

const markAsActive = async (id) => {
  return prisma.marketplaceListing.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });
};

const addOffer = async (id, userId, amount, message = null) => {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { offers: true },
  });

  const currentOffers = listing?.offers || [];
  const newOffer = {
    id: Date.now().toString(),
    userId,
    amount,
    message,
    createdAt: new Date().toISOString(),
  };

  currentOffers.push(newOffer);

  return prisma.marketplaceListing.update({
    where: { id },
    data: { offers: currentOffers },
  });
};

const getOffers = async (id) => {
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { offers: true },
  });

  return listing?.offers || [];
};

const getCategories = async () => {
  const listings = await prisma.marketplaceListing.findMany({
    where: { status: 'ACTIVE' },
    select: { category: true },
    distinct: ['category'],
  });

  return listings.map((l) => l.category);
};

const getExpiredListings = async () => {
  const now = new Date();

  return prisma.marketplaceListing.findMany({
    where: {
      expiresAt: {
        lt: now,
      },
      status: 'ACTIVE',
    },
  });
};

const expireListings = async () => {
  const now = new Date();

  return prisma.marketplaceListing.updateMany({
    where: {
      expiresAt: {
        lt: now,
      },
      status: 'ACTIVE',
    },
    data: { status: 'REMOVED' },
  });
};

module.exports = {
  findById,
  create,
  update,
  softDelete,
  findAll,
  findByUser,
  markAsSold,
  markAsActive,
  addOffer,
  getOffers,
  getCategories,
  getExpiredListings,
  expireListings,
};
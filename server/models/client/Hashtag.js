const prisma = require('../../config/database.js');

const findByName = async (name) => {
  return prisma.hashtag.findUnique({
    where: { name: name.toLowerCase() },
  });
};

const create = async (name) => {
  return prisma.hashtag.create({
    data: { name: name.toLowerCase() },
  });
};

const upsert = async (name) => {
  return prisma.hashtag.upsert({
    where: { name: name.toLowerCase() },
    update: { postCount: { increment: 1 } },
    create: { name: name.toLowerCase(), postCount: 1 },
  });
};

const incrementPostCount = async (name) => {
  return prisma.hashtag.update({
    where: { name: name.toLowerCase() },
    data: { postCount: { increment: 1 } },
  });
};

const decrementPostCount = async (name) => {
  return prisma.hashtag.update({
    where: { name: name.toLowerCase() },
    data: { postCount: { decrement: 1 } },
  });
};

const getTrending = async (limit = 10) => {
  return prisma.hashtag.findMany({
    take: limit,
    orderBy: { postCount: 'desc' },
  });
};

const getAll = async ({ page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;

  const [hashtags, total] = await Promise.all([
    prisma.hashtag.findMany({
      skip,
      take: limit,
      orderBy: { postCount: 'desc' },
    }),
    prisma.hashtag.count(),
  ]);

  return { hashtags, total };
};

module.exports = {
  findByName,
  create,
  upsert,
  incrementPostCount,
  decrementPostCount,
  getTrending,
  getAll,
};
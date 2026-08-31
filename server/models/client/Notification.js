const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.notification.findUnique({
    where: { id },
  });
};

const create = async (data) => {
  return prisma.notification.create({
    data,
  });
};

const findByUser = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const skip = (page - 1) * limit;

  const where = { userId };
  if (unreadOnly) where.read = false;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total };
};

const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  });
};

const markAsRead = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};

const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: { read: true },
  });
};

const remove = async (id) => {
  return prisma.notification.delete({
    where: { id },
  });
};

const removeAll = async (userId) => {
  return prisma.notification.deleteMany({
    where: { userId },
  });
};

module.exports = {
  findById,
  create,
  findByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  remove,
  removeAll,
};
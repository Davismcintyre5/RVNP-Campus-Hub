const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.message.findUnique({
    where: { id },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
      recipient: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
    },
  });
};

const create = async (data) => {
  return prisma.message.create({
    data,
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          hdmVerified: true,
        },
      },
    },
  });
};

const findByConversation = async (conversationId, { page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;

  const where = {
    conversationId,
    deletedAt: null,
  };

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hdmVerified: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return { messages: messages.reverse(), total };
};

const markAsRead = async (conversationId, userId) => {
  return prisma.message.updateMany({
    where: {
      conversationId,
      recipientId: userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
};

const markAsDelivered = async (conversationId, userId) => {
  return prisma.message.updateMany({
    where: {
      conversationId,
      recipientId: userId,
      deliveredAt: null,
    },
    data: {
      deliveredAt: new Date(),
    },
  });
};

const softDelete = async (id) => {
  return prisma.message.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const getUnreadCount = async (userId) => {
  return prisma.message.count({
    where: {
      recipientId: userId,
      readAt: null,
      deletedAt: null,
      senderId: { not: userId },
    },
  });
};

module.exports = {
  findById,
  create,
  findByConversation,
  markAsRead,
  markAsDelivered,
  softDelete,
  getUnreadCount,
};
const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: {
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
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

const create = async (data) => {
  return prisma.conversation.create({
    data,
  });
};

const findDirectConversation = async (user1Id, user2Id) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      type: 'DIRECT',
      participants: {
        every: {
          userId: {
            in: [user1Id, user2Id],
          },
        },
      },
    },
    include: {
      participants: true,
    },
  });

  return conversations.find(
    (conv) =>
      conv.participants.length === 2 &&
      conv.participants.some((p) => p.userId === user1Id) &&
      conv.participants.some((p) => p.userId === user2Id)
  );
};

const findByUser = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    skip,
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      participants: {
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
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
      group: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const total = await prisma.conversation.count({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
  });

  return { conversations, total };
};

const addParticipant = async (conversationId, userId) => {
  return prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId,
    },
  });
};

const updateLastMessage = async (conversationId, messageId) => {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageId: messageId,
    },
  });
};

module.exports = {
  findById,
  create,
  findDirectConversation,
  findByUser,
  addParticipant,
  updateLastMessage,
};
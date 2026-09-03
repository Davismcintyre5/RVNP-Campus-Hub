const prisma = require('../../config/database.js');

const create = async (data) => {
  return prisma.reaction.create({
    data,
  });
};

const findExisting = async (userId, postId = null, reelId = null, commentId = null) => {
  const where = { userId };

  if (postId) where.postId = postId;
  if (reelId) where.reelId = reelId;
  if (commentId) where.commentId = commentId;

  return prisma.reaction.findFirst({ where });
};

const remove = async (id) => {
  return prisma.reaction.delete({
    where: { id },
  });
};

const findByPost = async (postId) => {
  return prisma.reaction.findMany({
    where: { postId },
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
    orderBy: { createdAt: 'desc' },
  });
};

const findByReel = async (reelId) => {
  return prisma.reaction.findMany({
    where: { reelId },
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
    orderBy: { createdAt: 'desc' },
  });
};

const findByComment = async (commentId) => {
  return prisma.reaction.findMany({
    where: { commentId },
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
    orderBy: { createdAt: 'desc' },
  });
};

const getReactionSummary = async (postId = null, reelId = null, commentId = null, currentUserId = null) => {
  const where = {};

  if (postId) where.postId = postId;
  if (reelId) where.reelId = reelId;
  if (commentId) where.commentId = commentId;

  const reactions = await prisma.reaction.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (reactions.length === 0) {
    return {
      total: 0,
      types: {},
      topEmojis: [],
      topReactors: [],
      hasYou: false,
      displayText: '',
    };
  }

  const EMOJI_MAP = {
    LIKE: '👍',
    LOVE: '❤️',
    CARE: '🤗',
    HAHA: '😂',
    WOW: '😮',
    SAD: '😢',
    ANGRY: '😡',
  };

  const typeCounts = {};
  reactions.forEach((reaction) => {
    typeCounts[reaction.type] = (typeCounts[reaction.type] || 0) + 1;
  });

  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const topEmojis = sortedTypes.slice(0, 2).map(([type]) => EMOJI_MAP[type] || '👍');

  const hasYou = reactions.some((r) => r.userId === currentUserId);

  const otherReactors = reactions.filter((r) => r.userId !== currentUserId);
  const topReactors = otherReactors.slice(0, 2).map((r) => ({
    id: r.userId,
    name: r.user?.fullName || 'Unknown',
    type: r.type,
  }));

  const total = reactions.length;
  const othersCount = total - (hasYou ? 1 : 0) - Math.min(topReactors.length, 2);

  let displayText = '';

  if (hasYou && topReactors.length === 0) {
    displayText = 'You reacted';
  } else if (hasYou && topReactors.length === 1) {
    displayText = `You and ${topReactors[0].name}`;
  } else if (hasYou && topReactors.length === 2) {
    displayText = `You, ${topReactors[0].name}, and ${othersCount + 1} other${othersCount + 1 > 1 ? 's' : ''}`;
  } else if (!hasYou && topReactors.length === 1) {
    displayText = topReactors[0].name;
  } else if (!hasYou && topReactors.length === 2) {
    displayText = `${topReactors[0].name}, ${topReactors[1].name}, and ${othersCount} other${othersCount > 1 ? 's' : ''}`;
  }

  return {
    total,
    types: typeCounts,
    topEmojis,
    topReactors,
    hasYou,
    displayText,
    othersCount,
  };
};

const countByPost = async (postId) => {
  return prisma.reaction.count({ where: { postId } });
};

const countByReel = async (reelId) => {
  return prisma.reaction.count({ where: { reelId } });
};

module.exports = {
  create,
  findExisting,
  remove,
  findByPost,
  findByReel,
  findByComment,
  getReactionSummary,
  countByPost,
  countByReel,
};
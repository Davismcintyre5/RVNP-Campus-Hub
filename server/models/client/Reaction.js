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
        },
      },
    },
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
        },
      },
    },
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
        },
      },
    },
  });
};

const countByPost = async (postId) => {
  return prisma.reaction.count({
    where: { postId },
  });
};

const countByReel = async (reelId) => {
  return prisma.reaction.count({
    where: { reelId },
  });
};

module.exports = {
  create,
  findExisting,
  remove,
  findByPost,
  findByReel,
  findByComment,
  countByPost,
  countByReel,
};
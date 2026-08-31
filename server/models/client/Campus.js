const prisma = require('../../config/database.js');

const findAll = async () => {
  return prisma.campus.findMany({
    include: {
      _count: {
        select: {
          users: true,
          posts: true,
          reels: true,
          groups: true,
          events: true,
        },
      },
    },
  });
};

const findById = async (id) => {
  return prisma.campus.findUnique({
    where: { id },
    include: {
      departments: true,
      _count: {
        select: {
          users: true,
          posts: true,
          reels: true,
          groups: true,
          events: true,
        },
      },
    },
  });
};

const getUsers = async (campusId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    campusId,
    accountStatus: 'ACTIVE',
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        course: true,
        yearOfStudy: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const getDepartments = async (campusId) => {
  return prisma.department.findMany({
    where: { campusId },
  });
};

module.exports = {
  findAll,
  findById,
  getUsers,
  getDepartments,
};
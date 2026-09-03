const prisma = require('../../config/database.js');

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      avatarUrl: true,
      coverUrl: true,
      bio: true,
      role: true,
      verificationStatus: true,
      hdmVerified: true,
      accountStatus: true,
      campusId: true,
      departmentId: true,
      course: true,
      yearOfStudy: true,
      staffId: true,
      graduationYear: true,
      lastSeen: true,
      createdAt: true,
      campus: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          posts: true,
          reels: true,
          followers: true,
          following: true,
        },
      },
    },
  });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findByPhone = async (phoneNumber) => {
  return prisma.user.findUnique({
    where: { phoneNumber },
  });
};

const create = async (data) => {
  return prisma.user.create({
    data,
  });
};

const update = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

const updatePassword = async (id, passwordHash) => {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
};

const updateLastSeen = async (id) => {
  return prisma.user.update({
    where: { id },
    data: { lastSeen: new Date() },
  });
};

const search = async (query, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { fullName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { course: { contains: query, mode: 'insensitive' } },
    ],
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
        email: true,
        avatarUrl: true,
        bio: true,
        hdmVerified: true,
        campus: {
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

module.exports = {
  findById,
  findByEmail,
  findByPhone,
  create,
  update,
  updatePassword,
  updateLastSeen,
  search,
};
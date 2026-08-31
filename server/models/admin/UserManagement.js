const prisma = require('../../config/database.js');

const findAll = async ({ page = 1, limit = 20, role = null, status = null, search = null }) => {
  const skip = (page - 1) * limit;

  const where = {
    role: {
      in: ['STUDENT', 'STAFF', 'ALUMNI'],
    },
  };

  if (role && ['STUDENT', 'STAFF', 'ALUMNI'].includes(role)) {
    where.role = role;
  }

  if (status) where.accountStatus = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
      { course: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        role: true,
        accountStatus: true,
        verificationStatus: true,
        hdmVerified: true,
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
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      campus: true,
      department: true,
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

  if (user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return null;
  }

  return user;
};

const toggleHdmVerified = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { hdmVerified: true },
  });

  if (!user) return null;

  return prisma.user.update({
    where: { id },
    data: {
      hdmVerified: !user.hdmVerified,
    },
  });
};

const setHdmVerified = async (id, status) => {
  return prisma.user.update({
    where: { id },
    data: {
      hdmVerified: status,
    },
  });
};

const suspendUser = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      accountStatus: 'SUSPENDED',
    },
  });
};

const reactivateUser = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      accountStatus: 'ACTIVE',
    },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

const changeRole = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
  });
};

const verifyUser = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      verificationStatus: 'VERIFIED',
    },
  });
};

module.exports = {
  findAll,
  findById,
  toggleHdmVerified,
  setHdmVerified,
  suspendUser,
  reactivateUser,
  deleteUser,
  changeRole,
  verifyUser,
};
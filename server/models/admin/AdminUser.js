const prisma = require('../../config/database.js');

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const findAllAdmins = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'SUPER_ADMIN'],
      },
    },
  });
};

const createAdmin = async (data) => {
  return prisma.user.create({
    data: {
      ...data,
      role: 'ADMIN',
      verificationStatus: 'VERIFIED',
    },
  });
};

const updateAdmin = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

const deleteAdmin = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

module.exports = {
  findByEmail,
  findById,
  findAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
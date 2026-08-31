const prisma = require('../../config/database.js');

const getTerms = async () => {
  return prisma.legal.findFirst({
    where: { type: 'TERMS' },
  });
};

const getPrivacy = async () => {
  return prisma.legal.findFirst({
    where: { type: 'PRIVACY' },
  });
};

const getAbout = async () => {
  return prisma.legal.findFirst({
    where: { type: 'ABOUT' },
  });
};

const getAll = async () => {
  return prisma.legal.findMany({
    orderBy: { type: 'asc' },
  });
};

const getById = async (id) => {
  return prisma.legal.findUnique({
    where: { id },
  });
};

const create = async (data) => {
  return prisma.legal.create({
    data,
  });
};

const update = async (id, data) => {
  return prisma.legal.update({
    where: { id },
    data,
  });
};

const remove = async (id) => {
  return prisma.legal.delete({
    where: { id },
  });
};

module.exports = {
  getTerms,
  getPrivacy,
  getAbout,
  getAll,
  getById,
  create,
  update,
  remove,
};
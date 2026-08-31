const prisma = require('../../config/database.js');

const getGeneralSettings = async () => {
  const settings = await prisma.setting.findMany();

  const general = {};
  settings.forEach((setting) => {
    general[setting.key] = setting.value;
  });

  return general;
};

const getSettingByKey = async (key) => {
  return prisma.setting.findUnique({
    where: { key },
  });
};

const setSetting = async (key, value) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};

const setMultipleSettings = async (settings) => {
  const results = [];

  for (const [key, value] of Object.entries(settings)) {
    const result = await setSetting(key, value);
    results.push(result);
  }

  return results;
};

const deleteSetting = async (key) => {
  return prisma.setting.delete({
    where: { key },
  });
};

module.exports = {
  getGeneralSettings,
  getSettingByKey,
  setSetting,
  setMultipleSettings,
  deleteSetting,
};
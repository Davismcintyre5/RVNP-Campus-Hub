const Settings = require('../../models/admin/Settings.js');
const Campus = require('../../models/client/Campus.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const prisma = require('../../config/database.js');

const getGeneralSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getGeneralSettings();
  res.json(ApiResponse.ok(settings));
});

const getSettingByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;

  const setting = await Settings.getSettingByKey(key);

  if (!setting) {
    throw ApiError.notFound('Setting not found');
  }

  res.json(ApiResponse.ok(setting));
});

const updateGeneralSettings = asyncHandler(async (req, res) => {
  const {
    appName,
    tagline,
    supportEmail,
    supportPhone,
    logoUrl,
    faviconUrl,
    emailLogoUrl,
    maintenanceMode,
    registrationEnabled,
    smsNotifications,
    emailNotifications,
    pushNotifications,
  } = req.body;

  const settings = {};

  if (appName) settings.appName = appName;
  if (tagline) settings.tagline = tagline;
  if (supportEmail) settings.supportEmail = supportEmail;
  if (supportPhone) settings.supportPhone = supportPhone;
  if (logoUrl) settings.logoUrl = logoUrl;
  if (faviconUrl) settings.faviconUrl = faviconUrl;
  if (emailLogoUrl) settings.emailLogoUrl = emailLogoUrl;

  if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
  if (registrationEnabled !== undefined) settings.registrationEnabled = registrationEnabled;
  if (smsNotifications !== undefined) settings.smsNotifications = smsNotifications;
  if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
  if (pushNotifications !== undefined) settings.pushNotifications = pushNotifications;

  const result = await Settings.setMultipleSettings(settings);

  res.json(ApiResponse.ok(result, 'Settings updated successfully'));
});

const deleteSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;

  await Settings.deleteSetting(key);

  res.json(ApiResponse.ok(null, 'Setting deleted successfully'));
});

const getCampuses = asyncHandler(async (req, res) => {
  const campuses = await prisma.campus.findMany({
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

  res.json(ApiResponse.ok(campuses));
});

const getCampusById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campus = await prisma.campus.findUnique({
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

  if (!campus) {
    throw ApiError.notFound('Campus not found');
  }

  res.json(ApiResponse.ok(campus));
});

const createCampus = asyncHandler(async (req, res) => {
  const { name, location, type } = req.body;

  if (!name) {
    throw ApiError.badRequest('Campus name is required');
  }

  const campus = await prisma.campus.create({
    data: {
      name,
      location,
      type: type || 'SATELLITE',
    },
  });

  res.status(201).json(ApiResponse.created(campus));
});

const updateCampus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, location, type } = req.body;

  const data = {};
  if (name) data.name = name;
  if (location !== undefined) data.location = location;
  if (type) data.type = type;

  const campus = await prisma.campus.update({
    where: { id },
    data,
  });

  res.json(ApiResponse.ok(campus, 'Campus updated successfully'));
});

const deleteCampus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.campus.delete({
    where: { id },
  });

  res.json(ApiResponse.ok(null, 'Campus deleted successfully'));
});

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await prisma.department.findMany({
    include: {
      campus: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  res.json(ApiResponse.ok(departments));
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      campus: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!department) {
    throw ApiError.notFound('Department not found');
  }

  res.json(ApiResponse.ok(department));
});

const createDepartment = asyncHandler(async (req, res) => {
  const { name, campusId } = req.body;

  if (!name || !campusId) {
    throw ApiError.badRequest('Department name and campus ID are required');
  }

  const department = await prisma.department.create({
    data: {
      name,
      campusId,
    },
  });

  res.status(201).json(ApiResponse.created(department));
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, campusId } = req.body;

  const data = {};
  if (name) data.name = name;
  if (campusId) data.campusId = campusId;

  const department = await prisma.department.update({
    where: { id },
    data,
  });

  res.json(ApiResponse.ok(department, 'Department updated successfully'));
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.department.delete({
    where: { id },
  });

  res.json(ApiResponse.ok(null, 'Department deleted successfully'));
});

module.exports = {
  getGeneralSettings,
  getSettingByKey,
  updateGeneralSettings,
  deleteSetting,
  getCampuses,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
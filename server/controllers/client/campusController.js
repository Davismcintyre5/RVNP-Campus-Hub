const Campus = require('../../models/client/Campus.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllCampuses = asyncHandler(async (req, res) => {
  const campuses = await Campus.findAll();

  res.json(ApiResponse.ok(campuses));
});

const getCampusById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campus = await Campus.findById(id);

  if (!campus) {
    throw ApiError.notFound('Campus not found');
  }

  res.json(ApiResponse.ok(campus));
});

const getCampusUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const data = await Campus.getUsers(id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getCampusDepartments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const departments = await Campus.getDepartments(id);

  res.json(ApiResponse.ok(departments));
});

module.exports = {
  getAllCampuses,
  getCampusById,
  getCampusUsers,
  getCampusDepartments,
};
const Campus = require('../../models/client/Campus.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllCampuses = asyncHandler(async (req, res) => {
  const campuses = await Campus.findAll();

  const publicCampuses = campuses.map((campus) => ({
    id: campus.id,
    name: campus.name,
    location: campus.location,
    type: campus.type,
    userCount: campus._count.users,
    groupCount: campus._count.groups,
    eventCount: campus._count.events,
  }));

  res.json(ApiResponse.ok(publicCampuses));
});

const getCampusById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campus = await Campus.findById(id);

  if (!campus) {
    throw ApiError.notFound('Campus not found');
  }

  res.json(
    ApiResponse.ok({
      id: campus.id,
      name: campus.name,
      location: campus.location,
      type: campus.type,
      departments: campus.departments,
      userCount: campus._count.users,
      groupCount: campus._count.groups,
      eventCount: campus._count.events,
    })
  );
});

module.exports = {
  getAllCampuses,
  getCampusById,
};
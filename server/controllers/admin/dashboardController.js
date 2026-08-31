const DashboardStats = require('../../models/admin/DashboardStats.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getStats = asyncHandler(async (req, res) => {
  const stats = await DashboardStats.getFullStats();
  res.json(ApiResponse.ok(stats));
});

const getUsersByCampus = asyncHandler(async (req, res) => {
  const data = await DashboardStats.getUsersByCampus();
  res.json(ApiResponse.ok(data));
});

const getPostsByCampus = asyncHandler(async (req, res) => {
  const data = await DashboardStats.getPostsByCampus();
  res.json(ApiResponse.ok(data));
});

module.exports = {
  getStats,
  getUsersByCampus,
  getPostsByCampus,
};
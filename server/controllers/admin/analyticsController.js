const Analytics = require('../../models/admin/Analytics.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getUserGrowth = asyncHandler(async (req, res) => {
  const { days } = req.query;

  const data = await Analytics.getUserGrowth(parseInt(days) || 30);

  res.json(ApiResponse.ok(data));
});

const getPostGrowth = asyncHandler(async (req, res) => {
  const { days } = req.query;

  const data = await Analytics.getPostGrowth(parseInt(days) || 30);

  res.json(ApiResponse.ok(data));
});

const getEngagementStats = asyncHandler(async (req, res) => {
  const data = await Analytics.getEngagementStats();

  res.json(ApiResponse.ok(data));
});

const getMostActiveUsers = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await Analytics.getMostActiveUsers(parseInt(limit) || 10);

  res.json(ApiResponse.ok(data));
});

const getMostPopularPosts = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await Analytics.getMostPopularPosts(parseInt(limit) || 10);

  res.json(ApiResponse.ok(data));
});

const getFullAnalytics = asyncHandler(async (req, res) => {
  const [userGrowth, postGrowth, engagement, activeUsers, popularPosts] = await Promise.all([
    Analytics.getUserGrowth(30),
    Analytics.getPostGrowth(30),
    Analytics.getEngagementStats(),
    Analytics.getMostActiveUsers(10),
    Analytics.getMostPopularPosts(10),
  ]);

  res.json(
    ApiResponse.ok({
      userGrowth,
      postGrowth,
      engagement,
      activeUsers,
      popularPosts,
    })
  );
});

module.exports = {
  getUserGrowth,
  getPostGrowth,
  getEngagementStats,
  getMostActiveUsers,
  getMostPopularPosts,
  getFullAnalytics,
};
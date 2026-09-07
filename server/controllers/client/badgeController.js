const Badge = require('../../models/client/Badge.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.findAll();
  res.json(ApiResponse.ok(badges));
});

const getUserBadges = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const badges = await Badge.getUserBadges(userId);

  res.json(ApiResponse.ok(badges));
});

const checkMyBadges = asyncHandler(async (req, res) => {
  await Badge.checkAndAwardBadges(req.user.id);

  const badges = await Badge.getUserBadges(req.user.id);

  res.json(ApiResponse.ok(badges));
});

module.exports = {
  getAllBadges,
  getUserBadges,
  checkMyBadges,
};
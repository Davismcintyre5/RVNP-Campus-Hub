const Leaderboard = require('../../models/client/Leaderboard.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getTopContributors = asyncHandler(async (req, res) => {
  const { period, limit } = req.query;

  const contributors = await Leaderboard.getTopContributors({
    period: period || 'all',
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(contributors));
});

const getTopFans = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const fans = await Leaderboard.getTopFans({
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(fans));
});

module.exports = {
  getTopContributors,
  getTopFans,
};
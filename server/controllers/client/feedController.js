const Feed = require('../../models/client/Feed.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Feed.getFeed(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getCampusFeed = asyncHandler(async (req, res) => {
  const { campusId } = req.params;
  const { page, limit } = req.query;

  const data = await Feed.getCampusFeed(campusId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

module.exports = {
  getFeed,
  getCampusFeed,
};
const Hashtag = require('../../models/client/Hashtag.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAll = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Hashtag.getAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 50,
  });

  res.json(ApiResponse.ok(data));
});

const getTrending = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const hashtags = await Hashtag.getTrending(parseInt(limit) || 10);

  res.json(ApiResponse.ok(hashtags));
});

module.exports = {
  getAll,
  getTrending,
};
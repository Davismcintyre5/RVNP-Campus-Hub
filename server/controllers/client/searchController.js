const Search = require('../../models/client/Search.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const searchAll = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchAll(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(data));
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchUsers(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const searchPosts = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchPosts(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const searchReels = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchReels(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const searchGroups = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchGroups(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const searchEvents = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchEvents(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const searchMarketplace = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await Search.searchMarketplace(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

module.exports = {
  searchAll,
  searchUsers,
  searchPosts,
  searchReels,
  searchGroups,
  searchEvents,
  searchMarketplace,
};
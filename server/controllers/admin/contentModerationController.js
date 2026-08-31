const ContentModeration = require('../../models/admin/ContentModeration.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllPosts = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const data = await ContentModeration.findAllPosts({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const getAllReels = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const data = await ContentModeration.findAllReels({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const getAllComments = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const data = await ContentModeration.findAllComments({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.softDeletePost(id);

  res.json(ApiResponse.ok(null, 'Post deleted successfully'));
});

const deleteReel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.softDeleteReel(id);

  res.json(ApiResponse.ok(null, 'Reel deleted successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.softDeleteComment(id);

  res.json(ApiResponse.ok(null, 'Comment deleted successfully'));
});

const restorePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.restorePost(id);

  res.json(ApiResponse.ok(null, 'Post restored successfully'));
});

const restoreReel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.restoreReel(id);

  res.json(ApiResponse.ok(null, 'Reel restored successfully'));
});

const restoreComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ContentModeration.restoreComment(id);

  res.json(ApiResponse.ok(null, 'Comment restored successfully'));
});

module.exports = {
  getAllPosts,
  getAllReels,
  getAllComments,
  deletePost,
  deleteReel,
  deleteComment,
  restorePost,
  restoreReel,
  restoreComment,
};
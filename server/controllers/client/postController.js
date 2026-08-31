const Post = require('../../models/client/Post.js');
const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createPost = asyncHandler(async (req, res) => {
  const { content, privacy, campusId } = req.body;
  const userId = req.user.id;

  if (!content) {
    throw ApiError.badRequest('Content is required');
  }

  const post = await Post.create({
    content,
    privacy: privacy || 'PUBLIC',
    userId,
    campusId: campusId || req.user.campusId,
  });

  res.status(201).json(ApiResponse.created(post));
});

const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    throw ApiError.notFound('Post not found');
  }

  res.json(ApiResponse.ok(post));
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, privacy } = req.body;
  const userId = req.user.id;

  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    throw ApiError.notFound('Post not found');
  }

  if (post.userId !== userId) {
    throw ApiError.forbidden('You can only edit your own posts');
  }

  const data = {};
  if (content) data.content = content;
  if (privacy) data.privacy = privacy;

  const updated = await Post.update(id, data);

  res.json(ApiResponse.ok(updated, 'Post updated successfully'));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    throw ApiError.notFound('Post not found');
  }

  if (post.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own posts');
  }

  await Post.softDelete(id);

  res.json(ApiResponse.ok(null, 'Post deleted successfully'));
});

const getMyPosts = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Post.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const data = await Post.findByUser(id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getCampusPosts = asyncHandler(async (req, res) => {
  const { campusId } = req.params;
  const { page, limit } = req.query;

  const data = await Post.findByCampus(campusId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    throw ApiError.notFound('Post not found');
  }

  const existing = await Reaction.findExisting(userId, id, null, null);

  if (existing) {
    throw ApiError.conflict('Already liked this post');
  }

  await Reaction.create({ userId, postId: id, type: 'LIKE' });
  await Post.incrementLike(id);

  if (post.userId !== userId) {
    await notificationService.createNotification({
      userId: post.userId,
      type: 'LIKE',
      title: 'New Like',
      body: `${req.user.fullName} liked your post`,
    });
  }

  res.json(ApiResponse.ok(null, 'Post liked'));
});

const unlikePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = await Reaction.findExisting(userId, id, null, null);

  if (!existing) {
    throw ApiError.badRequest('Not liked this post');
  }

  await Reaction.remove(existing.id);
  await Post.decrementLike(id);

  res.json(ApiResponse.ok(null, 'Post unliked'));
});

const sharePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post || post.deletedAt) {
    throw ApiError.notFound('Post not found');
  }

  await Post.incrementShare(id);

  res.json(ApiResponse.ok(null, 'Post shared'));
});

module.exports = {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getUserPosts,
  getCampusPosts,
  likePost,
  unlikePost,
  sharePost,
};
const Comment = require('../../models/client/Comment.js');
const Post = require('../../models/client/Post.js');
const Reel = require('../../models/client/Reel.js');
const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createComment = asyncHandler(async (req, res) => {
  const { content, postId, reelId, parentId } = req.body;
  const userId = req.user.id;

  if (!content) {
    throw ApiError.badRequest('Comment content is required');
  }

  if (!postId && !reelId) {
    throw ApiError.badRequest('Post ID or Reel ID is required');
  }

  const comment = await Comment.create({
    content,
    userId,
    postId,
    reelId,
    parentId,
  });

  if (postId) {
    await Post.incrementComment(postId);

    const post = await Post.findById(postId);

    if (post && post.userId !== userId) {
      await notificationService.createNotification({
        userId: post.userId,
        type: 'COMMENT',
        title: 'New Comment',
        body: `${req.user.fullName} commented on your post`,
      });
    }
  }

  if (reelId) {
    await Reel.incrementComment(reelId);

    const reel = await Reel.findById(reelId);

    if (reel && reel.userId !== userId) {
      await notificationService.createNotification({
        userId: reel.userId,
        type: 'COMMENT',
        title: 'New Comment',
        body: `${req.user.fullName} commented on your reel`,
      });
    }
  }

  res.status(201).json(ApiResponse.created(comment));
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page, limit } = req.query;

  const data = await Comment.findByPost(postId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getReelComments = asyncHandler(async (req, res) => {
  const { reelId } = req.params;
  const { page, limit } = req.query;

  const data = await Comment.findByReel(reelId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { page, limit } = req.query;

  const data = await Comment.getReplies(commentId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(data));
});

const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await Comment.findById(id);

  if (!comment || comment.deletedAt) {
    throw ApiError.notFound('Comment not found');
  }

  if (comment.userId !== userId) {
    throw ApiError.forbidden('You can only edit your own comments');
  }

  const updated = await Comment.update(id, { content });

  res.json(ApiResponse.ok(updated, 'Comment updated successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(id);

  if (!comment || comment.deletedAt) {
    throw ApiError.notFound('Comment not found');
  }

  if (comment.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own comments');
  }

  await Comment.softDelete(id);

  if (comment.postId) {
    await Post.decrementComment(comment.postId);
  }

  if (comment.reelId) {
    await Reel.decrementComment(comment.reelId);
  }

  res.json(ApiResponse.ok(null, 'Comment deleted successfully'));
});

const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(id);

  if (!comment || comment.deletedAt) {
    throw ApiError.notFound('Comment not found');
  }

  const existing = await Reaction.findExisting(userId, null, null, id);

  if (existing) {
    throw ApiError.conflict('Already liked this comment');
  }

  await Reaction.create({ userId, commentId: id, type: 'LIKE' });
  await Comment.incrementLike(id);

  if (comment.userId !== userId) {
    await notificationService.createNotification({
      userId: comment.userId,
      type: 'LIKE',
      title: 'New Like',
      body: `${req.user.fullName} liked your comment`,
    });
  }

  res.json(ApiResponse.ok(null, 'Comment liked'));
});

const unlikeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = await Reaction.findExisting(userId, null, null, id);

  if (!existing) {
    throw ApiError.badRequest('Not liked this comment');
  }

  await Reaction.remove(existing.id);
  await Comment.decrementLike(id);

  res.json(ApiResponse.ok(null, 'Comment unliked'));
});

module.exports = {
  createComment,
  getPostComments,
  getReelComments,
  getReplies,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
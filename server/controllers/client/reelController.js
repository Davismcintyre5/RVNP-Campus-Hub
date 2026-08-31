const Reel = require('../../models/client/Reel.js');
const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createReel = asyncHandler(async (req, res) => {
  const { videoUrl, thumbnailUrl, caption, campusId } = req.body;
  const userId = req.user.id;

  if (!videoUrl) {
    throw ApiError.badRequest('Video URL is required');
  }

  const reel = await Reel.create({
    videoUrl,
    thumbnailUrl,
    caption,
    userId,
    campusId: campusId || req.user.campusId,
  });

  res.status(201).json(ApiResponse.created(reel));
});

const getReelFeed = asyncHandler(async (req, res) => {
  const { page, limit, campusId } = req.query;

  const data = await Reel.getFeed({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    campusId,
  });

  res.json(ApiResponse.ok(data));
});

const getReelById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  await Reel.incrementView(id);

  res.json(ApiResponse.ok(reel));
});

const updateReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { caption, thumbnailUrl } = req.body;
  const userId = req.user.id;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  if (reel.userId !== userId) {
    throw ApiError.forbidden('You can only edit your own reels');
  }

  const data = {};
  if (caption !== undefined) data.caption = caption;
  if (thumbnailUrl) data.thumbnailUrl = thumbnailUrl;

  const updated = await Reel.update(id, data);

  res.json(ApiResponse.ok(updated, 'Reel updated successfully'));
});

const deleteReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  if (reel.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own reels');
  }

  await Reel.softDelete(id);

  res.json(ApiResponse.ok(null, 'Reel deleted successfully'));
});

const getMyReels = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Reel.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(data));
});

const likeReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  const existing = await Reaction.findExisting(userId, null, id, null);

  if (existing) {
    throw ApiError.conflict('Already liked this reel');
  }

  await Reaction.create({ userId, reelId: id, type: 'LIKE' });
  await Reel.incrementLike(id);

  if (reel.userId !== userId) {
    await notificationService.createNotification({
      userId: reel.userId,
      type: 'LIKE',
      title: 'New Like',
      body: `${req.user.fullName} liked your reel`,
    });
  }

  res.json(ApiResponse.ok(null, 'Reel liked'));
});

const unlikeReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = await Reaction.findExisting(userId, null, id, null);

  if (!existing) {
    throw ApiError.badRequest('Not liked this reel');
  }

  await Reaction.remove(existing.id);
  await Reel.decrementLike(id);

  res.json(ApiResponse.ok(null, 'Reel unliked'));
});

module.exports = {
  createReel,
  getReelFeed,
  getReelById,
  updateReel,
  deleteReel,
  getMyReels,
  likeReel,
  unlikeReel,
};
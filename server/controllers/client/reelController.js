const Reel = require('../../models/client/Reel.js');
const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createReel = asyncHandler(async (req, res) => {
  const { videoUrl, thumbnailUrl, caption, content, privacy, campusId } = req.body;
  const userId = req.user.id;

  if (!videoUrl) {
    throw ApiError.badRequest('Video URL is required');
  }

  const reel = await Reel.create({
    videoUrl,
    thumbnailUrl,
    caption,
    content: content || null,
    privacy: privacy || 'PUBLIC',
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
  const { caption, thumbnailUrl, content, privacy } = req.body;
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
  if (content) data.content = content;
  if (privacy) data.privacy = privacy;

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

const getUserReels = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;

  const data = await Reel.findByUser(userId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(data));
});

const reactToReel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const userId = req.user.id;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  const existing = await Reaction.findExisting(userId, null, id, null);

  if (existing) {
    await Reaction.remove(existing.id);
    await Reel.decrementLike(id);
  }

  const reaction = await Reaction.create({
    userId,
    reelId: id,
    type: type || 'LIKE',
  });

  await Reel.incrementLike(id);

  if (reel.userId !== userId) {
    await notificationService.createNotification({
      userId: reel.userId,
      type: 'LIKE',
      title: 'New Reaction',
      body: `${req.user.fullName} reacted to your reel`,
    });
  }

  res.json(ApiResponse.ok(reaction, 'Reaction added'));
});

const removeReaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = await Reaction.findExisting(userId, null, id, null);

  if (!existing) {
    throw ApiError.badRequest('No reaction found');
  }

  await Reaction.remove(existing.id);
  await Reel.decrementLike(id);

  res.json(ApiResponse.ok(null, 'Reaction removed'));
});

const incrementViewCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Reel.incrementView(id);

  res.json(ApiResponse.ok(null, 'View counted'));
});

const shareReel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reel = await Reel.findById(id);

  if (!reel || reel.deletedAt) {
    throw ApiError.notFound('Reel not found');
  }

  await Reel.incrementShare(id);

  res.json(ApiResponse.ok(null, 'Reel shared'));
});

module.exports = {
  createReel,
  getReelFeed,
  getReelById,
  updateReel,
  deleteReel,
  getMyReels,
  getUserReels,
  reactToReel,
  removeReaction,
  incrementViewCount,
  shareReel,
};
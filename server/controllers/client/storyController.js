const Story = require('../../models/client/Story.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const { addHours } = require('../../utils/time.js');

const createStory = asyncHandler(async (req, res) => {
  const { content, privacy, campusId } = req.body;
  const userId = req.user.id;

  if (!content) {
    throw ApiError.badRequest('Story content is required');
  }

  const story = await Story.create({
    content,
    privacy: privacy || 'PUBLIC',
    userId,
    campusId: campusId || req.user.campusId,
    expiresAt: addHours(24),
  });

  res.status(201).json(ApiResponse.created(story));
});

const getActiveStories = asyncHandler(async (req, res) => {
  const { campusId } = req.query;

  const stories = await Story.getActiveStories({
    campusId: campusId || req.user.campusId,
  });

  res.json(ApiResponse.ok(stories));
});

const getMyStories = asyncHandler(async (req, res) => {
  const stories = await Story.getActiveStories({
    userId: req.user.id,
  });

  res.json(ApiResponse.ok(stories));
});

const getStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id);

  if (!story) {
    throw ApiError.notFound('Story not found');
  }

  if (story.expiresAt < new Date()) {
    throw ApiError.notFound('Story expired');
  }

  await Story.incrementView(id);

  res.json(ApiResponse.ok(story));
});

const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const story = await Story.findById(id);

  if (!story) {
    throw ApiError.notFound('Story not found');
  }

  if (story.userId !== userId) {
    throw ApiError.forbidden('You can only delete your own stories');
  }

  await Story.softDelete(id);

  res.json(ApiResponse.ok(null, 'Story deleted successfully'));
});

module.exports = {
  createStory,
  getActiveStories,
  getMyStories,
  getStoryById,
  deleteStory,
};
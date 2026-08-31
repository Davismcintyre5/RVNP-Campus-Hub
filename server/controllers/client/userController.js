const User = require('../../models/client/User.js');
const Follow = require('../../models/client/Follow.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json(ApiResponse.ok(user));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isFollowing = await Follow.isFollowing(req.user.id, id);

  res.json(ApiResponse.ok({ ...user, isFollowing }));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { fullName, bio, avatarUrl, coverUrl, course, yearOfStudy } = req.body;

  const data = {};
  if (fullName) data.fullName = fullName;
  if (bio !== undefined) data.bio = bio;
  if (avatarUrl) data.avatarUrl = avatarUrl;
  if (coverUrl) data.coverUrl = coverUrl;
  if (course) data.course = course;
  if (yearOfStudy) data.yearOfStudy = parseInt(yearOfStudy);

  const user = await User.update(userId, data);

  res.json(ApiResponse.ok(user, 'Profile updated successfully'));
});

const updateCampus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { campusId, departmentId } = req.body;

  const user = await User.update(userId, { campusId, departmentId });

  res.json(ApiResponse.ok(user, 'Campus updated successfully'));
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    throw ApiError.badRequest('Search query is required');
  }

  const data = await User.search(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getFollowers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const data = await Follow.getFollowers(id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getFollowing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const data = await Follow.getFollowing(id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const followUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (id === userId) {
    throw ApiError.badRequest('You cannot follow yourself');
  }

  const targetUser = await User.findById(id);

  if (!targetUser) {
    throw ApiError.notFound('User not found');
  }

  const alreadyFollowing = await Follow.isFollowing(userId, id);

  if (alreadyFollowing) {
    throw ApiError.conflict('Already following this user');
  }

  await Follow.follow(userId, id);

  await notificationService.createNotification({
    userId: id,
    type: 'FOLLOW',
    title: 'New Follower',
    body: `${req.user.fullName} started following you`,
  });

  res.json(ApiResponse.ok(null, 'Followed successfully'));
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const alreadyFollowing = await Follow.isFollowing(userId, id);

  if (!alreadyFollowing) {
    throw ApiError.badRequest('Not following this user');
  }

  await Follow.unfollow(userId, id);

  res.json(ApiResponse.ok(null, 'Unfollowed successfully'));
});

module.exports = {
  getProfile,
  getUserById,
  updateProfile,
  updateCampus,
  searchUsers,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};
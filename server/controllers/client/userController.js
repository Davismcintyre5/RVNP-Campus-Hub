const User = require('../../models/client/User.js');
const Follow = require('../../models/client/Follow.js');
const Friend = require('../../models/client/Friend.js');
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

  const [followerCount, followingCount, friendCount] = await Promise.all([
    Follow.getFollowerCount(userId),
    Follow.getFollowingCount(userId),
    Friend.getFriendCount(userId),
  ]);

  const formattedUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    bio: user.bio,
    role: user.role,
    verificationStatus: user.verificationStatus,
    hdmVerified: user.hdmVerified,
    accountStatus: user.accountStatus,
    campusId: user.campusId,
    departmentId: user.departmentId,
    course: user.course,
    yearOfStudy: user.yearOfStudy,
    staffId: user.staffId,
    graduationYear: user.graduationYear,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
    campus: user.campus,
    department: user.department,
    _count: {
      posts: user._count?.posts || 0,
      reels: user._count?.reels || 0,
      followers: followerCount,
      following: followingCount,
      friends: friendCount,
    },
  };

  res.json(ApiResponse.ok(formattedUser));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  let isFollowing = false;
  let isFollower = false;
  let isFriend = false;

  if (req.user.id !== id) {
    [isFollowing, isFollower] = await Promise.all([
      Follow.isFollowing(req.user.id, id),
      Follow.isFollowing(id, req.user.id),
    ]);

    isFriend = isFollowing && isFollower;
  }

  const [followerCount, followingCount, friendCount] = await Promise.all([
    Follow.getFollowerCount(id),
    Follow.getFollowingCount(id),
    Friend.getFriendCount(id),
  ]);

  const formattedUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    bio: user.bio,
    role: user.role,
    verificationStatus: user.verificationStatus,
    hdmVerified: user.hdmVerified,
    accountStatus: user.accountStatus,
    campusId: user.campusId,
    departmentId: user.departmentId,
    course: user.course,
    yearOfStudy: user.yearOfStudy,
    staffId: user.staffId,
    graduationYear: user.graduationYear,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
    campus: user.campus,
    department: user.department,
    _count: {
      posts: user._count?.posts || 0,
      reels: user._count?.reels || 0,
      followers: followerCount,
      following: followingCount,
      friends: friendCount,
    },
    isFollowing,
    isFollower,
    isFriend,
  };

  res.json(ApiResponse.ok(formattedUser));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    fullName,
    bio,
    avatarUrl,
    coverUrl,
    course,
    yearOfStudy,
    staffId,
    graduationYear,
  } = req.body;

  const data = {};
  if (fullName) data.fullName = fullName;
  if (bio !== undefined) data.bio = bio;
  if (avatarUrl) data.avatarUrl = avatarUrl;
  if (coverUrl) data.coverUrl = coverUrl;
  if (course !== undefined) data.course = course;
  if (yearOfStudy !== undefined) data.yearOfStudy = yearOfStudy ? parseInt(yearOfStudy) : null;
  if (staffId !== undefined) data.staffId = staffId;
  if (graduationYear !== undefined) data.graduationYear = graduationYear ? parseInt(graduationYear) : null;

  const user = await User.update(userId, data);

  res.json(ApiResponse.ok(user, 'Profile updated successfully'));
});

const updateCampus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { campusId, departmentId } = req.body;

  const data = {};
  if (campusId) data.campusId = campusId;
  if (departmentId) data.departmentId = departmentId;

  const user = await User.update(userId, data);

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
    data: {
      followerId: userId,
    },
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

const isFollowing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const following = await Follow.isFollowing(userId, id);

  res.json(ApiResponse.ok({ isFollowing: following }));
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
  isFollowing,
};
const Friend = require('../../models/client/Friend.js');
const Follow = require('../../models/client/Follow.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getFriends = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Friend.getMutualFriends(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getFriendCount = asyncHandler(async (req, res) => {
  const count = await Friend.getFriendCount(req.user.id);

  res.json(ApiResponse.ok({ count }));
});

const checkFriendship = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const isFriend = await Friend.isMutualFriend(req.user.id, userId);
  const isFollowing = await Follow.isFollowing(req.user.id, userId);
  const isFollower = await Follow.isFollowing(userId, req.user.id);

  res.json(
    ApiResponse.ok({
      isFriend,
      isFollowing,
      isFollower,
      status: isFriend ? 'FRIENDS' : isFollowing ? 'FOLLOWING' : isFollower ? 'FOLLOWER' : 'NONE',
    })
  );
});

const getFriendSuggestions = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const suggestions = await Friend.getFriendSuggestions(
    req.user.id,
    parseInt(limit) || 10
  );

  res.json(ApiResponse.ok(suggestions));
});

const getMessageableUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;

  const data = await Friend.getMessageableUsers(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 50,
  });

  let users = data.users;

  if (search && search.trim()) {
    users = users.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(ApiResponse.ok({ users, total: users.length }));
});

module.exports = {
  getFriends,
  getFriendCount,
  checkFriendship,
  getFriendSuggestions,
  getMessageableUsers,
};
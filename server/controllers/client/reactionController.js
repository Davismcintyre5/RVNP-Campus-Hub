const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getPostReactions = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const reactions = await Reaction.findByPost(postId);

  res.json(ApiResponse.ok(reactions));
});

const getReelReactions = asyncHandler(async (req, res) => {
  const { reelId } = req.params;

  const reactions = await Reaction.findByReel(reelId);

  res.json(ApiResponse.ok(reactions));
});

const getCommentReactions = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const reactions = await Reaction.findByComment(commentId);

  res.json(ApiResponse.ok(reactions));
});

module.exports = {
  getPostReactions,
  getReelReactions,
  getCommentReactions,
};
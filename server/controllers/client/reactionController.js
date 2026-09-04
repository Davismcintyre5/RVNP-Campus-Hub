const Reaction = require('../../models/client/Reaction.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getPostReactions = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const reactions = await Reaction.findByPost(postId);
  const summary = await Reaction.getReactionSummary(postId, null, null, req.user.id);
  res.json(ApiResponse.ok({ reactions, summary }));
});

const getReelReactions = asyncHandler(async (req, res) => {
  const { reelId } = req.params;
  const reactions = await Reaction.findByReel(reelId);
  const summary = await Reaction.getReactionSummary(null, reelId, null, req.user.id);
  res.json(ApiResponse.ok({ reactions, summary }));
});

const getCommentReactions = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const reactions = await Reaction.findByComment(commentId);
  const summary = await Reaction.getReactionSummary(null, null, commentId, req.user.id);
  res.json(ApiResponse.ok({ reactions, summary }));
});

const getPostReactionSummary = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const summary = await Reaction.getReactionSummary(postId, null, null, req.user.id);
  res.json(ApiResponse.ok(summary));
});

const getReelReactionSummary = asyncHandler(async (req, res) => {
  const { reelId } = req.params;
  const summary = await Reaction.getReactionSummary(null, reelId, null, req.user.id);
  res.json(ApiResponse.ok(summary));
});

const getCommentReactionSummary = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const summary = await Reaction.getReactionSummary(null, null, commentId, req.user.id);
  res.json(ApiResponse.ok(summary));
});

module.exports = {
  getPostReactions,
  getReelReactions,
  getCommentReactions,
  getPostReactionSummary,
  getReelReactionSummary,
  getCommentReactionSummary,
};
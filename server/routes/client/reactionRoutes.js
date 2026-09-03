const express = require('express');
const router = express.Router();
const reactionController = require('../../controllers/client/reactionController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/post/:postId', reactionController.getPostReactions);
router.get('/reel/:reelId', reactionController.getReelReactions);
router.get('/comment/:commentId', reactionController.getCommentReactions);

router.get('/post/:postId/summary', reactionController.getPostReactionSummary);
router.get('/reel/:reelId/summary', reactionController.getReelReactionSummary);
router.get('/comment/:commentId/summary', reactionController.getCommentReactionSummary);

module.exports = router;
const express = require('express');
const router = express.Router();
const reactionController = require('../../controllers/client/reactionController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/post/:postId', reactionController.getPostReactions);
router.get('/reel/:reelId', reactionController.getReelReactions);
router.get('/comment/:commentId', reactionController.getCommentReactions);

module.exports = router;
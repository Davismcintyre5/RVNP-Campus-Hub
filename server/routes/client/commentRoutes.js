const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/client/commentController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', commentController.createComment);
router.get('/post/:postId', commentController.getPostComments);
router.get('/reel/:reelId', commentController.getReelComments);
router.get('/:commentId/replies', commentController.getReplies);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);
router.post('/:id/like', commentController.likeComment);
router.delete('/:id/like', commentController.unlikeComment);

module.exports = router;
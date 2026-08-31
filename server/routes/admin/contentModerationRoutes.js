const express = require('express');
const router = express.Router();
const contentModerationController = require('../../controllers/admin/contentModerationController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/posts', contentModerationController.getAllPosts);
router.get('/reels', contentModerationController.getAllReels);
router.get('/comments', contentModerationController.getAllComments);

router.delete('/posts/:id', auditLog('DELETE_POST'), contentModerationController.deletePost);
router.delete('/reels/:id', auditLog('DELETE_REEL'), contentModerationController.deleteReel);
router.delete('/comments/:id', auditLog('DELETE_COMMENT'), contentModerationController.deleteComment);

router.put('/posts/:id/restore', auditLog('RESTORE_POST'), contentModerationController.restorePost);
router.put('/reels/:id/restore', auditLog('RESTORE_REEL'), contentModerationController.restoreReel);
router.put('/comments/:id/restore', auditLog('RESTORE_COMMENT'), contentModerationController.restoreComment);

module.exports = router;
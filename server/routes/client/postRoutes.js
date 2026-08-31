const express = require('express');
const router = express.Router();
const postController = require('../../controllers/client/postController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', postController.createPost);
router.get('/my-posts', postController.getMyPosts);
router.get('/user/:id', postController.getUserPosts);
router.get('/campus/:campusId', postController.getCampusPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.likePost);
router.delete('/:id/like', postController.unlikePost);
router.post('/:id/share', postController.sharePost);

module.exports = router;
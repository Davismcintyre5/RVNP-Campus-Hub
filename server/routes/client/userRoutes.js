const express = require('express');
const router = express.Router();
const userController = require('../../controllers/client/userController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/profile', userController.getProfile);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.put('/profile', userController.updateProfile);
router.put('/campus', userController.updateCampus);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);
router.post('/:id/follow', userController.followUser);
router.delete('/:id/follow', userController.unfollowUser);

module.exports = router;
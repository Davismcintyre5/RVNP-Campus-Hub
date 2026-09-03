const express = require('express');
const router = express.Router();
const storyController = require('../../controllers/client/storyController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', storyController.createStory);
router.get('/', storyController.getActiveStories);
router.get('/my-stories', storyController.getMyStories);
router.get('/:id', storyController.getStoryById);
router.get('/:id/viewers', storyController.getViewers);
router.get('/:id/reactions', storyController.getReactions);
router.post('/:id/react', storyController.reactToStory);
router.delete('/:id/react', storyController.removeReaction);
router.delete('/:id', storyController.deleteStory);

module.exports = router;
const express = require('express');
const router = express.Router();
const storyController = require('../../controllers/client/storyController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', storyController.createStory);
router.get('/', storyController.getActiveStories);
router.get('/my-stories', storyController.getMyStories);
router.get('/:id', storyController.getStoryById);
router.delete('/:id', storyController.deleteStory);

module.exports = router;
const express = require('express');
const router = express.Router();
const reelController = require('../../controllers/client/reelController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', reelController.createReel);
router.get('/feed', reelController.getReelFeed);
router.get('/my-reels', reelController.getMyReels);
router.get('/user/:userId', reelController.getUserReels);
router.get('/:id', reelController.getReelById);
router.put('/:id', reelController.updateReel);
router.delete('/:id', reelController.deleteReel);
router.post('/:id/react', reelController.reactToReel);
router.delete('/:id/react', reelController.removeReaction);
router.post('/:id/view', reelController.incrementViewCount);
router.post('/:id/share', reelController.shareReel);

module.exports = router;
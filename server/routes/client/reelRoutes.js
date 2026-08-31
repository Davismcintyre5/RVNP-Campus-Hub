const express = require('express');
const router = express.Router();
const reelController = require('../../controllers/client/reelController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', reelController.createReel);
router.get('/feed', reelController.getReelFeed);
router.get('/my-reels', reelController.getMyReels);
router.get('/:id', reelController.getReelById);
router.put('/:id', reelController.updateReel);
router.delete('/:id', reelController.deleteReel);
router.post('/:id/like', reelController.likeReel);
router.delete('/:id/like', reelController.unlikeReel);

module.exports = router;
const express = require('express');
const router = express.Router();
const friendController = require('../../controllers/client/friendController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', friendController.getFriends);
router.get('/count', friendController.getFriendCount);
router.get('/suggestions', friendController.getFriendSuggestions);
router.get('/messageable', friendController.getMessageableUsers);
router.get('/:userId', friendController.checkFriendship);

module.exports = router;
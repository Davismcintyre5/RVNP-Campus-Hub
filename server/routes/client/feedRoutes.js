const express = require('express');
const router = express.Router();
const feedController = require('../../controllers/client/feedController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', feedController.getFeed);
router.get('/campus/:campusId', feedController.getCampusFeed);

module.exports = router;
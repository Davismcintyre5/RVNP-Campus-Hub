const express = require('express');
const router = express.Router();
const hashtagController = require('../../controllers/client/hashtagController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', hashtagController.getAll);
router.get('/trending', hashtagController.getTrending);

module.exports = router;
const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/client/searchController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', searchController.searchAll);
router.get('/users', searchController.searchUsers);
router.get('/posts', searchController.searchPosts);
router.get('/reels', searchController.searchReels);
router.get('/groups', searchController.searchGroups);
router.get('/events', searchController.searchEvents);
router.get('/marketplace', searchController.searchMarketplace);

module.exports = router;
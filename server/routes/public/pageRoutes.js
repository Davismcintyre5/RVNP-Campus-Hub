const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/public/pageController.js');

router.get('/about', pageController.getAbout);
router.get('/terms', pageController.getTerms);
router.get('/privacy', pageController.getPrivacy);

module.exports = router;
const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/public/settingsController.js');

router.get('/', settingsController.getPublicLegals);
router.get('/:type', settingsController.getPublicLegalByType);

module.exports = router;
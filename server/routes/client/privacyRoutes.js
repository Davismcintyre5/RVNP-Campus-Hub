const express = require('express');
const router = express.Router();
const privacyController = require('../../controllers/client/privacyController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', privacyController.getPrivacySettings);
router.put('/', privacyController.updatePrivacySettings);
router.post('/reset', privacyController.resetPrivacySettings);

module.exports = router;
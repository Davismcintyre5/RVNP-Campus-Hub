const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/client/aiController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/status', aiController.getStatus);
router.post('/chat', aiController.chat);
router.post('/content', aiController.generateContent);
router.get('/comments/:postId', aiController.analyzeComments);

module.exports = router;
const express = require('express');
const router = express.Router();
const healthController = require('../../controllers/public/healthController.js');

router.get('/', healthController.checkHealth);

module.exports = router;
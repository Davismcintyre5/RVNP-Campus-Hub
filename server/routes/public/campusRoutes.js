const express = require('express');
const router = express.Router();
const campusController = require('../../controllers/public/campusController.js');

router.get('/', campusController.getAllCampuses);
router.get('/:id', campusController.getCampusById);

module.exports = router;
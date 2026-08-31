const express = require('express');
const router = express.Router();
const campusController = require('../../controllers/client/campusController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/', campusController.getAllCampuses);
router.get('/:id', campusController.getCampusById);
router.get('/:id/users', campusController.getCampusUsers);
router.get('/:id/departments', campusController.getCampusDepartments);

module.exports = router;
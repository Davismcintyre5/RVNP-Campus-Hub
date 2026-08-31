const express = require('express');
const router = express.Router();

const campusRoutes = require('./campusRoutes.js');
const eventRoutes = require('./eventRoutes.js');
const healthRoutes = require('./healthRoutes.js');
const pageRoutes = require('./pageRoutes.js');
const settingsRoutes = require('./settingsRoutes.js');
const legalsRoutes = require('./legalsRoutes.js');

router.use('/campuses', campusRoutes);
router.use('/events', eventRoutes);
router.use('/health', healthRoutes);
router.use('/pages', pageRoutes);
router.use('/settings', settingsRoutes);
router.use('/legals', legalsRoutes);

module.exports = router;
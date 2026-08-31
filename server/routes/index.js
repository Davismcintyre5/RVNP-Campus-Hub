const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin/index.js');
const clientRoutes = require('./client/index.js');
const publicRoutes = require('./public/index.js');

router.use('/api/admin', adminRoutes);
router.use('/api', clientRoutes);
router.use('/api/public', publicRoutes);

module.exports = router;
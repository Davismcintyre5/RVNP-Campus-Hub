const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuthRoutes.js');
const dashboardRoutes = require('./dashboardRoutes.js');
const userManagementRoutes = require('./userManagementRoutes.js');
const contentModerationRoutes = require('./contentModerationRoutes.js');
const reportRoutes = require('./reportRoutes.js');
const auditLogRoutes = require('./auditLogRoutes.js');
const analyticsRoutes = require('./analyticsRoutes.js');
const settingsRoutes = require('./settingsRoutes.js');
const legalsRoutes = require('./legalsRoutes.js');
const backupsRoutes = require('./backupsRoutes.js');
const healthRoutes = require('./healthRoutes.js');

router.use('/auth', adminAuthRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userManagementRoutes);
router.use('/moderation', contentModerationRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/legals', legalsRoutes);
router.use('/backups', backupsRoutes);
router.use('/health', healthRoutes);

module.exports = router;
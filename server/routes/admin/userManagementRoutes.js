const express = require('express');
const router = express.Router();
const userManagementController = require('../../controllers/admin/userManagementController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const requireSuperAdmin = require('../../middleware/admin/requireSuperAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/', userManagementController.getAllUsers);
router.get('/:id', userManagementController.getUserById);

router.put('/:id/hdm-verified', auditLog('TOGGLE_HDM_VERIFIED'), userManagementController.toggleHdmVerified);
router.put('/:id/hdm-verified/status', requireSuperAdmin, auditLog('SET_HDM_VERIFIED'), userManagementController.setHdmVerified);

router.put('/:id/suspend', auditLog('SUSPEND_USER'), userManagementController.suspendUser);
router.put('/:id/reactivate', auditLog('REACTIVATE_USER'), userManagementController.reactivateUser);
router.delete('/:id', requireSuperAdmin, auditLog('DELETE_USER'), userManagementController.deleteUser);
router.put('/:id/role', requireSuperAdmin, auditLog('CHANGE_ROLE'), userManagementController.changeRole);
router.put('/:id/verify', auditLog('VERIFY_USER'), userManagementController.verifyUser);

module.exports = router;
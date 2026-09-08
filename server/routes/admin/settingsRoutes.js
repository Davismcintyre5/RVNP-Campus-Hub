const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/admin/settingsController.js');
const requireAdmin = require('../../middleware/admin/requireAdmin.js');
const requireSuperAdmin = require('../../middleware/admin/requireSuperAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');

router.use(requireAdmin);

router.get('/', settingsController.getAllSettings);

router.get('/general', settingsController.getGeneralSettings);
router.put('/general', requireSuperAdmin, auditLog('UPDATE_SETTINGS'), settingsController.updateGeneralSettings);
router.patch('/general', requireSuperAdmin, auditLog('UPDATE_SETTINGS'), settingsController.updateGeneralSettings);

router.get('/upload', settingsController.getUploadSettings);
router.put('/upload', requireSuperAdmin, auditLog('UPDATE_UPLOAD_SETTINGS'), settingsController.updateUploadSettings);
router.patch('/upload', requireSuperAdmin, auditLog('UPDATE_UPLOAD_SETTINGS'), settingsController.updateUploadSettings);

router.get('/campuses', settingsController.getCampuses);
router.get('/campuses/:id', settingsController.getCampusById);
router.post('/campuses', requireSuperAdmin, auditLog('CREATE_CAMPUS'), settingsController.createCampus);
router.put('/campuses/:id', requireSuperAdmin, auditLog('UPDATE_CAMPUS'), settingsController.updateCampus);
router.patch('/campuses/:id', requireSuperAdmin, auditLog('UPDATE_CAMPUS'), settingsController.updateCampus);
router.delete('/campuses/:id', requireSuperAdmin, auditLog('DELETE_CAMPUS'), settingsController.deleteCampus);

router.get('/departments', settingsController.getDepartments);
router.get('/departments/:id', settingsController.getDepartmentById);
router.post('/departments', auditLog('CREATE_DEPARTMENT'), settingsController.createDepartment);
router.put('/departments/:id', auditLog('UPDATE_DEPARTMENT'), settingsController.updateDepartment);
router.patch('/departments/:id', auditLog('UPDATE_DEPARTMENT'), settingsController.updateDepartment);
router.delete('/departments/:id', auditLog('DELETE_DEPARTMENT'), settingsController.deleteDepartment);

router.get('/:key', settingsController.getSettingByKey);
router.delete('/:key', requireSuperAdmin, auditLog('DELETE_SETTING'), settingsController.deleteSetting);

module.exports = router;
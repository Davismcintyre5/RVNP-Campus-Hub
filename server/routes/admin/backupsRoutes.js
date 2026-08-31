const express = require('express');
const router = express.Router();
const backupsController = require('../../controllers/admin/backupsController.js');
const requireSuperAdmin = require('../../middleware/admin/requireSuperAdmin.js');
const auditLog = require('../../middleware/admin/auditLog.js');
const { uploadSingle } = require('../../middleware/global/upload.js');

router.use(requireSuperAdmin);

router.get('/settings', backupsController.getBackupSettings);
router.put('/settings', auditLog('UPDATE_BACKUP_SETTINGS'), backupsController.updateBackupSettings);
router.get('/', backupsController.listBackups);
router.post('/', auditLog('CREATE_BACKUP'), backupsController.createBackup);
router.get('/download/:filename', backupsController.downloadBackup);
router.post('/send-email/:filename', auditLog('SEND_BACKUP_EMAIL'), backupsController.sendBackupToEmail);
router.delete('/:filename', auditLog('DELETE_BACKUP'), backupsController.deleteBackup);
router.post('/upload-restore', uploadSingle, auditLog('RESTORE_BACKUP'), backupsController.uploadAndRestore);

module.exports = router;
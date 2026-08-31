const Backups = require('../../models/admin/Backups.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const fs = require('fs');

const getBackupSettings = asyncHandler(async (req, res) => {
  const settings = await Backups.getBackupSettings();
  res.json(ApiResponse.ok(settings));
});

const updateBackupSettings = asyncHandler(async (req, res) => {
  const { enabled, frequency, emailOnCompletion, recipientEmail } = req.body;

  const settings = {
    enabled,
    frequency,
    emailOnCompletion,
    recipientEmail,
  };

  const updated = await Backups.updateBackupSettings(settings);

  res.json(ApiResponse.ok(updated, 'Backup settings updated'));
});

const createBackup = asyncHandler(async (req, res) => {
  const backup = await Backups.createBackup();

  res.status(201).json(ApiResponse.created(backup, 'Backup created'));
});

const listBackups = asyncHandler(async (req, res) => {
  const backups = await Backups.listBackups();

  res.json(ApiResponse.ok(backups));
});

const downloadBackup = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const filePath = await Backups.downloadBackup(filename);

  res.download(filePath, filename);
});

const sendBackupToEmail = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const { email } = req.body;

  if (!email) {
    throw ApiError.badRequest('Email is required');
  }

  await Backups.sendBackupToEmail(filename, email);

  res.json(ApiResponse.ok(null, 'Backup sent to email'));
});

const deleteBackup = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  await Backups.deleteBackup(filename);

  res.json(ApiResponse.ok(null, 'Backup deleted'));
});

const uploadAndRestore = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  const fileBuffer = fs.readFileSync(req.file.path);
  const result = await Backups.uploadAndRestore(fileBuffer, req.file.originalname);

  fs.unlinkSync(req.file.path);

  res.json(ApiResponse.ok(result, 'Backup restored successfully'));
});

module.exports = {
  getBackupSettings,
  updateBackupSettings,
  createBackup,
  listBackups,
  downloadBackup,
  sendBackupToEmail,
  deleteBackup,
  uploadAndRestore,
};
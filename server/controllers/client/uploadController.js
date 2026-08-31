const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const uploadService = require('../../services/uploadService.js');
const path = require('path');

const uploadSingleFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  const filePath = req.file.path;
  const fileType = req.file.mimetype.startsWith('image/') ? 'images' : req.file.mimetype.startsWith('video/') ? 'videos' : 'documents';

  const result = await uploadService.uploadFile(filePath, {
    folder: `rvnp-campus-hub/${fileType}`,
    resourceType: req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('video/') ? 'video' : 'raw',
  });

  res.status(201).json(ApiResponse.created(result));
});

const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('No files uploaded');
  }

  const results = [];

  for (const file of req.files) {
    const fileType = file.mimetype.startsWith('image/') ? 'images' : file.mimetype.startsWith('video/') ? 'videos' : 'documents';

    const result = await uploadService.uploadFile(file.path, {
      folder: `rvnp-campus-hub/${fileType}`,
      resourceType: file.mimetype.startsWith('image/') ? 'image' : file.mimetype.startsWith('video/') ? 'video' : 'raw',
    });

    results.push(result);
  }

  res.status(201).json(ApiResponse.created(results));
});

const deleteFile = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  const { resourceType } = req.body;

  if (!publicId) {
    throw ApiError.badRequest('Public ID is required');
  }

  const result = await uploadService.deleteFromCloudinary(publicId, resourceType || 'image');

  res.json(ApiResponse.ok(result, 'File deleted successfully'));
});

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
};
const cloudinary = require('../config/cloudinary.js');
const env = require('../config/env.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.js');

const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'rvnp-campus-hub',
      resource_type: options.resourceType || 'auto',
      transformation: options.transformation || null,
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    logger.error('Cloudinary upload failed:', error.message);
    throw error;
  }
};

const uploadImage = async (filePath, folder = 'rvnp-campus-hub/images') => {
  return uploadToCloudinary(filePath, { folder, resourceType: 'image' });
};

const uploadVideo = async (filePath, folder = 'rvnp-campus-hub/videos') => {
  return uploadToCloudinary(filePath, { folder, resourceType: 'video' });
};

const uploadAudio = async (filePath, folder = 'rvnp-campus-hub/audio') => {
  return uploadToCloudinary(filePath, { folder, resourceType: 'raw' });
};

const uploadDocument = async (filePath, folder = 'rvnp-campus-hub/documents') => {
  return uploadToCloudinary(filePath, { folder, resourceType: 'raw' });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    logger.error('Cloudinary delete failed:', error.message);
    throw error;
  }
};

const saveToLocal = async (filePath, folder = 'uploads') => {
  try {
    const fileName = path.basename(filePath);
    const relativePath = path.join(folder, fileName);
    return {
      url: `${env.upload.local.url}/${fileName}`,
      path: relativePath,
    };
  } catch (error) {
    logger.error('Local save failed:', error.message);
    throw error;
  }
};

const uploadFile = async (filePath, options = {}) => {
  if (env.upload.provider === 'cloudinary') {
    return uploadToCloudinary(filePath, options);
  } else {
    return saveToLocal(filePath, options.folder);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadDocument,
  deleteFromCloudinary,
  saveToLocal,
  uploadFile,
};
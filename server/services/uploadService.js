const cloudinary = require('../config/cloudinary.js');
const env = require('../config/env.js');
const prisma = require('../config/database.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.js');

const getUploadProvider = async () => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'uploadProvider' },
    });

    return setting?.value || env.upload.provider;
  } catch {
    return env.upload.provider;
  }
};

const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'rvnp-campus-hub',
      resource_type: options.resourceType || 'auto',
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

const uploadFile = async (filePath, options = {}) => {
  const provider = await getUploadProvider();

  if (provider === 'cloudinary') {
    return uploadToCloudinary(filePath, options);
  }

  const fileName = path.basename(filePath);
  return {
    url: `${env.upload.local.url}/${fileName}`,
    path: fileName,
  };
};

module.exports = {
  uploadToCloudinary,
  uploadFile,
};
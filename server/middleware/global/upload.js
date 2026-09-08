const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../../config/env.js');
const prisma = require('../../config/database.js');
const ApiError = require('../../utils/ApiError.js');

const DEFAULTS = {
  maxFileSize: 200,
  maxImages: 10,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
};

const getUploadConfig = async () => {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['maxFileSize', 'maxImages', 'maxVideos', 'allowedImageTypes', 'allowedVideoTypes', 'uploadProvider'],
        },
      },
    });

    const config = {};
    settings.forEach((setting) => {
      config[setting.key] = setting.value;
    });

    return {
      maxFileSize: (config.maxFileSize || DEFAULTS.maxFileSize) * 1024 * 1024,
      maxImages: config.maxImages || DEFAULTS.maxImages,
      maxVideos: config.maxVideos || 1,
      allowedImageTypes: config.allowedImageTypes || DEFAULTS.allowedImageTypes,
      allowedVideoTypes: config.allowedVideoTypes || DEFAULTS.allowedVideoTypes,
      provider: config.uploadProvider || env.upload.provider,
    };
  } catch {
    return {
      maxFileSize: DEFAULTS.maxFileSize * 1024 * 1024,
      maxImages: DEFAULTS.maxImages,
      maxVideos: 1,
      allowedImageTypes: DEFAULTS.allowedImageTypes,
      allowedVideoTypes: DEFAULTS.allowedVideoTypes,
      provider: env.upload.provider,
    };
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = env.upload.local.path;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = async (req, file, cb) => {
  const config = await getUploadConfig();

  if (
    config.allowedImageTypes.includes(file.mimetype) ||
    config.allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type not allowed. Allowed: ${[...config.allowedImageTypes, ...config.allowedVideoTypes].join(', ')}`), false);
  }
};

const createUploader = async () => {
  const config = await getUploadConfig();

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: config.maxFileSize,
      files: config.maxImages,
    },
  });
};

const uploadSingle = async (req, res, next) => {
  try {
    const uploader = await createUploader();
    return uploader.single('file')(req, res, next);
  } catch (error) {
    next(error);
  }
};

const uploadMultiple = async (req, res, next) => {
  try {
    const uploader = await createUploader();
    return uploader.array('files', 10)(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadSingle, uploadMultiple };
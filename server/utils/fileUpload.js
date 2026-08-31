const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env.js');
const ApiError = require('./ApiError.js');

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

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype) ||
    allowedAudioTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = upload;
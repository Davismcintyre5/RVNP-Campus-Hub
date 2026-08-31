const { v2: cloudinary } = require('cloudinary');
const env = require('./env.js');

if (env.upload.provider === 'cloudinary') {
  cloudinary.config({
    cloud_name: env.upload.cloudinary.cloudName,
    api_key: env.upload.cloudinary.apiKey,
    api_secret: env.upload.cloudinary.apiSecret,
  });
}

module.exports = cloudinary;
const Privacy = require('../../models/client/Privacy.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getPrivacySettings = asyncHandler(async (req, res) => {
  const privacy = await Privacy.getPrivacy(req.user.id);

  res.json(ApiResponse.ok(privacy));
});

const updatePrivacySettings = asyncHandler(async (req, res) => {
  const settings = req.body;

  if (!settings || Object.keys(settings).length === 0) {
    throw ApiError.badRequest('No settings provided');
  }

  const updated = await Privacy.updatePrivacy(req.user.id, settings);

  res.json(ApiResponse.ok(updated, 'Privacy settings updated'));
});

const resetPrivacySettings = asyncHandler(async (req, res) => {
  const defaults = await Privacy.resetPrivacy(req.user.id);

  res.json(ApiResponse.ok(defaults, 'Privacy settings reset to default'));
});

module.exports = {
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
};
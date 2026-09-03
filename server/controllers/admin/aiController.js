const aiService = require('../../services/aiService.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await aiService.getAISettings();
  res.json(ApiResponse.ok(settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const {
    enabled,
    name,
    avatarUrl,
    description,
    baseUrl,
    apiKey,
    chatEnabled,
    contentEnabled,
    commentAnalysisEnabled,
  } = req.body;

  const updated = await aiService.updateAISettings({
    enabled,
    name,
    avatarUrl,
    description,
    baseUrl,
    apiKey,
    chatEnabled,
    contentEnabled,
    commentAnalysisEnabled,
  });

  if (updated.enabled) {
    await aiService.ensureAIUser();
  }

  res.json(ApiResponse.ok(updated, 'AI settings updated'));
});

module.exports = {
  getSettings,
  updateSettings,
};
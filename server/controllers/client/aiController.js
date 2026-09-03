const aiService = require('../../services/aiService.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getStatus = asyncHandler(async (req, res) => {
  const settings = await aiService.getAISettings();

  res.json(
    ApiResponse.ok({
      enabled: settings.enabled,
      chatEnabled: settings.chatEnabled,
      contentEnabled: settings.contentEnabled,
      commentAnalysisEnabled: settings.commentAnalysisEnabled,
      name: settings.name,
      avatarUrl: settings.avatarUrl,
    })
  );
});

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw ApiError.badRequest('Message is required');
  }

  const result = await aiService.chatWithAI(req.user.id, message);

  res.json(
    ApiResponse.ok({
      aiUser: {
        id: result.aiUser.id,
        fullName: result.aiUser.fullName,
        avatarUrl: result.aiUser.avatarUrl,
        hdmVerified: result.aiUser.hdmVerified,
      },
      reply: result.response,
      provider: result.provider,
    })
  );
});

const generateContent = asyncHandler(async (req, res) => {
  const { prompt, type } = req.body;

  if (!prompt) {
    throw ApiError.badRequest('Prompt is required');
  }

  const content = await aiService.generateContent(req.user.id, prompt, type);

  res.json(ApiResponse.ok({ content: content.content }));
});

const analyzeComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const analysis = await aiService.analyzeComments(postId);

  res.json(ApiResponse.ok({ analysis }));
});

module.exports = {
  getStatus,
  chat,
  generateContent,
  analyzeComments,
};
const prisma = require('../config/database.js');
const hdmai = require('../config/hdmai.js');

const getAISettings = async () => {
  return hdmai.getConfig();
};

const updateAISettings = async (settings) => {
  const updates = {};

  if (settings.enabled !== undefined) updates.aiEnabled = settings.enabled;
  if (settings.name !== undefined) updates.aiName = settings.name;
  if (settings.avatarUrl !== undefined) updates.aiAvatarUrl = settings.avatarUrl;
  if (settings.description !== undefined) updates.aiDescription = settings.description;
  if (settings.baseUrl !== undefined) updates.aiBaseUrl = settings.baseUrl;
  if (settings.apiKey !== undefined) updates.aiApiKey = settings.apiKey;
  if (settings.chatEnabled !== undefined) updates.aiChatEnabled = settings.chatEnabled;
  if (settings.contentEnabled !== undefined) updates.aiContentEnabled = settings.contentEnabled;
  if (settings.commentAnalysisEnabled !== undefined) updates.aiCommentAnalysisEnabled = settings.commentAnalysisEnabled;

  for (const [key, value] of Object.entries(updates)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return hdmai.getConfig();
};

const ensureAIUser = async () => {
  const config = await hdmai.getConfig();

  if (!config.enabled) return null;

  const aiUser = await prisma.user.findFirst({
    where: { isAI: true },
  });

  if (aiUser) {
    await prisma.user.update({
      where: { id: aiUser.id },
      data: {
        fullName: config.name,
        avatarUrl: config.avatarUrl,
        bio: config.description,
      },
    });

    return aiUser;
  }

  const newAIUser = await prisma.user.create({
    data: {
      fullName: config.name,
      email: 'ai@hdm.com',
      phoneNumber: '+254700000000',
      passwordHash: 'ai-user-no-login',
      role: 'STAFF',
      verificationStatus: 'VERIFIED',
      hdmVerified: true,
      isAI: true,
      avatarUrl: config.avatarUrl,
      bio: config.description,
    },
  });

  return newAIUser;
};

const chatWithAI = async (userId, message) => {
  const aiUser = await ensureAIUser();

  if (!aiUser) {
    throw new Error('AI is not enabled');
  }

  const response = await hdmai.chat(message);

  return {
    aiUser,
    response: response.reply,
    provider: response.provider,
    tokensUsed: response.tokensUsed,
  };
};

const generateContent = async (userId, prompt, type = 'post') => {
  const response = await hdmai.generateContent(prompt, type);

  return {
    content: response.content,
    provider: response.provider,
  };
};

const analyzeComments = async (postId) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      deletedAt: null,
    },
    select: {
      content: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (comments.length === 0) {
    return { summary: 'No comments to analyze yet.' };
  }

  const formattedComments = comments.map((c) => ({
    user: c.user?.fullName || 'Anonymous',
    text: c.content,
  }));

  const analysis = await hdmai.analyzeComments(formattedComments);

  return analysis;
};

const suggestReply = async (commentText) => {
  const response = await hdmai.suggestReply(commentText);

  return {
    suggestion: response.suggestion,
  };
};

module.exports = {
  getAISettings,
  updateAISettings,
  ensureAIUser,
  chatWithAI,
  generateContent,
  analyzeComments,
  suggestReply,
};
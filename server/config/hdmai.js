const axios = require('axios');
const prisma = require('./database.js');

const hdmai = {
  getConfig: async () => {
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['aiEnabled', 'aiName', 'aiAvatarUrl', 'aiDescription', 'aiBaseUrl', 'aiApiKey', 'aiChatEnabled', 'aiContentEnabled', 'aiCommentAnalysisEnabled'],
        },
      },
    });

    const config = {};
    settings.forEach((setting) => {
      config[setting.key] = setting.value;
    });

    return {
      enabled: config.aiEnabled || false,
      name: config.aiName || 'HDM AI',
      avatarUrl: config.aiAvatarUrl || null,
      description: config.aiDescription || 'Your campus AI assistant',
      baseUrl: config.aiBaseUrl || 'https://hdmaiserver.pxxl.click/api/v1',
      apiKey: config.aiApiKey || null,
      chatEnabled: config.aiChatEnabled || false,
      contentEnabled: config.aiContentEnabled || false,
      commentAnalysisEnabled: config.aiCommentAnalysisEnabled || false,
    };
  },

  callChatAPI: async (message, systemPrompt) => {
    const config = await hdmai.getConfig();

    if (!config.enabled || !config.apiKey) {
      throw new Error('AI is not enabled');
    }

    const endpoint = `${config.baseUrl}/projects/general/public-chat`;

    const response = await axios.post(
      endpoint,
      {
        message,
        system_prompt: systemPrompt,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.success) {
      return response.data.data;
    }

    throw new Error('AI API error');
  },

  chat: async (message) => {
    const config = await hdmai.getConfig();

    if (!config.chatEnabled) {
      throw new Error('AI chat is not enabled');
    }

    const systemPrompt = `You are ${config.name}, a friendly campus AI assistant for RVNP Campus Hub. You help students and staff with questions about campus life, academics, events, and general conversation. You are knowledgeable about Rift Valley National Polytechnic which has 5 campuses: Main Campus, Nakuru City Campus, Kericho Campus, Mwachon Campus, and Kureisoi Campus. Be helpful, friendly, and concise.`;

    const result = await hdmai.callChatAPI(message, systemPrompt);

    return {
      reply: result.reply,
      provider: result.provider,
      tokensUsed: result.tokens_used,
    };
  },

  generateContent: async (prompt, type = 'post') => {
    const config = await hdmai.getConfig();

    if (!config.contentEnabled) {
      throw new Error('AI content generation is not enabled');
    }

    let systemPrompt = '';

    switch (type) {
      case 'post':
        systemPrompt = `You are a content writer for RVNP Campus Hub. Write engaging, student-friendly social media posts. The tone should be upbeat, inclusive, and campus-appropriate. Keep posts between 50-150 words. Use emojis sparingly. Write in first person or neutral tone as appropriate.`;
        break;

      case 'reel_caption':
        systemPrompt = `You are a caption writer for RVNP Campus Hub. Write short, catchy captions for short videos (reels). Keep captions under 50 words. Use relevant hashtags. Make them fun and engaging for students.`;
        break;

      case 'event':
        systemPrompt = `You are an event promoter for RVNP Campus Hub. Write exciting event announcements that attract students. Include a catchy headline, brief description, and call to action. Keep under 100 words.`;
        break;

      default:
        systemPrompt = `You are a content writer for RVNP Campus Hub. Write helpful, engaging content for students.`;
    }

    const result = await hdmai.callChatAPI(prompt, systemPrompt);

    return {
      content: result.reply,
      provider: result.provider,
    };
  },

  analyzeComments: async (comments) => {
    const config = await hdmai.getConfig();

    if (!config.commentAnalysisEnabled) {
      throw new Error('AI comment analysis is not enabled');
    }

    const systemPrompt = `You are a comment analyzer for RVNP Campus Hub. Analyze the comments provided and return a JSON object with:
1. "summary": A brief summary of what people are saying
2. "sentiment": { "positive": percentage, "neutral": percentage, "negative": percentage }
3. "keyTopics": Array of main topics discussed
4. "notableComments": Array of 2-3 most interesting comments

Be objective and accurate. Only return valid JSON.`;

    const commentsText = comments.map((c) => `${c.user}: ${c.text}`).join('\n');

    const result = await hdmai.callChatAPI(
      `Analyze these comments:\n\n${commentsText}`,
      systemPrompt
    );

    try {
      const parsed = JSON.parse(result.reply);
      return parsed;
    } catch {
      return {
        summary: result.reply,
        sentiment: { positive: 0, neutral: 100, negative: 0 },
        keyTopics: [],
        notableComments: [],
      };
    }
  },

  suggestReply: async (commentText) => {
    const config = await hdmai.getConfig();

    if (!config.chatEnabled) {
      throw new Error('AI is not enabled');
    }

    const systemPrompt = `You are a helpful assistant for RVNP Campus Hub. Suggest a friendly, appropriate reply to the following comment. Keep it short and natural.`;

    const result = await hdmai.callChatAPI(commentText, systemPrompt);

    return {
      suggestion: result.reply,
    };
  },
};

module.exports = hdmai;
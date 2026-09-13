const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[\w]+/g) || [];
  return [...new Set(matches.map((tag) => tag.replace('#', '').toLowerCase()))];
};

const extractMentions = (text) => {
  if (!text) return [];
  const matches = text.match(/@[\w]+/g) || [];
  return [...new Set(matches.map((mention) => mention.replace('@', '')))];
};

const parseContent = (text) => {
  return {
    text,
    hashtags: extractHashtags(text),
    mentions: extractMentions(text),
  };
};

module.exports = {
  extractHashtags,
  extractMentions,
  parseContent,
};
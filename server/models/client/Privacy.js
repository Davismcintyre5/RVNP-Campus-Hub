const prisma = require('../../config/database.js');

const DEFAULT_PRIVACY = {
  profileVisibility: 'EVERYONE',
  showEmail: false,
  showPhone: false,
  showCourse: true,
  showYearOfStudy: true,
  postVisibility: 'EVERYONE',
  reelVisibility: 'EVERYONE',
  storyVisibility: 'EVERYONE',
  commentPermission: 'EVERYONE',
  reactionPermission: 'EVERYONE',
  followPermission: 'EVERYONE',
  messagePermission: 'EVERYONE',
  friendRequestPermission: 'EVERYONE',
  allowStoryReplies: true,
  allowStoryReactions: true,
  showInSearch: true,
  showInCampusDirectory: true,
  showOnlineStatus: true,
  showLastSeen: true,
  showReadReceipts: true,
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  notifyOnFollower: true,
  notifyOnMessage: true,
  notifyOnReaction: true,
  notifyOnComment: true,
  notifyOnGroupInvite: true,
  notifyOnEventReminder: true,
  privateAccount: false,
  twoFactorAuth: false,
};

const getPrivacy = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { privacySettings: true },
  });

  if (!user?.privacySettings) {
    return DEFAULT_PRIVACY;
  }

  return { ...DEFAULT_PRIVACY, ...user.privacySettings };
};

const updatePrivacy = async (userId, settings) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { privacySettings: true },
  });

  const current = user?.privacySettings || DEFAULT_PRIVACY;
  const updated = { ...current, ...settings };

  await prisma.user.update({
    where: { id: userId },
    data: { privacySettings: updated },
  });

  return updated;
};

const resetPrivacy = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { privacySettings: DEFAULT_PRIVACY },
  });

  return DEFAULT_PRIVACY;
};

module.exports = {
  DEFAULT_PRIVACY,
  getPrivacy,
  updatePrivacy,
  resetPrivacy,
};
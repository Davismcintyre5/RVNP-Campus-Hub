const prisma = require('../../config/database.js');
const notificationService = require('../../services/notificationService.js');

const DEFAULT_BADGES = [
  { name: 'Top Contributor', description: '50+ posts', icon: '🏆' },
  { name: 'Top Fan', description: '100+ reactions given', icon: '💎' },
  { name: 'Rising Star', description: '10+ posts in a week', icon: '⭐' },
  { name: 'Chatterbox', description: '500+ messages', icon: '💬' },
  { name: 'Group Leader', description: 'Created 3+ groups', icon: '👑' },
  { name: 'Marketplace Pro', description: 'Sold 10+ items', icon: '🛒' },
  { name: 'Event Guru', description: 'Attended 5+ events', icon: '🎯' },
  { name: 'Streak', description: 'Posted 7 days in a row', icon: '🔥' },
];

const seedBadges = async () => {
  for (const badge of DEFAULT_BADGES) {
    const existing = await prisma.badge.findFirst({
      where: { name: badge.name },
    });

    if (!existing) {
      await prisma.badge.create({
        data: badge,
      });
    }
  }
};

const findAll = async () => {
  return prisma.badge.findMany();
};

const findById = async (id) => {
  return prisma.badge.findUnique({
    where: { id },
  });
};

const getUserBadges = async (userId) => {
  return prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: { earnedAt: 'desc' },
  });
};

const awardBadge = async (userId, badgeId) => {
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
  });

  if (existing) return existing;

  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
    include: {
      badge: true,
    },
  });

  await notificationService.createNotification({
    userId,
    type: 'SYSTEM',
    title: 'New Badge Earned!',
    body: `You earned the ${userBadge.badge.icon} ${userBadge.badge.name} badge: ${userBadge.badge.description}`,
    data: {
      badgeId: userBadge.badgeId,
      badgeName: userBadge.badge.name,
      badgeIcon: userBadge.badge.icon,
    },
  });

  return userBadge;
};

const checkAndAwardBadges = async (userId) => {
  await seedBadges();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
          reactions: true,
          sentMessages: true,
          createdGroups: true,
          listings: true,
        },
      },
    },
  });

  if (!user) return;

  const badges = await prisma.badge.findMany();
  const badgeMap = {};
  badges.forEach((b) => {
    badgeMap[b.name] = b.id;
  });

  const newlyAwarded = [];

  if (user._count.posts >= 50) {
    const result = await awardBadge(userId, badgeMap['Top Contributor']);
    if (result) newlyAwarded.push(result);
  }

  if (user._count.reactions >= 100) {
    const result = await awardBadge(userId, badgeMap['Top Fan']);
    if (result) newlyAwarded.push(result);
  }

  if (user._count.sentMessages >= 500) {
    const result = await awardBadge(userId, badgeMap['Chatterbox']);
    if (result) newlyAwarded.push(result);
  }

  if (user._count.createdGroups >= 3) {
    const result = await awardBadge(userId, badgeMap['Group Leader']);
    if (result) newlyAwarded.push(result);
  }

  if (user._count.listings >= 10) {
    const result = await awardBadge(userId, badgeMap['Marketplace Pro']);
    if (result) newlyAwarded.push(result);
  }

  return newlyAwarded;
};

module.exports = {
  seedBadges,
  findAll,
  findById,
  getUserBadges,
  awardBadge,
  checkAndAwardBadges,
  DEFAULT_BADGES,
};
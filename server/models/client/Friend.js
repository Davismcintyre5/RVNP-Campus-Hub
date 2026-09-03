const prisma = require('../../config/database.js');

const getMutualFriends = async (userId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const myFollowings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = myFollowings.map((f) => f.followingId);

  const [friends, total] = await Promise.all([
    prisma.follow.findMany({
      where: {
        followingId: userId,
        followerId: { in: followingIds },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        follower: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hdmVerified: true,
            course: true,
            campus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.follow.count({
      where: {
        followingId: userId,
        followerId: { in: followingIds },
      },
    }),
  ]);

  return { friends, total };
};

const isMutualFriend = async (user1Id, user2Id) => {
  const [user1FollowsUser2, user2FollowsUser1] = await Promise.all([
    prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user1Id,
          followingId: user2Id,
        },
      },
    }),
    prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user2Id,
          followingId: user1Id,
        },
      },
    }),
  ]);

  return !!user1FollowsUser2 && !!user2FollowsUser1;
};

const getFriendCount = async (userId) => {
  const myFollowings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = myFollowings.map((f) => f.followingId);

  return prisma.follow.count({
    where: {
      followingId: userId,
      followerId: { in: followingIds },
    },
  });
};

const getFriendSuggestions = async (userId, limit = 10) => {
  const myFollowings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = myFollowings.map((f) => f.followingId);
  followingIds.push(userId);

  const friendsOfFriends = await prisma.follow.findMany({
    where: {
      followerId: { in: followingIds },
      followingId: { notIn: followingIds },
    },
    select: { followingId: true },
    distinct: ['followingId'],
    take: limit,
  });

  const suggestionIds = friendsOfFriends.map((f) => f.followingId);

  return prisma.user.findMany({
    where: {
      id: { in: suggestionIds },
      accountStatus: 'ACTIVE',
    },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      hdmVerified: true,
      course: true,
      campus: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
};

const getMessageableUsers = async (userId, { page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const myFollowings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const myFollowers = await prisma.follow.findMany({
    where: { followingId: userId },
    select: { followerId: true },
  });

  const followingIds = myFollowings.map((f) => f.followingId);
  const followerIds = myFollowers.map((f) => f.followerId);

  const messageableIds = [...new Set([...followingIds, ...followerIds])];

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        id: { in: messageableIds },
        accountStatus: 'ACTIVE',
      },
      skip,
      take: limit,
      orderBy: { fullName: 'asc' },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        hdmVerified: true,
        course: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.user.count({
      where: {
        id: { in: messageableIds },
        accountStatus: 'ACTIVE',
      },
    }),
  ]);

  const usersWithRelation = users.map((user) => {
    const isFriend = followingIds.includes(user.id) && followerIds.includes(user.id);
    const isFollowing = followingIds.includes(user.id);
    const isFollower = followerIds.includes(user.id);

    return {
      ...user,
      relation: isFriend ? 'FRIEND' : isFollowing ? 'FOLLOWING' : 'FOLLOWER',
      isFriend,
      isFollowing,
      isFollower,
    };
  });

  return { users: usersWithRelation, total };
};

module.exports = {
  getMutualFriends,
  isMutualFriend,
  getFriendCount,
  getFriendSuggestions,
  getMessageableUsers,
};
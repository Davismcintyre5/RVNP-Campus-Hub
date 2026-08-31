const fs = require('fs');
const path = require('path');
const env = require('../../config/env.js');
const prisma = require('../../config/database.js');
const emailService = require('../../services/emailService.js');

const DEFAULT_SETTINGS = {
  enabled: true,
  frequency: 'daily',
  emailOnCompletion: true,
  recipientEmail: 'admin@rvnp.ac.ke',
};

const getSettingsFilePath = () => {
  const backupDir = path.resolve(env.backup.path);
  return path.join(backupDir, 'backup-settings.json');
};

const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(env.backup.path);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const [
    campuses,
    departments,
    users,
    posts,
    reels,
    comments,
    reactions,
    groups,
    groupMembers,
    stories,
    events,
    marketplaceListings,
    notifications,
    reports,
    settings,
    legals,
    follows,
    conversations,
    conversationParticipants,
    messages,
  ] = await Promise.all([
    prisma.campus.findMany(),
    prisma.department.findMany(),
    prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        coverUrl: true,
        bio: true,
        role: true,
        accountStatus: true,
        verificationStatus: true,
        campusId: true,
        departmentId: true,
        course: true,
        yearOfStudy: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.post.findMany(),
    prisma.reel.findMany(),
    prisma.comment.findMany(),
    prisma.reaction.findMany(),
    prisma.group.findMany(),
    prisma.groupMember.findMany(),
    prisma.story.findMany(),
    prisma.event.findMany(),
    prisma.marketplaceListing.findMany(),
    prisma.notification.findMany(),
    prisma.report.findMany(),
    prisma.setting.findMany(),
    prisma.legal.findMany(),
    prisma.follow.findMany(),
    prisma.conversation.findMany(),
    prisma.conversationParticipant.findMany(),
    prisma.message.findMany(),
  ]);

  const backupData = {
    metadata: {
      appName: 'RVNP Campus Hub',
      tagline: 'RVNP Connected',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      type: 'manual',
      totalRecords: {
        campuses: campuses.length,
        departments: departments.length,
        users: users.length,
        posts: posts.length,
        reels: reels.length,
        comments: comments.length,
        reactions: reactions.length,
        groups: groups.length,
        groupMembers: groupMembers.length,
        stories: stories.length,
        events: events.length,
        marketplaceListings: marketplaceListings.length,
        notifications: notifications.length,
        reports: reports.length,
        settings: settings.length,
        legals: legals.length,
        follows: follows.length,
        conversations: conversations.length,
        conversationParticipants: conversationParticipants.length,
        messages: messages.length,
      },
    },
    data: {
      campuses,
      departments,
      users,
      posts,
      reels,
      comments,
      reactions,
      groups,
      groupMembers,
      stories,
      events,
      marketplaceListings,
      notifications,
      reports,
      settings,
      legals,
      follows,
      conversations,
      conversationParticipants,
      messages,
    },
  };

  const filename = `rvnp-backup-${timestamp}.json`;
  const filePath = path.join(backupDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

  const stats = fs.statSync(filePath);

  return {
    id: Date.now().toString(),
    filename,
    size: stats.size,
    type: 'manual',
    status: 'completed',
    createdAt: new Date().toISOString(),
    totalRecords: backupData.metadata.totalRecords,
  };
};

const listBackups = async () => {
  const backupDir = path.resolve(env.backup.path);

  if (!fs.existsSync(backupDir)) {
    return [];
  }

  const files = fs.readdirSync(backupDir).filter((file) => file.endsWith('.json') && file !== 'backup-settings.json');

  return files.map((file) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);

    return {
      filename: file,
      size: stats.size,
      createdAt: stats.mtime.toISOString(),
    };
  });
};

const downloadBackup = async (filename) => {
  const backupDir = path.resolve(env.backup.path);
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error('Backup file not found');
  }

  return filePath;
};

const sendBackupToEmail = async (filename, email) => {
  const backupDir = path.resolve(env.backup.path);
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error('Backup file not found');
  }

  const backupData = fs.readFileSync(filePath, 'utf8');

  await emailService.sendEmail({
    to: email,
    subject: `RVNP Campus Hub Backup - ${filename}`,
    htmlBody: `<p>Backup file attached.</p>`,
    textBody: `Backup file: ${filename}\n\n${backupData}`,
  });

  return true;
};

const deleteBackup = async (filename) => {
  const backupDir = path.resolve(env.backup.path);
  const filePath = path.join(backupDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error('Backup file not found');
  }

  fs.unlinkSync(filePath);
  return true;
};

const uploadAndRestore = async (fileBuffer, filename) => {
  const backupDir = path.resolve(env.backup.path);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const filePath = path.join(backupDir, filename);
  fs.writeFileSync(filePath, fileBuffer);

  const backupData = JSON.parse(fileBuffer.toString());

  return {
    restored: true,
    backup: backupData,
  };
};

const getBackupSettings = async () => {
  const settingsFilePath = getSettingsFilePath();

  if (!fs.existsSync(settingsFilePath)) {
    const backupDir = path.resolve(env.backup.path);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.writeFileSync(settingsFilePath, JSON.stringify(DEFAULT_SETTINGS, null, 2));

    return DEFAULT_SETTINGS;
  }

  const settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));

  return settings;
};

const updateBackupSettings = async (settings) => {
  const backupDir = path.resolve(env.backup.path);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const settingsFilePath = getSettingsFilePath();

  const updatedSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2));

  return updatedSettings;
};

module.exports = {
  createBackup,
  listBackups,
  downloadBackup,
  sendBackupToEmail,
  deleteBackup,
  uploadAndRestore,
  getBackupSettings,
  updateBackupSettings,
};
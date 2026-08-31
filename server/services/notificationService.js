const emailService = require('./emailService.js');
const smsService = require('./smsService.js');
const socketService = require('./socketService.js');
const prisma = require('../config/database.js');

const createNotification = async ({ userId, type, title, body, data = null }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data,
      },
    });

    socketService.notifyUser(userId, notification);
    return notification;
  } catch (error) {
    console.error('Create notification error:', error.message);
    throw error;
  }
};

const createCampusNotification = async ({ campusId, type, title, body, data = null }) => {
  try {
    const campusUsers = await prisma.user.findMany({
      where: { campusId },
      select: { id: true },
    });

    const notifications = [];

    for (const user of campusUsers) {
      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          title,
          body,
          data,
        },
      });
      notifications.push(notification);
    }

    socketService.notifyCampus(campusId, { type, title, body, data });
    return notifications;
  } catch (error) {
    console.error('Create campus notification error:', error.message);
    throw error;
  }
};

const createGroupNotification = async ({ groupId, type, title, body, data = null }) => {
  try {
    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
    });

    const notifications = [];

    for (const member of groupMembers) {
      const notification = await prisma.notification.create({
        data: {
          userId: member.userId,
          type,
          title,
          body,
          data,
        },
      });
      notifications.push(notification);
    }

    socketService.notifyGroup(groupId, { type, title, body, data });
    return notifications;
  } catch (error) {
    console.error('Create group notification error:', error.message);
    throw error;
  }
};

const notifyWithEmailAndSMS = async ({ userId, email, phone, notificationType, emailData, smsData }) => {
  if (email) {
    try {
      await emailService.sendEmail({
        to: email,
        ...emailData,
      });
    } catch (error) {
      console.error('Email notification failed:', error.message);
    }
  }

  if (phone) {
    try {
      await smsService.sendSMS({
        to: phone,
        ...smsData,
      });
    } catch (error) {
      console.error('SMS notification failed:', error.message);
    }
  }

  if (userId) {
    await createNotification({
      userId,
      type: notificationType,
      title: emailData?.subject || smsData?.message || 'Notification',
      body: smsData?.message || emailData?.subject || '',
    });
  }
};

const markAsRead = async (notificationId) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

const deleteNotification = async (notificationId) => {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
};

module.exports = {
  createNotification,
  createCampusNotification,
  createGroupNotification,
  notifyWithEmailAndSMS,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
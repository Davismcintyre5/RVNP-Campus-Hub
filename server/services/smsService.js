const hdmbridge = require('../config/hdmbridge.js');
const brevo = require('../config/brevo.js');
const env = require('../config/env.js');
const logger = require('../utils/logger.js');
const smsTemplates = require('../templates/smsTemplates.js');

const sendSMS = async ({ to, message }) => {
  try {
    if (env.sms.provider === 'hdm') {
      return await hdmbridge.sendSMS({ to, message });
    } else if (env.sms.provider === 'brevo') {
      return await brevo.sendSMS({ to, message });
    }
    throw new Error('Invalid SMS provider');
  } catch (error) {
    logger.error('SMS sending failed:', error.message);
    throw error;
  }
};

const sendWelcomeSMS = async ({ to, fullName }) => {
  const message = smsTemplates.welcomeSMS({ fullName });
  return sendSMS({ to, message });
};

const sendOtpSMS = async ({ to, otp, purpose }) => {
  const message = smsTemplates.otpSMS({ otp, purpose });
  return sendSMS({ to, message });
};

const sendPasswordResetOtpSMS = async ({ to, otp }) => {
  const message = smsTemplates.passwordResetOtpSMS({ otp });
  return sendSMS({ to, message });
};

const sendLoginAlertSMS = async ({ to, device, time }) => {
  const message = smsTemplates.loginAlertSMS({ device, time });
  return sendSMS({ to, message });
};

const sendSuspiciousActivitySMS = async ({ to, activity }) => {
  const message = smsTemplates.suspiciousActivitySMS({ activity });
  return sendSMS({ to, message });
};

const sendAccountSuspensionSMS = async ({ to, reason }) => {
  const message = smsTemplates.accountSuspensionSMS({ reason });
  return sendSMS({ to, message });
};

const sendEventReminderSMS = async ({ to, eventTitle, eventDate, eventLocation }) => {
  const message = smsTemplates.eventReminderSMS({ eventTitle, eventDate, eventLocation });
  return sendSMS({ to, message });
};

const sendGroupInvitationSMS = async ({ to, groupName, inviterName }) => {
  const message = smsTemplates.groupInvitationSMS({ groupName, inviterName });
  return sendSMS({ to, message });
};

const sendNewOfferSMS = async ({ to, listingTitle, offerAmount }) => {
  const message = smsTemplates.newOfferSMS({ listingTitle, offerAmount });
  return sendSMS({ to, message });
};

const sendOfferAcceptedSMS = async ({ to, listingTitle, amount }) => {
  const message = smsTemplates.offerAcceptedSMS({ listingTitle, amount });
  return sendSMS({ to, message });
};

const sendItemSoldSMS = async ({ to, listingTitle }) => {
  const message = smsTemplates.itemSoldSMS({ listingTitle });
  return sendSMS({ to, message });
};

const sendAdminAlertSMS = async ({ to, alertType, details }) => {
  const message = smsTemplates.adminAlertSMS({ alertType, details });
  return sendSMS({ to, message });
};

const sendWeeklySummarySMS = async ({ to, totalUsers, totalPosts, totalReels }) => {
  const message = smsTemplates.weeklySummarySMS({ totalUsers, totalPosts, totalReels });
  return sendSMS({ to, message });
};

module.exports = {
  sendSMS,
  sendWelcomeSMS,
  sendOtpSMS,
  sendPasswordResetOtpSMS,
  sendLoginAlertSMS,
  sendSuspiciousActivitySMS,
  sendAccountSuspensionSMS,
  sendEventReminderSMS,
  sendGroupInvitationSMS,
  sendNewOfferSMS,
  sendOfferAcceptedSMS,
  sendItemSoldSMS,
  sendAdminAlertSMS,
  sendWeeklySummarySMS,
};
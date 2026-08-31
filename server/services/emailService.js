const hdmbridge = require('../config/hdmbridge.js');
const brevo = require('../config/brevo.js');
const env = require('../config/env.js');
const prisma = require('../config/database.js');
const logger = require('../utils/logger.js');
const emailTemplates = require('../templates/emailTemplates.js');

const getEmailLogoUrl = async () => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'emailLogoUrl' },
    });

    return setting?.value?.url || setting?.value || null;
  } catch (error) {
    logger.error('Failed to fetch email logo:', error.message);
    return null;
  }
};

const getSupportContact = async () => {
  try {
    const [supportEmail, supportPhone] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'supportEmail' } }),
      prisma.setting.findUnique({ where: { key: 'supportPhone' } }),
    ]);

    return {
      email: supportEmail?.value || 'support@rvnp.ac.ke',
      phone: supportPhone?.value || '+254700000000',
    };
  } catch (error) {
    return {
      email: 'support@rvnp.ac.ke',
      phone: '+254700000000',
    };
  }
};

const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
  try {
    if (env.email.provider === 'hdm') {
      return await hdmbridge.sendEmail({ to, subject, htmlBody, textBody });
    } else if (env.email.provider === 'brevo') {
      return await brevo.sendEmail({ to, subject, htmlBody, textBody });
    }
    throw new Error('Invalid email provider');
  } catch (error) {
    logger.error('Email sending failed:', error.message);
    throw error;
  }
};

const sendWelcomeEmail = async ({ to, fullName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.welcomeEmail({ fullName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Welcome to RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendVerificationEmail = async ({ to, fullName, otp }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.verificationEmail({ fullName, otp, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Verify Your Email - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendPasswordResetEmail = async ({ to, fullName, resetUrl }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.passwordResetEmail({ fullName, resetUrl, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Reset Your Password - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendPasswordResetSuccess = async ({ to, fullName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.passwordResetSuccess({ fullName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Password Reset Successful', htmlBody: html, textBody: text });
};

const sendAccountSuspension = async ({ to, fullName, reason }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.accountSuspension({ fullName, reason, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Account Suspended - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendAccountReactivation = async ({ to, fullName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.accountReactivation({ fullName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Account Reactivated - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendAccountDeletion = async ({ to, fullName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.accountDeletion({ fullName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Account Deleted - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendNewLoginAlert = async ({ to, fullName, device, location, time }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.newLoginAlert({ fullName, device, location, time, logoUrl, supportContact });
  return sendEmail({ to, subject: 'New Login Detected - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendNewFollower = async ({ to, fullName, followerName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.newFollower({ fullName, followerName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'New Follower - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendGroupInvitation = async ({ to, fullName, groupName, inviterName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.groupInvitation({ fullName, groupName, inviterName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Group Invitation - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendEventInvitation = async ({ to, fullName, eventTitle, eventDate, eventLocation }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.eventInvitation({ fullName, eventTitle, eventDate, eventLocation, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Event Invitation - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendEventReminder = async ({ to, fullName, eventTitle, eventDate, eventLocation }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.eventReminder({ fullName, eventTitle, eventDate, eventLocation, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Event Reminder - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendListingApproved = async ({ to, fullName, listingTitle }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.listingApproved({ fullName, listingTitle, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Listing Approved - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendListingRejected = async ({ to, fullName, listingTitle, reason }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.listingRejected({ fullName, listingTitle, reason, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Listing Rejected - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendNewOfferReceived = async ({ to, fullName, listingTitle, offerAmount, buyerName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.newOfferReceived({ fullName, listingTitle, offerAmount, buyerName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'New Offer Received - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendOfferAccepted = async ({ to, fullName, listingTitle, amount }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.offerAccepted({ fullName, listingTitle, amount, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Offer Accepted - RVNP Campus Hub', htmlBody: html, textBody: text });
};

const sendAdminWelcome = async ({ to, fullName }) => {
  const [logoUrl, supportContact] = await Promise.all([
    getEmailLogoUrl(),
    getSupportContact(),
  ]);

  const { html, text } = emailTemplates.adminWelcome({ fullName, logoUrl, supportContact });
  return sendEmail({ to, subject: 'Welcome to Admin Dashboard', htmlBody: html, textBody: text });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccess,
  sendAccountSuspension,
  sendAccountReactivation,
  sendAccountDeletion,
  sendNewLoginAlert,
  sendNewFollower,
  sendGroupInvitation,
  sendEventInvitation,
  sendEventReminder,
  sendListingApproved,
  sendListingRejected,
  sendNewOfferReceived,
  sendOfferAccepted,
  sendAdminWelcome,
};
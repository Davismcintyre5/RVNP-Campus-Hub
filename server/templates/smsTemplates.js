const SUPPORT_CONTACT = {
  phone: '+254700000000',
};

const welcomeSMS = ({ fullName }) => {
  return `Welcome to RVNP Campus Hub, ${fullName}! Connect with all 5 campuses. Support: ${SUPPORT_CONTACT.phone}`;
};

const otpSMS = ({ otp, purpose = 'verification' }) => {
  return `Your RVNP Campus Hub ${purpose} code is: ${otp}. Expires in 10 minutes. Do not share this code. Support: ${SUPPORT_CONTACT.phone}`;
};

const passwordResetOtpSMS = ({ otp }) => {
  return `Your RVNP Campus Hub password reset code is: ${otp}. Expires in 10 minutes. Support: ${SUPPORT_CONTACT.phone}`;
};

const loginAlertSMS = ({ device, time }) => {
  return `New login to your RVNP Campus Hub account. Device: ${device}, Time: ${time}. If not you, reset password now. Support: ${SUPPORT_CONTACT.phone}`;
};

const suspiciousActivitySMS = ({ activity }) => {
  return `Suspicious activity detected on your RVNP Campus Hub account: ${activity}. Contact support: ${SUPPORT_CONTACT.phone}`;
};

const accountSuspensionSMS = ({ reason }) => {
  return `Your RVNP Campus Hub account has been suspended. Reason: ${reason}. Contact support: ${SUPPORT_CONTACT.phone}`;
};

const eventReminderSMS = ({ eventTitle, eventDate, eventLocation }) => {
  return `Reminder: ${eventTitle} on ${eventDate} at ${eventLocation}. - RVNP Campus Hub`;
};

const groupInvitationSMS = ({ groupName, inviterName }) => {
  return `${inviterName} invited you to join "${groupName}" on RVNP Campus Hub.`;
};

const newOfferSMS = ({ listingTitle, offerAmount }) => {
  return `New offer on your listing "${listingTitle}": KSh ${offerAmount}. - RVNP Campus Hub`;
};

const offerAcceptedSMS = ({ listingTitle, amount }) => {
  return `Your offer on "${listingTitle}" was accepted! Amount: KSh ${amount}. - RVNP Campus Hub`;
};

const itemSoldSMS = ({ listingTitle }) => {
  return `Your listing "${listingTitle}" has been marked as sold. - RVNP Campus Hub`;
};

const adminAlertSMS = ({ alertType, details }) => {
  return `[ADMIN ALERT] ${alertType}: ${details}. - RVNP Campus Hub`;
};

const weeklySummarySMS = ({ totalUsers, totalPosts, totalReels }) => {
  return `RVNP Hub Weekly: ${totalUsers} users, ${totalPosts} posts, ${totalReels} reels. - RVNP Campus Hub`;
};

module.exports = {
  welcomeSMS,
  otpSMS,
  passwordResetOtpSMS,
  loginAlertSMS,
  suspiciousActivitySMS,
  accountSuspensionSMS,
  eventReminderSMS,
  groupInvitationSMS,
  newOfferSMS,
  offerAcceptedSMS,
  itemSoldSMS,
  adminAlertSMS,
  weeklySummarySMS,
};
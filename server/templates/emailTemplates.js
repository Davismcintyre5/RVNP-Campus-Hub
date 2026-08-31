const BRAND_COLORS = {
  primary: '#006400',
  secondary: '#CC0000',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#666666',
  background: '#F5F5F5',
};

const emailLayout = ({ title, contentHtml, contentText, logoUrl = null, supportContact = null }) => {
  const support = supportContact || {
    email: 'support@rvnp.ac.ke',
    phone: '+254700000000',
  };

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="RVNP Campus Hub Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">`
    : `<h1 style="color: ${BRAND_COLORS.white}; font-size: 22px; margin: 0; font-weight: 600;">RVNP Campus Hub</h1>`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: ${BRAND_COLORS.background};
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${BRAND_COLORS.white};
        }
        .header {
          background-color: ${BRAND_COLORS.primary};
          padding: 30px 40px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
          height: auto;
          margin-bottom: 10px;
        }
        .header h1 {
          color: ${BRAND_COLORS.white};
          font-size: 22px;
          margin: 0;
          font-weight: 600;
        }
        .body {
          padding: 40px;
        }
        .body h2 {
          color: ${BRAND_COLORS.textDark};
          font-size: 20px;
          margin-top: 0;
        }
        .body p {
          color: ${BRAND_COLORS.textLight};
          font-size: 15px;
          line-height: 1.6;
        }
        .otp-box {
          background-color: ${BRAND_COLORS.background};
          border: 2px dashed ${BRAND_COLORS.primary};
          padding: 20px;
          text-align: center;
          font-size: 32px;
          letter-spacing: 8px;
          color: ${BRAND_COLORS.primary};
          font-weight: bold;
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          background-color: ${BRAND_COLORS.primary};
          color: ${BRAND_COLORS.white};
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 20px 0;
        }
        .divider {
          height: 2px;
          background-color: ${BRAND_COLORS.background};
          margin: 30px 0;
        }
        .footer {
          background-color: ${BRAND_COLORS.background};
          padding: 30px 40px;
          text-align: center;
        }
        .footer p {
          color: ${BRAND_COLORS.textLight};
          font-size: 13px;
          margin: 5px 0;
        }
        .footer .support {
          color: ${BRAND_COLORS.primary};
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          ${logoHtml}
        </div>
        <div class="body">
          ${contentHtml}
          <div class="divider"></div>
          <p>Need help? Contact our support team:</p>
          <p class="support">📧 ${support.email}</p>
          <p class="support">📞 ${support.phone}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} RVNP Campus Hub. All rights reserved.</p>
          <p>Rift Valley National Polytechnic</p>
          <p>Nakuru-Njoro Road, Nakuru, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { html, text: contentText };
};

const welcomeEmail = ({ fullName, logoUrl = null, supportContact = null }) => {
  const title = 'Welcome to RVNP Campus Hub';
  const contentHtml = `
    <h2>Welcome, ${fullName}! 🎉</h2>
    <p>Your RVNP Campus Hub account has been created successfully.</p>
    <p>You can now connect with students and staff across all 5 campuses:</p>
    <p>📍 Main Campus | 📍 Nakuru City Campus | 📍 Kericho Campus | 📍 Mwachon Campus | 📍 Kureisoi Campus</p>
    <p>Start exploring, join groups, share moments, and stay connected with your campus community.</p>
  `;
  const contentText = `Welcome, ${fullName}! Your RVNP Campus Hub account has been created successfully. Connect with all 5 campuses.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const verificationEmail = ({ fullName, otp, logoUrl = null, supportContact = null }) => {
  const title = 'Verify Your Email - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Use the verification code below to verify your account:</p>
    <div class="otp-box">${otp}</div>
    <p>This code expires in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  const contentText = `Hello, ${fullName}! Your verification code is: ${otp}. Expires in 10 minutes.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const passwordResetEmail = ({ fullName, resetUrl, logoUrl = null, supportContact = null }) => {
  const title = 'Reset Your Password - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>We received a request to reset your password.</p>
    <p>Click the button below to reset your password:</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  const contentText = `Hello, ${fullName}! Reset your password here: ${resetUrl}. Link expires in 1 hour.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const passwordResetSuccess = ({ fullName, logoUrl = null, supportContact = null }) => {
  const title = 'Password Reset Successful';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your password has been reset successfully.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
  `;
  const contentText = `Hello, ${fullName}! Your password was reset successfully.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const accountSuspension = ({ fullName, reason, logoUrl = null, supportContact = null }) => {
  const title = 'Account Suspended - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your account has been suspended.</p>
    <p>Reason: ${reason}</p>
    <p>If you believe this is a mistake, please contact our support team.</p>
  `;
  const contentText = `Hello, ${fullName}! Your account has been suspended. Reason: ${reason}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const accountReactivation = ({ fullName, logoUrl = null, supportContact = null }) => {
  const title = 'Account Reactivated - RVNP Campus Hub';
  const contentHtml = `
    <h2>Welcome Back, ${fullName}! 🎉</h2>
    <p>Your account has been reactivated.</p>
    <p>You can now access RVNP Campus Hub again.</p>
  `;
  const contentText = `Welcome back, ${fullName}! Your account has been reactivated.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const accountDeletion = ({ fullName, logoUrl = null, supportContact = null }) => {
  const title = 'Account Deleted - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your account has been permanently deleted.</p>
    <p>We are sorry to see you go. If you ever wish to return, you can create a new account.</p>
  `;
  const contentText = `Hello, ${fullName}! Your account has been deleted.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const newLoginAlert = ({ fullName, device, location, time, logoUrl = null, supportContact = null }) => {
  const title = 'New Login Detected - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>We detected a new login to your account:</p>
    <p>📱 Device: ${device}</p>
    <p>📍 Location: ${location}</p>
    <p>🕐 Time: ${time}</p>
    <p>If this was not you, please reset your password immediately.</p>
  `;
  const contentText = `Hello, ${fullName}! New login detected. Device: ${device}, Location: ${location}, Time: ${time}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const newFollower = ({ fullName, followerName, logoUrl = null, supportContact = null }) => {
  const title = 'New Follower - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p><strong>${followerName}</strong> started following you.</p>
  `;
  const contentText = `Hello, ${fullName}! ${followerName} started following you.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const groupInvitation = ({ fullName, groupName, inviterName, logoUrl = null, supportContact = null }) => {
  const title = 'Group Invitation - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p><strong>${inviterName}</strong> invited you to join the group:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${groupName}</p>
  `;
  const contentText = `Hello, ${fullName}! ${inviterName} invited you to join ${groupName}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const eventInvitation = ({ fullName, eventTitle, eventDate, eventLocation, logoUrl = null, supportContact = null }) => {
  const title = 'Event Invitation - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>You are invited to:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${eventTitle}</p>
    <p>📅 Date: ${eventDate}</p>
    <p>📍 Location: ${eventLocation}</p>
  `;
  const contentText = `Hello, ${fullName}! You are invited to: ${eventTitle}. Date: ${eventDate}. Location: ${eventLocation}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const eventReminder = ({ fullName, eventTitle, eventDate, eventLocation, logoUrl = null, supportContact = null }) => {
  const title = 'Event Reminder - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Reminder for upcoming event:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${eventTitle}</p>
    <p>📅 Date: ${eventDate}</p>
    <p>📍 Location: ${eventLocation}</p>
  `;
  const contentText = `Hello, ${fullName}! Reminder: ${eventTitle} on ${eventDate} at ${eventLocation}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const listingApproved = ({ fullName, listingTitle, logoUrl = null, supportContact = null }) => {
  const title = 'Listing Approved - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your marketplace listing has been approved:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${listingTitle}</p>
  `;
  const contentText = `Hello, ${fullName}! Your listing "${listingTitle}" has been approved.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const listingRejected = ({ fullName, listingTitle, reason, logoUrl = null, supportContact = null }) => {
  const title = 'Listing Rejected - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your marketplace listing was rejected:</p>
    <p style="font-size: 18px;">${listingTitle}</p>
    <p>Reason: ${reason}</p>
  `;
  const contentText = `Hello, ${fullName}! Your listing "${listingTitle}" was rejected. Reason: ${reason}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const newOfferReceived = ({ fullName, listingTitle, offerAmount, buyerName, logoUrl = null, supportContact = null }) => {
  const title = 'New Offer Received - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>You received a new offer on:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${listingTitle}</p>
    <p>💰 Offer Amount: KSh ${offerAmount}</p>
    <p>👤 Buyer: ${buyerName}</p>
  `;
  const contentText = `Hello, ${fullName}! New offer on "${listingTitle}". Amount: KSh ${offerAmount}. Buyer: ${buyerName}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const offerAccepted = ({ fullName, listingTitle, amount, logoUrl = null, supportContact = null }) => {
  const title = 'Offer Accepted - RVNP Campus Hub';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>Your offer has been accepted:</p>
    <p style="font-size: 18px; color: ${BRAND_COLORS.primary}; font-weight: bold;">${listingTitle}</p>
    <p>💰 Amount: KSh ${amount}</p>
  `;
  const contentText = `Hello, ${fullName}! Your offer on "${listingTitle}" was accepted. Amount: KSh ${amount}.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

const adminWelcome = ({ fullName, logoUrl = null, supportContact = null }) => {
  const title = 'Welcome to Admin Dashboard';
  const contentHtml = `
    <h2>Hello, ${fullName}!</h2>
    <p>You have been granted admin access to RVNP Campus Hub.</p>
  `;
  const contentText = `Hello, ${fullName}! You have admin access to RVNP Campus Hub.`;
  return emailLayout({ title, contentHtml, contentText, logoUrl, supportContact });
};

module.exports = {
  welcomeEmail,
  verificationEmail,
  passwordResetEmail,
  passwordResetSuccess,
  accountSuspension,
  accountReactivation,
  accountDeletion,
  newLoginAlert,
  newFollower,
  groupInvitation,
  eventInvitation,
  eventReminder,
  listingApproved,
  listingRejected,
  newOfferReceived,
  offerAccepted,
  adminWelcome,
};
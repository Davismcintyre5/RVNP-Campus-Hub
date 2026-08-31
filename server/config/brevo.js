const axios = require('axios');
const env = require('./env.js');

const brevo = {
  emailApiKey: env.email.brevo.apiKey,
  smsApiKey: env.sms.brevo.apiKey,
  smsSender: env.sms.brevo.sender,
  fromEmail: env.email.brevo.fromEmail,

  sendEmail: async ({ to, subject, htmlBody, textBody }) => {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'RVNP Campus Hub',
          email: brevo.fromEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: htmlBody,
        textContent: textBody,
      },
      {
        headers: {
          'api-key': brevo.emailApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  sendSMS: async ({ to, message }) => {
    const response = await axios.post(
      'https://api.brevo.com/v3/transactionalSMS/sms',
      {
        sender: brevo.smsSender,
        recipient: to,
        content: message,
      },
      {
        headers: {
          'api-key': brevo.smsApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

module.exports = brevo;
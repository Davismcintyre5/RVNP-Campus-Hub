const axios = require('axios');
const env = require('./env.js');

const hdmbridge = {
  apiKey: env.email.hdm.apiKey || env.sms.hdm.apiKey,
  apiUrl: env.email.hdm.apiUrl || env.sms.hdm.apiUrl,
  fromEmail: env.email.hdm.fromEmail,
  fromName: env.email.hdm.fromName,
  smsSenderId: env.sms.hdm.senderId,

  sendEmail: async ({ to, subject, htmlBody, textBody }) => {
    const response = await axios.post(
      `${hdmbridge.apiUrl}/emails/send`,
      {
        from: hdmbridge.fromEmail,
        fromName: hdmbridge.fromName,
        to,
        subject,
        htmlBody,
        textBody,
      },
      {
        headers: {
          Authorization: `Bearer ${hdmbridge.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  sendSMS: async ({ to, message }) => {
    const response = await axios.post(
      `${hdmbridge.apiUrl}/sms/send`,
      {
        senderId: hdmbridge.smsSenderId,
        to,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${hdmbridge.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};

module.exports = hdmbridge;
const axios = require('axios');
const env = require('./env.js');

const KEEP_ALIVE_ENABLED = env.keepAlive.enabled;
const KEEP_ALIVE_URL = `${env.server.apiUrl}/api/health`;
const INITIAL_DELAY_MS = 60 * 1000;
const INTERVAL_MS = 10 * 60 * 1000;

const pingServer = async () => {
  try {
    const response = await axios.get(KEEP_ALIVE_URL, {
      timeout: 10000,
    });

    console.log(`[KeepAlive] Ping successful at ${new Date().toISOString()} - Status: ${response.status}`);
  } catch (error) {
    console.error(`[KeepAlive] Ping failed at ${new Date().toISOString()} - ${error.message}`);
  }
};

const initKeepAlive = () => {
  if (!KEEP_ALIVE_ENABLED) {
    console.log('[KeepAlive] Disabled');
    return;
  }

  console.log(`[KeepAlive] Enabled`);
  console.log(`[KeepAlive] URL: ${KEEP_ALIVE_URL}`);
  console.log(`[KeepAlive] First ping in ${INITIAL_DELAY_MS / 1000}s, then every ${INTERVAL_MS / 1000 / 60} minutes`);

  setTimeout(() => {
    pingServer();

    setInterval(() => {
      pingServer();
    }, INTERVAL_MS);
  }, INITIAL_DELAY_MS);
};

module.exports = initKeepAlive;
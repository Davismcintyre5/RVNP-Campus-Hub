const os = require('os');
const prisma = require('../../config/database.js');
const redis = require('../../config/redis.js');
const env = require('../../config/env.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getSystemHealth = asyncHandler(async (req, res) => {
  let redisStatus = 'disabled';
  let redisHost = 'N/A';
  const redisClient = redis;
  if (redisClient) {
    redisStatus = redisClient.status === 'ready' ? 'up' : 'down';
    redisHost = env.redis.url || 'N/A';
  }

  let databaseStatus = 'disconnected';
  let databaseHost = 'N/A';
  let databaseName = 'N/A';
  let tableCount = 0;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';

    const databaseUrl = new URL(env.database.url);
    databaseHost = databaseUrl.hostname;
    databaseName = databaseUrl.pathname.replace('/', '');

    const tables = await prisma.$queryRaw`
      SELECT COUNT(*) AS count FROM pg_tables WHERE schemaname = 'public';
    `;
    tableCount = parseInt(tables[0].count);
  } catch (error) {
    databaseStatus = 'disconnected';
  }

  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  const totalStaff = await prisma.user.count({ where: { role: 'STAFF' } });
  const totalPosts = await prisma.post.count();
  const totalReels = await prisma.reel.count();
  const totalGroups = await prisma.group.count();
  const totalEvents = await prisma.event.count();
  const totalListings = await prisma.marketplaceListing.count();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRequests = await prisma.auditLog.count({
    where: {
      createdAt: { gte: today },
    },
  });

  const totalCampuses = await prisma.campus.count();
  const totalDepartments = await prisma.department.count();
  const totalNotifications = await prisma.notification.count();

  return res.json(
    ApiResponse.ok({
      server: {
        status: 'running',
        node: process.version,
        platform: `${os.platform()} (${os.arch()})`,
        uptime: formatUptime(process.uptime()),
        cpu: `${((os.loadavg()[0] / os.cpus().length) * 100).toFixed(2)}% (${os.cpus().length} cores)`,
        memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        url: env.server.apiUrl,
      },
      database: {
        status: databaseStatus,
        host: databaseHost,
        database: databaseName,
        tables: tableCount,
        type: 'PostgreSQL',
      },
      redis: {
        status: redisStatus,
        host: redisHost,
        enabled: env.redis.enabled,
      },
      email: {
        status: env.email.hdm.apiKey || env.email.brevo.apiKey ? 'enabled' : 'disabled',
        provider: env.email.provider.toUpperCase(),
        from: env.email.provider === 'hdm' ? env.email.hdm.fromEmail : env.email.brevo.fromEmail,
        sender: env.email.provider === 'hdm' ? env.email.hdm.fromName : 'RVNP Campus Hub',
      },
      sms: {
        status: env.sms.hdm.apiKey || env.sms.brevo.apiKey ? 'enabled' : 'disabled',
        provider: env.sms.provider.toUpperCase(),
        sender: env.sms.provider === 'hdm' ? env.sms.hdm.senderId : env.sms.brevo.sender,
      },
      storage: {
        status: env.upload.cloudinary.cloudName ? 'enabled' : 'disabled',
        type: env.upload.provider,
        cloud: env.upload.cloudinary.cloudName || 'N/A',
        localPath: env.upload.provider === 'local' ? env.upload.local.path : 'N/A',
      },
      cors: {
        origins: env.cors.origins,
      },
      stats: {
        campuses: totalCampuses,
        departments: totalDepartments,
        users: {
          total: totalUsers,
          students: totalStudents,
          staff: totalStaff,
        },
        content: {
          posts: totalPosts,
          reels: totalReels,
          groups: totalGroups,
          events: totalEvents,
          listings: totalListings,
        },
        notifications: totalNotifications,
        todayRequests,
      },
      timestamp: new Date().toISOString(),
    })
  );
});

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = {
  getSystemHealth,
};
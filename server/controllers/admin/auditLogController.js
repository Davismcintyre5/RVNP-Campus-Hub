const AuditLog = require('../../models/admin/AuditLog.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllLogs = asyncHandler(async (req, res) => {
  const { page, limit, adminId } = req.query;

  const data = await AuditLog.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    adminId,
  });

  const formattedLogs = data.logs.map((log) => ({
    id: log.id,
    action: log.action,
    details: log.details,
    ipAddress: log.ipAddress || null,
    createdAt: log.createdAt,
    admin: log.admin,
  }));

  res.json(
    ApiResponse.ok({
      logs: formattedLogs,
      total: data.total,
    })
  );
});

const getLogsByAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const logs = await AuditLog.findByAdmin(adminId);

  const formattedLogs = logs.map((log) => ({
    id: log.id,
    action: log.action,
    details: log.details,
    ipAddress: log.ipAddress || null,
    createdAt: log.createdAt,
    admin: log.admin,
  }));

  res.json(ApiResponse.ok(formattedLogs));
});

module.exports = {
  getAllLogs,
  getLogsByAdmin,
};
const Reports = require('../../models/admin/Reports.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getAllReports = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const data = await Reports.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await Reports.findById(id);

  if (!report) {
    throw ApiError.notFound('Report not found');
  }

  res.json(ApiResponse.ok(report));
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw ApiError.badRequest('Status is required');
  }

  const validStatuses = ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'];

  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest('Invalid status');
  }

  const report = await Reports.updateStatus(id, status, req.user.id);

  res.json(ApiResponse.ok(report, 'Report status updated'));
});

const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Reports.deleteReport(id);

  res.json(ApiResponse.ok(null, 'Report deleted successfully'));
});

module.exports = {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};
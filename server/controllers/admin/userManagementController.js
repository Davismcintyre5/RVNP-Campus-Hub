const UserManagement = require('../../models/admin/UserManagement.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const emailService = require('../../services/emailService.js');
const smsService = require('../../services/smsService.js');

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, role, status, search } = req.query;

  const data = await UserManagement.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    role,
    status,
    search,
  });

  res.json(ApiResponse.ok(data));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserManagement.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json(ApiResponse.ok(user));
});

const toggleHdmVerified = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserManagement.toggleHdmVerified(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json(
    ApiResponse.ok(
      { hdmVerified: user.hdmVerified },
      user.hdmVerified ? 'HDM Verified granted' : 'HDM Verified revoked'
    )
  );
});

const setHdmVerified = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    throw ApiError.badRequest('Status is required');
  }

  const user = await UserManagement.setHdmVerified(id, status);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.json(ApiResponse.ok(user, 'HDM Verified updated'));
});

const suspendUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const user = await UserManagement.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await UserManagement.suspendUser(id);

  if (user.email) {
    await emailService.sendAccountSuspension({
      to: user.email,
      fullName: user.fullName,
      reason: reason || 'Violation of community guidelines',
    });
  }

  if (user.phoneNumber) {
    await smsService.sendAccountSuspensionSMS({
      to: user.phoneNumber,
      reason: reason || 'Violation of community guidelines',
    });
  }

  res.json(ApiResponse.ok(null, 'User suspended successfully'));
});

const reactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserManagement.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await UserManagement.reactivateUser(id);

  if (user.email) {
    await emailService.sendAccountReactivation({
      to: user.email,
      fullName: user.fullName,
    });
  }

  res.json(ApiResponse.ok(null, 'User reactivated successfully'));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserManagement.findById(id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await UserManagement.deleteUser(id);

  if (user.email) {
    await emailService.sendAccountDeletion({
      to: user.email,
      fullName: user.fullName,
    });
  }

  res.json(ApiResponse.ok(null, 'User deleted successfully'));
});

const changeRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw ApiError.badRequest('Role is required');
  }

  const validRoles = ['STUDENT', 'STAFF', 'ALUMNI'];

  if (!validRoles.includes(role)) {
    throw ApiError.badRequest('Invalid role. Only STUDENT, STAFF, ALUMNI allowed');
  }

  await UserManagement.changeRole(id, role);

  res.json(ApiResponse.ok(null, 'Role updated successfully'));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await UserManagement.verifyUser(id);

  res.json(ApiResponse.ok(null, 'User verified successfully'));
});

module.exports = {
  getAllUsers,
  getUserById,
  toggleHdmVerified,
  setHdmVerified,
  suspendUser,
  reactivateUser,
  deleteUser,
  changeRole,
  verifyUser,
};
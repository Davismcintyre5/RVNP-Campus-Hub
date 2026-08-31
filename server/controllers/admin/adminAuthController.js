const prisma = require('../../config/database.js');
const ApiError = require('../../utils/ApiError.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const { comparePassword, generateAccessToken, generateRefreshToken } = require('../../utils/auth.js');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const admin = await prisma.user.findUnique({
    where: { email },
  });

  if (!admin) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Admin access required');
  }

  if (admin.accountStatus === 'SUSPENDED') {
    throw ApiError.forbidden('Account suspended');
  }

  const isPasswordValid = await comparePassword(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

  res.json(
    ApiResponse.ok({
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        avatarUrl: admin.avatarUrl,
      },
      accessToken,
      refreshToken,
    })
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  const { verifyRefreshToken } = require('../../utils/auth.js');
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const admin = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!admin) {
    throw ApiError.unauthorized('Admin not found');
  }

  if (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Admin access required');
  }

  const newAccessToken = generateAccessToken(admin);
  const newRefreshToken = generateRefreshToken(admin);

  res.json(
    ApiResponse.ok({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  );
});

const getProfile = asyncHandler(async (req, res) => {
  const admin = req.user;

  res.json(
    ApiResponse.ok({
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      avatarUrl: admin.avatarUrl,
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  res.json(ApiResponse.ok(null, 'Logged out successfully'));
});

module.exports = {
  login,
  refreshToken,
  getProfile,
  logout,
};
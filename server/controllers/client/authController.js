const prisma = require('../../config/database.js');
const env = require('../../config/env.js');
const ApiError = require('../../utils/ApiError.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateRandomToken,
  generateOtp,
  hashOtp,
  verifyOtp,
  generateTokenExpiry,
} = require('../../utils/auth.js');
const emailService = require('../../services/emailService.js');
const smsService = require('../../services/smsService.js');
const cacheService = require('../../services/cacheService.js');

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    role = 'STUDENT',
    campusId,
    departmentId,
    course,
    yearOfStudy,
    staffId,
    graduationYear,
  } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    throw ApiError.badRequest('Full name, email, phone number, and password are required');
  }

  const userRole = ['STUDENT', 'STAFF', 'ALUMNI'].includes(role) ? role : 'STUDENT';

  if (userRole === 'STUDENT' && (!campusId || !departmentId)) {
    throw ApiError.badRequest('Campus and department are required for students');
  }

  if (userRole === 'STAFF' && (!campusId || !departmentId || !staffId)) {
    throw ApiError.badRequest('Campus, department, and staff ID are required for staff');
  }

  if (userRole === 'ALUMNI' && !graduationYear) {
    throw ApiError.badRequest('Graduation year is required for alumni');
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw ApiError.conflict('Email already registered');
  }

  const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existingPhone) {
    throw ApiError.conflict('Phone number already registered');
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const tempId = generateRandomToken(16);

  const pendingRegistration = {
    fullName,
    email,
    phoneNumber,
    password,
    role: userRole,
    campusId: userRole !== 'ALUMNI' ? campusId : null,
    departmentId: userRole !== 'ALUMNI' ? departmentId : null,
    course: userRole === 'STUDENT' ? course : null,
    yearOfStudy: userRole === 'STUDENT' && yearOfStudy ? parseInt(yearOfStudy) : null,
    staffId: userRole === 'STAFF' ? staffId : null,
    graduationYear: userRole === 'ALUMNI' && graduationYear ? parseInt(graduationYear) : null,
    hashedOtp,
    otpExpiresAt: generateTokenExpiry(env.otp.expiresIn),
  };

  await cacheService.setCache(`reg:${tempId}`, pendingRegistration, env.otp.expiresIn);

  try {
    await emailService.sendVerificationEmail({ to: email, fullName, otp });
  } catch (error) {
    console.error('Verification email failed:', error.message);
  }

  try {
    await smsService.sendOtpSMS({ to: phoneNumber, otp });
  } catch (error) {
    console.error('Verification SMS failed:', error.message);
  }

  res.json(
    ApiResponse.ok(
      {
        tempId,
        message: 'OTP sent successfully',
      },
      'OTP sent. Please verify your account'
    )
  );
});

const verifyRegistration = asyncHandler(async (req, res) => {
  const { tempId, otp } = req.body;

  if (!tempId || !otp) {
    throw ApiError.badRequest('Temp ID and OTP are required');
  }

  const pending = await cacheService.getCache(`reg:${tempId}`);

  if (!pending) {
    throw ApiError.badRequest('Registration session expired. Please register again');
  }

  const isValid = await verifyOtp(otp, pending.hashedOtp);

  if (!isValid) {
    throw ApiError.badRequest('Invalid OTP');
  }

  const passwordHash = await hashPassword(pending.password);

  const user = await prisma.user.create({
    data: {
      fullName: pending.fullName,
      email: pending.email,
      phoneNumber: pending.phoneNumber,
      passwordHash,
      role: pending.role,
      campusId: pending.campusId,
      departmentId: pending.departmentId,
      course: pending.course,
      yearOfStudy: pending.yearOfStudy,
      staffId: pending.staffId,
      graduationYear: pending.graduationYear,
      verificationStatus: 'VERIFIED',
    },
  });

  await cacheService.deleteCache(`reg:${tempId}`);

  try {
    await emailService.sendWelcomeEmail({ to: user.email, fullName: user.fullName });
  } catch (error) {
    console.error('Welcome email failed:', error.message);
  }

  try {
    await smsService.sendWelcomeSMS({ to: user.phoneNumber, fullName: user.fullName });
  } catch (error) {
    console.error('Welcome SMS failed:', error.message);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(201).json(
    ApiResponse.created({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        bio: user.bio,
        role: user.role,
        verificationStatus: user.verificationStatus,
        hdmVerified: user.hdmVerified,
        accountStatus: user.accountStatus,
        campusId: user.campusId,
        departmentId: user.departmentId,
        course: user.course,
        yearOfStudy: user.yearOfStudy,
        staffId: user.staffId,
        graduationYear: user.graduationYear,
      },
      accessToken,
      refreshToken,
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (user.accountStatus === 'SUSPENDED') {
    throw ApiError.forbidden('Account suspended');
  }

  if (user.accountStatus === 'DELETED') {
    throw ApiError.unauthorized('Account deleted');
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeen: new Date() },
  });

  res.json(
    ApiResponse.ok({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        bio: user.bio,
        role: user.role,
        verificationStatus: user.verificationStatus,
        hdmVerified: user.hdmVerified,
        accountStatus: user.accountStatus,
        campusId: user.campusId,
        departmentId: user.departmentId,
        course: user.course,
        yearOfStudy: user.yearOfStudy,
        staffId: user.staffId,
        graduationYear: user.graduationYear,
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

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res.json(
    ApiResponse.ok({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw ApiError.badRequest('Email is required');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const resetToken = generateRandomToken();
  const resetExpiry = generateTokenExpiry(3600);

  await cacheService.setCache(`reset:${user.id}`, { token: resetToken, expiresAt: resetExpiry }, 3600);

  const resetUrl = `${env.clientUrls.client}/reset-password?token=${resetToken}&userId=${user.id}`;

  await emailService.sendPasswordResetEmail({ to: user.email, fullName: user.fullName, resetUrl });

  res.json(ApiResponse.ok(null, 'Password reset link sent'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, userId, newPassword } = req.body;

  if (!token || !userId || !newPassword) {
    throw ApiError.badRequest('Token, userId, and new password are required');
  }

  const cached = await cacheService.getCache(`reset:${userId}`);

  if (!cached || cached.token !== token) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await cacheService.deleteCache(`reset:${userId}`);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.email) {
    await emailService.sendPasswordResetSuccess({ to: user.email, fullName: user.fullName });
  }

  res.json(ApiResponse.ok(null, 'Password reset successfully'));
});

const logout = asyncHandler(async (req, res) => {
  res.json(ApiResponse.ok(null, 'Logged out successfully'));
});

module.exports = {
  register,
  verifyRegistration,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
};
const Group = require('../../models/client/Group.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createGroup = asyncHandler(async (req, res) => {
  const { name, description, campusId, avatarUrl } = req.body;
  const userId = req.user.id;

  if (!name) {
    throw ApiError.badRequest('Group name is required');
  }

  const group = await Group.create({
    name,
    description,
    campusId,
    avatarUrl,
    createdBy: userId,
    memberCount: 1,
  });

  await Group.addMember(group.id, userId);

  res.status(201).json(ApiResponse.created(group));
});

const getAllGroups = asyncHandler(async (req, res) => {
  const { page, limit, campusId, search } = req.query;

  const data = await Group.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    campusId,
    search,
  });

  res.json(ApiResponse.ok(data));
});

const getGroupById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  res.json(ApiResponse.ok(group));
});

const updateGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, avatarUrl } = req.body;
  const userId = req.user.id;

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  if (group.createdBy !== userId) {
    throw ApiError.forbidden('Only group creator can update group');
  }

  const data = {};
  if (name) data.name = name;
  if (description !== undefined) data.description = description;
  if (avatarUrl) data.avatarUrl = avatarUrl;

  const updated = await Group.update(id, data);

  res.json(ApiResponse.ok(updated, 'Group updated successfully'));
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  if (group.createdBy !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('Only group creator can delete group');
  }

  await Group.softDelete(id);

  res.json(ApiResponse.ok(null, 'Group deleted successfully'));
});

const getGroupMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const data = await Group.getMembers(id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 50,
  });

  res.json(ApiResponse.ok(data));
});

const joinGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  const members = await Group.getMembers(id, { page: 1, limit: 1000 });
  const isMember = members.members.some((m) => m.userId === userId);

  if (isMember) {
    throw ApiError.conflict('Already a member of this group');
  }

  await Group.addMember(id, userId);
  await Group.incrementMemberCount(id);

  res.json(ApiResponse.ok(null, 'Joined group successfully'));
});

const leaveGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  const members = await Group.getMembers(id, { page: 1, limit: 1000 });
  const isMember = members.members.some((m) => m.userId === userId);

  if (!isMember) {
    throw ApiError.badRequest('Not a member of this group');
  }

  await Group.removeMember(id, userId);
  await Group.decrementMemberCount(id);

  res.json(ApiResponse.ok(null, 'Left group successfully'));
});

const inviteToGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId: inviteeId } = req.body;

  if (!inviteeId) {
    throw ApiError.badRequest('User ID is required');
  }

  const group = await Group.findById(id);

  if (!group || group.deletedAt) {
    throw ApiError.notFound('Group not found');
  }

  await notificationService.createNotification({
    userId: inviteeId,
    type: 'GROUP_INVITE',
    title: 'Group Invitation',
    body: `${req.user.fullName} invited you to join ${group.name}`,
    data: { groupId: id },
  });

  res.json(ApiResponse.ok(null, 'Invitation sent'));
});

const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.findByUser(req.user.id);

  res.json(ApiResponse.ok(groups));
});

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  inviteToGroup,
  getMyGroups,
};
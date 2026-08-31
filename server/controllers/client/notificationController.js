const Notification = require('../../models/client/Notification.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;

  const data = await Notification.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    unreadOnly: unreadOnly === 'true',
  });

  res.json(ApiResponse.ok(data));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user.id);

  res.json(ApiResponse.ok({ unreadCount: count }));
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  if (notification.userId !== req.user.id) {
    throw ApiError.forbidden('You can only mark your own notifications as read');
  }

  await Notification.markAsRead(id);

  res.json(ApiResponse.ok(null, 'Notification marked as read'));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user.id);

  res.json(ApiResponse.ok(null, 'All notifications marked as read'));
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  if (notification.userId !== req.user.id) {
    throw ApiError.forbidden('You can only delete your own notifications');
  }

  await Notification.remove(id);

  res.json(ApiResponse.ok(null, 'Notification deleted successfully'));
});

const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.removeAll(req.user.id);

  res.json(ApiResponse.ok(null, 'All notifications deleted successfully'));
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
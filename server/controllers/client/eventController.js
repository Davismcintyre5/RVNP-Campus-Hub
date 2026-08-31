const Event = require('../../models/client/Event.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const notificationService = require('../../services/notificationService.js');

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, location, campusId, startTime, endTime } = req.body;
  const userId = req.user.id;

  if (!title || !startTime || !endTime) {
    throw ApiError.badRequest('Title, start time, and end time are required');
  }

  const event = await Event.create({
    title,
    description,
    location,
    campusId: campusId || req.user.campusId,
    createdBy: userId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  res.status(201).json(ApiResponse.created(event));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const { page, limit, campusId, status } = req.query;

  const data = await Event.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    campusId,
    status,
  });

  res.json(ApiResponse.ok(data));
});

const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  res.json(ApiResponse.ok(event));
});

const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { campusId, limit } = req.query;

  const events = await Event.getUpcoming({
    campusId: campusId || req.user.campusId,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(events));
});

const getOngoingEvents = asyncHandler(async (req, res) => {
  const { campusId } = req.query;

  const events = await Event.getOngoing({
    campusId: campusId || req.user.campusId,
  });

  res.json(ApiResponse.ok(events));
});

const getCompletedEvents = asyncHandler(async (req, res) => {
  const { page, limit, campusId } = req.query;

  const events = await Event.getCompleted({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    campusId,
  });

  res.json(ApiResponse.ok(events));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, location, startTime, endTime, status } = req.body;
  const userId = req.user.id;

  const event = await Event.findById(id);

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  if (event.createdBy !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('You can only update your own events');
  }

  const data = {};
  if (title) data.title = title;
  if (description !== undefined) data.description = description;
  if (location) data.location = location;
  if (startTime) data.startTime = new Date(startTime);
  if (endTime) data.endTime = new Date(endTime);
  if (status) data.status = status;

  const updated = await Event.update(id, data);

  res.json(ApiResponse.ok(updated, 'Event updated successfully'));
});

const cancelEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const event = await Event.findById(id);

  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  if (event.createdBy !== userId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('You can only cancel your own events');
  }

  await Event.softDelete(id);

  res.json(ApiResponse.ok(null, 'Event cancelled successfully'));
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getOngoingEvents,
  getCompletedEvents,
  updateEvent,
  cancelEvent,
};
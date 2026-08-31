const Event = require('../../models/client/Event.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');

const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { campusId, limit } = req.query;

  const events = await Event.getUpcoming({
    campusId,
    limit: parseInt(limit) || 10,
  });

  res.json(ApiResponse.ok(events));
});

const getOngoingEvents = asyncHandler(async (req, res) => {
  const { campusId } = req.query;

  const events = await Event.getOngoing({ campusId });

  res.json(ApiResponse.ok(events));
});

const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event || event.status === 'CANCELLED') {
    throw ApiError.notFound('Event not found');
  }

  res.json(
    ApiResponse.ok({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status,
      campus: event.campus,
    })
  );
});

module.exports = {
  getUpcomingEvents,
  getOngoingEvents,
  getEventById,
};
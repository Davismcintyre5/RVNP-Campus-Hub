const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/client/eventController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/ongoing', eventController.getOngoingEvents);
router.get('/completed', eventController.getCompletedEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.cancelEvent);

module.exports = router;
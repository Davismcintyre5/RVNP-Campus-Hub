const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/public/eventController.js');

router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/ongoing', eventController.getOngoingEvents);
router.get('/:id', eventController.getEventById);

module.exports = router;
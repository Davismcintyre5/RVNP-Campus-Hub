const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/client/messageController.js');
const requireAuth = require('../../middleware/client/requireAuth.js');

router.use(requireAuth);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.createDirectConversation);
router.get('/conversations/:id', messageController.getConversationById);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', messageController.sendMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.get('/unread-count', messageController.getUnreadCount);

module.exports = router;
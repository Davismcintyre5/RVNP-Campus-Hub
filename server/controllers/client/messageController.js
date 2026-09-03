const prisma = require('../../config/database.js');
const Conversation = require('../../models/client/Conversation.js');
const Message = require('../../models/client/Message.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const ApiError = require('../../utils/ApiError.js');
const asyncHandler = require('../../utils/asyncHandler.js');
const socketService = require('../../services/socketService.js');

const getConversations = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await Conversation.findByUser(req.user.id, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(ApiResponse.ok(data));
});

const getConversationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const conversation = await Conversation.findById(id);

  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const isParticipant = conversation.participants.some((p) => p.userId === req.user.id);

  if (!isParticipant) {
    throw ApiError.forbidden('You are not a participant in this conversation');
  }

  res.json(ApiResponse.ok(conversation));
});

const createDirectConversation = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const userId = req.user.id;

  if (!recipientId) {
    throw ApiError.badRequest('Recipient ID is required');
  }

  if (recipientId === userId) {
    throw ApiError.badRequest('Cannot create conversation with yourself');
  }

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
  });

  if (!recipient) {
    throw ApiError.notFound('Recipient not found');
  }

  const existing = await Conversation.findDirectConversation(userId, recipientId);

  if (existing) {
    return res.json(ApiResponse.ok(existing));
  }

  const conversation = await Conversation.create({
    type: 'DIRECT',
  });

  await Conversation.addParticipant(conversation.id, userId);
  await Conversation.addParticipant(conversation.id, recipientId);

  const fullConversation = await Conversation.findById(conversation.id);

  res.status(201).json(ApiResponse.created(fullConversation));
});

const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page, limit } = req.query;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const isParticipant = conversation.participants.some((p) => p.userId === req.user.id);

  if (!isParticipant) {
    throw ApiError.forbidden('You are not a participant in this conversation');
  }

  await Message.markAsDelivered(conversationId, req.user.id);
  await Message.markAsRead(conversationId, req.user.id);

  const data = await Message.findByConversation(conversationId, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 50,
  });

  res.json(ApiResponse.ok(data));
});

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { content, type } = req.body;
  const userId = req.user.id;

  if (!content) {
    throw ApiError.badRequest('Message content is required');
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const isParticipant = conversation.participants.some((p) => p.userId === userId);

  if (!isParticipant) {
    throw ApiError.forbidden('You are not a participant in this conversation');
  }

  const otherParticipant = conversation.participants.find((p) => p.userId !== userId);

  const message = await Message.create({
    conversationId,
    senderId: userId,
    recipientId: otherParticipant?.userId || null,
    content,
    type: type || 'TEXT',
    deliveredAt: new Date(),
  });

  await Conversation.updateLastMessage(conversationId, message.id);

  if (otherParticipant) {
    socketService.notifyNewMessage(otherParticipant.userId, message);
  }

  res.status(201).json(ApiResponse.created(message));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  const message = await Message.findById(messageId);

  if (!message || message.deletedAt) {
    throw ApiError.notFound('Message not found');
  }

  if (message.senderId !== userId) {
    throw ApiError.forbidden('You can only delete your own messages');
  }

  await Message.softDelete(messageId);

  res.json(ApiResponse.ok(null, 'Message deleted successfully'));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.getUnreadCount(req.user.id);

  res.json(ApiResponse.ok({ unreadCount: count }));
});

module.exports = {
  getConversations,
  getConversationById,
  createDirectConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  getUnreadCount,
};
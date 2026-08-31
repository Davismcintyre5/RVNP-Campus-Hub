const { getIO } = require('../config/socket.js');

const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error.message);
  }
};

const emitToCampus = (campusId, event, data) => {
  try {
    const io = getIO();
    io.to(`campus:${campusId}`).emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error.message);
  }
};

const emitToGroup = (groupId, event, data) => {
  try {
    const io = getIO();
    io.to(`group:${groupId}`).emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error.message);
  }
};

const emitToAll = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (error) {
    console.error('Socket emit error:', error.message);
  }
};

const notifyUser = (userId, notification) => {
  emitToUser(userId, 'notification', notification);
};

const notifyCampus = (campusId, notification) => {
  emitToCampus(campusId, 'campus-notification', notification);
};

const notifyGroup = (groupId, notification) => {
  emitToGroup(groupId, 'group-notification', notification);
};

const notifyNewMessage = (userId, message) => {
  emitToUser(userId, 'new-message', message);
};

const notifyTyping = (userId, data) => {
  emitToUser(userId, 'typing', data);
};

const notifyReadReceipt = (userId, data) => {
  emitToUser(userId, 'read-receipt', data);
};

module.exports = {
  emitToUser,
  emitToCampus,
  emitToGroup,
  emitToAll,
  notifyUser,
  notifyCampus,
  notifyGroup,
  notifyNewMessage,
  notifyTyping,
  notifyReadReceipt,
};
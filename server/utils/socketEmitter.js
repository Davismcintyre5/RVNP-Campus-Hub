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

module.exports = {
  emitToUser,
  emitToCampus,
  emitToGroup,
  emitToAll,
};
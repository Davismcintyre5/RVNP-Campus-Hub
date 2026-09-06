const { Server } = require('socket.io');
const env = require('./env.js');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.cors.origins,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('join-campus', (campusId) => {
      socket.join(`campus:${campusId}`);
    });

    socket.on('join-group', (groupId) => {
      socket.join(`group:${groupId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
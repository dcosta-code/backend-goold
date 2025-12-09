import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "../sockets/socketAuth";
import { registerChatHandlers } from "../sockets/chatHandler";

let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer);

  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    registerChatHandlers(io, socket);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

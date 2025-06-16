import { Server, Socket } from "socket.io";

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join to room (for personal or group chat)
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle incoming message
    socket.on("sendMessage", (data: { roomId: string; message: string; senderId: string }) => {
      // Emit to everyone in the room except sender
      socket.to(data.roomId).emit("receiveMessage", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

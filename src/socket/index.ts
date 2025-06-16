import { Server, Socket } from "socket.io";
import { getGroupMessage, postGroupMessage } from "../services/message.service";
import { PostGroupChatMessageType } from "../types/message";

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join to room (for group chat)
    socket.on("groupChat", async (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      try {
        const messages = await getGroupMessage(Number(roomId))
        socket.emit("groupChatMessage", messages)
        
      } catch (error) {
        
      }

    });

    // Handle send group message
    socket.on("sendGroupChatMessage", async (data: PostGroupChatMessageType) => {
      const newMessage = await postGroupMessage(data)

      if(newMessage) {
        // Emit to everyone in the room except sender
        const groupId = String(newMessage.id)
        socket.to(groupId).emit("receiveGroupChatMessage", data);
      }
    });

    
    // Join to room (for personal)
    

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

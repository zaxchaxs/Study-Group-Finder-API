import { Server, Socket } from "socket.io";
import { getGroupMessage, postGroupMessage } from "../services/message.service";
import { PostGroupChatMessageType } from "../types/message";

export function initSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join to room (for group chat)
    socket.on("groupChat", async (groupId: string) => {
      try {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group: ${groupId}`);
  
        const messages = await getGroupMessage(Number(groupId))
        socket.emit("groupChatMessage", messages)
        
      } catch (error) {
        socket.emit("groupChatError", {
            message: "Internar Server Error",
            error: error as Error
        })
      }
    });

    // Handle send group message
    socket.on("sendGroupChatMessage", async (data: PostGroupChatMessageType) => {
      try {
        const newMessage = await postGroupMessage(data)
        if(newMessage) {
          // Emit to everyone in the room except sender
          const groupId = String(newMessage.id)
          socket.to(groupId).emit("receiveGroupChatMessage", data);
        } else {
          socket.emit("sendGroupChatMessageError", {
            message: "Failed to send message"
          })
        }
      } catch (error) {
        socket.emit("sendGroupChatMessageError", {
            message: "Internar Server Error",
            error: error as Error
        })
      }
    });

    
    // Join to room (for personal)s
    

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

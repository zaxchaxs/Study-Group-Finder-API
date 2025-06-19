import { Server, Socket } from "socket.io";
import { getGroupMessage, postGroupMessage } from "../services/message.service";
import { addGroupchatMessageSchema } from "../schemas/groupchat.schema";
import { getDetailPrivateChat, postPrivateChatMessage } from "../services/privatechat.service";
import { PostGroupchatMessageType } from "../types/groupchat";
import { PostPrivateChatMessageType } from "../types/privatechat";
import { addPrivateChatMessageSchema } from "../schemas/privatechat.schema";

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
            status: 500,
            message: "Internar Server Error",
            error: error as Error
        })
      }
    });

    // Handle send group message
    socket.on("sendGroupChatMessage", async (data: PostGroupchatMessageType) => {
      try {
        
        const newData = {
          ...data,
          groupId: Number(data.groupId),
          authorId: Number(data.authorId),
          image: data.image === 'null' ? null : data.image
        }

        const dataValidation = addGroupchatMessageSchema.safeParse(newData);

        if(dataValidation.success) {
          const newMessage = await postGroupMessage(newData)
          if(newMessage) {
            // Emit to everyone in the room except sender
            const groupId = newMessage.groupId.toString()
            io.to(groupId).emit("receiveGroupChatMessage", newMessage);
          } else {
            socket.emit("sendGroupChatMessageError", {
              status: 500,
              statusCode: "Internal Server Error",
              message: "Failed send message",
              error: "Failed send message"
            })
          }
        } else {
          const parsedMessage = dataValidation.error
          socket.emit("sendGroupChatMessageError", {
            status: 400,
            statusCode: "Bad Request",
            message: parsedMessage.message,
            error: parsedMessage
          })
        }
      } catch (error) {
        socket.emit("sendGroupChatMessageError", {
            status: 500,
            statusCode: "Internal Server Error",
            message: "Internal Server Error",
            error: error as Error
        })
      }
    });

    
    // Join to room (for personal)
    socket.on("privateChat", async (chatId: string) => {
      try {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined private chat: ${chatId}`);
  
        const messages = await getDetailPrivateChat(Number(chatId))
        socket.emit("privateChatMessage", messages)
        
      } catch (error) {
        socket.emit("privateChatError", {
            status: 500,
            message: "Interna Server Error",
            error: error as Error
        })
      }
    });

    socket.on("sendPrivateChatMessage", async (data: PostPrivateChatMessageType) => {
      try {
        
        const newData = {
          ...data,
          chatId: Number(data.chatId),
          authorId: Number(data.authorId),
          image: data.image === 'null' ? null : data.image
        }

        const dataValidation = addPrivateChatMessageSchema.safeParse(newData);

        if(dataValidation.success) {
          const newMessage = await postPrivateChatMessage(newData)
          if(newMessage) {
            // Emit to everyone in the room except sender
            const chatId = newMessage.chatId.toString()
            io.to(chatId).emit("receivePrivateChatMessage", newMessage);
          } else {
            socket.emit("sendPrivateChatMessageError", {
              status: 500,
              statusCode: "Internal Server Error",
              message: "Failed send message",
              error: "Failed send message"
            })
          }
        } else {
          const parsedMessage = dataValidation.error
          socket.emit("sendPrivateChatMessageError", {
            status: 400,
            statusCode: "Bad Request",
            message: parsedMessage.message,
            error: parsedMessage
          })
        }
      } catch (error) {
        socket.emit("sendPrivateChatMessageError", {
            status: 500,
            statusCode: "Internal Server Error",
            message: "Internal Server Error",
            error: error as Error
        })
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

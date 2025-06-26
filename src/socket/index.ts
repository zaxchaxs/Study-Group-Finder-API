import { Server, Socket } from "socket.io";
import { getGroupMessage, postGroupMessage } from "../services/message.service";
import { addGroupchatMessageSchema } from "../schemas/groupchat.schema";
import { getDetailPrivateChat, getUserPrivateChat, postPrivateChatMessage } from "../services/privatechat.service";
import { PostGroupchatMessageType } from "../types/groupchat";
import { PostPrivateChatMessageType } from "../types/privatechat";
import { addPrivateChatMessageSchema } from "../schemas/privatechat.schema";
import { decryptText, encryptText } from "../utils/messageEncript";

export async function initSocket(io: Server) {
  io.on("connection", async (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join to room (for group chat)
    socket.on("group chat", async (groupId: string) => {
      try {
        await socket.join(groupId);
        console.log(`Socket ${socket.id} joined group: ${groupId}`);
  
        const messages = await getGroupMessage(Number(groupId))
        messages?.data.forEach(message => {
          message.content = decryptText(message.content)
        })
        console.log(messages);
        
        socket.emit("get detail group chat message", messages)
        
      } catch (error) {
        socket.emit("get detail group chat message error", {
            status: 500,
            message: "Internar Server Error",
            error: error as Error
        })
      }
    });

    // Handle send group message
    socket.on("send group chat message", async (data: PostGroupchatMessageType) => {
      try {
        
        const newData = {
          ...data,
          groupId: Number(data.groupId),
          authorId: Number(data.authorId),
          image: data.image === 'null' ? null : data.image,
          content: encryptText(data.content)
        }

        const dataValidation = addGroupchatMessageSchema.safeParse(newData);

        if(dataValidation.success) {
          const newMessage = await postGroupMessage(newData)
          if(newMessage) {
            // Emit to everyone in the room except sender
            newMessage.content = decryptText(newMessage?.content)
            const groupId = newMessage.groupId.toString()
            await io.to(groupId).emit("receive new group chat message", newMessage);
          } else {
            await socket.emit("send group chat message error", {
              status: 500,
              statusCode: "Internal Server Error",
              message: "Failed send message",
              error: "Failed send message"
            })
          }
        } else {
          const parsedMessage = dataValidation.error
          await socket.emit("send group chat message error", {
            status: 400,
            statusCode: "Bad Request",
            message: parsedMessage.message,
            error: parsedMessage
          })
        }
      } catch (error) {
        await socket.emit("send group chat message error", {
            status: 500,
            statusCode: "Internal Server Error",
            message: "Internal Server Error",
            error: error as Error
        })
      }
    });

    
    // ### Private Chats ###
    // Join to room (for personal)
    socket.on("private chat", async (chatId: string) => {
      try {
        await socket.join(chatId);
        console.log(`Socket ${socket.id} joined private chat: ${chatId}`);
        
        const userPrivateChats = await getUserPrivateChat(Number(chatId));
        userPrivateChats.forEach(chat => {
          if(chat.messages[0]) {
            chat.messages[0].content = decryptText(chat.messages[0].content);
          }
        });
        socket.emit("get user private chat", userPrivateChats);

        const messages = await getDetailPrivateChat(Number(chatId))
        messages?.messages.forEach(message => {
          message.content = decryptText(message.content);
        });
        socket.emit("get detail private chat message", messages)
        
      } catch (error) {
        socket.emit("get detail private chat message error", {
            status: 500,
            statusMessage: "Internal Server Error",
            message: "Internal Server Error",
            error: error as Error
        })
      }
    });

    socket.on("send private chat message", async (data: PostPrivateChatMessageType) => {
      try {
        let newData = {
          ...data,
          chatId: Number(data.chatId),
          authorId: Number(data.authorId),
          image: data.image === 'null' ? null : data.image,
        }

        const dataValidation = addPrivateChatMessageSchema.safeParse(newData);

        if(dataValidation.success) {
          newData = {
            ...newData,
            content: encryptText(data.content)
          }
          
          const newMessage = await postPrivateChatMessage(newData)
          if(newMessage) {
            newMessage.content = decryptText(newMessage.content);
            const chatId = newMessage.chatId.toString();
             io.to(chatId).emit("receive new private chat message", newMessage); // Kirim ke semua klien di room ini
          } else {
            socket.emit("send private chat message error", {
              status: 500,
              statusCode: "Internal Server Error",
              message: "Failed send message",
              error: "Failed send message"
            })
          }
        } else {
          const parsedMessage = dataValidation.error
          socket.emit("send private chat message error", {
            status: 400,
            statusCode: "Bad Request",
            message: parsedMessage.message,
            error: parsedMessage
          })
        }
      } catch (error) {
        socket.emit("send private chat message error", {
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

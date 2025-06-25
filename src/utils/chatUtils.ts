import type { PrivateChatType } from "../types/privatechat";

export const getLastMessageTimestamp = (chat: PrivateChatType) => {
  if (chat.messages && chat.messages.length > 0) {
    const lastMsg = chat.messages[chat.messages.length - 1];
    return new Date(lastMsg.createdAt).getTime(); // Konversi ke milidetik untuk perbandingan
  }
  return 0; // Atau new Date('1970-01-01').getTime()
};
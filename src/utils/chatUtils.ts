import { GroupchatMessageType, GroupchatType } from "../types/groupchat";
import type { PrivateChatMessageType, PrivateChatType } from "../types/privatechat";

export const getLastMessageTimestamp = (message: Date) => {
  if(message) {
    return new Date(message).getTime(); // Konversi ke milidetik untuk perbandingan
  }
  return 0; // Atau new Date('1970-01-01').getTime()
};
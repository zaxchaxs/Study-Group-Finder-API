export interface PrivateChatType {
    id: number;
    userIdOne: number;
    userIdTwo: number;
    createdAt: Date;
    updatedAt: Date;
    messages?: PrivateChatMessageType[]
}

export interface PrivateChatMessageType {
    id: number;
    chatId: number;
    authorId: number;
    content: string;
    image: string | null;
    createdAt: Date
    updatedAt: Date
};

export interface PostPrivateChatType {
    userIdOne: number;
    userIdTwo: number;
};

// message
export interface PostPrivateChatMessageType {
    chatId: number
    authorId: number
    content: string
    image: string | null
};
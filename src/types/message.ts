export interface GroupChatType {
    id: number;
    authorId: number
    name: String
    image: String | null
    createdAt: string
    updatedAt: string
}

export interface PostGroupChatType {
    authorId: number
    name: String
    image: String | null
}

export interface GroupChatMessageType {
    id: number
    groupId: number;
    authorId: number
    content: String
    image: String | null
    createdAt: string
    updatedAt: string
};

export interface PostGroupChatMessageType {
    groupId: number;
    authorId: number
    content: string
    image: string | null
};
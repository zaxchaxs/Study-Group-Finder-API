import { UserType } from "./user";

export interface GroupchatType {
    id: number;
    authorId: number;
    name: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date
    messages?: GroupchatMessageType[]
};

export interface PostGroupchatType {
    authorId: number;
    name: string;
    image: string | null;
};

export interface UpdateGroupchatType {
    authorId: number;
    name: string;
    image?: string
}

export interface JoinedUserGroupChatType {
    id: number;
    groupId: number;
    userId: number;
    group: GroupchatType
}


// Message
export interface GroupchatMessageType {
    id: number
    groupId: number
    authorId: number
    content: string
    image: string | null;
    author?: UserType[]
    createdAt: Date
    updatedAt: Date
}

export interface PostGroupchatMessageType {
    groupId: number
    authorId: number
    content: string
    image: string | null;
};

export interface UpdateGroupchatMessageType {
    groupId: number
    authorId: number
    content: string
    image: string | null;
};


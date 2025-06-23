import { UserType } from "./user";

export interface GroupchatType {
    id: number;
    authorId: number;
    name: string;
    image: string | null;
    createdAt: string;
    updatedAt: string
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


// Message
export interface GroupchatMessageType {
    id: number
    groupId: number
    authorId: number
    content: string
    image: string | null;
    author?: UserType[]
    createdAt: string
    updatedAt: string
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


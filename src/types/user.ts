export interface UserType {
    id: number;
    username: string;
    email: string;
    name: string
    avatar: string | null;
    role: "admin" | "user"
    createdAt: Date;
    updatedAt: Date;
};

export interface PostUserType {
    username: string;
    email: string
    password: string
    name: string
    avatar: string | null
    role: "admin" | "user";
}

export interface UpdateUserType {
    username: string;
    email: string
    name: string
    avatar: string | null
    newAvatar: string | null
    role: "admin" | "user";
}

export interface LoginUserType {
    email: string
    password: string
}

export interface UserFriend {
    id: number;
    username: string;
    name: string;
    avatar: string | null;
    role: "admin" | "user"
    createdAt: Date;
    updatedAt: Date;
}

export enum FriendStatusEnum {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    BLOCKED = "BLOCKED",
    REJECTED = "REJECTED",
}
import type { UserType } from "./user";

export type UserFriendDataType = {
    id: number;
    requesterId: number;
    receiverId: number;
    type: "receiver"
    receiver: UserType,
    status: string;
} | {
    id: number;
    requesterId: number;
    receiverId: number;
    type: "requester"
    requester: UserType,
    status: string;
};
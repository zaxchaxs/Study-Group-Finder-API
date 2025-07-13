export interface InterestType {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export interface PostInterestType {
    name: string;
};

export interface userInterestType {
    id: number;
    userId: number;
    interestId: number;
    createdAt: string;
    updatedAt: string;
};

export interface PostUserInterestType {
    userId: number;
    interestId: number;
}
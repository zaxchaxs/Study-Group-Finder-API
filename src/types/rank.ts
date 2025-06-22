import { UserType } from "./user";

export interface UserRankCategoryType {
    id: number;
    name: string;
    createdAt: number;
    updatedAt: number;
}

export interface UserRankType {
    id: number;
    userId: number;
    rankCatId: number;
    rankValue: number;
    createdAt: number;
    updatedAt: number;
    user?: UserType
};

export interface PostUserRankType {
    userId: number;
    rankCatId: number;
    rankValue: number;
};

export interface UpdateUserRankType {
    userId: number;
    rankCatId: number;
    rankValue: number;
};
;

export interface RankCategoryType {
    id: number;
    name: string;
    createdAt: number;
    updatedAt: number;
    userRank?: UserRankType
};

export interface PostRankCategoryType {
    name: string;
}
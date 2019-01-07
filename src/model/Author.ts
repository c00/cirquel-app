export interface Author {
    userName: string;
    imgBase: string;
    contribCount: number;
    stub?: string;
    following?: boolean;
    followers: number;
}
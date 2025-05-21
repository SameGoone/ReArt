import { PostUser } from "./user";

export interface PostComment {
    id: number;
    createdAt: string;
    body: string;
    author: PostUser;
}
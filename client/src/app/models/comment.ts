import { UserDetails } from "./user";

export interface PostComment {
    id: number;
    createdAt: string;
    body: string;
    author: UserDetails;
}
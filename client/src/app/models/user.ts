import { Image } from "./image"

export interface UserDetails {
    id: string;
    displayName: string;
    createdAt?: string;
    username?: string;
    image?: Image;
    email?: string;
    token?: string;
    bio?: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}
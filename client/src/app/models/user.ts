import { ImageDto } from "./image"

export interface UserDetails {
    id: string;
    displayName: string;
    createdAt: string;
    image: ImageDto;
    email: string;
    bio: string;
}

export interface UserIdentity {
    id: string;
    displayName: string;
    image: ImageDto;
    token: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}
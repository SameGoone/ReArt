import { ImageDto } from "./image"
import { LikesInfo } from "./likesInfo"
import { UserDetails } from "./user"

export interface PostDetailsDto {
  id: string
  body: string
  createdAt: Date
  user: UserDetails
  image: ImageDto
  likesInfo: LikesInfo
}

export interface PostCreateDto {
  id?: String
  body: String
  image: ImageDto | null
}

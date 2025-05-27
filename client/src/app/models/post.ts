import { Image } from "./image"
import { LikesInfo } from "./likesInfo"
import { UserDetails } from "./user"

export interface Post {
  id: string
  body: string
  createdAt: Date
  user: UserDetails | null
  image: Image | null
  likesInfo: LikesInfo | null
}
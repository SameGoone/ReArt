import { Image } from "./image"
import { LikesInfo } from "./likesInfo"
import { PostUser } from "./user"

export interface Post {
  id: string
  body: string
  createdOn: Date
  user: PostUser
  image: Image | null
  likesInfo: LikesInfo | null
}
import { Image } from "./image"
import { PostUser } from "./user"

export interface Post {
  id: string
  body: string
  createdOn: Date
  user: PostUser
  image: Image | null
}